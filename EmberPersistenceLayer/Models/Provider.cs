using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmberPersistenceLayer.Models
{
    public class Provider : BaseEntity
    {
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public virtual HashSet<ProviderWorkingTime> WorkingTimes { get; set; }
    }
}
