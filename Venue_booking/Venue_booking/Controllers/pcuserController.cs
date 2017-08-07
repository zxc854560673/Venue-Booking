using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using mi = Venue_booking.MvcApplication;

namespace Venue_booking.Controllers
{
    public class pcuserController : Controller
    {
        // GET: pcuser
        public ActionResult index()
        {

            if (System.Web.HttpContext.Current.Session["login"] == null) return Redirect("/login");
            //登陆成功，取得用户基本信息
            var user_all= (Dictionary<string, string>)Session["user_all"];
            ViewData["user_name"] = user_all["wc_name"];
            test.log("数据：" + user_all["wc_lastlogin"]);
            if (user_all["wc_lastlogin"] !="")
            {
                ViewData["lastlogin_time"] = "上次登陆时间：" + DateTime.Parse(user_all["wc_lastlogin"]).ToString("yyyy-MM-dd HH:mm:ss");
            }
            else {
                ViewData["lastlogin_time"] = "尚未登录过";
            }
            return View();
        }
        [System.Web.Mvc.HttpGet]
        public ActionResult login(string need=null) {
            if (System.Web.HttpContext.Current.Session["login"] != null && System.Web.HttpContext.Current.Session["login"].ToString() == "success") return Redirect("/index");
            return View();
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult login()
        {
            if (System.Web.HttpContext.Current.Session["login"] != null && System.Web.HttpContext.Current.Session["login"].ToString() == "success") return Redirect("/index");
            if (Request.Form["user_name"] == null || Request.Form["password"] == null || Request.Form["password"].ToString() == "-1") return Json(new { msg = "error", more = "parameter error" });
            Dictionary<string, object> ml = new Dictionary<string, object>();
            ml.Add("user_name", Request.Form["user_name"].ToString());
            ml.Add("password", Request.Form["password"].ToString());
            var dmm = mi.wc.data_search_self("select * from wc_user_all where wc_name=@user_name and wc_password=@password",ml);
            if (dmm == null) return JavaScript("alert('账号或密码错误');");
            if (int.Parse(dmm[0]["wc_identify"])<1) return JavaScript("alert('权限不足');"); //权限控制
            System.Web.HttpContext.Current.Session["login"] = "success";
            Session["user_all"] = dmm[0];
            //更新登录时间
            Dictionary<string, object> now = new Dictionary<string, object>();
            now.Add("user_name", Request.Form["user_name"].ToString());
            mi.wc.data_change_self("update wc_user_all set wc_lastlogin = getdate() where wc_name=@user_name",now);
            return JavaScript("location.href='/index';");
        }

    }
}