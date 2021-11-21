using node.Infra;

namespace backend.Services
{
    public class AuthenticationService
    {
        private readonly IJWTAuthenticationManager _jWTAuthenticationManager; 
        private readonly ManagerService _managerService;
        public AuthenticationService(ManagerService managerService, IJWTAuthenticationManager jWTAuthenticationManager)
        {
            this._jWTAuthenticationManager = jWTAuthenticationManager;
            this._managerService = managerService;
        }

        public string Authenticate(string user, string password)
        {
            if (!_managerService.isValidCredentials(user, password))
            {
                return null;
            }
            return this._jWTAuthenticationManager.prepareAuthenticationToken(user);
        }

    }
}
