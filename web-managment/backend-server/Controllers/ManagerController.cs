using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ManagerController : ControllerBase
    {
        private readonly ManagerService _managerService;

        public ManagerController(ManagerService managerService)
        {
            _managerService = managerService;
        }

        [HttpGet]
        public ActionResult<List<Manager>> Get() =>
            _managerService.Get();

        [HttpGet("{id:length(24)}", Name = "GetManager")]
        public ActionResult<Result<Manager>> Get(string id)
        {
            var manager = _managerService.Get(id);
            if (manager == null)
            {
                return NotFound();
            }
            return new Result<Manager>(manager);
        }

        [HttpPost]
        public ActionResult<Result<Manager>> Create(Manager manager)
        {
            try
            {
                _managerService.Create(manager);
                return CreatedAtRoute("GetManager", new { id = manager.Id.ToString() }, manager);
            }
            catch (Exception e)
            {
                return StatusCode(500, new Result<Manager>(e.Message));
            }
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, UpdateManager managerIn)
        {
            var book = _managerService.Get(id);

            if (book == null)
            {
                return NotFound();
            }
            _managerService.Update(id, managerIn);
            return NoContent();
        }
        [HttpPut("password/{id:length(24)}")]
        public IActionResult UpdatePassword(string id, UpdatePassword managerIn)
        {
            var book = _managerService.Get(id);

            if (book == null)
            {
                return NotFound();
            }
            _managerService.UpdatePassword(id, managerIn);
            return NoContent();
        }
        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public IActionResult Delete(string id)
        {
            var command = _managerService.Get(id);

            if (command == null)
            {
                return NotFound();
            }
            _managerService.Delete(id);
            return NoContent();
        }
    }
}
