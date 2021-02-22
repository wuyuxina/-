<!--
  author:吴建莲
  backend：
  time：2021.01.25
  updateTime：
  describe：视频播放组件
  remark：参考链接：https://www.cnblogs.com/Renyi-Fan/p/11626583.html#_label0_1
 -->
<template>
  <div class="video-vue">
    <!-- <p class="tips">
      <span class="title">视频组件可实现的功能：</span>
      <br/>1、支持rtmp、flv、hls(可配置)
      <br/>2、能全屏(配置)
      <br/>3、云台控制（配置）
      <br/>4、云台控制的位置配置（视频区域内/外）
      <br/>5、IE控件（海康、公司自己的）的视频单独做一个
    </p> -->
    <!-- 解决在iPhone中播放时自动全屏问题：在video标签中添加playsinline="true"属性。 -->
    <div class="video_b">
      <video webkit-playsinline="true" playsinline="true" :id="id" class="video-js"></video>
    </div>
  </div>
</template>

<script>
// playbackRates:播放速度
// autoplay:如果出现该属性，则视频在就绪后马上播放。
// controls:如果出现该属性，则向用户显示控件，比如播放按钮。
// width:设置视频播放器的宽度。
// height:设置视频播放器的高度。
// loop:如果出现该属性,视频循环播放
// muted:如果出现该属性，则初始视频静音。
// poster:封面图片路径
// preload="auto":页面加载后播放视频，如果设置autoplay，则该属性失效
// src:要播放的视频的url

import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// rtmp视频需要flash的支持
import 'videojs-flash'

// 切换语言配置
import video_zhCN from 'video.js/dist/lang/zh-CN.json'
import video_en from  'video.js/dist/lang/en.json'
import { setTimeout } from 'timers';
videojs.addLanguage('zh-CN', video_zhCN);
videojs.addLanguage('en', video_en);
export default {
  name: 'videoUnit',
  props: {
    // 基础类型检测 (`null` 意思是任何类型都可以)
    playbackRates: {
      type: [Array,String],
      default:''
    },
    autoplay: {
      type: Boolean,
      default:true
    },
    controls:{
      type: Boolean,
      default: true
    },
    loop:{
      type: Boolean,
      default: false
    },
    muted:{
      type: Boolean,
      default: false
    },
    poster:{
      type: String,
      default: ''
    },
    language:{
      type: String,
      default: 'zh-CN'
    },
    src:{
      type: String,
      default: ''
    },
    type:{
      type: String,
      default: 'mp4'
    },
    fullscreen:{
      type: Boolean,
      default: true
    },
    id:{
      type: String,
      default: 'my-player'
    }
  },
  data () {
    return {
      player:'',
      videoTypes:[
        {
          type:'video/mp4'
        },
        {
          type:'rtmp/flv'
        },
        {
          type:'video/x-flv'
        },
        {
          type:'application/x-mpegURL'
        }
      ],
      // videoOptions:{
      //   autoplay:false,
      //   controls: true, // 是否显示控制条
      //   poster: 'http://img.youguoquan.com/uploads/users/header/f99a9c581c52b5e2245d7e5feb08e2ba.jpg"', // 视频封面图地址
      //   preload: 'auto',
      //   width: 500,
      //   height: 400,
      //   language: 'zh-CN', // 设置语言
      //   muted: false, // 是否静音
      //   inactivityTimeout: false,
      //   // controlBar: { // 设置控制条组件
      //   //     // 设置控制条里面组件的相关属性及显示与否
      //   //     'currentTimeDisplay': true,
      //   //     'durationDisplay': true,
      //   //     'remainingTimeDisplay': false,
      //   //     volumePanel: {
      //   //         inline: false
      //   //     },
      //   //     /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
      //   //     children: [
      //   //         {name: 'playToggle'}, // 播放/暂停按钮
      //   //         {name: 'currentTimeDisplay'}, // 视频当前已播放时间
      //   //         {name: 'progressControl'}, // 播放进度条
      //   //         {name: 'durationDisplay'}, // 视频播放总时间
      //   //         /*{
      //   //             name: 'playbackRateMenuButton', // 倍数播放，可以自己设置
      //   //             'playbackRates': [0.5, 1, 1.5, 2, 2.5]
      //   //         },*/
      //   //         {
      //   //             name: 'volumePanel', // 音量控制
      //   //             inline: false        // 不使用水平方式
      //   //         }
      //   //     ]
      //   // },
      //   sources: [ // 视频来源路径
      //       // {
      //       //   src: 'http://vjs.zencdn.net/v/oceans.mp4',
      //       //   type: 'video/mp4'
      //       // },
      //       {
      //         src: 'rtmp://58.200.131.2:1935/livetv/hunantv',
      //         type: 'rtmp/flv'
      //       }
      //   ]
      // },
      playerOptions:{
        playbackRates:this.playbackRates, //播放速度
        autoplay: this.autoplay, //  true/false 播放器准备好之后，是否自动播放 【默认false】
        controls:this.controls,//  true/false 是否拥有控制条 【默认true】,如果设为false ,那么只能通过api进行控制了。也就是说界面上不会出现任何控制按钮
        muted: this.muted, //  true/false 是否静音
        loop: this.loop, //  true/false 视频播放结束后，是否循环播放
        preload: 'auto', // 预加载,'auto' 自动;'metadata' 元数据信息 ,比如视频长度，尺寸等;'none' 不预加载任何数据，直到用户开始播放才开始下载
        language: this.language,//中文-zh-CN,英文-en
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          src: this.src,  // 路径
          type: ''  // 类型
        }],
        poster:this.poster, //你的封面地址 require("./posterIcon.png")
        // // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {//控制是否显示
          playToggle:true, // 播放暂停按钮
          volumeMenuButton:true,// 音量控制
          currentTimeDisplay:true,// 当前播放时间
          timeDivider:true, // '/' 分隔符
          durationDisplay:true, // 总时间
          progressControl:true, // 点播流时，播放进度条，seek控制
          liveDisplay:true, // 直播流时，显示LIVE
          remainingTimeDisplay:true, // 当前播放时间
          playbackRateMenuButton:true, // 播放速率，当前只有html5模式下才支持设置播放速率
          fullscreenToggle:this.fullscreen,// 全屏控制
          // children: [//控制栏排列顺序和是否显示
          //   {name: 'playToggle'}, // 播放按钮
          //   {name: 'currentTimeDisplay'}, // 当前已播放时间
          //   {name: 'progressControl'}, // 播放进度条
          //   {name: 'durationDisplay'}, // 总时间
          //   { // 倍数播放
          //     name: 'playbackRateMenuButton',
          //     // 'playbackRates': [0.5, 1, 1.5, 2, 2.5]
          //   },
          //   {
          //     name: 'volumePanel', // 音量控制
          //     inline: false, // 不使用水平方式
          //   },
          //   {name: 'FullscreenToggle'} // 全屏
          // ]
        },
      }
    }
  },
  beforeUnmount:function(){
    this.player.dispose();//销毁video实例
    // const videoDom = this.$refs.myPlayer1;  //不能用document 获取节点
    // videojs(videoDom).dispose() //销毁video实例，避免出现节点不存在 但是flash一直在执行，报 this.el.......is not function
    // this.player1.dispose() //销毁video实例
 },
  mounted:function(){
    this.$nextTick(function(){//vue渲染完成后执行一次查询操作
      this.init();
    });
  },
  // watch:{
  //   src:function(newValue,oldValue){
  //     this.player.src(
  //       [{
  //         type:'rtmp',
  //         src:newValue
  //       }]
  //     )
  //     // this.player.play();
  //   },
  // },
  methods:{
    init(){
      this.playVideo();
    },
    getvideoType(type,src){
      let videoType = '';
      if(type == 'mp4'){
        videoType = this.videoTypes[0].type;
      }
      else if(type == 'rtmp'){
        videoType = this.videoTypes[1].type;
      }
      else if(type == 'flv'){
        videoType = this.videoTypes[2].type;
      }
      else if(type == 'hls'){
        videoType = this.videoTypes[3].type;
      }
      this.playerOptions.sources[0].type = videoType;
      this.playerOptions.sources[0].src = src;
    },
    playVideo(){
      this.getvideoType(this.type,this.src);
      if(this.src){
         this.player = videojs(this.id, this.playerOptions, function () {
          // chrome 进度显示当前播放时间
          // if (window.browser.chrome) {
          //     $('.video-js .vjs-time-control').css('display', 'block');
          //     $('.video-js .vjs-remaining-time').css('display', 'none');
          // }
        });
      }
     
    },
    changeVideo(type,src){
      this.getvideoType(type,src);
      if(this.player){
        this.player.src(
          [{
            type:this.playerOptions.sources[0].type,
            src:src
          }]
        )
      }
      else{
        this.player = videojs(this.id, this.playerOptions, function () {
          // chrome 进度显示当前播放时间
          // if (window.browser.chrome) {
          //     $('.video-js .vjs-time-control').css('display', 'block');
          //     $('.video-js .vjs-remaining-time').css('display', 'none');
          // }
        });
      }
      // this.player.play();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
