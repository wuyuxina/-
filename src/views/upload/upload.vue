<template>
  <div class="editor-block">
    <div>
      <p class="tips">
        <span class="title">上传组件可实现的功能：</span>
        <br/>1、单文件、多文件上传
        <br/>2、可查看、回显、删除（调接口）、放大/点击查看（只支持图片文件）
        <br/>3、可配置展示形式：1）输入框，点击选择，上传 2）图片显示
        <br/>4、能带表单数据一起提交
        <br/>5、是否显示文件上传进度可配置
        <br/>6、格式、大小限制、文件数量可配置
        <br/>7、限制提示信息可自定义，有默认
        <br/>8、回调函数可配置
        <br/>9、可配置选完文件立即提交还是不立即提交
        <br/>注：提示信息的弹窗不能与项目中的提示弹窗冲突（要保持一致）
      </p>

      <p>
        maxSize:{
          type:[Number,String],
          default:''
        },//单个图片的最大尺寸
        <br/>
        maxNum:{
          type:[Number,String],
          default:''
        },//允许上传的最大个数
        <br/>
        accept: {
          type:String,
          default:'image/jpeg,image/jpg,image/png'
        },//接受的文件类型
        <br/>
        action: {
          type:String,
          default:''
        },//上传的地址
        <br/>
        method:{
          type:String,
          default:'post'
        },//请求的方式
        <br/>
        directory:{
          type:Boolean,
          default:false
        },//支持上传文件夹
        <br/>
        disabled:{
          type:Boolean,
          default:false
        },//是否禁用
        <br/>
        fileList:{
          type:Array,
          default:function(){
            return []
          }
        },//已经上传的文件列表
        <br/>
        headers:{
          type:Object,
          default:function(){
            return {}
          }
        },//设置上传的请求头部
        <br/>
        listType:{
          type:String,
          default:'text'
        },//上传列表的内建样式--text, picture 和 picture-card
        <br/>
        multiple:{
          type:Boolean,
          default:false
        },//是否支持多选
        <br/>
        name:{
          type:String,
          default:'file'
        },//发到后台的文件参数名
        <br/>
        showUploadList:{
          type:[Boolean,Object],
          default:function(){
            return true
          }
        },//是否展示 uploadList,
        <br/>
        supportServerRender:{
          type:Boolean,
          default:false
        },//服务端渲染时需要打开这个
        <br/>
        withCredentials:{
          type:Boolean,
          default:false
        },//上传请求时是否携带 cookie
        <br/>
        openFileDialogOnClick:{
          type:Boolean,
          default:true
        }//点击打开文件对话框
        <br/>
        showErrorFile:{
          type:Boolean,
          default:true
        }//是否在上传列表中显示上传错误的文件
        <br/>
        data:{
          type:Object,
          default:function(){
            return {}
          }
        }//上传所需参数或返回上传参数的方法
      </p>
    </div>
    <div>
      1.上传图片-text,表头设置,单个图片最大尺寸2M,最多允许上传3张图片
      <uploadIndex ref="child1" action="" :headers="upload.headers" :fileList="upload.fileList" :multiple="true" :maxSize='2' :maxNum='3'/>
      <a-button 
        type="primary"
        @click="handleUpload('child1')">
        手动上传
      </a-button>
      <br/>

      2.上传图片-picture
      <uploadIndex :data="{type:'11',name:'aimee'}" :action="upload.action" :fileList="upload.fileList2" listType="picture" :maxSize='2' :maxNum='4' :showErrorFile="true"/>
      3.上传图片-picture-card
      <uploadIndex :action="upload.action" :fileList="upload.fileList3" listType="picture-card" :maxNum='6'/>
    </div>

    <a-modal :visible="modalImage.show" :footer="null" @cancel="modalCancel">
      <!-- <img :alt="modal.name" style="width: 100%" :src="modal.image" /> -->
      12121212
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/api.js' //页面中引入
import uploadIndex from "@components/upload/index";

export default {
  name: "uploadPage",
  components: {
    uploadIndex
  },
  data(){
    return {
      upload:{
        action:'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        // headers:{
        //   authorization: 'authorization-text'
        // },
        fileList:[],
        fileList2:[],
        fileList3:[],
      },
      modalImage:{
        show:false
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
      
    },
    modalCancel(){
      this.modalImage.show = false;
    },
    handleUpload(child){//手动上传文件
      let _this = this;
      // this.modalImage.show = true;
      // return false
      let formData = new FormData();
      let fileList = this.$refs[child].upload.fileList;
      if(fileList.length == 0){
        this.$message.warning('请上传图片');
        return false
      }
      let registerData = {
        name:'上传几张图片',
        type:'2',
        author:'xiaowu'
      }
      for (let key in fileList) {
        formData.append("file", fileList[key],fileList[key].name);
      }
      for (let key in registerData) {
        formData.append(key, registerData[key]);
      }

      let config = {
        headers: {
          "Content-Type": "multipart/form-data;charset=utf-8;",
        },
      };
      api.uploadFile(formData,config).then(data => {// 请求数据成功并返回数据。
        if(data.status == 'done'){
          _this.$message.success('表单上传成功');
        }
        else{
          _this.$message.error(data.msg);
        }
      }).catch( data => {
        _this.$message.error('表单上传失败');
      })
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
