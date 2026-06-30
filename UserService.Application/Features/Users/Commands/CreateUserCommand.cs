using System;
using UserService.Domain.Entities;


namespace UserService.Application.Features.Users.Commands
{
    
    public class CreateUserCommand
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
    }

    
    public class CreateUserCommandHandler
    {
        public string Execute(CreateUserCommand command)
        {
            
            var newUser = User.Create(command.Username, command.Email, command.FullName);
            
            
            FakeDbContext.Instance.Users.Add(newUser);
            
            return $"کاربر با شناسه {newUser.Id} و نام کاربری {newUser.Username} با موفقیت ساخته شد.";
        }
    }
}