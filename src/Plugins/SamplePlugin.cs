using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace D365.Plugins
{
    /// <summary>
    /// Sample Plugin for D365
    /// This plugin demonstrates basic D365 plugin structure
    /// </summary>
    public class SamplePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtain the tracing service
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the execution context from the service provider
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the organization service reference
            IOrganizationServiceFactory serviceFactory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            try
            {
                // Check if the input parameters property bag contains a target
                if (context.InputParameters.Contains("Target") &&
                    context.InputParameters["Target"] is Entity)
                {
                    // Obtain the target entity from the input parameters
                    Entity entity = (Entity)context.InputParameters["Target"];

                    tracingService.Trace("SamplePlugin: Executing for entity {0}", entity.LogicalName);

                    // Add your custom business logic here
                    // Example: Set a field value
                    if (!entity.Contains("description"))
                    {
                        entity["description"] = "Updated by Sample Plugin";
                    }

                    tracingService.Trace("SamplePlugin: Successfully executed");
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("SamplePlugin: {0}", ex.ToString());
                throw new InvalidPluginExecutionException(
                    String.Format("An error occurred in SamplePlugin: {0}", ex.Message));
            }
        }
    }
}
