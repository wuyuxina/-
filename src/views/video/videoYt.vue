<template>
  <div class="video">
    <div class="cloud" v-if="hasCloudOut">
      <div class="ptz-control">
        <p class="ptz-name">当前摄像机：{{options.code}}</p>
        <div class="main-control flex">
          <div class="main-left">
            <ul>
              <li @click="changeCloud('3','向上')"></li>
              <li @click="changeCloud('2','向右')"></li>
              <li @click="changeCloud('4','向下')"></li>
              <li @click="changeCloud('1','向左')"></li>
            </ul>
          </div>
          <div class="main-right">
            <div class="ptz-lens flex">
              <span @click="changeCloud('5','镜头小')">
                <img src="../../components/video/images/v_cut.png" alt="">
              </span>
              <p>镜头</p>
              <span @click="changeCloud('6','镜头大')">
                <img src="../../components/video/images/v_add.png" alt="">
              </span>
            </div>
            <div class="ptz-focalLength flex">
              <span @click="changeCloud('7','焦点小')">
                <img src="../../components/video/images/v_cut.png" alt="">
              </span>
              <p>焦距</p>
              <span @click="changeCloud('8','焦点大')">
                <img src="../../components/video/images/v_add.png" alt="">
              </span>
            </div>
            <div class="ptz-aperture flex">
              <span @click="changeCloud('9','光圈小')">
                <img src="../../components/video/images/v_cut.png" alt="">
              </span>
              <p>光圈</p>
              <span @click="changeCloud('10','光圈大')">
                <img src="../../components/video/images/v_add.png" alt="">
              </span>
            </div>
          </div>
        </div>
        <div class="move-speed flex">
          <span>移动速度：</span>
          <div id="slideTest" class="demo-slider"></div>
        </div>
      </div>
    </div>
    <div class="video-block">
      <videoUnit
        ref="child1"
        id="player1"
        :type="options.type"
        :src="options.src"
        :controls="false"
        :hasCloud="true"
      />
    </div>
  </div>
</template>

<script>
import * as api from '@/api/api.js' //页面中引入
import videoUnit from "@components/video/index";

export default {
  name: "videoYt",
  components: {
    videoUnit
  },
  data(){
    return {
      hasCloudOut:true,//是否有外部云台控制
      options:{
        code:'',//视频的code值
        bitRate:'',//播放速度
        type:'',//播放类型
        src:'',
        rtmpSrc:'',
        flvSrc:'',
        hlsSrc:''
      },
      slide:{
        value:4,
        min:1,
        max:8
      }
    }
  },
  mounted:function(){
    this.$nextTick(function(){//vue渲染完成后执行一次查询操作
      this.init();
    });
  },
  methods:{
    init(){
      let _this = this;
      //默认滑块
      layui.slider.render({
        elem: '#slideTest'
        ,value: this.slide.value //初始值
        ,min: this.slide.min //最小值
        ,max: this.slide.max//最大值
        ,change: function(value){
          _this.slide.value = value
        }
      });
      this.getVideo();
    },
    getVideo(){
      let _this = this;
      // this.options.code = 'a0f7722b-b6e0-3d1c-b394-5eabc80e6201';
      // this.options.bitRate = '1';
      // this.options.type = 'rtmp';
      // this.options.src = 'rtmp://58.200.131.2:1935/livetv/hunantv';
      // this.options.rtmpSrc ='rtmp://58.200.131.2:1935/livetv/hunantv';
      // this.options.flvSrc = 'http://nebula-playback.qiniudn.com/test-playback/flv/sample.flv';
      // this.options.hlsSrc = 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8';
      // this.$refs.child1.changeVideo(this.options);
      // return false

      localStorage.setItem('token','eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI4YzY1OTY0NzljNmY0NThlODVmZTliODA1MTdhYmJhZSIsInVDb2RlIjoiemhhbmdkYW55aW5nIiwidU5hbWUiOiLlvKDkuLnpopYiLCJ1U2lnbkNvZGUiOiJ6aGFuZ2RhbnlpbmciLCJleHAiOjE2MTI3NjU3NjQsImlhdCI6MTYxMjY3OTM2NCwianRpIjoiYzFjNzIwMmItZGI3OC00MTAxLWFlZjQtOTdlNDczNWU5ODU2In0.cjmv91q9DMrSxxF90LWyJzRZkDkMGFX2pwc26LHuVtk');
      let params = {
        bitRate: "0",
        cameraCode: "a0f7722b-b6e0-3d1c-b394-5eabc80e6201"
      };
      api.queryPlayAddresss(params).then(data => {// 请求数据成功并返回数据。
        if(data.code == 200){
          _this.options.code = params.cameraCode;
          _this.options.bitRate = params.bitRate;
          _this.options.type = 'rtmp';
          _this.options.src = data.resultData[0].rtmpUrl;
          _this.options.rtmpSrc = data.resultData[0].rtmpUrl;
          _this.options.flvSrc = data.resultData[0].flvUrl;
          _this.options.hlsSrc = data.resultData[0].hlsUrl;
          _this.$refs.child1.changeVideo(_this.options);
        }
        else{
            // _this.Message(data.msg);
            console.log('请求错误')
        }
      }).catch( data => {
        // _this.Message(); 
        console.log('请求失败') 
      });
    },
    changeCloud(type,text){
      this.$refs.child1.changeCloud(type,text);
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
.cloud{
  width:255px;
  position: fixed;
  bottom: 0;
  z-index: 10;
}
.ptz-control{
    position: relative;
    background: #1C2C4D;
    padding: 10Px;

    .ptz-name{
      color: #ecedef;
      line-height: 30Px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .flex{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
    .main-control{
      .main-left{
        width: 110Px;
        height: 110Px;
        background: url("../../components/video/images/v_cloud_bg_out.png");
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center 0;
        position: relative;
      }
      ul{
        width: 80Px;
        height: 80Px;
        margin-top: 15Px;
        margin-left: 15Px;
        li{
          width: 18Px;
          height: 18Px;
          position: absolute;
          border-radius: 50%;
          left: 50%;
          margin-left: -10Px;
          margin-top: -10Px;
          background: url("../../components/video/images/v_arrow.png");
          background-repeat: no-repeat;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
          background-position: center 0;
          cursor: pointer;
          &:nth-child(2){
            -webkit-transform: rotate(90deg);
            transform: rotate(90deg);
            -webkit-transform-origin: 9Px 49Px;
            transform-origin: 9Px 49Px;
          }
          &:nth-child(3){
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
            -webkit-transform-origin: 9Px 49Px;
            transform-origin: 9Px 49Px;
          }
          &:nth-child(4){
            -webkit-transform: rotate(270deg);
            transform: rotate(270deg);
            -webkit-transform-origin: 9Px 49Px;
            transform-origin: 9Px 49Px;
          }
        }
      }
      .main-right{
        width: 110Px;
        .ptz-lens,.ptz-focalLength,.ptz-aperture{
          background: #334B79;
          margin-top: 5Px;
          height: 20Px;
          color: #F8F8F6;
          padding: 0 5Px;
          border-radius: 3Px;
          span{
            cursor: pointer;
            img{
              display:block;
            }
          }
          p{
            margin-bottom:0;
          }
        }
      }
    }

    .move-speed{
      width: 100%;
      height: 34Px;
      color: #F8F8F6;

      .demo-slider{
        width: 160px;
      }
    }
}
</style>


