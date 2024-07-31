using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactHomepage.Interfaces;
using Swashbuckle.AspNetCore.Annotations;
using System.IO;
using System.Linq;

namespace ReactHomepage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoManager _photoManager;
        public PhotosController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }

        [HttpGet("album/{id}")]
        [SwaggerOperation(Summary = "Get all photos in album", Description = "Get all photos in album")]
        public ActionResult GetPhotos(int id) // id = albumId
        {
            var photos = _photoManager.GetPhotosByAlbumId(id).Select(o => new { o.PhotoID, o.AlbumID, o.Caption });
            return Ok(photos);
        }

        [HttpGet("caption/{id}")]
        [SwaggerOperation(Summary = "Get album caption by photo id", Description = "Get album caption by photo id")]
        public ActionResult GetAlbumCaption(int id) // id = photoId
        {
            var caption = _photoManager.GetAlbumCaptionByPhotoId(id);

            if (!string.IsNullOrEmpty(caption))
                return Ok(new { caption });

            return NotFound(new { message = "Album caption found." });
        }

        [HttpPost("add")]
        [SwaggerOperation(Summary = "Add photo", Description = "Add photo")]
        public ActionResult Add([FromForm] FormData formData)
        {
            if (UserIsLoggedIn())
            {
                using (var ms = new MemoryStream())
                {
                    formData.Image.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    _photoManager.AddPhoto(formData.AlbumId, formData.Caption, fileBytes);
                }

                return Ok(new { message = "Photo added successfully." });
            }

            return Unauthorized(new { message = "User not logged in." });
        }

        [HttpPut("update/{id}")]
        [SwaggerOperation(Summary = "Update photo", Description = "Update photo")]
        public ActionResult Update(int id, [FromBody] string caption)
        {
            if (UserIsLoggedIn())
            {
                _photoManager.UpdatePhoto(caption, id);
                return Ok(new { message = "Photo updated successfully." });
            }

            return Unauthorized(new { message = "User not logged in." });
        }

        [HttpDelete("delete/{id}")]
        [SwaggerOperation(Summary = "Delete photo", Description = "Delete photo")]
        public IActionResult Delete(int id)
        {
            if (UserIsLoggedIn())
            {
                _photoManager.DeletePhoto(id);
                return Ok(new { message = "Photo deleted successfully." });
            }

            return Unauthorized(new { message = "User not logged in." });
        }

        private bool UserIsLoggedIn()
        {
            // Replace this with actual user authentication logic, e.g., checking JWT tokens or session data
            return HttpContext.Session.GetString(HomeController.UserLoggedIn) == "true";
        }
    }

    public class FormData
    {
        public int AlbumId { get; set; }
        public string Caption { get; set; }
        public IFormFile Image { get; set; }
    }
}