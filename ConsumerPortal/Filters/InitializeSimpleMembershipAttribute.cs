using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using WebMatrix.WebData;
using ConsumerPortal.Models;
using EmberPersistenceLayer;
using EmberInfrastructure.Log;

namespace ConsumerPortal.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public sealed class InitializeSimpleMembershipAttribute : ActionFilterAttribute
    {
        private static SimpleMembershipInitializer _initializer;
        private static object _initializerLock = new object();
        private static bool _isInitialized;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Ensure ASP.NET Simple Membership is initialized only once per app start
            LazyInitializer.EnsureInitialized(ref _initializer, ref _isInitialized, ref _initializerLock);
        }

        private class SimpleMembershipInitializer
        {
            public SimpleMembershipInitializer()
            {
                //Database.SetInitializer<ConsumersContext>(null);
                Database.SetInitializer<AppointmentDBContext>(null);
                Log4NetLogger logger = new Log4NetLogger();
                logger.Info("aaaaaaaa");
                logger.Debug("bbbbbbbbbb");
                logger.Error("ssssssssssss");

                try
                {
                    using (var context = new AppointmentDBContext())
                    {
                        if (!context.Database.Exists())
                        {
                            // Create the SimpleMembership database without Entity Framework migration schema
                            ((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
                        }
                    }


                    WebSecurity.InitializeDatabaseConnection("AppointmentConnection", "UserProfile", "Id", "Name", autoCreateTables: true);
                    if (!WebSecurity.UserExists("admin"))
                    {
                        WebSecurity.CreateUserAndAccount("admin", "admin", new {Email = "admin@gmail.com"});
                    }
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("The ASP.NET Simple Membership database could not be initialized. For more information, please see http://go.microsoft.com/fwlink/?LinkId=256588", ex);
                }
            }
        }
    }
}
