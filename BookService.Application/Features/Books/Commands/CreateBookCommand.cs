using System;
using BookService.Domain.Entities;

namespace BookService.Application.Features.Books.Commands
{
    public class CreateBookCommand
    {
        public string Title { get; set; }
        public string Author { get; set; }
    }

    public class CreateBookCommandHandler
    {
        public string Execute(CreateBookCommand command)
        {
            var newBook = Book.Create(command.Title, command.Author);
            FakeBookDbContext.Instance.Books.Add(newBook);
            return $"کتاب '{newBook.Title}' با موفقیت ثبت شد.";
        }
    }
}