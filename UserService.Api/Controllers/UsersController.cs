using Microsoft.AspNetCore.Mvc;
using System;
using UserService.Application.Features.Users.Commands;
using UserService.Application.Features.Users.Queries;

namespace UserService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpPost]
        public IActionResult CreateUser([FromBody] CreateUserCommand command)
        {
            try {
                var handler = new CreateUserCommandHandler();
                return Ok(new { message = handler.Execute(command) });
            } catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            var handler = new GetUsersQueryHandler();
            return Ok(handler.Execute());
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(Guid id, [FromBody] UpdateUserCommand command)
        {
            try {
                command.Id = id;
                var handler = new UpdateUserCommandHandler();
                return Ok(new { message = handler.Execute(command) });
            } catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(Guid id)
        {
            try {
                var command = new DeleteUserCommand { Id = id };
                var handler = new DeleteUserCommandHandler();
                return Ok(new { message = handler.Execute(command) });
            } catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
        }
    }
}