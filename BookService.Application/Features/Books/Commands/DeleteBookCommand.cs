using System;
using BookService.Domain.Entities;

namespace BookService.Application.Features.Books.Commands
{
    public class DeleteBookCommand
    {
        public Guid Id { get; set; }
    }

    public class DeleteBookCommandHandler
    {
        public string Execute(DeleteBookCommand command)
        {
            var book = FakeBookDbContext.Instance.Books.Find(b => b.Id == command.Id);
            if (book == null)
                throw new ArgumentException("کتاب مورد نظر یافت نشد.");

            FakeBookDbContext.Instance.Books.Remove(book);
            return $"کتاب با موفقیت از سیستم حذف شد.";
        }
    }
}