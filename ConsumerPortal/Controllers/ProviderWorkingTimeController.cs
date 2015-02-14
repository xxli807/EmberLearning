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
    //[Authorize]
    //[ValidateHttpAntiForgeryToken]
    public class ProviderWorkingTimeController : ApiController
    {
        private ConsumersContext db = new ConsumersContext();

        // GET api/TodoList
        public IEnumerable<ProviderWorkingTimeDto> GetProviderWorkingTimes()
        {
            return db.ProviderWorkingTimes.Include("Provider")
                .AsEnumerable()
                .Select(d => new ProviderWorkingTimeDto(d)).ToList();
        }

        // GET api/TodoList/5
        public ProviderWorkingTimeDto GetProviderWorkingTime(int id)
        {
            var data = db.ProviderWorkingTimes.Find(id);
            if (data == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new ProviderWorkingTimeDto(data);
        }

        // PUT api/Todo/5
        public HttpResponseMessage PutProviderWorkingTime(int id, ProviderWorkingTimeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != dto.id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var data = dto.ToEntity(db.ProviderWorkingTimes.Find(id));

            db.Entry(data).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        // POST api/Todo
        public HttpResponseMessage PostProviderWorkingTime(ProviderWorkingTimeDto dto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            var provider = db.Providers.Find(dto.providerId);
            if (provider == null)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var count = dto.monday + dto.tuesday * 10 +
                dto.wednesday * 100 + dto.thursday * 1000 +
                dto.friday * 10000 + dto.saturday * 100000 +
                dto.sunday * 1000000;
            var data = provider.WorkingTimes.OrderByDescending(d => d.CreateOn).FirstOrDefault();

            if (data == null || count != ((int)data.Monday +
                            (int)data.Tuesday * 10 +
                            (int)data.Wednesday * 100 +
                            (int)data.Thursday * 1000 +
                            (int)data.Friday * 10000 +
                            (int)data.Saturday * 100000 +
                            (int)data.Sunday * 1000000))
            {
                data = dto.ToEntity();
                data.EntityStatus = EntityStatus.Actived;
                db.ProviderWorkingTimes.Add(data);
                db.SaveChanges();
            }

            dto.id = data.Id;

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, dto);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = dto.id }));
            return response;
        }

        // DELETE api/Todo/5
        public HttpResponseMessage DeleteProviderWorkingTime(int id)
        {
            var data = db.ProviderWorkingTimes.Find(id);
            if (data == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            var dto = new ProviderWorkingTimeDto(data);
            db.ProviderWorkingTimes.Remove(data);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            return Request.CreateResponse(HttpStatusCode.OK, dto);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
