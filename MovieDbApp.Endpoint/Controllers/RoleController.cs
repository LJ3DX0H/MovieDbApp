using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MovieDbApp.Endpoint.Services;
using MovieDbApp.Logic;
using MovieDbApp.Models;
using System.Collections.Generic;

namespace MovieDbApp.Endpoint.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        IRoleLogic logic;
        IHubContext<SignalRHub> hub;

        public RoleController(IRoleLogic logic, IHubContext<SignalRHub> hub)
        {
            this.logic = logic;
            this.hub = hub;
        }

        [HttpGet]
        public IEnumerable<Role> ReadAll()
        {
            return this.logic.ReadAll();
        }

        [HttpGet("{id}")]
        public Role Read(int id)
        {
            return this.logic.Read(id);
        }

        [HttpPost]
        public void Create([FromBody] Role value)
        {
            this.logic.Create(value);
            this.hub.Clients.All.SendAsync("RoleCreated", value);
        }

        [HttpPut]
        public void Put([FromBody] Role value)
        {
            this.logic.Update(value);
            this.hub.Clients.All.SendAsync("RoleUpdated", value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            this.logic.Delete(id);
        }
    }
}
