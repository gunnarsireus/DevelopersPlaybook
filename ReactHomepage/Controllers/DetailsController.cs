using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactHomepage.Interfaces;
using ReactHomepage.Models;
using System.Collections.Generic;
using System.Linq;

namespace ReactHomepage.Controllers
{
    public class DetailsController : Controller
    {
	    private const string RandomPhotoID = "RandomPhotoID";
        private readonly IPhotoManager _photoManager;
        public DetailsController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }
        //
        // GET: /Details/

        public IActionResult GetPhotos(string id)  //id=albumId
        {
             if (id=="0")
            {
                var photoList = new List<Photo>();
				var randomPhotoID = HttpContext.Session.MyGet<string>(RandomPhotoID);
				if (randomPhotoID != null && int.TryParse(randomPhotoID, out int randomPhotoId))
                {
                    var tmpAlbumId = _photoManager.GetPhoto(randomPhotoId).AlbumID;
                    return Json(_photoManager.GetPhotos(tmpAlbumId).Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
                }
                else
                {
                    var tmpPhotoID = _photoManager.GetRandomPhotoId(_photoManager.GetRandomAlbumId());
                    photoList.Add(_photoManager.GetPhoto(tmpPhotoID));
                }
                return Json(photoList.Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
            }
            return Json(_photoManager.GetPhotos(int.Parse(id)).Select(o => new { o.PhotoID, o.AlbumID, o.Caption }));
        }

        public IActionResult GetRandomPhotoID()
        {
            var randomPhotoID = HttpContext.Session.MyGet<string>(RandomPhotoID);
            if (randomPhotoID != null && int.TryParse(randomPhotoID, out int idd))
            {
                return Json(idd);
            }
            else
            {
                return Json(0);
            }
        }
    }
}