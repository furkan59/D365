using System;
using System.Activities;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Workflow;
using Microsoft.Crm.Sdk.Messages;

namespace D365.Workflows
{
    /// <summary>
    /// Custom Email Sending Workflow Activity
    /// </summary>
    public class SendEmailActivity : CodeActivity
    {
        [Input("Email Subject")]
        [RequiredArgument]
        public InArgument<string> EmailSubject { get; set; }

        [Input("Email Body")]
        [RequiredArgument]
        public InArgument<string> EmailBody { get; set; }

        [Input("To Email")]
        [RequiredArgument]
        public InArgument<string> ToEmail { get; set; }

        [Output("Email Sent Successfully")]
        public OutArgument<bool> EmailSent { get; set; }

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
                tracingService.Trace("SendEmailActivity: Starting execution");

                string subject = EmailSubject.Get(executionContext);
                string body = EmailBody.Get(executionContext);
                string toEmail = ToEmail.Get(executionContext);

                tracingService.Trace("SendEmailActivity: Creating email entity");

                // Create email entity
                Entity email = new Entity("email");
                email["subject"] = subject;
                email["description"] = body;

                // Set the regarding object
                if (context.PrimaryEntityName != null && context.PrimaryEntityId != Guid.Empty)
                {
                    email["regardingobjectid"] = new EntityReference(
                        context.PrimaryEntityName, 
                        context.PrimaryEntityId);
                }

                // Create the email
                Guid emailId = service.Create(email);
                tracingService.Trace("SendEmailActivity: Email created with ID {0}", emailId);

                // Send the email
                SendEmailRequest sendEmailRequest = new SendEmailRequest
                {
                    EmailId = emailId,
                    TrackingToken = "",
                    IssueSend = true
                };

                service.Execute(sendEmailRequest);
                tracingService.Trace("SendEmailActivity: Email sent successfully");

                EmailSent.Set(executionContext, true);
            }
            catch (Exception ex)
            {
                tracingService.Trace("SendEmailActivity: Exception - {0}", ex.ToString());
                EmailSent.Set(executionContext, false);
                throw new InvalidPluginExecutionException(
                    "An error occurred in SendEmailActivity", ex);
            }
        }
    }
}
