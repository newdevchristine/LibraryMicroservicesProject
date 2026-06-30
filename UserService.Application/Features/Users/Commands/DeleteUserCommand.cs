using System;
using UserService.Domain.Entities;

namespace UserService.Application.Features.Users.Commands
{
    public class DeleteUserCommand
    {
        public Guid Id { get; set; }
    }

    public class DeleteUserCommandHandler
    {
        public string Execute(DeleteUserCommand command)
        {
            var user = FakeDbContext.Instance.Users.Find(u => u.Id == command.Id);
            if (user == null)
                throw new ArgumentException("کاربر مورد نظر یافت نشد.");

            FakeDbContext.Instance.Users.Remove(user);
            return $"کاربر با موفقیت از سیستم حذف شد.";
        }
    }
}