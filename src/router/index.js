// import Vue from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home/home.vue";
import main from '../views/main'
import About from "../views/About.vue";
import errorPage from '@/views/common/404'//错误页面
import login from '@/views/login/login'//登录页
import loginCode from '@/views/login/logincode'//登录页
import dialogPage from '@/views/dialog/dialog'//弹窗页
import videoPage from '@/views/video/video'//视频页
import videoYt from '@/views/video/videoYt'//视频-云台控制
import videoIE from '@/views/video/videoIE'//视频-ie可用，海康视频
import upload from '@/views/upload/upload'//上传文件
import eidtorPage from '@/views/editor/editor'//富文本编辑器

// import leftTree from '@/components/selectTreeTwo/index'//视频页
import selectTree from '@/views/selectTree/index'//下拉树
import timeDate from '@/views/timeDate/index'//时间组件
import timeShow from '@/views/timeDate/newIndex'//时间组件
import bufferZone from '@/views/bufferZone/index'//时间组件
const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/Home',
    component: main,
    meta:{  //设置为需要登录验证
      requireAuth: false
    },
    children:[
      {
        path: 'Home',
        name: '/Home',
        component: Home,
        meta:{  //设置为需要登录验证
          requireAuth: false
        }
      },
      {
        path: 'loginCon',
        name: 'loginCon',
        component: login
      },
      {
        path: 'loginCode',
        name: 'loginCode',
        component: loginCode
      },
      {
        path: 'about',
        name: 'about',
        component: About
      },
      {
        path: 'dialogPage',
        name: 'dialogPage',
        component: dialogPage
      },
      {
        path: 'videoPage',
        name: 'videoPage',
        component: videoPage
      },
      {
        path: 'videoYt',
        name: 'videoYt',
        component: videoYt
      },
      {
        path: 'videoIE',
        name: 'videoIE',
        component: videoIE
      },
      {
        path: 'upload',
        name: 'upload',
        component: upload
      },
      {
        path: 'eidtorPage',
        name: 'eidtorPage',
        component: eidtorPage
      },
      {
        path: 'selectTree',
        name: 'selectTree',
        component: selectTree
      },
      {
        path: 'timeDate',
        name: 'timeDate',
        component: timeDate
      },
      {
        path: 'timeShow',
        name: 'timeShow',
        component: timeShow
      },
      {
        path: 'bufferZone',
        name: 'bufferZone',
        component: bufferZone
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component:errorPage
    // component: ()=> import("../components/NoFind.vue")
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');  //获取token

  // 已登录过无需重复登录
  if (token && to.name === "login") {
    // next({path:'/main/home'});
  }

  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    if (!token) {  //判断是否有token
      next({path:'/'});
    }
  }

  next()
})
export default router;
