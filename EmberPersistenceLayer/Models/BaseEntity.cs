using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace EmberPersistenceLayer.Models
{
    public class BaseEntity
    {
        public BaseEntity()
        {
            CreateOn = DateTime.Now;
            //EntityStatus = EntityStatus.Temporary;
        }
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime CreateOn { get; set; }
        //public EntityStatus EntityStatus { get; set; }
        //[Column(TypeName = "xml")]
        public string Memo { get; set; }
        public XElement GetMemo()
        {
            if (string.IsNullOrWhiteSpace(Memo))
            {
                return null;
            }
            XElement ret = null;
            try
            {
                ret = XElement.Parse(Memo);
            }
            catch (Exception ex)
            {
            }
            return ret;
        }
        public void SetMemo(XElement value)
        {
            Memo = value != null ? value.ToString() : null;
        }
    }
}
