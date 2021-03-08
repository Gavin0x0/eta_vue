import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import LoginScreen from "../test/LoginScreen.vue";
import MainScreen from "../screens/MainScreen.vue";
import Upload from "../views/Upload";
import Mine from "../views/Mine";
import QueryStu from "../views/QueryStu";
import QueryTea from "../views/QueryTea";
import Review from "../views/Review";
import Award from "../views/Award";
import ManageStu from "../views/ManageStu";
import ManageTea from "../views/ManageTea";
import ImportAward from "../views/ImportAward";
import ImportTea from "../views/ImportTea";
import ImportStu from "../views/ImportStu";
import { checkState } from "../api/index";
import { Message } from "element-ui";

Vue.use(VueRouter);

// TODO 正式部署时全部改为懒加载模式可以加快加载速度

const routes = [
  {
    path: "/",
    name: "LoginScreen",
    component: LoginScreen,
  },
  {
    path: "/eta",
    name: "MainScreen",
    component: MainScreen,
    children: [
      {
        // 当 /eta/home 匹配成功，
        // Home 会被渲染在 MainScreen 的 <router-view> 中
        path: "home",
        component: Home,
      },
      {
        path: "upload",
        component: Upload,
      },
      {
        path: "mine",
        component: Mine,
      },
      {
        path: "password",
        // which is lazy-loaded when the route is visited.
        // 使用时导入，类似懒加载
        component: () => import("../views/Password"),
      },
      {
        path: "query-stu",
        component: QueryStu,
      },
      {
        path: "query-tea",
        component: QueryTea,
      },
      {
        path: "review",
        component: Review,
      },
      {
        path: "award",
        component: Award,
      },
      {
        path: "manage-stu",
        component: ManageStu,
      },
      {
        path: "manage-tea",
        component: ManageTea,
      },
      {
        path: "import-award",
        component: ImportAward,
      },
      {
        path: "import-stu",
        component: ImportStu,
      },
      {
        path: "import-tea",
        component: ImportTea,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path !== "/") {
    let ifLogin = false;
    checkState()
      .then((res) => {
        console.log("登陆状态检测请求成功", res);
        ifLogin = true;
      })
      .catch((err) => {
        console.log("登陆状态检测请求失败", err);
      })
      .finally(() => {
        if (!ifLogin) {
          router.push({ name: "LoginScreen" });
          Message.error({
            message: "未登陆或登陆信息已过期，请重新登陆",
          });
        }
      });
  }
  next();
});

export default router;
