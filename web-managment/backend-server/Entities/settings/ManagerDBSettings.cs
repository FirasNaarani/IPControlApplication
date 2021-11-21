namespace backend.Entities
{
    public class ManagerDBSettings : IManagerDBSettings
    {
        public string ManagerCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IManagerDBSettings
    {
        string ManagerCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
