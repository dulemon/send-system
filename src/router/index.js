import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login/Login";
import Register from "@/components/Register/Register";
import Home from "@/components/Home/Home";
import PersonalSettings from "@/components/PersonalSettings/PersonalSettings";
import PublishManage from "@/components/PublishManage/PublishManage";

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
          path: "/home/publish/manage",
          component: PublishManage
        }
      ]
    }
  ]
});
