<template>
  <div class="video">
    <div class="video-block">
      <p class="tips">
        <span class="title">视频组件可实现的功能：</span>
        <br/>1、支持rtmp、flv、hls(可配置)
        <br/>2、能全屏(配置)
        <br/>3、云台控制（配置）
        <br/>4、云台控制的位置配置（视频区域内/外）
        <br/>5、IE控件（海康、公司自己的）的视频单独做一个
      </p>
      <p>
        playbackRates: {
          type: [Array,String],
          default:''
        },//播放速度
        <br/>
        autoplay: {
          type: Boolean,
          default:true
        },//如果出现该属性，则视频在就绪后马上播放
        <br/>
        controls:{
          type: Boolean,
          default: true
        },//如果出现该属性，则向用户显示控件，比如播放按钮
        <br/>
        loop:{
          type: Boolean,
          default: false
        },//如果出现该属性,视频循环播放
        <br/>
        muted:{
          type: Boolean,
          default: false
        },//如果出现该属性，则初始视频静音
        <br/>
        poster:{
          type: String,
          default: ''
        },//封面图片路径
        <br/>
        language:{
          type: String,
          default: 'zh-CN'
        },//中英文切换
        <br/>
        src:{
          type: String,
          default: ''
        },//视频链接
        <br/>
        type:{
          type: String,
          default: 'mp4'
        },//视频类型-mp4,rtmp,flv,hls
        <br/>
        fullscreen:{
          type: Boolean,
          default: true
        },//是否全屏
        <br/>
        id:{
          type: String,
          default: 'my-player'
        },//当前播放器的id
        <br/>
        hasCloud:{
          type:Boolean,
          default:false
        }//是否有云台控制
      </p>
    </div>
    <div class="video-block">
      1.播放mp4视频,不自动播放，循环播放,可设置播放速度，有封面
      <videoUnit 
        id="player1" 
        src="http://vjs.zencdn.net/v/oceans.mp4" 
        :loop="true"
        :autoplay="false"
        playbackRates="[0.5, 1, 1.5, 2]"
        poster="http://img.youguoquan.com/uploads/users/header/f99a9c581c52b5e2245d7e5feb08e2ba.jpg"
      />
    </div>
    <div class="video-block">
      2.播放rtmp视频,自动播放，无封面,不循环
      <videoUnit 
        id="player2"
        type="rtmp"
        src="rtmp://58.200.131.2:1935/livetv/hunantv"
      />
    </div>
    <div class="video-block">
        3.播放flv视频,自动播放，不循环，不全屏
        <videoUnit 
          id="player3"
          type="flv" 
          src="http://nebula-playback.qiniudn.com/test-playback/flv/sample.flv"
          :fullscreen='false'
        />
    </div>
    <!-- http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8 -->
     
    <div class="video-block">
        3.播放hls视频,不自动播放，不循环，不全屏
        <videoUnit 
          id="player4"
          type="hls" 
          src="http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8"
          :fullscreen='false'
        />
    </div>
  </div>
</template>

<script>
import videoUnit from "@components/video/index";

export default {
  name: "videoPage",
  components: {
    videoUnit
  },
  data(){
    return {

    }
  },
  mounted:function(){
    this.$nextTick(function(){//vue渲染完成后执行一次查询操作
      this.init();
    });
  },
  methods:{
    init(){
      
    }
  }
}
</script>

<style lang="less" scoped>
.video-block{
  width:500px;
  height:auto;
  margin:0 auto;
  padding:10px 0;
}
</style>


