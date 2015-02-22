using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmberPersistenceLayer.Models
{
    public class ProviderWorkingTime : BaseEntity
    {
        [ForeignKey("Provider")]
        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }
        public WorkingTimeType Monday { get; set; }
        public WorkingTimeType Tuesday { get; set; }
        public WorkingTimeType Wednesday { get; set; }
        public WorkingTimeType Thursday { get; set; }
        public WorkingTimeType Friday { get; set; }
        public WorkingTimeType Saturday { get; set; }
        public WorkingTimeType Sunday { get; set; }
    }
}
