# 05 - Clean Up

Well, hopefully you had a good time during the workshop and learned a lot, but all good things must come to an end. 

Before you leave for the day (unless you can't wait to go home and show your work to your kids, spouse, significant other, boss, co-workers, parents and grandparents), you should probably delete the resources you created so you don't continue to get charged for them.

The cool thing is, it's really easy:

1. Open a PowerShell prompt or Terminal Window

1. Ensure you are logged into the Azure CLI (You should still be, but just in case)

    ```bash
    az login
    ```

1. Delete your resource group using the CLI.  Deleting the resource group also deletes all the resources in it.  Very powerful, so be careful doing this at work!:

    ```bash
    az group delete --resource-group <name_prefix>group
    ```

    So, with the ***flysimjqd** same prefix:

    ```bash
    az group delete --resource-group flysimjqdgroup
    ```

1. Just verify in the output that the operation succeeded, and you are good to go!
