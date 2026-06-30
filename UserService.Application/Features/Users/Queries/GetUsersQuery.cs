using System.Collections.Generic;
using UserService.Domain.Entities;


namespace UserService.Application.Features.Users.Queries
{
    
    public class GetUsersQueryHandler
    {
        
        public List<User> Execute()
        {
            
            return FakeDbContext.Instance.Users;
        }
    }
}