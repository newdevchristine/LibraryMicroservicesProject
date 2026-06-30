using System;
using System.Collections.Generic;

namespace BookService.Domain.Entities
{
    
    public class FakeBookDbContext
    {
        private static FakeBookDbContext _instance;
        private static readonly object _lock = new object();

        public List<Book> Books { get; private set; }

        private FakeBookDbContext()
        {
            Books = new List<Book>();
            Books.Add(Book.Create("شاهنامه", "فردوسی"));
        }

        public static FakeBookDbContext Instance
        {
            get
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new FakeBookDbContext();
                    }
                    return _instance;
                }
            }
        }
    }
}