using Rubyon.NetFramework;
using System.Collections;
using System.Data;

namespace Northwind7.Service
{
	public class CategoriesService : BaseClass
	{
		public GridDataTable GetCategoriesList()
		{
			string querystring = "CategoriesList";

			Hashtable param = new Hashtable();
			param.Add("@CategoryID", "0");
			DataTable dt = DbUtil.GetDataSet(DefaultConnection, querystring, CommandType.StoredProcedure, param);

			GridDataTable DataTableGrid = new GridDataTable();

			DataTableGrid.Init();
			string[] columns = { "CategoryID", "CategoryName", "Description" };  // DB Columns
			DataTableGrid.Columns = columns;

			int[] hidCol = { 2 }; //세번째 칼럼
			DataTableGrid.HiddenColumn(hidCol);

			DataTableGrid.DataTableBind(dt, "grid1");

			return DataTableGrid;
		}
	}
}
