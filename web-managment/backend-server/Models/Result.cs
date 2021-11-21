using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Result<T>
    {
        public T obj { get; set; }
        public string message { get; set; }
        public Boolean isSuccess { get; set; }
        public Result(string message)
        {
            this.obj = obj;
            this.message = message;
            this.isSuccess = false;
        }
        public Result(T obj)
        {
            this.message = "";
            this.isSuccess = true;
            this.obj = obj;
        }
    }
}
