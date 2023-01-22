using Microsoft.AspNetCore.Mvc;
using Northwind7.Service;
using Northwind7.Models;
using Rubyon.NetFramework;
using System.Reflection;

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

        public IActionResult List()
		{
            ProductsService productsService = new ProductsService();
			DataViewModel model = new DataViewModel()
			{
				GridTable = productsService.GetProductsList2()
			};

            return View(model);
		}
    }
}
