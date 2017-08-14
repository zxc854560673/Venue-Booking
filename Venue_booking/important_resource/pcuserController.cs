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
            var user_all = (Dictionary<string, string>)Session["user_all"];
            ViewData["user_name"] = user_all["wc_name"];
            if (System.IO.File.Exists(mi.local + @"Content\user_img\" + user_all["id"] + ".jpg"))
            {
                ViewData["img_id"] = user_all["id"];
            }
            else {
                ViewData["img_id"] = "0";
            }
            
            //test.log("数据：" + user_all["wc_lastlogin"]);
            if (user_all["wc_lastlogin"] != "")
            {
                ViewData["lastlogin_time"] = "上次登陆时间：" + DateTime.Parse(user_all["wc_lastlogin"]).ToString("yyyy-MM-dd HH:mm:ss");
            }
            else {
                ViewData["lastlogin_time"] = "尚未登录过";
            }
            return View();
        }
        [System.Web.Mvc.HttpGet]
        public ActionResult login(string need = null) {
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
            var dmm = mi.wc.data_search_self("select * from wc_user_all where wc_name=@user_name and wc_password=@password", ml);
            if (dmm == null) return JavaScript("alert('账号或密码错误');");
            if (int.Parse(dmm[0]["wc_identify"]) < 1) return JavaScript("alert('权限不足');"); //权限控制
            System.Web.HttpContext.Current.Session["login"] = "success";
            Session["user_all"] = dmm[0];
            //更新登录时间
            Dictionary<string, object> now = new Dictionary<string, object>();
            now.Add("user_name", Request.Form["user_name"].ToString());
            mi.wc.data_change_self("update wc_user_all set wc_lastlogin = getdate() where wc_name=@user_name", now);
            return JavaScript("location.href='/index';");
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult seeAuthority() {
            //if (System.Web.HttpContext.Current.Session["login"] != null && System.Web.HttpContext.Current.Session["login"].ToString() == "success") return Redirect("/index");
            //if (int.Parse(((Dictionary<string, string>)Session["user_all"])["wc_identify"]) < 1) return Json(new { msg = "error", more = "Insufficient permissions" });
            //Response.Headers.Set("Access-Control-Allow-Origin", "*");//仅供跨域测试使用
            if (Request.Form["target"]==null) return Json(new { msg = "error", more = "parameter error" });
            if (Request.Form["target"].ToString() == "getdata")
            {
                if(Request.Form["status"]==null) return Json(new { msg = "error", more = "parameter error" }); 
                var cz = new Dictionary<string, object>();
                int cl;
                if (!int.TryParse(Request.Form["status"].ToString(), out cl)) return Json(new { msg = "error", more = "parameter error" });
                cz.Add("status", cl);
                if (Request.Form["yeshu"] != null && (!int.TryParse(Request.Form["yeshu"].ToString(), out cl) || cl < 0)) return Json(new { msg = "error", more = "parameter error" });
                if (Request.Form["yeshu"] == null) cl = 0;
                cz.Add("yeshu", cl * 15);
                cz.Add("zongshu", (cl + 1) * 15);
                var z = mi.wc.data_search_self("select id,wc_name,building_name,room_name,apply_time,apply_for_time,start_time,end_time,organization,reason,status from(select top (@zongshu) wc_recoder.id,wc_name,building_name,room_name,apply_time,apply_for_time,start_time,end_time,organization,reason,status,ROW_NUMBER() over (order by wc_recoder.id)n from wc_recoder left join wc_building on wc_recoder.room_id=wc_building.id left join wc_user_all on wc_recoder.applyer_id=wc_user_all.id where status=@status)kco where n>@yeshu order by n", cz);
                if (z == null) return Json(new { msg="error",more="no more recoder"});
                var iop = new object[] { }.ToList();
                foreach (var c in z)
                {
                    iop.Add(new
                    {
                        id = c.Value["id"],
                        name = c.Value["wc_name"],
                        building_name = c.Value["building_name"],
                        room_name = c.Value["room_name"],
                        apply_time = DateTime.Parse(c.Value["apply_time"]).ToString("yyyy-MM-dd HH:mm:ss"),
                        apply_for_time = DateTime.Parse(c.Value["apply_for_time"]).ToString("yyyy-MM-dd"),
                        start_time = c.Value["start_time"],
                        end_time = c.Value["end_time"],
                        organization = c.Value["organization"],
                        reason = c.Value["reason"],
                        status = c.Value["status"]
                    });
                }
                return Json(iop.ToArray());
            }
            if (Request.Form["target"] == "updata") {
                if (Request.Form["status"] == null) return Json(new { msg = "error", more = "parameter error" });
                int cl;
                Dictionary<string, object> a=new Dictionary<string, object>();
                if (Request.Form["id"] == null) return Json(new { msg = "error", more = "parameter error" });
                if (!int.TryParse(Request.Form["id"].ToString(), out cl))return Json(new { msg = "error", more = "parameter error" });
                a.Add("id", cl);
                if (!int.TryParse(Request.Form["status"].ToString(), out cl)) return Json(new { msg = "error", more = "parameter error" });
                if (cl == -1)
                {
                    var c = mi.wc.data_search_self("select wc_recoder.id,wc_building.building_name,wc_building.room_name,wc_name,wc_recoder.apply_time,wc_recoder.apply_for_time,wc_recoder.start_time,ck.end_time,wc_recoder.reason,wc_recoder.organization,wc_recoder.status from wc_recoder,(select * from wc_recoder as cl where id=@id)ck left join wc_user_all on ck.applyer_id=wc_user_all.id left join wc_building on ck.room_id=wc_building.id where wc_recoder.apply_for_time=ck.apply_for_time  and not (wc_recoder.id=ck.id) and (case when wc_recoder.start_time>ck.start_time then wc_recoder.start_time else ck.start_time end)<(case when wc_recoder.end_time<ck.end_time then wc_recoder.end_time else ck.end_time end)", a);
                    if (c != null)
                    {
                        var iop = new object[] { }.ToList();
                        foreach (var ik in c)
                        {
                            iop.Add(new
                            {
                                id = ik.Value["id"],
                                name = ik.Value["wc_name"],
                                building_name = ik.Value["building_name"],
                                room_name = ik.Value["room_name"],
                                apply_time = DateTime.Parse(ik.Value["apply_time"]).ToString("yyyy-MM-dd HH:mm:ss"),
                                apply_for_time = DateTime.Parse(ik.Value["apply_for_time"]).ToString("yyyy-MM-dd"),
                                start_time = ik.Value["start_time"],
                                end_time = ik.Value["end_time"],
                                organization = ik.Value["organization"],
                                reason = ik.Value["reason"],
                                status = ik.Value["status"]
                            });
                        }
                        if (Request.Form["confirm"] != null && Request.Form["confirm"].ToString() == "1") {
                            string k="";
                            foreach (var d in iop.ToArray()) {
                                if (k == "") {
                                    k = d.GetType().GetProperty("id").GetValue(d,null).ToString();
                                    continue;
                                };
                                k=k+","+ d.GetType().GetProperty("id").GetValue(d, null).ToString();
                            }
                            var cp = new int[] { -1, 0, 1, 2 };
                            if (!test.isIn(cp, cl)) return Json(new { msg = "error", more = "parameter error" });
                            a.Add("verifier_id", 2);
                            mi.wc.data_change_self("update wc_recoder set status = 1,reply_time=GETDATE(),verifier_id=@verifier_id where id in (" + k + ")",a);
                            a.Add("status", Request.Form["status"].ToString());
                            //a.Add("verifier_id",Session["id"]) 由于测试没有这个东西所以先不管
                            mi.wc.data_change_self("update wc_recoder set status = @status,reply_time=GETDATE(),verifier_id=@verifier_id where id=@id", a);
                            return Json(new { msg = "success" });
                        }
                        return Json(new { msg = "error", more = "conflict recoder", data = iop.ToArray() });
                    }
                }//设置为已通过，检查是否有冲突
                var z = new int[] { -1, 0, 1, 2 };
                if (!test.isIn(z, cl)) return Json(new { msg = "error", more = "parameter error" });
                a.Add("status", Request.Form["status"].ToString());
                a.Add("verifier_id", 2);
                //a.Add("verifier_id",Session["id"]) 由于测试没有这个东西所以先不管
                mi.wc.data_change_self("update wc_recoder set status = @status,reply_time=GETDATE(),verifier_id=@verifier_id where id=@id",a);
                return Json(new { msg = "success"});
            }
            if (Request.Form["target"] == "num") {
                int cl;
                if (Request.Form["status"] == null|| !int.TryParse(Request.Form["status"].ToString(), out cl)|| !test.isIn(new int[] { -1, 0, 1, 2 }, cl)) return Json(new { msg = "error", more = "parameter error" });
                Dictionary<string, object> a = new Dictionary<string, object>();
                a.Add("status", cl);
                var p = mi.wc.data_search_self("select isnull(count(status),0) as count from wc_recoder where  status=@status", a);
                return Json(new { num = p[0]["count"] });
            }
            return Json(new { msg = "error", more = "parameter error" });
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult openAuthority() {
            //if (System.Web.HttpContext.Current.Session["login"] != null && System.Web.HttpContext.Current.Session["login"].ToString() == "success") return Redirect("/index");
            //if (int.Parse(((Dictionary<string, string>)Session["user_all"])["wc_identify"]) < 1) return Json(new { msg = "error", more = "Insufficient permissions" });
            //Response.Headers.Set("Access-Control-Allow-Origin", "*");//仅供跨域测试使用
            if (Request.Form["target"] == null) return Json(new { msg = "error", more = "parameter error" });
            var target = Request.Form["target"].ToString();
            switch (target) {
                case "building":
                    int cl;
                    var parent = Request.Form["parent"] == null ? "NONE" : Request.Form["parent"].ToString();
                    var yy = Request.Form["yeshu"] == null ? 0 : ((int.TryParse(Request.Form["yeshu"].ToString(), out cl)) ? cl : 0);
                    Dictionary<string, object> cmo = new Dictionary<string, object>();
                    cmo.Add("parent", parent);
                    cmo.Add("tiaoshu", 15);
                    cmo.Add("yeshu", (yy*15));
                    string search = "SELECT id,building_name,room_name,parent,can_use FROM (SELECT TOP (@yeshu + @tiaoshu) row_number() OVER (ORDER BY building_name , room_name)n,* FROM wc_building where parent like @parent)wc_building WHERE n > @yeshu ORDER BY n";
                    var gg=mi.wc.data_search_self(search, cmo);
                    if(gg==null) return Json(new { msg = "error", more = "parameter error" });
                    var qq = (new object[] { }).ToList();
                    for (int cp = 0; cp < gg.Count; cp++) {
                        qq.Add(new {
                            id = gg[cp]["id"],
                            building = gg[cp]["building_name"],
                            room_name = gg[cp]["room_name"],
                            parent = gg[cp]["parent"],
                            can_use = gg[cp]["can_use"],
                        });
                    }
                    string st2 = "select count(id) as num FROM wc_building where parent like @parent";
                    gg = mi.wc.data_search_self(st2, cmo);
                    var detail = new {
                        num = int.Parse(gg[0]["num"])
                    };
                    var jio = new {detail=detail,data=qq.ToArray()};
                    return Json(jio);
                case "building_change":
                    int cmv;
                    if(Request.Form["id"]==null||Request.Form["status"]==null) return Json(new { msg = "error", more = "parameter error" });
                    if(!int.TryParse(Request.Form["id"].ToString(), out cmv))return Json(new { msg = "error", more = "parameter error" });
                    Dictionary<string, object> cmz = new Dictionary<string, object>();
                    cmz.Add("id", cmv);
                    if (!int.TryParse(Request.Form["status"].ToString(), out cmv) || !test.isIn(new int[]{-1,0,1,2},cmv)) return Json(new { msg = "error", more = "parameter error" });
                    cmz.Add("can_use", cmv);
                    mi.wc.data_change_self("update wc_building set can_use=@can_use where id=@id", cmz);
                    return Json(new { msg = "success" });
                case "building_search":
                    int mmp;
                    var buillding_name = Request.Form["building_name"] != null ? "%"+Request.Form["building_name"].ToString()+ "%" : "%";
                    var room_name= Request.Form["room_name"] != null ? "%"+Request.Form["room_name"].ToString()+ "%" : "%";
                    var yyy = Request.Form["yeshu"] == null ? 0 : ((int.TryParse(Request.Form["yeshu"].ToString(), out mmp)) ? mmp : 0);
                    Dictionary<string, object> cmq = new Dictionary<string, object>();
                    cmq.Add("building_name", buillding_name);
                    cmq.Add("room_name", room_name);
                    cmq.Add("tiaoshu", 15);
                    cmq.Add("yeshu", (yyy * 15));
                    string search_1 = "SELECT id,building_name,room_name,parent,can_use FROM (SELECT TOP (@yeshu + @tiaoshu) row_number() OVER (ORDER BY building_name , room_name)n,* FROM wc_building where building_name like @building_name and room_name like @room_name)wc_building WHERE n > @yeshu ORDER BY n";
                    var dmp = mi.wc.data_search_self(search_1, cmq);
                    if (dmp == null) return Json(new { msg = "error", more = "parameter error" });
                    var sear_return = (new object[] { }).ToList();
                    for (int i = 0; i < dmp.Count; i++) {
                        sear_return.Add(new
                        {
                            id = dmp[i]["id"],
                            building = dmp[i]["building_name"],
                            room_name = dmp[i]["room_name"],
                            parent = dmp[i]["parent"],
                            can_use = dmp[i]["can_use"],
                        });
                    }
                    var str_z = "SELECT COUNT(id) as num FROM wc_building where building_name like @building_name and room_name like @room_name";
                    dmp = mi.wc.data_search_self(str_z, cmq);
                    var detail_1 = new
                    {
                        num = int.Parse(dmp[0]["num"])
                    };
                    var jio_1 = new { detail = detail_1, data = sear_return.ToArray() };
                    return Json(jio_1);
                case "person":
                    var id= Request.Form["id"] != null ? "%" + Request.Form["id"].ToString() + "%" : "%";
                    var wc_name= Request.Form["name"] != null ? "%" + Request.Form["name"].ToString() + "%" : "%";
                    var wc_identify= Request.Form["identify"] != null ? "%" + Request.Form["identify"].ToString() + "%" : "%";
                    var yeshu = Request.Form["yeshu"] == null ? 0 : ((int.TryParse(Request.Form["yeshu"].ToString(), out mmp)) ? mmp : 0);
                    string sear_2 = "SELECT id,wc_name,wc_identify FROM (SELECT TOP (@yeshu + @tiaoshu) row_number() OVER (ORDER BY id)n,* FROM wc_user_all where wc_name like @wc_name and id like @id and wc_identify like @wc_identify and wc_identify<2)wc_user WHERE n > @yeshu ORDER BY n";
                    Dictionary<string, object> biu = new Dictionary<string, object>();
                    biu.Add("id", id);
                    biu.Add("wc_name", wc_name);
                    biu.Add("wc_identify", wc_identify);
                    biu.Add("yeshu", yeshu);
                    biu.Add("tiaoshu", 15);
                    var suu = mi.wc.data_search_self(sear_2, biu);
                    if (suu == null) return Json(new { msg = "error", more = "parameter error" });
                    var asear_return = (new object[] { }).ToList();
                    for (int i = 0; i < suu.Count; i++)
                    {
                        asear_return.Add(new
                        {
                            id = suu[i]["id"],
                            name = suu[i]["wc_name"],
                            identify = suu[i]["wc_identify"],
                        });
                    }
                    string kil = "SELECT count(id) as num FROM wc_user_all where wc_name like @wc_name and id like @id and wc_identify like @wc_identify and wc_identify<2";
                    suu= mi.wc.data_search_self(kil, biu);
                    var detail_2 = new
                    {
                        num = int.Parse(suu[0]["num"])
                    };
                    var jso = new { detail = detail_2, data = asear_return.ToArray() };
                    return Json(jso);
                case "person_change":
                    if(Request.Form["id"]==null|| Request.Form["status"]==null) return Json(new { msg = "error", more = "parameter error" });
                    int cu;
                    Dictionary<string, object> wtf = new Dictionary<string, object>();
                    if (!int.TryParse(Request.Form["id"].ToString(),out cu)) return Json(new { msg = "error", more = "parameter error" });
                    wtf.Add("id", cu);
                    if (!int.TryParse(Request.Form["status"].ToString(), out cu)) return Json(new { msg = "error", more = "parameter error" });
                    wtf.Add("wc_identify", cu);
                    string sear_3 = "update wc_user_all set wc_identify = @wc_identify where id=@cu";
                    mi.wc.data_change_self(sear_3, wtf);
                    return Json(new { msg = "success" });
                default:
                    return Json(new { msg = "error", more = "parameter error" });
            }
        }

        ///<summary>
        ///用户注销功能
        ///</summary>
        public ActionResult quit() {
            Session.Clear();
            return Redirect("/login");
        }
    }
}