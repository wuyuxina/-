<template>
  <div>
    <p class="tips">
      <span class="title">弹窗组件可实现的功能：</span>
      <br/>1、宽高可配置，不配置的情况下，宽度有固定值，高度随内容变化，有最大高度，超出内容滚动
      <br/>2、可拖拽（不能拖出可视范围）
      <br/>3、可最大化、还原、最小化、关闭
      <br/>4、内容自定义
    </p>
    
  </div>
</template>

<script>
export default {
  name: 'dialogUnit',
  props: {
    // 基础类型检测 (`null` 意思是任何类型都可以)
    msg: {
      type: String,
      required: false
    },
    title:{
      type: [String,Array,Boolean],
      default: '信息'
    },
    content:{
      type: [String,Array,Object],
      default: ''
    },
    area:{
      type: [String,Array],
      default: 'auto'
    },
    // options:{
    //   type:Object,

    // }
    // isShow:{
    //     type: Boolean,
    //     default: function () {
    //         return false
    //     }
    // },
  },
  data () {
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
      
    },
    showLayer(){
      // 执行父集组件的方法
      this.$parent.changeMsg();
      // this.$emit('change-msg',{msg:this.title})

      let area = this.area;
      if(area=='auto'||!area){
        area = '400px';
      }
      layer.open({
        //类型：Number，默认：0;
        //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        type: 1 

        // 类型：String/Array/Boolean，默认：'信息'
        // title :'我是标题';title: ['文本', 'font-size:18px;'];title: false
        ,title:this.title?this.title:'信息'

        //类型：String/DOM/Array，默认：''
        // 可以是html，#id,type为2时可以是链接地址
        ,content:this.content

        // 类型：String，默认：''
        //class类名，可自定义不同风格:layui-layer-lanlayui-layer-molv
        ,skin:''

        // 类型：String/Array，默认：'auto'
        ,area: area

        // 类型：String/Array，默认：垂直水平居中
        //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        ,offset: 'auto' 

        // 类型：Number，默认：-1（信息框）/0（加载层）
        // 信息框默认不显示图标。当你想显示图标时，默认皮肤可以传入0-6如果是加载层，可以传入0-2
        ,icon:'-1'
        
        ,btn: ['确认', '关闭']
        ,yes: function(index, layero){
          //按钮【按钮一】的回调
          // layer.closeAll();
          console.log('确认弹窗内容,并且关闭弹窗')
          layer.close(index)
          // 子组件执行父组件方法
          
        }
        // ,btn2: function(index, layero){
        //   //按钮【按钮二】的回调
        //   console.log('no')
        //   //return false 开启该代码可禁止点击该按钮关闭
        // }
        // 类型：String，默认：r
        // 你可以快捷定义按钮的排列位置，btnAlign的默认值为r，即右对齐
        ,btnAlign: 'r' //按钮右对齐

        // 类型：String/Boolean，默认：1
        ,closeBtn:'1'

        // 类型：String/Array/Boolean，默认：0.3
        // shade: [0.8, '#393D49']；shade: 0
        ,shade:0

        // 是否点击遮罩关闭，类型：Boolean，默认：false
        ,shadeClose:false

        // 自动关闭所需毫秒，类型：Number，默认：0
        ,time:0

        // 用于控制弹层唯一标识，类型：String，默认：空字符
        ,id: '' //防止重复弹出

        // 弹出动画，类型：Number，默认：0
        ,anim:0

        // 关闭动画，类型：Boolean，默认：true
        ,isOutAnim:true

        // 最大化，最小化，类型：Boolean，默认：false
        ,maxmin:true

        // 鼠标滚动时，层是否固定在可视区域,类型：Boolean，默认：true
        ,fixed:true

        // 是否允许拉伸，类型：Boolean，默认：true
        ,resize:false

        // 最大宽度，类型：Number，默认：360
        ,maxWidth:360

        // 最大高度，类型：Number，默认：无
        ,maxHeight:500

        //层叠顺序，类型：，默认：19891014（贤心生日 0.0）
        ,zIndex:19891014

        // 层弹出的成功回调方法
        ,success: function(layero, index){
          // console.log(layero, index);
          console.log('弹出弹窗');
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.tips{
  width:360px;
  margin:0 auto;
  text-align: left;
  &>.title{
    font-weight: bold;
    font-size: 15px;
  }
}

</style>
