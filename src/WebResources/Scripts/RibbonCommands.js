/**
 * D365 Ribbon Command Scripts
 * Contains ribbon button command handlers
 */

var D365 = D365 || {};
D365.RibbonCommands = D365.RibbonCommands || {};

(function () {
    "use strict";

    /**
     * Enable rule for ribbon button
     * @param {object} primaryControl - The primary control
     * @returns {boolean} - True if button should be enabled
     */
    this.enableRule = function (primaryControl) {
        try {
            if (!primaryControl) {
                return false;
            }

            var formContext = primaryControl;
            var recordId = formContext.data.entity.getId();

            // Enable button only if record is saved
            return recordId !== null && recordId !== "";
        } catch (error) {
            console.error("Error in enableRule: " + error.message);
            return false;
        }
    };

    /**
     * Custom action command
     * @param {object} primaryControl - The primary control
     */
    this.customAction = function (primaryControl) {
        try {
            var formContext = primaryControl;
            var entityId = formContext.data.entity.getId().replace(/[{}]/g, "");
            var entityName = formContext.data.entity.getEntityName();

            console.log("Custom action triggered for: " + entityName + " (" + entityId + ")");

            // Show confirmation dialog
            var confirmStrings = {
                text: "Are you sure you want to perform this action?",
                title: "Confirm Action"
            };
            var confirmOptions = { height: 200, width: 450 };

            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
                function (success) {
                    if (success.confirmed) {
                        executeCustomAction(entityName, entityId);
                    }
                }
            );
        } catch (error) {
            handleError("customAction", error);
        }
    };

    /**
     * Execute custom action
     * @param {string} entityName - The entity logical name
     * @param {string} entityId - The entity ID
     */
    function executeCustomAction(entityName, entityId) {
        var progressIndicator = { message: "Processing..." };
        Xrm.Utility.showProgressIndicator(progressIndicator.message);

        // Call custom API or perform action
        var actionRequest = {
            entity: {
                entityType: entityName,
                id: entityId
            },
            getMetadata: function () {
                return {
                    boundParameter: "entity",
                    parameterTypes: {
                        "entity": {
                            typeName: "mscrm." + entityName,
                            structuralProperty: 5
                        }
                    },
                    operationType: 0,
                    operationName: "new_CustomAction"
                };
            }
        };

        Xrm.WebApi.online.execute(actionRequest).then(
            function (result) {
                if (result.ok) {
                    Xrm.Utility.closeProgressIndicator();
                    Xrm.Navigation.openAlertDialog({
                        text: "Action completed successfully!",
                        title: "Success"
                    });
                }
            },
            function (error) {
                Xrm.Utility.closeProgressIndicator();
                handleError("executeCustomAction", error);
            }
        );
    }

    /**
     * Export to Excel command
     * @param {object} primaryControl - The primary control
     */
    this.exportToExcel = function (primaryControl) {
        try {
            var formContext = primaryControl;
            var entityName = formContext.data.entity.getEntityName();

            console.log("Exporting " + entityName + " to Excel");

            // Retrieve records and export
            var fetchXml = buildFetchXml(entityName);
            retrieveAndExport(entityName, fetchXml);
        } catch (error) {
            handleError("exportToExcel", error);
        }
    };

    /**
     * Build FetchXML query
     * @param {string} entityName - The entity logical name
     * @returns {string} - FetchXML query
     */
    function buildFetchXml(entityName) {
        var fetchXml = [
            "<fetch>",
            "  <entity name='" + entityName + "'>",
            "    <attribute name='name' />",
            "    <attribute name='createdon' />",
            "  </entity>",
            "</fetch>"
        ].join("");

        return fetchXml;
    }

    /**
     * Retrieve records and export to Excel
     * @param {string} entityName - The entity logical name
     * @param {string} fetchXml - The FetchXML query
     */
    function retrieveAndExport(entityName, fetchXml) {
        Xrm.WebApi.retrieveMultipleRecords(entityName, "?fetchXml=" + fetchXml).then(
            function (result) {
                if (result.entities.length > 0) {
                    console.log("Retrieved " + result.entities.length + " records");
                    // Export logic here
                    Xrm.Navigation.openAlertDialog({
                        text: "Export functionality would be implemented here",
                        title: "Export"
                    });
                } else {
                    Xrm.Navigation.openAlertDialog({
                        text: "No records found to export",
                        title: "Information"
                    });
                }
            },
            function (error) {
                handleError("retrieveAndExport", error);
            }
        );
    }

    /**
     * Handle errors
     * @param {string} functionName - The function where error occurred
     * @param {object} error - The error object
     */
    function handleError(functionName, error) {
        console.error("Error in " + functionName + ": " + error.message);
        Xrm.Navigation.openErrorDialog({
            message: "An error occurred: " + error.message
        });
    }

}).call(D365.RibbonCommands);
