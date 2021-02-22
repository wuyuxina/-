<template>
  <div class="editor-block">
    <p class="tips">
      <span class="title">富文本编辑器组件可实现的功能：</span>
      <br/>1、可配置编辑器的工具栏
      <br/>2、工具栏可配置显/隐
    </p>
    <p>
      width: {
        type:[String,Number],
        default:'100%'
      },//编辑器宽度
      <br/>
      height: {
        type:[String,Number],
        default:200
      },//编辑器高度
      <br/>
      resize:{
        type:[String,Boolean],
        default:true
      },//右下角可改变编辑器的大小
      <br/>
      statusbar:{
        type:Boolean,
        default:true
      },//底部状态栏设置显示隐藏
      <br/>
      inline:{
        type:Boolean,
        default:false
      },//编辑器菜单栏是否内嵌
      <br/>
      value: {
        type: String,
        default: ''
      },//绑定的编辑器的值
      <br/>
      disabled: {
        type: Boolean,
        default: false
      },//禁止修改
      <br/>
      plugins: {
        type: [String, Array],
        default: 'lists link image media table wordcount'
      },//编辑器所需插件，例如图片，视频，表格
      <br/>
      toolbar: {
        type: [String, Array, Boolean],
        default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link lists image media table | removeformat'
      },//工具栏
      <br/>
      menubar:{
        type: [String, Boolean],
        default:false
      }//菜单栏
    </p>
    <div>
      1.富文本编辑器(默认)
      <tinymce
        ref="editor1"
        :value="msg"
        :disabled="disabled"
      />
      <button @click="getContent('editor1')">获取内容</button>
      <button @click="clear('editor1')">清空内容</button>
      <button @click="disabled = !disabled">{{disabled?'启用':'禁用'}}</button>
    </div>

     <div>
      2.富文本编辑器(配置工具栏)
      <tinymce
        ref="editor2"
        :value="msg"
        toolbar = 'undo redo | bold italic forecolor backcolor'
        :resize="false"
        menubar="file edit"
      />
      <button @click="getContent('editor2')">获取内容</button>
      <button @click="clear('editor2')">清空内容</button>
    </div>

    <div>
      3.富文本编辑器(无工具栏)
      <tinymce
        ref="editor3"
        :value="msg"
        :toolbar="false"
      />
      <button @click="getContent('editor3')">获取内容</button>
      <button @click="clear('editor3')">清空内容</button>
    </div>
  </div>
</template>

<script>
import tinymce from "@components/editor/index";

export default {
  name: "editorPage",
  components: {
    tinymce
  },
  data(){
    return {
      msg: '<p>Welcome to Use Tinymce Editor</p>',
	    disabled: false
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
    // 获取内容
    getContent(editor){
      console.log(this.$refs[editor].myValue)
    },
		// 清空内容
		clear (editor) {
		  this.$refs[editor].clear()
		}
  }
}
</script>

<style lang="less" scoped>
.editor-block{
  width:80%;
  height:auto;
  margin:0 auto;
  padding-bottom: 50px;
  &>div{
    margin-top:20px;
  }
}
</style>


