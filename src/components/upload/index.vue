<template>
  <div>
    <!-- <p class="tips">
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
    </p> -->
    <div class="upload-box">
	    <a-upload
        :accept="accept"
        :action="action"
        :method="method"
        :directory="directory"
        :disabled="disabled"
        :file-list="upload.fileList"
        :headers="headers"
        :list-type="listType"
        :multiple="multiple"
        :name="name"
        :data="data"
        :show-upload-list="showUploadList"
        :support-server-render="showUploadList"
        :with-credentials="withCredentials"
        :open-file-dialog-onClick="openFileDialogOnClick"

        class="upload-list-inline"
        :before-upload="beforeUpload"
        :remove="handleRemove"
        @preview="handlePreview"
        @change="handleChange"
      >
      <!-- before-upload:上传前判断大小格式等
      preview:点击文件链接或预览图标时的回调 -->
        <div v-if="listType=='picture-card'&&(!maxNum||maxNum&&upload.fileList.length < maxNum)">
          <a-icon :type="upload.loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            Upload
          </div>
        </div>
        <a-input readonly placeholder="点击上传" v-if="listType!='picture-card'" :value="upload.fileArrName"/>
      </a-upload>

      <a-modal :visible="modal.show" :footer="null" @cancel="modalCancel" v-if="listType=='picture-card'">
        <img :alt="modal.name" style="width: 100%" :src="modal.image" />
      </a-modal>
	  </div>
   
  </div>
</template>

<script>
// https://blog.csdn.net/wangyile4399/article/details/89677575?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
// 参考网址：https://www.antdv.com/docs/vue/use-with-vue-cli-cn/
// props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
// import { Icon } from '@ant-design/compatible';

export default {
  name: 'uploadUnit',
  props: {
    maxSize:{//单个图片的最大尺寸
      type:[Number,String],
      default:''
    },
    maxNum:{//允许上传的最大个数
      type:[Number,String],
      default:''
    },
    accept: {//接受的文件类型
      type:String,
      default:'image/jpeg,image/jpg,image/png'
    },
    action: {//上传的地址
      type:String,
      default:''
    },
    method:{//请求的方式
      type:String,
      default:'post'
    },
    directory:{//支持上传文件夹
      type:Boolean,
      default:false
    },
    disabled:{//是否禁用
      type:Boolean,
      default:false
    },
    fileList:{//已经上传的文件列表
      type:Array,
      default:function(){
        return []
      }
    },
    headers:{//设置上传的请求头部
      type:Object,
      default:function(){
        return {}
      }
    },
    listType:{//上传列表的内建样式--text, picture 和 picture-card
      type:String,
      default:'text'
    },
    multiple:{//是否支持多选
      type:Boolean,
      default:false
    },
    name:{//发到后台的文件参数名
      type:String,
      default:'file'
    },
    //是否展示 uploadList,用于单独设定 showPreviewIcon 和 showRemoveIcon;
    // Boolean or { showPreviewIcon?: boolean, showRemoveIcon?: boolean }
    showUploadList:{
      type:[Boolean,Object],
      default:function(){
        return true
      }
    },
    supportServerRender:{//服务端渲染时需要打开这个
      type:Boolean,
      default:false
    },
    withCredentials:{//上传请求时是否携带 cookie
      type:Boolean,
      default:false
    },
    openFileDialogOnClick:{//点击打开文件对话框
      type:Boolean,
      default:true
    },
    showErrorFile:{//是否在上传列表中显示上传错误的文件
      type:Boolean,
      default:true
    },
    data:{//上传所需参数或返回上传参数的方法
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  components: {
    
  },
  data () {
    return {
      upload:{
        fileList: this.fileList,
        loading:false,
        imageUrl:'',
        fileArrName:'',
      },
      modal:{
        show:false,
        image:'',
        name:''
      },
      show:false
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
    getBase64(img,callback){
      console.log('base64')
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    beforeUpload(file,fileList) {
      let _this = this;
      file['addFile'] = true;
      // console.log('上传前11')
      // return new Promise((resolve, reject) => {
      //   const isJpgOrPng = this.accept.split(',').indexOf(file.type);
      //   if (isJpgOrPng==-1) {
      //     this.$message.error('请上传正确格式的文件!');
      //     return reject(false);
      //   }
      //   if(this.maxSize){
      //     const isLt2M = file.size / 1024 / 1024 < this.maxSize;
      //     if (!isLt2M) {
      //       this.$message.error('文件大小不能超过'+this.maxSize+'MB!');
      //       return reject(false);
      //     }
      //   } 
        // if(!this.action){//阻止默认上传
        //   console.log(this.upload.fileList.length+'....')
        //   this.upload.fileList.push(file);
        //   console.log(this.upload.fileList.length)
        //   console.log('44')
        //   let info = {
        //     file:file,
        //     fileList:this.upload.fileList
        //   }
        //   this.handleChange(info);
        //   return reject(false);
        // }
        // else{
        //   return resolve(true)
        // }
      // }); 
      const isJpgOrPng = this.accept.split(',').indexOf(file.type);
      if (isJpgOrPng==-1) {
        file['addFile'] = false;
        this.$message.error('请上传正确格式的文件!');
        return false;
      }
      if(this.maxSize){
        const isLt2M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt2M) {
          file['addFile'] = false;
          this.$message.error('文件大小不能超过'+this.maxSize+'MB!');
          return false;
        }
      }
      if(this.upload.fileList.length>this.maxNum - 1){
        file['addFile'] = false;
        this.$message.error('上传文件不能超过'+this.maxNum+'个!');
        return false
      }
      if(!this.action){//阻止默认上传
        return false
      }
      return true
    },
    handleRemove(file) {
      console.log('删除')
      const index = this.upload.fileList.indexOf(file);
      const newFileList = this.upload.fileList.slice();
      newFileList.splice(index, 1);
      this.upload.fileList = newFileList;
    },
    handleChange(info) {
      let _this = this;
      console.log('上传图片')
      let fileList = [];
      let fileArrName = [];
      info.fileList.map(file => {
        if (file.originFileObj.addFile) {
          fileList.push(file)
          fileArrName.push(file.name)
        }
      });
      this.upload.fileList = fileList;
      this.upload.fileArrName = fileArrName.join(',');
      // this.$emit('getFileList',this.upload.fileList);
      console.log(this.upload.fileArrName)
      if (info.file.status === 'uploading') {
        this.upload.loading = true;
      }
      if (info.file.status == 'done') {
        this.upload.loading = false;
        this.$message.success('文件上传成功');
        // this.getBase64(info.file.originFileObj, function(imageUrl){
        //   _this.upload.imageUrl = imageUrl;
        // });
      } else if (info.file.status === 'error') {
        console.log('上传错误')
        if(!this.showErrorFile){
          this.handleRemove(info.file)
        }
        this.$message.error('文件上传失败');
      }
    },
    // 预览图片
    handlePreview(file){
      let _this = this;
      this.getBase64(file.originFileObj, function(imageUrl){
        _this.modal.image  = imageUrl;
      });
      this.modal.name = file.name;
      this.modal.show = true;
    },
    modalCancel() {
      this.modal.show = false;
    },
  },
  
  watch: {
    
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
