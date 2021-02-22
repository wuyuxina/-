<!--
@author: wuyuxin
@description: 文字验证码组件
@time: 2021/1/19
-->
<template>
  <div>
    <!-- 验证码容器 -->
    <VerifyPoints
            :mode="mode"
            :defaultNum="defaultNum"
            :checkNum="checkNum"
            :vSpace="vSpace"
            :sanvasHeight="sanvasHeight"
            :sanvasWidth="sanvasWidth"
            :imgUrl="imgUrl"
            :imgName="imgName"
            :imgSize="imgSize"
            :barSize="barSize"
            ref="instance"
            @codePrice="codePrice"
    >
    </VerifyPoints>
  </div>
</template>
<script type="text/babel">
  /**
   * Verify 验证码组件
   * @description 分发验证码使用
   * */
  import VerifyPoints from "./VerifyPoints";

  export default {
    name: "Vue2Verify",
    props: {
      //弹出方式
      mode: {
        type: String,
      },
      sanvasWidth: {
        type: Number,
      },
      sanvasHeight: {
        type: Number,
      },
      //默认的文字数量
      defaultNum: {
        type: Number,
      },
      //校对的文字数量
      checkNum: {
        type: Number,
      },
      //间隔
      vSpace: {
        type: Number,
      },
      //图片地址
      imgUrl: {
        type: String,
        default: 'https://picsum.photos/300/150/?image='
      },
      //图片数组
      imgName: {
        type: Array,
      },
      //图片大小
      imgSize: {
        type: Object,
      },
      //滑动条的宽度和高度
      barSize: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    methods: {
      codePrice(msg){
        this.$emit('codePrice',msg)
      },
    },
    computed: {},
    watch: {},
    components: {
      VerifyPoints,
    },
  };
</script>
<style>
</style>
