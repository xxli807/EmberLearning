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
    public class ProviderController : ApiController
    {
        private ConsumersContext db = new ConsumersContext();

        // GET api/Providers
        public IEnumerable<ProviderDto> GetProviders()
        {
            var datas = db.Providers.Include("WorkingTimes")
                .AsEnumerable()
                .Select(d => new ProviderDto(d)).ToList();
            return datas;
        }

        // GET api/Provider/5
        public ProviderDto GetProvider(int id)
        {
            var data = db.Providers.Find(id);
            if (data == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new ProviderDto(data);
        }

        // PUT api/Provider/5
        public HttpResponseMessage PutProvider(int id, ProviderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != dto.id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            var data = dto.ToEntity(db.Providers.Find(id));

            db.Entry(data).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }

            dto = new ProviderDto(data);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, dto);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = dto.id }));
            return response;
        }

        // POST api/Provider
        public HttpResponseMessage PostProvider(ProviderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            var data = dto.ToEntity();
            data.EntityStatus = EntityStatus.Actived;

            db.Providers.Add(data);
            db.SaveChanges();

            dto.id = data.Id;

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, dto);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = dto.id }));
            return response;
        }

        // DELETE api/Provider/5
        public HttpResponseMessage DeleteProvider(int id)
        {
            var data = db.Providers.Find(id);
            if (data == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            var dto = new ProviderDto(data);
            db.Providers.Remove(data);

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
