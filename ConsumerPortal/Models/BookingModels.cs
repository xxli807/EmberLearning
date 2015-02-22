using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using WebGrease.Css.Extensions;

namespace ConsumerPortal.Models
{
    public class ConsumersContext : DbContext
    {
        public ConsumersContext()
            : base("AppointmentConnection")
        {
        }

        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Consumer> Consumers { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<ProviderWorkingTime> ProviderWorkingTimes { get; set; }
        public DbSet<Booking> Bookings { get; set; }
    }

    public enum EntityStatus
    {
        Temporary = 0,
        Actived = 1,
        Deactived = 9999,
    }
    public enum BookingStatus
    {
        Applied = 0,
        Rejected = 1,
        Scheduled = 2,
        Canceled = 3,
        NoShowed = 4,
    }
    public enum WorkingTimeType
    {
        NoWorking = 0,
        AM = 1,
        PM = 2,
        AllDay = 3,
    }
    public class BaseEntity
    {
        public BaseEntity()
        {
            CreateOn = DateTime.Now;
            EntityStatus = EntityStatus.Temporary;
        }
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime CreateOn { get; set; }
        public EntityStatus EntityStatus { get; set; }
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

    [Table("Provider")]
    public class Provider : BaseEntity
    {
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Mobile { get; set; }
        public virtual HashSet<ProviderWorkingTime> WorkingTimes { get; set; }
    }
    public class ProviderDto //: BaseEntity
    {
        public ProviderDto(Provider data = null)
        {
            if (data != null)
            {
                id = data.Id;
                familyName = data.FamilyName;
                givenName = data.GivenName;
                email = data.Email;
                phone = data.Phone;
                mobile = data.Mobile;
                if (data.WorkingTimes != null)
                {
                    providerWorkingTimes = new HashSet<ProviderWorkingTimeDto>();
                    data.WorkingTimes.ForEach(d =>
                    {
                        //d.Provider = data;
                        providerWorkingTimes.Add(new ProviderWorkingTimeDto(d));
                    });
                }
            }
            else
            {
            }
        }
        [Key]
        public int id { get; set; }
        public string familyName { get; set; }
        public string givenName { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string mobile { get; set; }
        public virtual HashSet<ProviderWorkingTimeDto> providerWorkingTimes { get; set; }

        public Provider ToEntity(Provider data = null)
        {
            Provider ret = data;
            if (data == null)
            {
                ret = new Provider();
            }

            //ret.Id = id;
            ret.GivenName = givenName;
            ret.FamilyName = familyName;
            ret.Email = email;
            ret.Phone = phone;
            ret.Mobile = mobile;

            if (providerWorkingTimes != null)
            {
                ret.WorkingTimes = ret.WorkingTimes ?? new HashSet<ProviderWorkingTime>();
                providerWorkingTimes.ForEach(d =>
                {
                    var count = d.monday + d.tuesday * 10 + d.wednesday * 100 + d.thursday * 1000 + d.friday * 10000 +
                                d.saturday * 100000 + d.sunday * 1000000;
                    if (
                        ret.WorkingTimes.All(
                            t =>
                                count != ((int)t.Monday +
                                (int)t.Tuesday * 10 +
                                (int)t.Wednesday * 100 +
                                (int)t.Thursday * 1000 +
                                (int)t.Friday * 10000 +
                                (int)t.Saturday * 100000 +
                                (int)t.Sunday * 1000000)))
                    {
                        var entity = d.ToEntity();
                        entity.Provider = ret;
                        ret.WorkingTimes.Add(entity);
                    }
                });
            }

            return ret;
        }
    }

    [Table("ProviderWorkingTime")]
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
    public class ProviderWorkingTimeDto //: BaseEntity
    {
        public ProviderWorkingTimeDto(ProviderWorkingTime data = null)
        {
            if (data != null)
            {
                id = data.Id;
                providerId = data.ProviderId;
                monday = (int)data.Monday;
                thursday = (int)data.Thursday;
                wednesday = (int)data.Wednesday;
                thursday = (int)data.Thursday;
                friday = (int)data.Friday;
                saturday = (int)data.Saturday;
                sunday = (int)data.Sunday;
            }
            else
            {
            }
        }
        [Key]
        public int id { get; set; }

        public int providerId { get; set; }
        public int monday { get; set; }
        public int tuesday { get; set; }
        public int wednesday { get; set; }
        public int thursday { get; set; }
        public int friday { get; set; }
        public int saturday { get; set; }
        public int sunday { get; set; }

        public ProviderWorkingTime ToEntity(ProviderWorkingTime data = null)
        {
            ProviderWorkingTime ret = data;
            if (data == null)
            {
                ret = new ProviderWorkingTime();
            }

            //ret.Id = id;
            ret.ProviderId = providerId;
            ret.Monday = (WorkingTimeType)monday;
            ret.Tuesday = (WorkingTimeType)tuesday;
            ret.Wednesday = (WorkingTimeType)wednesday;
            ret.Thursday = (WorkingTimeType)thursday;
            ret.Friday = (WorkingTimeType)friday;
            ret.Saturday = (WorkingTimeType)saturday;
            ret.Sunday = (WorkingTimeType)sunday;

            return ret;
        }

    }


    [Table("Consumer")]
    public class Consumer : BaseEntity
    {
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    [Table("Booking")]
    public class Booking : BaseEntity
    {
        public string BookingNumber { get; set; }
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string VisitReason { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public bool IsAM { get; set; }
        [ForeignKey("Provider")]
        public int ProviderId { get; set; }
        public virtual Provider Provider { get; set; }
        public BookingStatus Status { get; set; }
    }
    public class BookingDto //: BaseEntity
    {
        public BookingDto(Booking data = null)
        {
            if (data != null)
            {
                id = data.Id;
                familyName = data.FamilyName;
                givenName = data.GivenName;
                contactEmail = data.Email;
                contactPhone = data.Phone;
                visitReason = data.VisitReason;
                bookingDate = data.Date;
                startTime = data.StartTime.HasValue ? data.Date.Date.Add(data.StartTime.Value) : new DateTime?();
                endTime = data.EndTime.HasValue ? data.Date.Date.Add(data.EndTime.Value) : new DateTime?();
                atAM = data.IsAM;
                atPM = !data.IsAM;
                providerId = data.ProviderId;
                status = data.Status.ToString();
                bookingNumber = data.BookingNumber;
                provider = new ProviderDto(data.Provider)
                {
                    providerWorkingTimes = null
                };
            }
            else
            {
                bookingDate = DateTime.Now;
                status = BookingStatus.Applied.ToString();
            }
        }
        [Key]
        public int id { get; set; }
        public string bookingNumber { get; set; }
        public string familyName { get; set; }
        public string givenName { get; set; }
        public string contactEmail { get; set; }
        public string contactPhone { get; set; }
        public string visitReason { get; set; }
        public DateTime bookingDate { get; set; }
        public DateTime? startTime { get; set; }
        public DateTime? endTime { get; set; }
        public bool atAM { get; set; }
        public bool atPM { get; set; }
        public int providerId { get; set; }
        public string status { get; set; }

        public ProviderDto provider { get; set; }

        public Booking ToEntity(Booking data = null)
        {
            Booking ret = data;
            if (data == null)
            {
                ret = new Booking();
            }

            //ret.Id = id;
            //ret.BookingNumber = bookingNumber;
            ret.GivenName = givenName;
            ret.FamilyName = familyName;
            ret.Email = contactEmail;
            ret.Phone = contactPhone;
            ret.VisitReason = visitReason;
            ret.Date = bookingDate;
            ret.IsAM = atAM || !atPM;
            BookingStatus eStatus;
            ret.Status = BookingStatus.TryParse(status, out eStatus) ? eStatus : BookingStatus.Applied;

            if (ret.Status == BookingStatus.Scheduled)
            {
                ret.StartTime = startTime.HasValue ? startTime.Value.TimeOfDay : new TimeSpan?();
                ret.EndTime = endTime.HasValue ? endTime.Value.TimeOfDay : new TimeSpan?();
            }
            else if (ret.Status == BookingStatus.Applied)
            {
                ret.StartTime = null;
                ret.EndTime = null;
            }

            ret.ProviderId = providerId;

            return ret;
        }
    }

}