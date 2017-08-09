using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.SessionState;
using System.Threading;
using mi = Venue_booking.MvcApplication;
using System.Xml;

namespace Venue_booking
{

    public class MvcApplication : System.Web.HttpApplication, IRequiresSessionState
    {
        public const string appid = "wxad42b620cdf88dca";
        public const string appsecret = "4a49244b5ff681446e0ebb9c0d265ef5";
        public const string myclasstime = "480-525|535-580|600-645|655-700|860-905|915-960|980-1025|1035-1080|1140-1185|1195-1240|1250-1295";
        public const string local = @"C:\Users\qq854\Documents\visual studio 2017\Projects\Venue_booking\Venue_booking\";
        public static SqlConnection sConn;
        public static mydata wc;
        public static mysession io;
        public static readonly object lockobj = new object();
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            wc = new mydata();
            io = new mysession();
            wc.data_connect();
            //test.log(wc.data_add("wc_user_all", new string[] { "pptp", "nononon", "1" }).ToString());
            //test.log(wc.data_del("wc_user_all","3").ToString());
            //test.log(wc.data_update("wc_user_all", "wc_password", "2", "zzzz854560673").ToString());
            /*var k=wc.data_search("wc_user_all","wc_password");
            foreach (var i in k) {
                foreach (var o in i) {
                    test.log(o);
                }
                test.log("下一主体");
            }*/

        }
        public override void Init()
        {
            this.PostAuthenticateRequest += (sender, e) => HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            base.Init();
        }
        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }
    }

    public class test {
        public static void log(string a) { System.Diagnostics.Debug.WriteLine(a); }
        public static int GetRandomSeed()
        {
            byte[] bytes = new byte[4];
            System.Security.Cryptography.RNGCryptoServiceProvider rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
            rng.GetBytes(bytes);
            rng.Dispose();
            return BitConverter.ToInt32(bytes, 0);
        }
        public static int max(int a, int b)
        {
            return a > b ? a : b;
        }
        public static int min(int a, int b)
        {
            return a < b ? a : b;
        }
        public static Dictionary<int,Dictionary<string,int>> getTimeTable(string a) {
            var c = a.Split('|');
            var output= new Dictionary<int, Dictionary<string, int>>();
            var z = 0;
            foreach (var k in c) {
                var j = k.Split('-');
                var one = new Dictionary<string, int>();
                one.Add("start_time", int.Parse(j[0]));
                one.Add("end_time", int.Parse(j[1]));
                one.Add("count", 0);
                output.Add(z, one);
                z++;
            }
            return output;
        }
        public static bool isIn<T>(T[] a, T b) {
            foreach (var c in a) if (c.Equals(b)) return true;
            return false;
        }

    }

    public class mydata {
        //public SqlConnection sConn;
        public bool data_connect() {
            string connSting;
            connSting = "server=localhost;database=wechat;Integrated Security=True;MultipleActiveResultSets=True";
            mi.sConn = new SqlConnection(connSting);
            try
            {
                mi.sConn.Open();
                test.log("登录成功");
                return true;
            }
            catch (Exception ex)
            {
                test.log(ex.ToString());
                return false;
            }
        }
        public bool data_close() {
            try
            {
                if (mi.sConn != null)
                {
                    mi.sConn.Close();
                    mi.sConn.Dispose();
                    mi.sConn = null;
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex) {
                test.log(ex.ToString());
                return false;
            }
        }
        //接下来实现增、删、改、查
        public int data_add(string table_name, string[] input) {//单行增,id不会被修改
            string p = "";
            try
            {
                foreach (var io in input) {
                    if (io != null || io != "") {
                        if (p != "") { p += ",'" + io + "'"; } else { p = "'" + io + "'"; }
                    } else {
                        if (p != "") { p += ",null"; } else { p = "null"; }
                    }

                }
                int yr;
                using (SqlCommand command = new SqlCommand("insert into dbo." + table_name + " values (" + p + ")", mi.sConn))
                {
                    yr = command.ExecuteNonQuery();
                    command.Dispose();
                }
                return yr;
            }
            catch (Exception ex)
            {
                test.log(ex.ToString());
                return -1;
            }
        }
        public int data_add_pro(string table_name, Dictionary<string, object> k) {
            string a="";
            foreach (var c in k) {
                if (a != "") { a += ",@" + c.Key; } else { a = "@"+c.Key; }
            }
            int yr;
            using (SqlCommand command = new SqlCommand("insert into dbo." + table_name + " (" + a.Replace("@", "") + ") values (" + a + ")", mi.sConn))
            {
                foreach (var c in k)
                {
                    command.Parameters.AddWithValue(c.Key, c.Value);
                }
                yr = command.ExecuteNonQuery();
                command.Dispose();
            }
            return yr;
        }

        public int data_del(string table_name, string id) {
            try
            {
                int yr;
                using (SqlCommand command = new SqlCommand("delete from " + table_name + " where id=@id", mi.sConn))
                {
                    command.Parameters.AddWithValue("@id", id);
                    yr = command.ExecuteNonQuery();
                    command.Dispose();
                }
                return yr;
            }
            catch (Exception ex) {
                test.log(ex.ToString());
                return -1;
            }
        }

        public int data_update(string table_name, string column_name, string id, string new_value) {
            try
            {
                int yr;
                using (SqlCommand command = new SqlCommand("update " + table_name + " set " + column_name + " = @new_value where id=@id", mi.sConn))
                {
                    command.Parameters.AddWithValue("@new_value", new_value);
                    command.Parameters.AddWithValue("@id", id);
                    yr = command.ExecuteNonQuery();
                    command.Dispose();
                }
                return yr;
            }
            catch (Exception ex)
            {
                test.log(ex.ToString());
                return -1;
            }

        }

        public Dictionary<int, Dictionary<string, string>> data_search(string table_name, string column_name, string openid = "%") {//针对名字进行查询——user版
            try {
                SqlCommand command = new SqlCommand("select " + column_name + " from " + table_name + " where wc_openid like @openid", mi.sConn);
                command.Parameters.AddWithValue("@openid", openid);
                DataSet myDataSet = new DataSet();
                SqlDataAdapter myDataAdapter = new SqlDataAdapter(command);
                myDataAdapter.Fill(myDataSet, "now");
                DataTable myTable = myDataSet.Tables["now"];
                var o = new Dictionary<int, Dictionary<string, string>>();
                var k = 0;
                //var a = new List<string[]>();
                foreach (DataRow myRow in myTable.Rows)
                {
                    //var b = new List<string>();
                    var c = new Dictionary<string, string>();
                    foreach (DataColumn myColumn in myTable.Columns)
                    {
                        c.Add(myColumn.ColumnName, myRow[myColumn].ToString());
                        //b.Add(myRow[myColumn].ToString());
                    }
                    //a.Add(b.ToArray());
                    o.Add(k, c);
                    k++;
                }
                myDataSet.Dispose();
                myDataAdapter.Dispose();
                command.Dispose();
                if (o.Count == 0) return null;
                return o;
            } catch (Exception ex) {
                test.log(ex.ToString());
                return null;
            }
        }
        //以下为危险的自定义函数   
        public Dictionary<int, Dictionary<string, string>> data_search_self(string sql_string, Dictionary<string, object> mmp = null)
        {
            try
            {
                SqlCommand command = new SqlCommand(sql_string, mi.sConn);
                if (mmp != null) {
                    foreach (var ccoo in mmp)
                    {
                        command.Parameters.AddWithValue(ccoo.Key, ccoo.Value);
                    }
                }
                DataSet myDataSet = new DataSet();
                SqlDataAdapter myDataAdapter = new SqlDataAdapter(command);
                myDataAdapter.Fill(myDataSet, "now");
                DataTable myTable = myDataSet.Tables["now"];
                var o = new Dictionary<int, Dictionary<string, string>>();
                var k = 0;
                //var a = new List<string[]>();
                foreach (DataRow myRow in myTable.Rows)
                {
                    //var b = new List<string>();
                    var c = new Dictionary<string, string>();
                    foreach (DataColumn myColumn in myTable.Columns)
                    {
                        c.Add(myColumn.ColumnName, myRow[myColumn].ToString());
                        //b.Add(myRow[myColumn].ToString());
                    }
                    //a.Add(b.ToArray());
                    o.Add(k, c);
                    k++;
                }
                myDataSet.Dispose();
                myDataAdapter.Dispose();
                command.Dispose();
                if (o.Count == 0) return null;
                return o;
            }
            catch (Exception ex) {
                test.log(ex.ToString());
                return null;
            }
        }
        public int data_change_self(string sql_string,Dictionary<string,object> dic=null) {
            try
            {
                int yr;
                using (SqlCommand command = new SqlCommand(sql_string, mi.sConn))
                {
                    foreach (var z in dic)
                    {
                        command.Parameters.AddWithValue(z.Key, z.Value);
                    }
                    yr = command.ExecuteNonQuery();
                }
                return yr;
            }
            catch (Exception ex) {
                test.log(ex.ToString());
                return -1;
            }
        }

        public string data_getIdBySessionId(string user) {
            //获取openid
            try {
                var z = ((string)mi.io.get(user, "important")).Split('|')[1];
                return (data_search("wc_user_all", "id", z))[0]["id"];
            }catch (Exception ex)
            {
                test.log(ex.ToString());
                return null;
            }
        }

        public object[] get_user_data(string user, string target,int yeshu=0) {
            switch (target) {
                case "mybook":
                    var iop = data_getIdBySessionId(user);//获取用户id
                    Dictionary<string, object> cmo = new Dictionary<string, object>();
                    cmo.Add("user_id", iop);
                    cmo.Add("yeshu", yeshu * 10);
                    //string search = "SELECT id,verifier_id,room_id,apply_time,apply_for_time,start_time,end_time,reply_time,status FROM (SELECT TOP (10) row_number() OVER (ORDER BY id desc)n,* FROM wc_recoder where applyer_id like @user_id)wc_recoder WHERE n > @yeshu ORDER BY n";
                    string search = "SELECT wc_recoder.id,wc_recoder.room_id,wc_building.room_name,wc_recoder.apply_time,wc_recoder.apply_for_time,wc_recoder.start_time,wc_recoder.end_time,wc_recoder.phone_num,wc_recoder.reason,wc_recoder.organization,wc_recoder.reply_time,status FROM (SELECT TOP (@yeshu + 10) row_number() OVER (ORDER BY id desc)n,* FROM wc_recoder where applyer_id like @user_id)wc_recoder,wc_building WHERE n > @yeshu and wc_recoder.room_id=wc_building.id ORDER BY n";
                    var po = mi.wc.data_search_self(search, cmo);
                    var retu = (new object[] { }).ToList();
                    if (po == null) return new object[] { };
                    for (var i = 0; i < po.Count; i++) {
                        retu.Add(JsonConvert.SerializeObject(po[i]));
                    }
                    return retu.ToArray();
                default:return new object[] { };
            }
        }

    }

    public class for_user_public : mydata {
        /*public int user_login(string username) {
            var ti = data_search("wc_user_all", "id", username);
            if (ti == null)
            {
                //需要注册
                return -1;
            }
            else {
                return int.Parse(ti[0]["id"]);
            }
        }*/

        public int user_register(string openid, string username, string identify = "0")
        {
            var ti = data_search("wc_user_all", "*", openid);
            if (ti == null)
            {
                //无重复，可添加
                return data_add("wc_user_all", new string[] { openid, username, "", identify });
            }
            else {
                //有重复
                return -1;
            }
        }
        public static string AES_decrypt(string encryptedDataStr, string key, string iv)
        {
            RijndaelManaged rijalg = new RijndaelManaged();
            rijalg.KeySize = 128;
            rijalg.Padding = PaddingMode.PKCS7;
            rijalg.Mode = CipherMode.CBC;
            rijalg.Key = Convert.FromBase64String(key);
            rijalg.IV = Convert.FromBase64String(iv);
            byte[] encryptedData = Convert.FromBase64String(encryptedDataStr);
            //解密
            ICryptoTransform decryptor = rijalg.CreateDecryptor(rijalg.Key, rijalg.IV);
            string result;
            using (MemoryStream msDecrypt = new MemoryStream(encryptedData))
            {
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        result = srDecrypt.ReadToEnd();
                    }
                }
            }
            return result;
        }



    }

    public static class http_ways {
        public static string get(string url) {
            WebClient wc = new WebClient();
            wc.Credentials = CredentialCache.DefaultCredentials;
            wc.Encoding = Encoding.UTF8;
            string returnText = wc.DownloadString(url);
            return returnText;
        }
        public static void get_file(string url, string path) {
            WebClient wc = new WebClient();
            wc.DownloadFile(new Uri(url),path);
            return;
        }
    }

    //还是自己新建个class来管理吧
    public class mysession {
        private Dictionary<string, Dictionary<string, object>> solo = new Dictionary<string, Dictionary<string, object>>();
        public static int deadtime = 30;
        public object this[string user,string key]{
            /*get { if (solo.ContainsKey(user) && solo[user].ContainsKey(key)) { return solo[user].ContainsKey(key); } else { return null; }; }
            set { ...}*/
            get { return get(user, key); }
            set { set(user, key, value); }
        }//写了个小索引器,提供类似test.log(wx.io[iop, "important"].ToString());的写法
        public object get(string user, string key) {
            if (!solo.ContainsKey(user) || !solo[user].ContainsKey(key)) { return null; }
            refresh(user);
            return solo[user][key];
        }
        public void set(string user, string key, object value) {
            if (!solo.ContainsKey(user)) {//新建
                solo.Add(user, (new Dictionary<string, object>()));
                solo[user].Add("DeadTime", deadtime);
                Semaphore mutex = new Semaphore(1, 1);
                new Thread(() =>
                {
                    do
                    {
                        mutex.WaitOne();
                        Thread.Sleep(60000);
                        if (solo.ContainsKey(user)) solo[user]["DeadTime"] = (int)solo[user]["DeadTime"] - 1;
                        mutex.Release();
                    } while (solo.ContainsKey(user) && (int)solo[user]["DeadTime"] > 0);
                    clean(user);
                }).Start();
            }
            solo[user].Add(key, value);
            refresh(user);
        }
        public void clean(string user) {
            if (solo.ContainsKey(user)) solo.Remove(user);
        }
        public void refresh(string user) {
            if (solo.ContainsKey(user)) solo[user]["DeadTime"] = deadtime;
        }
        public bool is_exist(string user, string key="DeadTime") {
            if (!solo.ContainsKey(user) || !solo[user].ContainsKey(key)) return false;
            refresh(user);
            return true;
        }
        
    }
    public static class wx
    {
        public static mysession io
        {
            get { return mi.io; }
        }
    }
    //尝试通过xml来管理用户权限
    /*
    public class user_per
    {//permissions
        //第一步，加载用户模型
        XmlDocument doc = new XmlDocument();

        public void load(string url) {
            doc.Load(url);
        }
        public void load_pro(string all) {

        }
    }*/
}
