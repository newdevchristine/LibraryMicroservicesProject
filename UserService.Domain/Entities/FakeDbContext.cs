using System;
using System.Collections.Generic;

namespace UserService.Domain.Entities
{
    
    public class FakeDbContext
    {
        private static FakeDbContext _instance;
        private static readonly object _lock = new object();

        public List<User> Users { get; private set; }

        private FakeDbContext()
        {
            Users = new List<User>();
            Users.Add(User.Create("admin", "admin@email.com", "مدیر سیستم"));
        }

        public static FakeDbContext Instance
        {
            get
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new FakeDbContext();
                    }
                    return _instance;
                }
            }
        }
    }
}