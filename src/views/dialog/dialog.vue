<template>
  <div class="home">
    <dialogUnit ref="mychild" @change-msg="changeMsg" :title="title" :content="content" :area="area"/>
    <div class="buttons">
      {{msg?msg:'未点击按钮'}}
      <br/>
      <button type="button" class="layui-btn" @click="showDialog($event,'area')">自定义宽高</button>
      <button type="button" class="layui-btn" @click="showDialog($event,'areaAuto')">不配置宽高,固定宽</button>
      <button type="button" class="layui-btn" @click="showDialog($event,'html')">自定义html</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import $ from 'jquery'
import dialogUnit from "@components/dialog/index";

export default {
  name: "dialogPage",
  components: {
    dialogUnit
  },
  data () {
    return {
      msg:'',
      title:'',
      content:'',
      area:'',
      domDialog:false
    }
  },
  mounted:function(){
    this.$nextTick(function(){//vue渲染完成后执行一次查询操作
      this.init();
    });
  },
  methods:{
    init(){
      // var layer ;
      // layui.use('layer', function(){
      //     layer = layui.layer;
      // });
      // console.log(layer)
    },
    showDialog(event,type){
      // console.log(this.msg)
      this.title='';
      this.content='';
      this.area='';
      this.title = event.currentTarget.innerText;
      if(type=='area'){
        this.content = '这里是固定宽高的弹窗：600*600';
        this.area = ['600px', '600px'];
      }
      else if(type=='areaAuto'){
        for(let i=0;i<20;i++){
          this.content += '<br/>这里是不配置宽高的弹窗：宽度有默认值:400px，高度随内容变化，有最大高度：500px'
        }
      }
      else if(type=='html'){
        this.content = `<div>这里是不配置宽高，自定义的html的内容;<span style="color:red">拼接html代码</span></div>`;
      }
      
      this.$nextTick(function(){
        this.$refs.mychild.showLayer();//父组件执行子组件内的方法
      })
      
    },
    // 子组件执行的方法
    changeMsg(params){
      this.msg = '点击了按钮：'+this.title;
    }
  }
};
</script>

<style lang="less" scoped>
  .buttons{
    text-align: center;
    margin-top:20px;
  }
</style>


