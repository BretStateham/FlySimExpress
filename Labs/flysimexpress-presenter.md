# PRESENTER ONLY - Configure Shared Resources and ATC App

A quick reminder of the architecture for this workshop:

![Express Architecture](images/architecture-express.png)

In this lab, you will take on the role of the Presenter at a workshop event and create the resources shown in orange in the diagram above.

This lab will be pretty sparsely documented for now.  For more details on naming prefixes, resource groups, the Azure CLI and ARM Templates, see the "**[02 - Deploy and Verify Your Resources in Azure](flysimexpress-02.md)**" lab.

1. Decide on a name prefix to use for your objects.  It is recommended that you use a prefix like ***flysim*** followed by your first middle and last initials.  For example, John Q. Doe might use a prefix of ***flyimjqd***

    > **Note**: If you are an individual user completing the workshop on your own, you can use the same ***flysimxxx*** prefix you have used in the other labs.  These resources will just be added to the existing resource group.

1. Open a PowerShell prompt or Terminal Window and navigate to the "**`AzureResources/Presenter`**" folder under the workshop contents.

1. If you wish, you can review the contents of the "**`template-presenter.json`**" file.  It creates:

    - An Azure Storage Account for Stream Analytics to use
    - An Event Hub Namespace
    - The `flysim-shared-input-hub` that will be used to receive flight data from attendees
    - The `flysim-shared-output-hub` that will be used to receive proximity warning from Stream Analalytics
    - A Stream Analytics Job watches the flight data in `flysim-shared-input-hub`, looks for planes that are dangerously close to each other and when it finds two emits data about them to `flysim-shared-output-hub`

1. Follow the steps in the "**[02 - Deploy and Verify Your Resources in Azure](flysimexpress-02.md)**" lab to login to the Azure CLI

1. Run the following command, passing your name prefix in for the ***&lt;name_prefix&gt;*** pace holder.

    ```bash
    az group create --resource-group <name_prefix>group --location westus
    ```

    For example, with a name prefix of ***flysimjqd***:

    ```bash
    az group create --resource-group flysimjqdgroup --location westus
    ```

    And verify in the output that the "**`provisioningState`**" value is "**`Succeeded`**"

    ```bash
    {
      ...
      "name": "flysimjqdgroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      ...
    }
    ```

1. Next, deploy the presenter template to azure using the following command:

    ```bash
    az group deployment create --name "FlySimPresenter" --resource-group <name_prefix>group --template-file .\template-presenter.json --parameters name_prefix=<name_prefix>
    ```

    For example, using our ***flysimjqd*** prefix:

    ```bash
    az group deployment create --name "FlySimPresenter" --resource-group flysimjqdgroup --template-file .\template-presenter.json --parameters name_prefix=flysimjqd
    ```

1. The command will take some time to complete, verify in the output that the "**`provisioningState`**" value is "**`Succeeded`**".

    ```bash
    {
      ...
      "properties": {
        ...
        "provisioningState": "Succeeded"
      },
      "resourceGroup": "flysimjqdgroup"
    }
    ```

1. In the output from the previous command, locate the "**`SharedInputHubConnectionString`**" output property, copy it's value, and make the value available (for example in a gist) to attendees for use in their labs.

    ```bash
    {
      ...
      "properties": {
        ...
        "outputs": {
          ...
          "sharedInputHubConnectionString": {
            "type": "String",
            "value": "Endpoint=sb://flysimjqdns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=X5cTD6Gu6CUb5O5VD4RtqBkenPcnLQAHIB/X78sz+pY=;EntityPath=flysim-shared-input-hub"
          },
          ...
        }
      }
    }
    ```

1. Additionally, In the output from the previous command, locate the "**`NamespaceConnectionString`**" output property for your own use in the AirTrafficSim app in the in the next exercise

    ```bash
    {
      ...
      "properties": {
        ...
        "outputs": {
          "namespaceConnectionString": {
            "type": "String",
            "value": "Endpoint=sb://flysimjqdns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=X5cTD6Gu6CUb5O5VD4RtqBkenPcnLQAHIB/X78sz+pY="
          },
          ...
        }
      }
    }    
    ```
## Update the AirTrafficSim App connection strings and run it.

1. Open the "**`AirTrafficSim`**" solution from the workshop content in Visual Studio 2017 Community Edition or later.

1. In Visual Studio, open the "**CoreConstants**" file, and paste the "**`NamespaceConnectionString`**" value you copied into the last exercise in for the `SharedEventHubEndpoint` variable value.

1. Run the app and keep it on the event screen so attendees can verify their plane is appearing on it.
    
## Update the Zoom Level Visibility

If you want plane metadata (name, direction) to be visible when you are zoomed out further, you can modify line 165 in the "`MainViewModel.cs`" file. Change the "90" to a larger value if you want to see metadata when you are zoomed out more. 

  ```c#
  plane.ZoomDeepLevel = (value < 90) ? Visibility.Visible : Visibility.Collapsed;
  ```

