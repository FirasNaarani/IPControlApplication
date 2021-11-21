using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly AgentService _agentService;
        public AgentController(AgentService agentService)
        {
            _agentService = agentService;
        }

        [Authorize]
        [HttpGet("{id:length(24)}", Name = "GetAgent")]
        public ActionResult<Result<Agent>> Get(string id)
        {
            var agent = _agentService.Get(id);
            if (agent == null)
            {
                return NotFound();
            }
            return new Result<Agent>(agent);
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<Agent>> Get() =>
            _agentService.Get();

        [HttpPost]
        public ActionResult<Result<Agent>> Create(Agent agent)
        {
            try
            {
                var existingAgent = _agentService.GetByIp(agent.ip);
                if (existingAgent != null)
                {
                    return CreatedAtRoute("GetAgent", new { id = existingAgent.Id.ToString() }, existingAgent);
                }
                _agentService.Create(agent);
                return CreatedAtRoute("GetAgent", new { id = agent.Id.ToString() }, agent);
            }
            catch (Exception e)
            {
                return StatusCode(500, new Result<Agent>(e.Message));
            }
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult UpdateLastSync(string id)
        {
            var agent = _agentService.Get(id);

            if (agent == null)
            {
                return NotFound();
            }
            agent.lasySync = DateTime.Now;
            _agentService.Update(id, agent);
            return NoContent();
        }
    }
}
