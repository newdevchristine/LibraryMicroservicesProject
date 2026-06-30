using System.Collections.Generic;
using BookService.Domain.Entities;

namespace BookService.Application.Features.Books.Queries
{
    public class GetBooksQueryHandler
    {
        public List<Book> Execute()
        {
            return FakeBookDbContext.Instance.Books;
        }
    }
}