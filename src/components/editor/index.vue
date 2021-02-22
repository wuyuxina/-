<template>
  <div>
    <!-- <p class="tips">
      <span class="title">富文本编辑器组件可实现的功能：</span>
      <br/>1、可配置编辑器的工具栏
      <br/>2、工具栏可配置显/隐
    </p> -->
    <div class="tinymce-box">
	    <editor v-model="myValue"
	      :init="options"
	      :disabled="disabled">
	    </editor>
	  </div>
   
  </div>
</template>

<script>
// 参考网址：http://tinymce.ax-z.cn/
// https://github.com/tinymce/tinymce-vue
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons' //解决了icons.js 报错Unexpected token '<'
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import 'tinymce/plugins/link'//超链接
export default {
  name: 'editorUnit',
  props: {
    width: {
      type:[String,Number],
      default:'100%'
    },
    height: {
      type:[String,Number],
      default:200
    },
    resize:{//改变编辑器的大小
      type:[String,Boolean],
      default:true
    },
    statusbar:{//底部状态栏
      type:Boolean,
      default:true
    },
    inline:{
      type:Boolean,
      default:false
    },
    value: {//绑定值
      type: String,
      default: ''
    },
    disabled: {//禁止修改
      type: Boolean,
      default: false
    },
    plugins: {//插件
      type: [String, Array],
      default: 'lists link image media table wordcount'
    },
    // lineheight（行高 5.5新增）
    // newdocument（新文档）
    // bold（加粗）
    // italic（斜体）
    // underline（下划线）
    // strikethrough（删除线）
    // alignleft（左对齐）
    // aligncenter（居中对齐）
    // alignright（右对齐）
    // alignjustify（两端对齐）
    // styleselect（格式设置）
    // formatselect（段落格式）
    // fontselect（字体选择）
    // fontsizeselect（字号选择）
    // cut（剪切）
    // copy（复制）
    // paste（粘贴）
    // bullist（项目列表UL）
    // numlist（编号列表OL）
    // outdent（减少缩进）
    // indent（增加缩进）
    // blockquote（引用）
    // undo（撤销）
    // redo（重做/重复）
    // removeformat（清除格式）
    // subscript（下角标）
    // superscript（上角标）
    toolbar: {//工具栏
      type: [String, Array, Boolean],
      default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link lists image media table | removeformat'
      // default: 'newdocument cut copy paste styleselect| undo redo subscript superscript lineheight | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | formatselect | fontselect | fontsizeselect | bullist numlist outdent indent blockquote '
    },
    menubar:{//菜单栏
      type: [String, Boolean],
      default:false
    }
  },
  components: {
    Editor
  },
  data () {
    return {
      options: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        // skin_url: 'tinymce/skins/ui/oxide-dark',//暗色系
        width: this.width,
        height: this.height,
        resize:this.resize,
        statusbar:this.statusbar,
        inline:this.inline,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: this.menubar,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        }
      },
      myValue: this.value
    }
  },
  mounted:function(){
    this.$nextTick(function(){//vue渲染完成后执行一次查询操作
      this.init();
    });
  },
  methods:{
    init(){
      tinymce.init({})
    },
    clear(){
      this.myValue = '';
    }
  },
  watch: {
    value (newValue) {
      this.myValue = newValue
    },
    // myValue (newValue) {
    //   this.$emit('editorContent', newValue)
    // }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">


</style>
