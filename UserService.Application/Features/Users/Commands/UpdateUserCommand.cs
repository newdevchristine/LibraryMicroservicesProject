using System;
using UserService.Domain.Entities;

namespace UserService.Application.Features.Users.Commands
{
    public class UpdateUserCommand
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
    }

    public class UpdateUserCommandHandler
    {
        public string Execute(UpdateUserCommand command)
        {
            var user = FakeDbContext.Instance.Users.Find(u => u.Id == command.Id);
            if (user == null)
                throw new ArgumentException("کاربر مورد نظر یافت نشد.");

            user.UpdateProfile(command.FullName);
            return $"اطلاعات کاربر با موفقیت به‌روزرسانی شد.";
        }
    }
}