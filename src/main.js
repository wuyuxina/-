import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
/**
 * 引入vantdv  UI框架
 * */
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
/**
 * 引入  moment.js
 * */
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
// import videoPlayer from 'vue-video-player'
// require('vue-video-player/src/custom-theme.css')
// require('vue-video-player/node_modules/video.js/dist/video-js.css')


import VideoPlayer from 'vue-video-player'
// require('video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')

// 1.全局引用video
// import VueVideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import VideoPlayer from 'vue-video-player'
// // require('video.js/dist/video-js.css')
// require('vue-video-player/node_modules/video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')


// import VideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css' //videoJs的样式
// // import 'vue-video-player/src/custom-theme.css' //vue-video-player的样式
// import 'videojs-flash'; //引入才能播放rtmp视屏
// import 'videojs-contrib-hls' //引入才能播放m3u8文件


// Vue.use(VideoPlayer)

// import '@components/video/video/video-js.min.css'

// import '@/assets/video/video-js.min.css';//公共的css
// import common from '@/assets/js/common';//公共的js
createApp(App)
    .use(store)
    .use(VideoPlayer)
    .use(router)
    .use(Antd)
    .mount("#app");
