using agent.api.dto;
using System;

namespace agent.services
{
    public class BlockServiceFactory
    {
        public static IBlockService Create(ResourceType resourceType)
        {
            switch(resourceType)
            {
                case ResourceType.Application:
                    return new ApplicationHandlerService();
                case ResourceType.Website:
                    return new WebsiteHandlerService();
                default:
                    throw new Exception("command type not supported");
            }
        }
    }
}
