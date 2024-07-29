using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactHomepage.Interfaces;
using ReactHomepage.Models;
using System.IO;
using System.Linq;

namespace ReactHomepage.Controllers
{
    public class PhotosController : Controller
    {
        private readonly IPhotoManager _photoManager;
        public PhotosController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }
		//
		// GET: /Photos/Session

		public IActionResult Index(string id)  //id = albumId
        {
            var albumId = int.Parse(id);
            return Json(_photoManager.GetPhotos(albumId).Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
        }

        public IActionResult GetAlbumCaption(string id) // id = photoId
        {
            var photoId = int.Parse(id);
            return Json(_photoManager.GetAlbumCaptionByPhotoId(photoId));
        }

        [HttpPost]
        public IActionResult AddPhoto([FromForm] FormData formData)
        {
            if (HttpContext.Session.MyGet<bool>(HomeController.UserLoggedIn) == true)
            {
                using (var ms = new MemoryStream())
                {
                    formData.Image.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    _photoManager.AddPhoto(formData.AlbumId, formData.Caption, fileBytes);
                }

                return Json("Ok");
            }

            return Json("Nok");
        }
    }

    public class FormData
    {
        public int AlbumId { get; set; }
        public string Caption { get; set; }
        public IFormFile Image { get; set; }
    }
}