using Microsoft.Data.SqlClient;
using Rubyon.NetFramework;
using System.Data;
using System.Text;

namespace Northwind7.Service
{
	public class ProductsService : BaseClass
	{
		public string GetProductsList()
		{
			DataSet ds = new DataSet();
			SqlConnection conn = new SqlConnection("Server=localhost;Initial Catalog=Northwind;Persist Security Info=False;User ID=sa;Password=pass;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;");
			conn.Open();

			string querystring = "ProductsList";
			SqlCommand cmd = new SqlCommand(querystring, conn);
			cmd.CommandType = CommandType.StoredProcedure;

			SqlParameter[] parameter = new SqlParameter[1];
			parameter[0] = new SqlParameter("@ProductID", "0");
			cmd.Parameters.Add(parameter[0]);

			SqlDataAdapter da = new SqlDataAdapter(cmd);
			DataTable dt = new DataTable();
			da.Fill(dt);

			StringBuilder sb = new StringBuilder();
			sb = new StringBuilder();
			sb.Append("[");
			for (int i = 0; i < dt.Rows.Count; i++)
			{
				sb.Append("[");
				for (int j = 0; j < dt.Columns.Count - 1; j++)
					sb.AppendFormat("\"{0}\",", dt.Rows[i][j].ToString());

				sb.AppendFormat("\"{0}\"", dt.Rows[i][dt.Columns.Count - 1].ToString());
				if (i == dt.Rows.Count - 1)
					sb.Append("]");
				else sb.Append("],");
			}
			sb.Append("]");
			conn.Close();
			return sb.ToString();
		}

        public GridDataTable GetProductsList2()
		{
            string querystring = "SELECT ProductID, ProductName, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder FROM Products";
            DataTable dt = DbUtil.GetDataSet(DefaultConnection, querystring, CommandType.Text);
            GridDataTable DataTableGrid = new GridDataTable();

            DataTableGrid.Init();
            DataTableGrid.Columns = new string[] { "ProductID", "ProductName", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder" };  // DB Columns
            DataTableGrid.HiddenColumn(new int[] { 4, 5 });                                                                                                                                   // 	
            DataTableGrid.DataTableBind(dt, "grid1", 0, false, "300px");

            return DataTableGrid;
        }
    }
}
