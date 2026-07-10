using System;
using BookService.Domain.Entities;

namespace BookService.Application.Features.Books.Commands
{
    public class UpdateBookCommand
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class UpdateBookCommandHandler
    {
        public string Execute(UpdateBookCommand command)
        {
            var book = FakeBookDbContext.Instance.Books.Find(b => b.Id == command.Id);
            if (book == null)
                throw new ArgumentException("کتاب مورد نظر یافت نشد.");

            book.UpdateDetails(command.Title, command.Author);
            book.ChangeAvailability(command.IsAvailable); 

            return $"اطلاعات کتاب با موفقیت به‌روزرسانی شد.";
        }
    }
}