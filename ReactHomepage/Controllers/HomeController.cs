using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ReactHomepage.Interfaces;
using ReactHomepage.Models;
using System.Diagnostics;
using System.Threading.Tasks;

namespace ReactHomepage.Controllers
{
    public class HomeController : Controller
    {
        public const string SessionUserLoggedIn = "UserLoggedIn";
        private IConfiguration Configuration { get; }
        public HomeController(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IActionResult Index() => View();

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            if (ModelState.IsValid)
            {
                bool isLoggedIn = HttpContext.Session.MyGet<bool>(SessionUserLoggedIn);
                if (isLoggedIn)
                {
                    await Task.Delay(500); // Async delay to simulate processing time
                    HttpContext.Session.MySet(SessionUserLoggedIn, false);
                    return Json(new { success = true, text = "userLoggedOut" });
                }
                else
                {
                    return Json(new { success = true, text = "userAlreadyLoggedOut" });
                }
            }
            else
            {
                return Json(new { success = false, text = "ModelState invalid" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Password == Configuration["Password"])
                {
                    await Task.Delay(500); // Async delay to simulate processing time
                    HttpContext.Session.MySet(SessionUserLoggedIn, true);
                    return Json(new { success = true, text = "PasswordOk" });
                }
                else
                {
                    return Json(new { success = true, text = "PasswordNotOk" });
                }
            }
            else
            {
                return Json(new { success = false, text = "ModelState invalid" });
            }
        }

        public class LoginModel
        {
            public string Password { get; set; }
        }
    }
}
