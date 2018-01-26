# 02 - Deploy and Verify Your Resources in Azure

## Lab Overview

If you recall from the overview, the overall architecture for this lab looks like this:

![FlySimExpress Architecture](images/architecture-express.png)

In this lab, you will deploy the resources colored blue up above. Those resources include

  - An Azure IoT Hub.  This is where your MXChip board will send it's accelerometer data to.  In the full workshop, this is also where your board will proximity warning messages from the cloud.

  - An Azure Function.  This function is triggered and runs automatically whenever a new message is received by the Azure IoT Hub from your board.  The function takes the accelerometer data from the board and uses it to create hypothetical flight data (pitch, roll, altitude, heading, latitude and longitude) for a virtual plane.  It persists that state to an Azure Storage Table so it can recall, then update your virtual plane's flight data appropriately with each subsequent message from your board.

  - An Azure Storage Account.  The Azure Storage Account is used by Azure Functions.  The Azure Functions runtime actually uses it for various internal logging, queueing and monitoring purposes.  Our function will use it specifically to persist your virtual flight data between messages from your device.

## Azure Portal, CLI Commands or Templates?  

When you are deploying resources in Azure, you have a number of methods available to you.  The Azure Portal, The Azure Command Line Interface (CLI), and Azure Resource Manager (ARM) Templates. 

- **The Azure Portal**: You could use the Azure Portal at <a href="https://portal.azure.com" target="_blank">http://portal.azure.com</a>.  The portal gives you a powerful and visual way to create an manage your resources in your Azure subscriptions.  However, doing it this way takes the longest.  For an "Express" lab, it will likely slow new users down enough that it could become a time constraint.

- **The Azure Command Line Interface (CLI)**: The CLI allows you to create, query, and manage ***nearly** all the resources available to you in Azure.  It is extremely powerfull and the team is constantly increasing the resource types it can manage.  In addition, the CLI is availble in the "<a href="https://docs.microsoft.com/en-us/azure/cloud-shell/overview" target="_blank">Cloud Shell</a>" which makes it easy to use even on machines where it isn't installed.

- **Azure Resource Manager (ARM) Templates**: When you are looking to encapsulate all the resources needed for a solution into a single definition, deploy it across environments (dev, test, production) and regions (US, Europe, Asia), ARM templates are your best choice.  They also make it possible to deploy complex architectures simply and expediently. 

In this lab, we'll use a combination of the Azure CLI and ARM Templates.  Yes, we could walk you step by step through creating each resource in the portal, but those steps are fully documented elsewhere, and this lab would become difficult to maintain with lots of screen shots to portal interfaces that change regularly. In addition simply by having to click on a bunch of links, type in a bunch of boxes, and click a bunch of buttons, the time it would take to deploy the resources for this lab with be significantly longer.

If you want a more step-by-step lab experience, you can view the <a href="http://aka.ms/flysim" target="_blank">full version</a> of this workshop at a later time.

## The "myresources.txt" File

Throughout this lab, you will be creating a number of resources. You will need to refer to those resources later in the lab so it is helpful to keep track of all the information you need in a single place. 

To help you do that, a file called `myresources.txt.sample` has been provided in the "Labs" folder whereever you extracted this workshop content to.  You should create a ***copy*** of that file in the same folder, and just name it `myresources.txt`. We'll instruct you periodically to make note of your resources details in that file through this lab.

___
<a name="Exercises"></a>

## Exercises


- [Choose a Name Prefix](#Exercise1)
- [Login to the Azure CLI](#Exercise2)
- [Deplooy the ARM Template](#Exercise3)
- [Verify your Resources in the Portal](#Exercise4)

___
<a name="Exercise1"></a>

### Choose a Name Prefix

When you create resources in Azure, you must give them a name, most resources (web sites, function apps, event hub namespaces, storage accounts, etc.) use their name as a part of the URL used to access them.  For this reason, the names you choose must be globally unique. In addition when you encounter resources in the portal, or wherever, it is helpful if the name you use indicates what the resource is, and why you created it.  For that reason, you should come up with a consistent naming scheme for your resources.  In addition, many of the resources require names to be ***lowercase only*** and to include only valid url characters.  To that end, it is suggested that you use a naming scheme in this lab similar to the following

***&lt;name_prefix&gt;resourcetype***

Where:

- ***&lt;name_prefix&gt;*** is a something like ***flysim*** (to let you know it came from this lab) and your first middle and last initials (to help keep it unique).  For example, if your name were "John Q. Doe", you might use ***flysimjqd*** as your ***&lt;name_prefix&gt;*** .

- ***resourcetype*** gives you some sort of indication of the kind of resource:

  - ***group*** for a Resource Group
  - ***iot*** for an iot hub
  - ***storage*** for a storage account
  - ***functions*** for an Function App
  - ***ns*** for an Event Hub Namespace

- Again using the example ***&lt;name_prefix&gt;*** of ***flysimjqd*** from above, and the suggested ***resourcetype*** names, we might name our resources like this:
 
  - ***flysimjqdgroup*** for a Resource Group
  - ***flysimjqdiot*** for an iot hub
  - ***flysimjqdstorage*** for a storage account
  - ***flysimjqdfunctions*** for an Function App
  - ***flysimjqdns*** for an Event Hub Namespace

- Honestly, it doesn't matter what you use as your ***&lt;name_prefix&gt;*** as long as it helps generate globally unique names.  However, for the remainder of this lab, we will assume the naming convention outlined above.  If you use a different name, you will need to keep track of your resource names.

1. Using the information above, choose the ***&lt;name_prefix&gt;*** you wish to use.

1. Open the `Labs/myresources.txt` file (or create a copy of the `Labs/myresources.txt.sample` file and name it `Labs/myresources.txt` if you haven't done so already), and document that name prefix you chose there:

1. 
