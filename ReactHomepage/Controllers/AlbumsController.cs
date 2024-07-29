using Microsoft.AspNetCore.Mvc;
using ReactHomepage.Interfaces;

namespace ReactHomepage.Controllers
{
    public class AlbumsController : Controller
    {
        private readonly IPhotoManager _photoManager;
        public AlbumsController(IPhotoManager photoManager)
        {
            _photoManager = photoManager;
        }

        //
        // GET: /Albums/
        public IActionResult Index()
        {
            return Json(_photoManager.GetAlbumsWithPhotoCount());
        }
    }
}