using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using node.Models;
using System;

namespace node.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly AuthenticationService _authenticationService;

        public AuthenticationController(AuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("authenticate")]
        public ActionResult<UserLoginToken> Authenticate([FromBody] UserAuth userAuth)
        {
            Console.WriteLine($"User login with {JsonConvert.SerializeObject(userAuth)}");

            var token = _authenticationService.Authenticate(userAuth.Username, userAuth.Password);

            if (token == null)
                return new UnauthorizedResult();

            var userToken = new UserLoginToken();
            userToken.Token = token;
            return userToken;
        }
    }
}
