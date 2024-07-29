using Microsoft.AspNetCore.Mvc;
using ReactHomepage.Models;
using System.Diagnostics;


namespace ReactHomepage.Controllers
{
    public class HomeController : Controller
    {
        public const string UserLoggedIn ="UserLoggedIn";
        public IActionResult Index() => View();

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }

        [HttpPost]
        public IActionResult Logout()
        {
            if (ModelState.IsValid)
            {
                if (HttpContext.Session.MyGet<bool>(UserLoggedIn) == true)
                {
                    System.Threading.Thread.Sleep(500);
                    HttpContext.Session.MySet(UserLoggedIn, false);
                    return Json(new { success = true, text = "userLoggedOut" });
                }
                else
                {
                    return Json(new { success = true, text = "userAlreadyLoggedOut" });
                }
            }
            else
            {
                return Json(new { success = false, text = "Modelstate invalid" });
            }
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Password == "0000")
                {
                    System.Threading.Thread.Sleep(500);
                    HttpContext.Session.MySet(UserLoggedIn, true);
                    return Json(new { success = true, text = "PasswordOk" });
                }
                else
                {
                    return Json(new { success = true, text = "PasswordNotOk" });
                }
            }
            else
            {
                return Json(new { success = false, text = "Modelstate invalid" });
            }
        }

        public class LoginModel
        {
            public string Password { get; set; }
        }
    }
}
