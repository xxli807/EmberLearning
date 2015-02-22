using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmberPersistenceLayer.Models
{
    public class Client : BaseEntity
    {
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string MiddleName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        [NotMapped]
        public string FullName
        {
            get
            {
                return GivenName == null ? MiddleName == null ? FamilyName : MiddleName + " " + FamilyName : MiddleName + " " + GivenName + " " + FamilyName;
            }
        }
    }
}
