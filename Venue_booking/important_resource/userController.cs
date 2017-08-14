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
    public class userController : Controller
    {

        // GET: user
        public string index() { return "null"; }
        [System.Web.Mvc.HttpGet]
        public JsonResult login()
        {
            string pi;
            pi = Request.Params["url"] != null ? Request.Params["url"].ToString() : "login_null";
            //test.log(pi);
            return Json(new { msg = "login_null" }, JsonRequestBehavior.AllowGet);
        }
        [System.Web.Mvc.HttpPost]
        public JsonResult login(string n = null)
        {
            string pi = Request.Form["js_code"] != null ? Request.Form["js_code"].ToString() : "login_null";
            //test.log(pi);
            if (pi != "login_null") {
                pi = "https://api.weixin.qq.com/sns/jscode2session?appid=" + MvcApplication.appid + "&secret=" + MvcApplication.appsecret + "&js_code=" + pi + "&grant_type=authorization_code";
                var opc = http_ways.get(pi);
                var o = (JObject)JsonConvert.DeserializeObject(opc);
                if (opc.Contains("errcode")) {
                    //发生错误
                    return Json(new object[] { new { msg = "outTime" } });
                }
                //test.log(o["session_key"].ToString() + "|" + o["openid"].ToString());
                var iop = test.GetRandomSeed().ToString();
                mi.io.set(iop, "important", o["session_key"].ToString() + "|" + o["openid"].ToString());
                // mi.io[iop] = o["session_key"].ToString() + "|" + o["openid"].ToString();
                //接下来检查是否已注册
                var z = mi.wc.data_search("wc_user_all", "*", o["openid"].ToString());
                if (z == null) return Json(new { msg = "require register", user_num = iop });//未注册
                //以下是已注册
                //var user_name = mi.wc.data_search("wc_user_all", "wc_name", o["openid"].ToString());
                mi.io.set(iop, "identify", z[0]["wc_identify"].ToString());
                //设置用户权限
                //取得用户信息
                return Json(new { msg = "success", user_num = iop, nick_name=z[0]["wc_name"].ToString(),identigy= z[0]["wc_identify"].ToString(),picture=z[0]["wc_mypicture"],telnum= z[0]["wc_mytel"] });
            }
            return Json(new { msg = "login_null" });
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult register(string n = null) {
            string iop = Request.Form["user_num"] != null ? Request.Form["user_num"].ToString() : "-1";
            string ety = Request.Form["encryptedData"] != null ? Request.Form["encryptedData"].ToString() : null;
            string iv = Request.Form["iv"] != null ? Request.Form["iv"].ToString() : null;
            string sk = mi.io.get(iop, "important") != null ? mi.io.get(iop, "important").ToString().Split('|')[0] : null;
            //test.log(iop + "|" + ety + "|" + iv + "|" + sk);
            if (ety == null || iv == null || sk == null) { return Json(new { msg = "register_null" }); }
            if (!mi.io.is_exist(Request.Form["user_num"].ToString())) return Json(new { msg = "error", more = "without login or outTime" });
            var c = for_user_public.AES_decrypt(ety, sk, iv);
            //test.log(c);
            var o = (JObject)JsonConvert.DeserializeObject(c);
            test.log(o["avatarUrl"].ToString());
            Dictionary<string, object> qm=new Dictionary<string, object>();
            qm.Add("wc_openid", o["openId"].ToString());
            qm.Add("wc_name", o["nickName"].ToString());
            mi.wc.data_add_pro("wc_user_all", qm);
            var id = mi.wc.data_search("wc_user_all", "id", o["openId"].ToString())[0]["id"];
            http_ways.get_file(o["avatarUrl"].ToString(), mi.local + @"Content\user_img\" + id + ".jpg");
            //mi.wc.data_add("wc_user_all", new string[] { o["openId"].ToString(), o["nickName"].ToString(), "", "0" });
            return Json(new { msg = "success" });
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult detail() {
            //授权验证开始
            if (Request.Form["user_num"] == null || Request.Form["parent"] == null || Request.Form["room_name"] == null) return Json(new { msg = "error", more = "parameter error" });
            string iop = Request.Form["user_num"] != null ? Request.Form["user_num"].ToString() : "-1";
            string cmk = Request.Form["parent"] != null ? Request.Form["parent"].ToString() : null;
            string yy = Request.Form["yeshu"] != null ? Request.Form["yeshu"].ToString() : "0";
            string cmko = Request.Form["room_name"] == "none" ? "%" : Request.Form["room_name"].ToString();
            if (!mi.io.is_exist(iop)) return Json(new { msg = "error", more = "without login or outTime" });
            //授权验证结束
            //获取基本信息
            var jjj = mi.wc.data_getIdBySessionId(Request.Form["user_num"].ToString());
            if(jjj==null) return Json(new { msg = "error", more = "without login or outTime" });
            Dictionary<string, object> cmo = new Dictionary<string, object>();
            cmo.Add("id", jjj);
            var  dl=mi.wc.data_search_self("SELECT wc_identify from wc_user_all where id=@id",cmo);
            //获取完毕
            cmo.Clear();
            cmo.Add("identify", dl[0]["wc_identify"]);
            cmo.Add("parent", cmk);
            cmo.Add("room_name", cmko);
            cmo.Add("tiaoshu", 10);
            cmo.Add("yeshu", (int.Parse(yy) * 10).ToString());
            string search = "SELECT id,building_name,room_name,open_time,more_detail,img,parent FROM (SELECT TOP (@yeshu + @tiaoshu) row_number() OVER (ORDER BY building_name , room_name)n,* FROM wc_building where parent like @parent and room_name like @room_name and can_use>-1 and can_use<=@identify)wc_building WHERE n > @yeshu ORDER BY n";
            var po = mi.wc.data_search_self(search, cmo);
            var ck = (new Object[] { }).ToList();
            if (po == null) return Json(ck.ToArray());
            foreach (var lo in po) {
                ck.Add(JsonConvert.SerializeObject(lo));
            }
            return Json(ck.ToArray());
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult details() {
            if (Request.Form["user_num"] == null || Request.Form["people_min"] == null || Request.Form["people_max"] == null) return Json(new { msg = "error", more = "parameter error:lose something" });
            int jk;
            var yy = Request.Form["yeshu"] == null ? 0 : ((int.TryParse(Request.Form["yeshu"].ToString(), out jk)) ? jk : 0);
            var iop = Request.Form["user_num"].ToString();
            if (!mi.io.is_exist(iop)) return Json(new { msg = "error", more = "without login or outTime" });
            var neo = new Dictionary<string, object>();
            if(!int.TryParse(Request.Form["people_min"].ToString(),out jk) || jk<=0) return Json(new { msg = "error", more = "parameter error" });
            neo.Add("min", jk);
            if (!int.TryParse(Request.Form["people_max"].ToString(), out jk) || jk <= 0) return Json(new { msg = "error", more = "parameter error" });
            neo.Add("max", jk);
            neo.Add("tiaoshu", 10);
            neo.Add("yeshu", yy * 10);
            var z = mi.wc.data_search("wc_user_all", "wc_identify", mi.io.get(iop, "important").ToString().Split('|')[1]);
            if (z == null) return Json(new { msg = "error", more = "parameter error or login outTime" });
            neo.Add("identify", int.Parse(z[0]["wc_identify"]));
            var par = Request.Form["parent"] == null ? "%" : Request.Form["parent"].ToString();
            neo.Add("parent", par);
            string search = "select id,building_name,room_name,open_time,more_detail,img,parent from (select TOP (@yeshu + @tiaoshu) row_number() OVER (ORDER BY building_name , room_name)n,*,cast(substring(more_detail,1,charindex('<split1>',more_detail)-1) as int)people from wc_building where (more_detail is not null))temp where people>=@min and people<=@max and n>@yeshu and can_use>-1 and can_use<=@identify and parent like @parent";
            var q = mi.wc.data_search_self(search, neo);
            if(q==null) return Json(new { msg = "error", more = "parameter error:nothing there" });
            var zzio = (new object[] { }).ToList();
            for (int i = 0; i < q.Count; i++) {
                zzio.Add(new
                {
                    id = q[i]["id"],
                    building_name = q[i]["building_name"],
                    room_name = q[i]["room_name"],
                    open_time = q[i]["open_time"],
                    more_detail = q[i]["more_detail"],
                    img = q[i]["img"],
                    parent = q[i]["parent"],
                });
            }
            return Json(zzio.ToArray());
        }
        
        [System.Web.Mvc.HttpPost]
        public JsonResult apply() {
            //授权验证开始
            if (Request.Form["user_num"] == null || Request.Form["target"] == null||Request.Form["apply_time"]==null||Request.Form["apply_room_id"]==null) return Json(new { msg = "apply_null" });
            string iop = Request.Form["user_num"] != null ? Request.Form["user_num"].ToString() : "-1";
            string target= Request.Form["target"] != null ? Request.Form["target"].ToString() : null;
            string apply_time= Request.Form["apply_time"] != null ? Request.Form["apply_time"].ToString() : null;
            string apply_room_id= Request.Form["apply_room_id"] != null ? Request.Form["apply_room_id"].ToString() : null;
            if (!mi.io.is_exist(iop)) return Json(new { msg = "error", more = "without login or outTime" });
            if (!mi.wc.have_identify(mi.wc.data_getIdBySessionId(iop), apply_room_id)) return Json(new { msg = "error", more = "you don't have enough identify" });
            //授权验证结束
            if (target == "check") {
                DateTime zzz;
                if(!DateTime.TryParse(apply_time,out zzz)||!Regex.IsMatch(apply_time, @"\d{4}-\d{2}-\d{2}"))return Json(new { msg = "error", more = "parameter error" });
                Dictionary<string, object> cmo = new Dictionary<string, object>();
                cmo.Add("room_id", int.Parse(apply_room_id));
                cmo.Add("apply_for_time", apply_time);
                string search = "SELECT start_time,end_time,status FROM wc_recoder where room_id like @room_id and apply_for_time like @apply_for_time and (status like 0 or status like -1) order by status,start_time,end_time desc";
                var po = mi.wc.data_search_self(search, cmo);
                int i = 0, j = 0;
                var olp = test.getTimeTable(mi.myclasstime);
                var czz = po == null ? 0 : po.Count;
                if (czz == 0) {
                    var cmow = (new Object[] { }).ToList();
                    for (var zio = 0; zio < olp.Count; zio++)
                    {
                        olp[zio].Remove("start_time");
                        olp[zio].Remove("end_time");
                        cmow.Add(JsonConvert.SerializeObject(olp[zio]));
                    }
                    return Json(cmow.ToArray());
                }//对null进行处理
                for (i = 0; i < po.Count; i++) {
                    if (po[i]["status"] == "-1")
                    {
                        //保险起见尝试消除所有冲突值
                        for (j = i + 1; j < po.Count; j++)
                        {
                            if (int.Parse(po[j]["status"]) < 0) continue;
                            if (int.Parse(po[i]["end_time"]) < int.Parse(po[j]["start_time"])) break;
                            if (test.max(int.Parse(po[i]["start_time"]), int.Parse(po[j]["start_time"])) < test.min(int.Parse(po[i]["end_time"]), int.Parse(po[j]["end_time"])))
                            {
                                if (po[j]["status"] == "0") po[j]["status"] = "-2";
                            }
                            //调整冲突记录状态为-2，即在此次过程中被取消
                        }
                        //调整完毕，开始填充
                        for(var ci=0;ci<olp.Count;ci++)
                        {
                            if (olp[ci]["end_time"] <= int.Parse(po[i]["start_time"])) continue;
                            if (olp[ci]["start_time"] >= int.Parse(po[i]["end_time"])) break;
                            olp[ci]["count"] = -1;
                        }
                    }
                    else if (po[i]["status"] == "0") {
                        for (var ci = 0; ci < olp.Count; ci++)
                        {
                            if (olp[ci]["end_time"] <= int.Parse(po[i]["start_time"])) continue;
                            if (olp[ci]["start_time"] >= int.Parse(po[i]["end_time"])) break;
                            olp[ci]["count"]++;
                        }
                    }
                }
                var ck = (new Object[] { }).ToList();
                for (var zio = 0; zio < olp.Count; zio++) {
                    olp[zio].Remove("start_time");
                    olp[zio].Remove("end_time");
                    ck.Add(JsonConvert.SerializeObject(olp[zio]));
                }
                return Json(ck.ToArray());

            }
            if (target == "submit") {
                DateTime zzz;
                if (!DateTime.TryParse(apply_time.Split('|')[0], out zzz) || !Regex.IsMatch(apply_time.Split('|')[0], @"\d{4}-\d{2}-\d{2}")) return Json(new { msg = "error", more = "parameter error" });
                if(!Regex.IsMatch(apply_time.Split('|')[1], @"^\d{0,4}-\d{0,4}$")|| int.Parse(apply_time.Split('|')[1].Split('-')[0])>int.Parse(apply_time.Split('|')[1].Split('-')[1]))return Json(new { msg = "error", more = "parameter error" });
                Dictionary<string, object> cmo = new Dictionary<string, object>();
                var start_time = int.Parse(apply_time.Split('|')[1].Split('-')[0]);
                var end_time = int.Parse(apply_time.Split('|')[1].Split('-')[1]);
                cmo.Add("start_time", start_time);
                cmo.Add("end_time", end_time);
                var search = "select count(status) as count from wc_recoder where  not (end_time<@start_time or start_time>@end_time) and status=-1";
                var po = mi.wc.data_search_self(search, cmo);
                if(po==null) return Json(new { msg = "error", more = "system_error" });
                if (po[0]["count"] != "0") return Json(new { msg = "error", more = "have been booked" });
                //获取开放时长
                Dictionary<string, object> ciom= new Dictionary<string, object>();
                ciom.Add("id", apply_room_id);
                var ziom = mi.wc.data_search_self("select open_time from wc_building where id = @id",ciom);
                if(ziom==null) return Json(new { msg = "error", more = "parameter error" });
                bool kiii = false;//是否在开放时间内 检验符
                foreach (var clz in ziom[0]["open_time"].Split('|')) {
                    //test.log(clz.Split('-')[0] + "|" + clz.Split('-')[1]);
                    if (start_time >= int.Parse(clz.Split('-')[0]) && end_time <= int.Parse(clz.Split('-')[1])) { kiii = true; break; }
                }
                if (!kiii) return Json(new { msg = "error", more = "apply time error" });
                //检验通过，获取基本数据，如id
                var id = mi.wc.data_getIdBySessionId(iop);
                Dictionary<string, object> cnk = new Dictionary<string, object>();
                cnk.Add("applyer_id", id);
                cnk.Add("room_id", apply_room_id);
                cnk.Add("apply_time", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                cnk.Add("apply_for_time", apply_time.Split('|')[0]);
                cnk.Add("start_time", apply_time.Split('|')[1].Split('-')[0]);
                cnk.Add("end_time", apply_time.Split('|')[1].Split('-')[1]);
                cnk.Add("phone_num", Request.Form["phone_num"]==null?"-1": Request.Form["phone_num"].ToString());
                cnk.Add("reason", Request.Form["reason"] == null ? "-1" : Request.Form["reason"].ToString());
                cnk.Add("organization", Request.Form["organization"] == null ? "-1" : Request.Form["organization"].ToString());
                mi.wc.data_add_pro("wc_recoder", cnk);
                //mi.wc.data_add("wc_recoder",new string[] {id,"",apply_room_id, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") ,apply_time.Split('|')[0] , apply_time.Split('|')[1].Split('-')[0] , apply_time.Split('|')[1].Split('-')[1],"","0" });
                return Json(new { msg = "success" });
            }
            if (target == "many_submit") {
                DateTime zzz;
                var sall = apply_time.Split('|');
                var rqt = sall.Last();
                if (sall.Length<2||!Regex.IsMatch(rqt, @"^\d{0,4}-\d{0,4}$") || int.Parse(rqt.Split('-')[0]) > int.Parse(rqt.Split('-')[1])) return Json(new { msg = "error", more = "parameter error" });
                for (int i = 0; i < sall.Length - 1; i++) {
                    if (!DateTime.TryParse(sall[i], out zzz) || !Regex.IsMatch(sall[i], @"\d{4}-\d{2}-\d{2}")) return Json(new { msg = "error", more = "parameter error" });
                }
                Dictionary<string, object> ciom = new Dictionary<string, object>();
                ciom.Add("id", apply_room_id);
                var ziom = mi.wc.data_search_self("select open_time from wc_building where id = @id", ciom);
                if (ziom == null) return Json(new { msg = "error", more = "parameter error" });
                Dictionary<string, object> cmo = new Dictionary<string, object>();
                var start_time = int.Parse(rqt.Split('-')[0]);
                var end_time = int.Parse(rqt.Split('-')[1]);
                cmo.Add("start_time", start_time);
                cmo.Add("end_time", end_time);

                bool kiii = false;//是否在开放时间内 检验符
                foreach (var clz in ziom[0]["open_time"].Split('|'))
                {
                    if (start_time >= int.Parse(clz.Split('-')[0]) && end_time <= int.Parse(clz.Split('-')[1])) { kiii = true; break; }
                }
                if (!kiii) return Json(new { msg = "error", more = "apply time error" });
                //接下来开始申请
                var phone_num = Request.Form["phone_num"] == null ? "-1" : Request.Form["phone_num"].ToString();
                var reason = Request.Form["reason"] == null ? "-1" : Request.Form["reason"].ToString();
                var organization = Request.Form["organization"] == null ? "-1" : Request.Form["organization"].ToString();
                var ret = (new object[] { }).ToList();
                for (int i = 0; i < sall.Length - 1; i++) {
                    var search = "select isnull(count(status),0) as count from wc_recoder where  not (end_time<@start_time or start_time>@end_time) and status=-1";
                    var po = mi.wc.data_search_self(search, cmo);
                    if (po[0]["count"] != "0") { ret.Add(new {apply_time= sall[i], msg="error",more= "have been booking" }); continue; }
                    var id = mi.wc.data_getIdBySessionId(iop);
                    Dictionary<string, object> cnk = new Dictionary<string, object>();
                    cnk.Add("applyer_id", id);
                    cnk.Add("room_id", apply_room_id);
                    cnk.Add("apply_for_time", sall[i]);
                    cnk.Add("start_time", start_time);
                    cnk.Add("end_time", end_time);
                    cnk.Add("phone_num", phone_num);
                    cnk.Add("reason", reason);
                    cnk.Add("organization", organization);
                    mi.wc.data_add_pro("wc_recoder", cnk);
                    ret.Add(new { apply_time = sall[i], msg = "success" });
                }
                return Json(ret.ToArray());

            }
                
            return Json(new { msg = "apply_null" });
        }

        [System.Web.Mvc.HttpPost]
        public JsonResult my() {
            if (Request.Form["user_num"] == null || Request.Form["target"] == null) return Json(new { msg = "error", more = "parameter error" });
            if (!mi.io.is_exist(Request.Form["user_num"].ToString())) return Json(new { msg = "error", more = "without login or outTime" });
            if (Request.Form["target"].ToString() == "mybook")
            {
                var yeshu = Request.Form["yeshu"] == null ? 0 : int.Parse(Request.Form["yeshu"].ToString());
                return Json(mi.wc.get_user_data(Request.Form["user_num"].ToString(), Request.Form["target"].ToString(), yeshu));
            }
            if (Request.Form["target"].ToString() == "quit") {
                mi.io.clean(Request.Form["user_num"].ToString());
                return Json(new { msg = "success" });
            }
            return Json(new { msg = "error", more = "parameter error" });
        }

    }
    
}