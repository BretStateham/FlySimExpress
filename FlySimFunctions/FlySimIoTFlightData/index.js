// Pull in the azure-storage library
let azure = require('azure-storage');
// Connect to the storage account whos connection string is saved in the AzureWebJobsStorage App Setting
let tableSvc = azure.createTableService(process.env["AzureWebJobsStorage"]);
// Save the table name, partitionkey and rowkey for future use
let tableName = 'deviceState';
let partitionKey = "1";
let rowKey = "1";

// Create the variable that will hold the last known device state
// This will allow us to update the latitude, longitude, altitude, heading, etc.
// based on new x,y,z acceleromoter values passed in to the IoT Hub from the
// MXChip board
let last = null;

module.exports = function (context, inputMessage) {

  context.log('----------------------------------------');

  context.log(`Input Message: ${JSON.stringify(inputMessage)}\n`);

  // Ensure that the deviceState table exists in the Azure storage account
  tableSvc.createTableIfNotExists(tableName, function (error, result, response) {
    if (!error) {

      // Then retrieve the only record ( PartitionKey: "1", RowKey: "1") from the table
      tableSvc.retrieveEntity(tableName, partitionKey, rowKey, function (error, result, response) {

        // If there wasn't an error, and the resulting record has a "deviceId" property
        // then it looks like we succesffully retrieved the previous state from table storage
        if (!error && ('deviceId' in result)) {

          try {

            // Try mapping that returned record to a simpler structure 
            // without all the table storage metadata in the way
            // and log the results for debugging purpose
            last = {
              deviceId: ((result.deviceId._ === null) ? "" : result.deviceId._),
              time: ((result.time._ === null) ? (new Date()).toISOString() : new Date(result.time._)),
              airspeed: ((result.airspeed._ === null) ? 0 : parseFloat(result.airspeed._)),
              heading: ((result.heading._ === null) ? 0 : parseFloat(result.heading._)),
              altitude: ((result.altitude._ === null) ? 0 : parseFloat(result.altitude._)),
              latitude: ((result.latitude._ === null) ? 0 : parseFloat(result.latitude._)),
              longitude: ((result.longitude._ === null) ? 0 : parseFloat(result.longitude._)),
              pitch: ((result.pitch._ === null) ? 0 : parseFloat(result.pitch._)),
              roll: ((result.roll._ === null) ? 0 : parseFloat(result.roll._)),
              temperature: ((result.temperature._ === null) ? 0 : parseFloat(result.temperature._)),
              humidity: ((result.humidity._ === null) ? 0 : parseFloat(result.humidity._)),
            };
            context.log("deviceState:   Retrieved from table storage");
            context.log(`Retrieved:     ${JSON.stringify(result)}`);

          } catch (err) {

            // If there was an error parsing the record from storage
            // log that there was an error, set last to null, 
            // and fall through to creating a new genesis state below
            last = null;
            context.log(`ERROR:         There was an error parsing the table result:\n               ${err}`);
          }

        // Otherwise, if we couldn't find a valid record in table storage
        // then assume this is the first time it has run and create a new
        // genesis state
        } else if( error || !last || !('deviceId' in result)) {

          context.log("deviceState:   Valid state Not found in storage.  Generating new genesis state");

          // Get some "randomish" values using the current time as a "seed"
          var seed = ((new Date).valueOf());

          last = {
            deviceId: '',
            time: (new Date()).toISOString(),
            airspeed: 384,   // airspeed is fixed at 384. You chould cheat and set this higher to go faster
            heading: seed % 360,
            altitude: 10000.0 + ((seed % 25) * 1000),
            latitude: 36.7 + (((seed / 100) % 100) / 100.0),
            longitude: -116.8 + ((seed % 100) / 50.0),
            pitch: 0,
            roll: 0,
            temperature: 0.0,
            humidity: 0.0
          };
        }

        context.log(`Last State:    ${JSON.stringify(last)}`);


        // Ok, figure out how much time in milliseconds has elapsed between
        // the input message's time, and the last known state's time
        var thisTime = Date.parse(inputMessage.timestamp);
        var lastTime = Date.parse(last.time);
        var milliseconds = thisTime.valueOf() - lastTime.valueOf();

        // persist the deviceId from the inputMessage
        last.deviceId = inputMessage.deviceId;

        // Set the last time to the new inputMessages time
        last.time = inputMessage.timestamp;

        // Compute new heading assuming hard left or right turns 10 degrees per second
        var delta = (milliseconds / 100.0) * (last.roll / 30.0);
        last.heading += delta;

        if (last.heading < 0.0)
          last.heading += 360.0;
        else if (last.heading >= 360.0)
          last.heading -= 360.0;

        // Constrain pitch to +/-15 degrees (positive == nose down)
        last.pitch = Math.max(Math.min(inputMessage.y / 11.0, 15.0), -15.0);
        // Constrain roll to +/-30 degrees (positive == rolling right)
        last.roll = Math.max(Math.min(inputMessage.x / 11.0, 30.0), -30.0);
        
        // Determine the distance travelled between the two messages
        // given the time distance and the airspeed
        // 1 MPH == 0.000277778 miles per second
        var distance = (milliseconds / 1000) * (last.airspeed * 0.000277778); 

        // Compute new altitude and constrain it to 1,000 to 40,000 feet
        last.altitude = last.altitude - (distance * 5280.0 * Math.sin(last.pitch * Math.PI / 180.0));
        last.altitude = Math.max(Math.min(last.altitude, 40000.0), 1000.0);

        // Compute new latitude and longitude
        var radians = last.heading * Math.PI / 180.0;
        var dx = distance * Math.sin(radians);
        var dy = distance * Math.cos(radians);
        last.latitude += (dy / 69.0); // Assume 69 miles per 1 degree of latitude
        last.longitude += (dx / 69.0); // Assume 69 miles per 1 degree of longitude

        // Persist the temperature and humidity just to make it so we can use "last" as our outputMessage
        last.temperature = inputMessage.temperature;
        last.humidity = inputMessage.humidity;

        // Write the message to your Event Hub so it can be viewed by the FlySim desktop app
        context.bindings.outputMessage = last;

        // Write the message to the Shared Event Hub so it can be viewed by the AirTrafficSim desktop app
        context.bindings.sharedOutputMessage = last;

        context.log(`Revised State: ${JSON.stringify(last)}`);

        // Create the last known state entity that we'll persist in to table storage
        var entity = {
          PartitionKey: partitionKey,
          RowKey: rowKey,
          deviceId: last.deviceId,
          time: last.time,
          airspeed: last.airspeed,
          heading: last.heading,
          altitude: last.altitude,
          latitude: last.latitude,
          longitude: last.longitude,
          pitch: last.pitch,
          roll: last.roll,
          temperature: last.temperature,
          humidity: last.humidity
        }

        // And inert it or update the existing entity in table storage
        tableSvc.insertOrReplaceEntity(tableName, entity, function (error, result, response) {
          if (!error) {
            // The device state was successfully saved to table storage
            context.log("deviceState:   Persisted to table storage");
            context.done();
          } else {
            // Log any errors and get out of dodge
            context.log(`ERROR:         There was an error persisting the device state:\n               ${err}`);
            context.done();
            return;
          }
        });

      });
    } else {

      // Log the table creation error and exit
      context.log(`ERROR:         There was an error creating the deviceState table:\n               ${err}`);
      context.done();
      return;

    }
  });
};