using Microsoft.AspNetCore.Mvc;
using Northwind7.Models;
using System.Diagnostics;

namespace Northwind7.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(Customer user)
        {
            //if (!ModelState.IsValid)
            //{
            //	return View();
            //}
            //if(user.Password != user.ConfirmPassword)
            //{
            //             ViewData["message"] = "두 개의 패스워드가 다릅니다. 2つのパスワードが異なります. two different passwords";
            //             return View(user);
            //         }

            return View("login");
        }

        public IActionResult Login()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}