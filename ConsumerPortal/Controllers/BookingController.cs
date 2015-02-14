using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ConsumerPortal.Filters;
using ConsumerPortal.Models;

namespace ConsumerPortal.Controllers
{
    //[ValidateHttpAntiForgeryToken]
    [RoutePrefix("api/booking")]
    public class BookingController : ApiController
    {
        private ConsumersContext db = new ConsumersContext();

        [HttpGet]
        [Route("query")]
        public IEnumerable<BookingDto> GetBookings(string bookingNumber = null, string familyName = null, string givenName = null, string phone = null, DateTime? bookingDate = null, BookingStatus? status = null)
        {
            var datas = db.Bookings.Include("Provider").Where(d => !status.HasValue || d.Status == status);
            if (!string.IsNullOrEmpty(bookingNumber))
            {
                bookingNumber = bookingNumber.ToUpper();
                datas = datas.Where(d => d.BookingNumber == bookingNumber);
            }
            else
            {
                if (!string.IsNullOrEmpty(familyName))
                {
                    familyName = familyName.ToLower();
                    datas = datas.Where(d => d.FamilyName.ToLower() == familyName);
                }
                if (!string.IsNullOrEmpty(givenName))
                {
                    givenName = givenName.ToLower();
                    datas = datas.Where(d => d.GivenName.ToLower() == givenName);
                }
                if (!string.IsNullOrEmpty(phone))
                {
                    datas = datas.Where(d => d.Phone == phone);
                }

                if (bookingDate.HasValue)
                {
                    var start = bookingDate.Value.Date;
                    var end = bookingDate.Value.Date.AddDays(1);
                    datas = datas.Where(d => d.Date >= start && d.Date < end);
                }
            }

            return datas.AsEnumerable().Select(d => new BookingDto(d));
        }

        // GET api/TodoList/5
        public BookingDto GetBooking(int id)
        {
            var booking = db.Bookings.Find(id);
            if (booking == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new BookingDto(booking);
        }

        // PUT api/Todo/5
        public HttpResponseMessage PutBooking(int id, BookingDto bookingDto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != bookingDto.id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var booking = bookingDto.ToEntity(db.Bookings.Find(id));
            var provider = db.Providers.Find(booking.ProviderId);
            if (provider == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            booking.Provider = provider;

            // Need to detach to avoid duplicate primary key exception when SaveChanges is called
            db.Entry(provider).State = EntityState.Detached;
            db.Entry(booking).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            bookingDto = new BookingDto(booking);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, bookingDto);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = bookingDto.id }));
            return response;
        }

        // POST api/Todo
        public HttpResponseMessage PostBooking(BookingDto bookingDto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            var booking = bookingDto.ToEntity();
            booking.EntityStatus = EntityStatus.Actived;

            var provider = db.Providers.Find(booking.ProviderId);
            if (provider == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            // Need to detach to avoid loop reference exception during JSON serialization
            db.Entry(provider).State = EntityState.Detached;
            db.Bookings.Add(booking);
            db.SaveChanges();

            booking.BookingNumber = "B01" + booking.Id.ToString("D05");
            db.Entry(booking).State = EntityState.Modified;
            db.SaveChanges();

            bookingDto.id = booking.Id;
            bookingDto.bookingNumber = booking.BookingNumber;

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, bookingDto);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = bookingDto.id }));
            return response;
        }

        // DELETE api/Todo/5
        public HttpResponseMessage DeleteBooking(int id)
        {
            var booking = db.Bookings.Find(id);
            if (booking == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            var bookingDto = new BookingDto(booking);
            db.Bookings.Remove(booking);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return Request.CreateResponse(HttpStatusCode.OK, bookingDto);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
