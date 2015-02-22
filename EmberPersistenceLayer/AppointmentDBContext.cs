using EmberPersistenceLayer.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmberPersistenceLayer
{
    public class AppointmentDBContext : DbContext
    {
        public AppointmentDBContext()
            : base("AppointmentConnection")
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Client> Consumers { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<ProviderWorkingTime> ProviderWorkingTimes { get; set; }
        public DbSet<Booking> Bookings { get; set; }


    }

    public enum WorkingTimeType
    {
        NoWorking = 0,
        AM = 1,
        PM = 2,
        AllDay = 3,
    }
}
