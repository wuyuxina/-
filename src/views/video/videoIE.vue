<template>
  <div class="video">
    <OBJECT ID="SinoVMS" width="500" height="400" hspace="2" vspace="2" CLASSID="clsid:C2D2A8DE-4AEC-47D8-BEC6-E23DD41F6142">
	
	  </OBJECT>
    <div class="video-block">
      1.播放mp4视频,不自动播放，循环播放,可设置播放速度
      
    </div>
    <OBJECT id="VMSPlayWnd" width="100%" height="100%" hspace="2" vspace="2" CLASSID="clsid:E7396BA6-4ED5-4F04-82A5-19012556C4CE">
							
    </OBJECT>
  </div>
</template>

<script>
// import SinoVmss from "@/assets/js/haikang/SinoVms.js";
export default {
  name: "videoIE",
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


