# Workshop Prerequisites

In order to successfully complete this workshop as an attendee, you will need:

- A Windows or Mac computer.

Presenters (or you if you wish to complete the entire lab on your own outside of a workshop) will need:

    - A Windows 10 Professional or better computer
    - [Visual Studio 2017 Community Edition](https://www.visualstudio.com/vs/community/) (FREE) or better with the Windows Development Toosl feature installed.

- An Azure IoT Developer Kit with the MXChip AZ3166 development board.  You can learn more about them and purchase one at [http://aka.ms/devkit](http://aka.ms/devkit).

- The latest firmware for the MXChip board.  We'll walk through installing that later in the labs, but you can go to "[Upgrade DevKit Firmware](https://microsoft.github.io/azure-iot-developer-kit/docs/firmware-upgrading/)" for the latest firmware for the board.

- On macOS machines, you  will need to [install Homebrew](https://docs.brew.sh/Installation.html)

- You will need the latest Azure IoT Development Kit software package.  We'll walk through this later in the lab, but you can always get the latest version from:

  - [Latest DevKit for Windows](https://aka.ms/devkit/prod/installpackage/latest)
  - [Latest DevKit for macOS](https://aka.ms/devkit/prod/installpackage/mac/latest)

  > **Note**: The Dev Kit includes a number of software packages.  By installing the latest Dev Kit, you should also get the latest version of the following:

    - Azure CLI
    - Node.js
    - Visual Studio Code
    - Arduino UI
    - Custom Board manager for Arduino IDE
    - Board drivers for Windows

- Finally, you will need to complete the "[Get Started](https://microsoft.github.io/azure-iot-developer-kit/docs/get-started/)" walkthrough for the dev board.  Again, we'll guide you through that process later.

- The Zip File with the Workshop Contents.  You can download the zip file from [https://aka.ms/FlySimExpress](https://aka.ms/FlySimExpress).

- An WiFi network that just needs an SSID and Password (no itermediate sign in web page) with all protocols open.  Or if not all protocols need the network needs to at a minimum support inbound and outbound ports for HTTP (80), HTTPS (443), AMQP (5671,5672), and MQTT (8883).

  > **Note**: "***Why no intermediate sign in web page***" you ask?  Well because there is no way for the MXChip board to present the Web UI for you to authenticate it.  You can only give the board standard wifi login credentials (SSID/PWD(PSK)).  Yes, you may be able to connect your COMPUTER to a gated wifi connection where you have a browser to complete the login process, but you can't connect the board to one because the board has no browser, screen, keyboard, mouse, etc.

- An active Azure Subscription that you are willing to use for the resources you will create during the event.  If you delete the resources as instructed at the end of the event, the total cost for the resources shouldn't be more than a few US dolalrs.

  If you don't have an active Azure Subscription, or don't want charges billed to your existing subscription, you can create a free trial at [http://azure.com/free](http://azure.com/free). If you have created a free trial previously, you will need to create a new one using a different email address.  The recommended steps for creating a free trial for the event are:

    > **Note**: A credit card is required as part of the Free Trial sign up process.  No charges will be applied to the card, it is used just for identity verification purposes.

    1. Open a private browser session
    1. Go to http://outlook.com and create a new somename@outlook.com account
    1. Still in the same private browser session, navigate to http://azure.com/free and complete the free trial registration using your new outlook.com address, but with your real phone number and credit card for verification purposes.

