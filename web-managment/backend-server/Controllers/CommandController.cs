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
    public class CommandController : ControllerBase
    {
        private readonly CommandService _commandService;
        private readonly AgentService _agentService;
        public CommandController(AgentService agentService, CommandService commandService)
        {
            _commandService = commandService;
            _agentService = agentService;
        }
        [HttpGet]
        public ActionResult<List<AgentCommmand>> Get() =>
            _commandService.Get();

        [HttpGet("{id:length(24)}", Name = "GetCommand")]
        public ActionResult<Result<AgentCommmand>> Get(string id)
        {
            var commmand = _commandService.Get(id);
            if (commmand == null)
            {
                return NotFound();
            }
            return new Result<AgentCommmand>(commmand);
        }
        [HttpPost]
        [Authorize]
        public ActionResult<Result<AgentCommmand>> CreateCommand(AgentCommmand agentCommmand)
        {
            try
            {
                agentCommmand.dateAdded = DateTime.Now;
                _commandService.Create(agentCommmand);
                return CreatedAtRoute("GetCommand", new { id = agentCommmand.Id.ToString() }, agentCommmand);
            }
            catch (Exception e)
            {
                return StatusCode(500, new Result<Agent>(e.Message));
            }
        }
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public IActionResult Update(string id, UpdateCommand commandIn)
        {
            var book = _commandService.Get(id);

            if (book == null)
            {
                return NotFound();
            }
            _commandService.Update(id, commandIn);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public IActionResult Delete(string id)
        {
            var command = _commandService.Get(id);

            if (command == null)
            {
                return NotFound();
            }
            _commandService.Delete(id);
            return NoContent();
        }
    }
}
