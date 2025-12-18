using System;
using System.Activities;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Xrm.Sdk.Query;

namespace D365.Workflows
{
    /// <summary>
    /// Custom Workflow Activity for D365
    /// Demonstrates how to create custom workflow steps
    /// </summary>
    public class CustomWorkflowActivity : CodeActivity
    {
        [Input("Input Text")]
        [Default("Hello")]
        public InArgument<string> InputText { get; set; }

        [Output("Output Text")]
        public OutArgument<string> OutputText { get; set; }

        protected override void Execute(CodeActivityContext executionContext)
        {
            ITracingService tracingService = executionContext.GetExtension<ITracingService>();
            IWorkflowContext context = executionContext.GetExtension<IWorkflowContext>();
            IOrganizationServiceFactory serviceFactory = 
                executionContext.GetExtension<IOrganizationServiceFactory>();
            IOrganizationService service = 
                serviceFactory.CreateOrganizationService(context.UserId);

            try
            {
                tracingService.Trace("CustomWorkflowActivity: Starting execution");

                // Get input parameter
                string inputText = InputText.Get(executionContext);
                tracingService.Trace("CustomWorkflowActivity: Input text - {0}", inputText);

                // Perform custom logic
                string processedText = ProcessText(inputText);

                // Set output parameter
                OutputText.Set(executionContext, processedText);

                tracingService.Trace("CustomWorkflowActivity: Output text - {0}", processedText);
                tracingService.Trace("CustomWorkflowActivity: Execution completed successfully");
            }
            catch (Exception ex)
            {
                tracingService.Trace("CustomWorkflowActivity: Exception - {0}", ex.ToString());
                throw new InvalidPluginExecutionException(
                    "An error occurred in CustomWorkflowActivity", ex);
            }
        }

        private string ProcessText(string input)
        {
            // Example: Convert to uppercase and add timestamp
            if (string.IsNullOrEmpty(input))
            {
                return string.Empty;
            }

            return $"{input.ToUpper()} - Processed at {DateTime.Now:yyyy-MM-dd HH:mm:ss}";
        }
    }
}
