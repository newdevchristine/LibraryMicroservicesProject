using System;

namespace UserService.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Username { get; private set; }
        public string Email { get; private set; }
        public string FullName { get; private set; }
        public DateTime CreatedAt { get; private set; }

        private User(Guid id, string username, string email, string fullName)
        {
            Id = id;
            Username = username;
            Email = email;
            FullName = fullName;
            CreatedAt = DateTime.UtcNow;
        }

        public static User Create(string username, string email, string fullName)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentException("نام کاربری نمی‌تواند خالی باشد.");
                
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("ایمیل نمی‌تواند خالی باشد.");

            return new User(Guid.NewGuid(), username, email, fullName);
        }

        public void UpdateProfile(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                throw new ArgumentException("نام کامل نمی‌تواند خالی باشد.");

            FullName = fullName;
        }
    }
}