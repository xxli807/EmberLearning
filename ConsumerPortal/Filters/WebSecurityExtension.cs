using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ConsumerPortal.Models;

namespace ConsumerPortal.Filters
{
    public class WebSecurityExtension
    {
        public static string GetUserName(string email)
        {
            ConsumersContext db = new ConsumersContext();
            var userProfile = db.UserProfiles.FirstOrDefault(u => u.Email == email);
            return userProfile == null ? null : userProfile.Name;
        }
    }
}