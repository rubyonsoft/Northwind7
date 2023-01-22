using System.ComponentModel.DataAnnotations;

namespace Northwind7.Models
{
    public class Customer
    {
        [StringLength(30, MinimumLength = 4, ErrorMessage = "아이디의 길이는 최소 4자입니다")]
        [Required(ErrorMessage = "아이디는 필수 입력입니다")]
        public string CustomerID { get; set; }

        [Required(ErrorMessage = "회사는 필수 입력입니다")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "회사의 길이는 최소 3자입니다")]
        public string CompanyName { get; set; }

        public string ContactName { get; set; }

        [Required(ErrorMessage = "이메일은 필수 입력입니다")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }  //Address

        [Required(ErrorMessage = "패스워드는 필수 입력입니다")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "패스워드 길이는 최소 4자입니다")]
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
