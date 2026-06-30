using System;

namespace BookService.Domain.Entities
{
    public class Book
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Author { get; private set; }
        public bool IsAvailable { get; private set; }

        private Book(Guid id, string title, string author)
        {
            Id = id;
            Title = title;
            Author = author;
            IsAvailable = true;
        }


        public static Book Create(string title, string author)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("عنوان کتاب نمی‌تواند خالی باشد.");

            return new Book(Guid.NewGuid(), title, author);
        }

        public void ChangeAvailability(bool status)
        {
            IsAvailable = status;
        }
        public void UpdateDetails(string title, string author)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("عنوان کتاب نمی‌تواند خالی باشد.");
            Title = title;
            Author = author;
        }
    }
}