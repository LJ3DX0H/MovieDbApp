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
    public class DirectorController : ControllerBase
    {
        IDirectorLogic logic;
        IHubContext<SignalRHub> hub;

        public DirectorController(IDirectorLogic logic, IHubContext<SignalRHub> hub)
        {
            this.logic = logic;
            this.hub = hub;
        }

        [HttpGet]
        public IEnumerable<Director> ReadAll()
        {
            return this.logic.ReadAll();
        }

        [HttpGet("{id}")]
        public Director Read(int id)
        {
            return this.logic.Read(id);
        }

        [HttpPost]
        public void Create([FromBody] Director value)
        {
            this.logic.Create(value);
            this.hub.Clients.All.SendAsync("DirectorCreated", value);
        }

        [HttpPut]
        public void Put([FromBody] Director value)
        {
            this.logic.Update(value);
            this.hub.Clients.All.SendAsync("DirectorUpdated", value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            this.logic.Delete(id);
        }
    }
}
