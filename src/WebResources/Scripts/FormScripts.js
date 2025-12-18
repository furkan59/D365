/**
 * D365 Form Scripts
 * Contains common form event handlers and utility functions
 */

var D365 = D365 || {};
D365.FormScripts = D365.FormScripts || {};

(function () {
    "use strict";

    /**
     * Form OnLoad event handler
     * @param {object} executionContext - The execution context
     */
    this.onLoad = function (executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            console.log("Form loaded successfully");

            // Initialize form
            initializeForm(formContext);
        } catch (error) {
            handleError("onLoad", error);
        }
    };

    /**
     * Form OnSave event handler
     * @param {object} executionContext - The execution context
     */
    this.onSave = function (executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            console.log("Form save event triggered");

            // Perform validation before save
            if (!validateForm(formContext)) {
                executionContext.getEventArgs().preventDefault();
            }
        } catch (error) {
            handleError("onSave", error);
        }
    };

    /**
     * Field OnChange event handler
     * @param {object} executionContext - The execution context
     */
    this.onChange = function (executionContext) {
        try {
            var formContext = executionContext.getFormContext();
            var attribute = executionContext.getEventSource();
            var attributeName = attribute.getName();

            console.log("Field changed: " + attributeName);

            // Handle specific field changes
            handleFieldChange(formContext, attributeName);
        } catch (error) {
            handleError("onChange", error);
        }
    };

    /**
     * Initialize form controls and settings
     * @param {object} formContext - The form context
     */
    function initializeForm(formContext) {
        // Set field requirements
        setFieldRequirements(formContext);

        // Configure field visibility
        configureFieldVisibility(formContext);

        // Load additional data if needed
        loadAdditionalData(formContext);
    }

    /**
     * Validate form data before save
     * @param {object} formContext - The form context
     * @returns {boolean} - True if validation passes
     */
    function validateForm(formContext) {
        var isValid = true;

        // Example: Validate email format
        var emailAttr = formContext.getAttribute("emailaddress1");
        if (emailAttr && emailAttr.getValue()) {
            var email = emailAttr.getValue();
            if (!isValidEmail(email)) {
                formContext.ui.setFormNotification(
                    "Please enter a valid email address",
                    "ERROR",
                    "email_validation"
                );
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Handle field change events
     * @param {object} formContext - The form context
     * @param {string} fieldName - The field name that changed
     */
    function handleFieldChange(formContext, fieldName) {
        switch (fieldName) {
            case "name":
                // Auto-populate account number based on name
                autoPopulateAccountNumber(formContext);
                break;
            case "address1_country":
                // Update state/province options based on country
                updateStateOptions(formContext);
                break;
            default:
                break;
        }
    }

    /**
     * Set field requirements based on business rules
     * @param {object} formContext - The form context
     */
    function setFieldRequirements(formContext) {
        // Example: Make telephone required if email is empty
        var emailAttr = formContext.getAttribute("emailaddress1");
        var phoneAttr = formContext.getAttribute("telephone1");

        if (emailAttr && phoneAttr) {
            if (!emailAttr.getValue()) {
                phoneAttr.setRequiredLevel("required");
            } else {
                phoneAttr.setRequiredLevel("none");
            }
        }
    }

    /**
     * Configure field visibility based on conditions
     * @param {object} formContext - The form context
     */
    function configureFieldVisibility(formContext) {
        // Example: Show/hide fields based on form type
        var formType = formContext.ui.getFormType();

        if (formType === 1) { // Create form
            // Hide certain fields on create
            var control = formContext.getControl("modifiedon");
            if (control) {
                control.setVisible(false);
            }
        }
    }

    /**
     * Load additional data asynchronously
     * @param {object} formContext - The form context
     */
    function loadAdditionalData(formContext) {
        var entityId = formContext.data.entity.getId();
        if (entityId) {
            // Retrieve related records or perform calculations
            console.log("Loading additional data for entity: " + entityId);
        }
    }

    /**
     * Auto-populate account number
     * @param {object} formContext - The form context
     */
    function autoPopulateAccountNumber(formContext) {
        var nameAttr = formContext.getAttribute("name");
        var accountNumberAttr = formContext.getAttribute("accountnumber");

        if (nameAttr && accountNumberAttr && !accountNumberAttr.getValue()) {
            var name = nameAttr.getValue();
            if (name) {
                var accountNumber = "ACC-" + name.substring(0, 5).toUpperCase();
                accountNumberAttr.setValue(accountNumber);
            }
        }
    }

    /**
     * Update state options based on selected country
     * @param {object} formContext - The form context
     */
    function updateStateOptions(formContext) {
        var countryAttr = formContext.getAttribute("address1_country");
        var stateControl = formContext.getControl("address1_stateorprovince");

        if (countryAttr && stateControl) {
            var country = countryAttr.getValue();
            // Filter state options based on country
            console.log("Country selected: " + country);
        }
    }

    /**
     * Validate email format
     * @param {string} email - The email address to validate
     * @returns {boolean} - True if email is valid
     */
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Handle errors and display user-friendly messages
     * @param {string} functionName - The function where error occurred
     * @param {object} error - The error object
     */
    function handleError(functionName, error) {
        console.error("Error in " + functionName + ": " + error.message);
        
        // Display error notification to user
        var errorMessage = "An error occurred. Please contact your system administrator.";
        Xrm.Navigation.openErrorDialog({ message: errorMessage });
    }

    // Expose public functions
    this.onLoad = this.onLoad;
    this.onSave = this.onSave;
    this.onChange = this.onChange;

}).call(D365.FormScripts);
