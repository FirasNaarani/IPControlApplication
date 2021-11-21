using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class UpdateCommand
    {
        [Required(ErrorMessage = "resourceType Required")]
        public ResourceType resourceType { get; set; }
        [Required(ErrorMessage = "operationType Required")]
        public string value { set; get; }
        public long operationDurationMinutes { set; get; }
        public bool isActive { set; get; }
    }
}
