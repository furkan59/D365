using System;
using System.ServiceModel;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace D365.Plugins
{
    /// <summary>
    /// Account Entity Plugin
    /// Executes on Create and Update of Account entity
    /// </summary>
    public class AccountPlugin : IPlugin
    {
        private readonly string _unsecureConfig;
        private readonly string _secureConfig;

        public AccountPlugin(string unsecureConfig, string secureConfig)
        {
            _unsecureConfig = unsecureConfig;
            _secureConfig = secureConfig;
        }

        public void Execute(IServiceProvider serviceProvider)
        {
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory serviceFactory =
                (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            try
            {
                tracingService.Trace("AccountPlugin: Starting execution");

                if (context.InputParameters.Contains("Target") &&
                    context.InputParameters["Target"] is Entity)
                {
                    Entity account = (Entity)context.InputParameters["Target"];

                    // Validate account name
                    if (account.Contains("name"))
                    {
                        string accountName = account["name"].ToString();
                        
                        // Business logic: Convert account name to uppercase
                        account["name"] = accountName.ToUpper();
                        
                        tracingService.Trace("AccountPlugin: Account name updated to uppercase");
                    }

                    // Auto-populate account number if not provided
                    if (!account.Contains("accountnumber") && context.MessageName == "Create")
                    {
                        account["accountnumber"] = GenerateAccountNumber();
                        tracingService.Trace("AccountPlugin: Account number generated");
                    }
                }

                tracingService.Trace("AccountPlugin: Execution completed successfully");
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                tracingService.Trace("AccountPlugin: FaultException - {0}", ex.ToString());
                throw new InvalidPluginExecutionException(
                    "An error occurred in AccountPlugin", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("AccountPlugin: Exception - {0}", ex.ToString());
                throw;
            }
        }

        private string GenerateAccountNumber()
        {
            // Generate a simple account number (in production, use more sophisticated logic)
            return "ACC-" + DateTime.Now.ToString("yyyyMMddHHmmss");
        }
    }
}
