import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login/Login";
import Register from "@/components/Register/Register";
import Home from "@/components/Home/Home";
import PersonalSettings from "@/components/PersonalSettings/PersonalSettings";
import MyPublish from "@/components/MyPublish/MyPublish";
import PublishManage from "@/components/PublishManage/PublishManage";
import AuditManage from "@/components/AuditManage/AuditManage";
import OrderManage from "@/components/OrderManage/OrderManage";
import UserManage from "@/components/UserManage/UserManage";
import ComplaintManage from "@/components/ComplaintManage/ComplaintManage";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      children: [
        {
          path: "/home/personal/settings",
          component: PersonalSettings
        },
        {
          path: "/home/my/publish",
          component: MyPublish
        },
        {
          path: "/home/publish/manage",
          component: PublishManage
        },
        {
          path: "/home/audit/manage",
          component: AuditManage
        },
        {
          path: "/home/order/manage",
          component: OrderManage
        },
        {
          path: "/home/user/manage",
          component: UserManage
        },
        {
          path: "/home/complaint/manage",
          component: ComplaintManage
        }
      ]
    }
  ]
});
