using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Venue_booking
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.RouteExistingFiles = true;
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            /*
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );*/
            routes.MapRoute("index", "", new { controller = "user", action = "index" });
            routes.MapRoute("admin_index", "admin", new { controller = "admin", action = "index" });
           // routes.MapRoute("for_admin", "admin/{action}/{putin}", new { controller = "admin", action = "login", putin = UrlParameter.Optional });
            routes.MapRoute("for_user_0", "user/{action}/{putin}", new { controller = "user", action = "login", putin = UrlParameter.Optional });
            routes.MapRoute("wx_user", "wx/{action}/{putin}", new { controller = "user", action = "login", putin = UrlParameter.Optional });
            routes.MapRoute("test_user", "pcuser/{action}/{putin}", new { controller = "pcuser", action = "Index", putin = UrlParameter.Optional });
            routes.MapRoute("pc_user", "{action}/{putin}", new { controller = "pcuser", action = "login", putin = UrlParameter.Optional });
        }
    }
}
