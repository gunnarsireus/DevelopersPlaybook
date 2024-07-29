using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactHomepage.Interfaces;
using ReactHomepage.Models;
using System;
using System.IO;

namespace ReactHomepage.Controllers
{
    public class HandlerController : Controller
    {
	    private const string RandomPhotoID = "RandomPhotoID";
	    private const string PhotoID = "PhotoID";
        private readonly IPhotoManager _photoManager;

        public HandlerController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }

        // GET: /Images/

        public IActionResult Index(string arg1, string arg2)  //arg1=photoId, arg2=Size
        {
            PhotoSize size;
            switch (arg2.Replace("Size=", ""))
            {
                case "S":
                    size = PhotoSize.Small;
                    break;
                case "M":
                    size = PhotoSize.Medium;
                    break;
                case "L":
                    size = PhotoSize.Large;
                    break;
                default:
                    size = PhotoSize.Original;
                    break;
            }

		    HttpContext.Session.MySet(PhotoID, arg1.Replace("PhotoID=", ""));
			if (arg1 == "PhotoID=0")
            {
                var tmpPhotoID = _photoManager.GetRandomPhotoId(_photoManager.GetRandomAlbumId());
                arg1 = "PhotoID=" + tmpPhotoID;
	            HttpContext.Session.MySet(PhotoID, tmpPhotoID.ToString());
	            HttpContext.Session.MySet(RandomPhotoID, tmpPhotoID.ToString());
            }
            // Setup the PhotoID Parameter

            var stream = new MemoryStream();

            if (arg1.Substring(0, 7) == "PhotoID")
            {
                var photoId = Convert.ToInt32(arg1.Replace("PhotoID=", ""));
	            HttpContext.Session.MySet(PhotoID, photoId.ToString());
                _photoManager.GetPhoto(photoId, size).CopyTo(stream);
            }
            else
            {
                var albumId = Convert.ToInt32(arg1.Replace("AlbumID=", ""));
                _photoManager.GetFirstPhoto(albumId, size).CopyTo(stream);
            }

            return File(stream.GetBuffer(), "image/png");
        }

        public IActionResult Download(string arg1, string arg2)
        {
	        var photoId = HttpContext.Session.MyGet<string>(PhotoID);
			if (photoId != null)
            {
                ViewData["PhotoID"] = photoId;
            }
            else
            {
				HttpContext.Session.MySet(RandomPhotoID, _photoManager.GetRandomPhotoId(_photoManager.GetRandomAlbumId()).ToString());
                ViewData["PhotoID"] = RandomPhotoID;
            }
            ViewData["Size"] = "L";
            return View();
        }

        public IActionResult Delete(string arg1, string arg2)
        {
            if (HttpContext.Session.MyGet<bool>(HomeController.UserLoggedIn) == true)
            {
                _photoManager.DeletePhoto(int.Parse(arg1));
                return Json(arg1);
            }

            return Json("NotOk");
        }

        public IActionResult Save(string arg1, string arg2) // arg1 = PhotoId, arg2 = Caption
        {
            if (HttpContext.Session.MyGet<bool>(HomeController.UserLoggedIn) == true)
            {
                _photoManager.EditPhoto(arg2, int.Parse(arg1));
                return Json("ok");
            }

            return Json("NotOk");
        }
    }
}