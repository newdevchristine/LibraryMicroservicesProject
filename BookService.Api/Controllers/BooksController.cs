using Microsoft.AspNetCore.Mvc;
using System;
using BookService.Application.Features.Books.Commands;
using BookService.Application.Features.Books.Queries;

namespace BookService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateBook([FromBody] CreateBookCommand command)
        {
            try {
                var handler = new CreateBookCommandHandler();
                return Ok(new { message = handler.Execute(command) });
            } catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpGet]
        public IActionResult GetAllBooks()
        {
            var handler = new GetBooksQueryHandler();
            return Ok(handler.Execute());
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBook(Guid id, [FromBody] UpdateBookCommand command)
        {
            try {
                command.Id = id;
                var handler = new UpdateBookCommandHandler();
                return Ok(new { message = handler.Execute(command) });
            } catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(Guid id)
        {
            try {
                var command = new DeleteBookCommand { Id = id };
                var handler = new DeleteBookCommandHandler();
                return Ok(new { message = handler.Execute(command) });
            } catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
        }
    }
}