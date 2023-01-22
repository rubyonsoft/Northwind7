using Microsoft.AspNetCore.Mvc;
using Northwind7.Service;
using Northwind7.Models;
namespace Northwind7.Controllers
{
	public class ProductsController : Controller
	{
		public IActionResult Index()
		{	
			ProductsService productsService = new ProductsService();
			string gridData = productsService.GetProductsList();

			DataViewModel model = new DataViewModel();
			model.GridData = gridData;
			ViewBag.GridData = gridData;
			return View(model);
		}
	}
}
