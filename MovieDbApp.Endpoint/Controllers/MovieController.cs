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
    public class MovieController : ControllerBase
    {

        IMovieLogic logic;
        IHubContext<SignalRHub> hub;

        public MovieController(IMovieLogic logic, IHubContext<SignalRHub> hub)
        {
            this.logic = logic;
            this.hub = hub;
        }

        [HttpGet]
        public IEnumerable<Movie> ReadAll()
        {
            return this.logic.ReadAll();
        }

        [HttpGet("{id}")]
        public Movie Read(int id)
        {
            return this.logic.Read(id);
        }

        [HttpPost]
        public void Create([FromBody] Movie value)
        {
            this.logic.Create(value);
            this.hub.Clients.All.SendAsync("MovieCreated", value);
        }

        [HttpPut]
        public void Put([FromBody] Movie value)
        {
            this.logic.Update(value);
            this.hub.Clients.All.SendAsync("MovieUpdated", value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            this.logic.Delete(id);
        }
    }
}
