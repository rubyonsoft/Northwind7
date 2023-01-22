using Microsoft.AspNetCore.Mvc;
using Northwind7.Models;
using Northwind7.Service;

namespace Northwind7.Controllers
{
	public class CategoriesController : Controller
	{
		public IActionResult Index()
		{
			CategoriesService categoriesService = new CategoriesService();
			ProductsService productsService = new ProductsService();
			DataViewModel model = new DataViewModel()
			{
				GridTable = categoriesService.GetCategoriesList(),
				GridData = productsService.GetProductsList()
			};
			return View(model);
		}
	}
}
