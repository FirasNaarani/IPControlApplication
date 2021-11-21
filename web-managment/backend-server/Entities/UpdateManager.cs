using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class UpdateManager
    {
        [Required(ErrorMessage = "Username Required")]
        public string username { get; set; }
        [Required(ErrorMessage = "Email Required")]
        public string email { get; set; }
        [Required(ErrorMessage = "Name Required")]
        public string name { get; set; }
    }
}
