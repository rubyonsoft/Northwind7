using Northwind7.Models;
using Rubyon.NetFramework;
using System.Collections;
using System.Data;

namespace Northwind7.Service
{
    public class CustomerService : BaseClass
    {
        public ResultViewModel InsertCustomer(Customer customer)
        {
            string querystring = "Customer_Insert";

            Hashtable param = new Hashtable();
            param.Add("@CustomerID", customer.CustomerID);
            param.Add("@CompanyName", customer.CompanyName);
            param.Add("@ContactName", customer.ContactName);
            param.Add("@Email", customer.Email);
            param.Add("@Password", customer.Password);
            DataTable dt = DbUtil.GetDataSet(DefaultConnection, querystring, CommandType.StoredProcedure, param);

            ResultViewModel result = new ResultViewModel();
            result.resultCode = (int)dt.Rows[0]["Result"];
            result.message = (string)dt.Rows[0]["Message"];

            return result;
        }

        public ResultViewModel LoginCustomer(Customer customer)
        {
            string querystring = "Customer_Login";

            Hashtable param = new Hashtable();
            param.Add("@CustomerID", customer.CustomerID);
            param.Add("@Password", customer.Password);
            DataTable dt = DbUtil.GetDataSet(DefaultConnection, querystring, CommandType.StoredProcedure, param);

            ResultViewModel result = new ResultViewModel();
            result.resultCode = (int)dt.Rows[0]["Result"];
            result.message = (string)dt.Rows[0]["Message"];

            return result;
        }

    }
}
