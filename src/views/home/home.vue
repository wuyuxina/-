<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import * as api from '@/api/api.js' //页面中引入

export default {
  name: "Home",
  components: {
    HelloWorld
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
      // this.getInfo();
    },
    getInfo(){
            localStorage.setItem('token','12345');
            let token = localStorage.getItem('token');

            let params = {
                typeCode:'material_type'
            };
            api.login(params).then(data => {// 请求数据成功并返回数据。
                if(data.code == 200){
                    // _this.loadOption.typeList = _this.loadOption.typeList.concat(data.resultData.material_type);//所属类别
                }
                else{
                    // _this.Message(data.msg);
                    console.log('请求错误')
                }
            }).catch( data => {
                // _this.Message(); 
                console.log('请求失败') 
            });
        }
  }
};
</script>

<style lang="less" scoped>
.home{
  text-align: center;
}
</style>

