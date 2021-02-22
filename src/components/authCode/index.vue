<template>
    <div class="form-group">
        <!--数字字母验证码开始-->
        <div v-if="codeType=='numberLetter'&&codeShow" class="layui-form-item">
            <label class="layui-form-label"><span class="required">*</span>验证码</label>
            <div class="layui-input-block phoneCode">
                <input class="layui-input " lay-verify="required|identify" type="text" name="phoneCode"   autocomplete="off" placeholder="请输入验证码">
                <i class="code_span">
                    <s-identify
                            :codeTypes="codeTypes"
                            :codeLength="codeLength"
                            :fontSizeMin="fontSizeMin"
                            :fontSizeMax="fontSizeMax"
                            :backgroundColorMin="backgroundColorMin"
                            :backgroundColorMax="backgroundColorMax"
                            :colorMin="colorMin"
                            :colorMax="colorMax"
                            :lineColorMin="lineColorMin"
                            :lineColorMax="lineColorMax"
                            :dotColorMin="dotColorMin"
                            :dotColorMax="dotColorMax"
                            :contentWidth="contentWidth"
                            :contentHeight="contentHeight"
                            @codePrice="codePrice"

                    >
                    </s-identify>
                </i>
            </div>
        </div>
        <!--运算验证码开始-->
        <div v-if="codeType=='operation'&&codeShow" class="layui-form-item">
            <label class="layui-form-label"><span class="required">*</span>验证码</label>
            <div class="layui-input-block phoneCode">
                <input class="layui-input " lay-verify="required|operation" type="text" name="phoneCode"  autocomplete="off" placeholder="请输入验证码">
                <i class="code_span">
                    <operation-code
                            @codePrice="operationSuccess"
                            :operatContentHeight="operatContentHeight"
                            :operatSize="operatSize"
                            :operatLook="operatLook"
                    >

                    </operation-code>
                </i>
            </div>
        </div>
        <!--滑块验证码开始-->
        <div v-if="codeType=='slider'&&codeShow" class="layui-form-item">
            <slider-code
                    @codePrice="silderSuccess"
                    :silderBwidth="silderBwidth"
                    :refreshShow="refreshShow"
            >
            </slider-code>
        </div>
        <!--选汉字验证码-->
        <div v-if="codeType=='verify'&&codeShow" class="layui-form-item">
            <verify
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
                    @codePrice="verifySuccess"
            ></verify>
        </div>
        <!--选汉字验证码-->
        <div v-if="codeType=='idiom'&&codeShow" class="layui-form-item">
            <idiom-code
                    :idiomMsg="idiomMsg"
                    :idiomWidth="idiomWidth"
                    :idiomHeight="idiomHeight"
                    :idiomBotHeight="idiomBotHeight"
                    :idiomSize="idiomSize"
                    @codePrice="idiomSuccess"
            ></idiom-code>
        </div>
    </div>
</template>

<script>
    import SIdentify from './sidentify'
    import sliderCode from './sliderCode'
    import operationCode from './operationCode'
    import verify from './selCharacters/Verify'
    import idiomCode from "./idiomCode";
    export default {
        name: "meun",
        components: {SIdentify,sliderCode,operationCode,verify,idiomCode},
        props:{
            codeType: {
                //要显示的code类型
                // numberLetter---数字加字母类型，默认
                //operation-----运算验证码
                //slider-----滑块验证码
                //verify-----按照给定的汉字从图上进行选择
                //idiom-----根据给定的成语进行排序
                type: String,
                default: 'numberLetter'
            },
            codeShow:{
                type: Boolean,
                default: true
            },
            codeTypes: {  // 想要的验证码类型，可以选择混合，数字或字母，默认为混合
                type: String,
                default: 'mixture'
            },
            codeLength: {  // 想要的验证码长度,默认为4
                type: Number,
                default: 4
            },
            fontSizeMin: {//验证码字体最小换算标准，默认为25
                type: Number,
                default: 25
            },
            fontSizeMax: {//验证码字体最大换算标准，默认为30
                type: Number,
                default: 30
            },
            backgroundColorMin: {//生成一个随机背景颜色（最小换算）
                type: Number,
                default: 255
            },
            backgroundColorMax: {//生成一个随机背景颜色（最大换算）
                type: Number,
                default: 255
            },
            colorMin: { //字体粗细的换算（最小换算），数值越小越深
                type: Number,
                default: 0
            },
            colorMax: {//字体粗细的换算（最大换算），默认为50,数值越小越深
                type: Number,
                default: 50
            },
            lineColorMin: {//绘制干扰线的深浅（最小换算），数值越小越深
                type: Number,
                default: 100
            },
            lineColorMax: {//绘制干扰线的深浅（最大换算），数值越小越深
                type: Number,
                default: 255
            },
            dotColorMin: {//备用，暂时没有被用到
                type: Number,
                default: 0
            },
            dotColorMax: {//备用，暂时没有被用到
                type: Number,
                default: 255
            },
            contentWidth: {//验证码div的宽度  默认120
                type: Number,
                default: 120
            },
            contentHeight: {//验证码div的高度，默认30
                type: Number,
                default: 30
            },
            operatContentHeight: {//验证码div的高度，默认30
                type: Number,
                default: 30
            },
            operatSize: {//字体大小，默认为25
                type: Number,
                default: 21
            },
            operatLook: {//是否需要显示看不请换一张
                type: Boolean,
                default: false
            },
            silderBwidth: {//验证码div,和验证码底部滑块的宽度
                type: Number,
                default: 300
            },
            refreshShow:{//验证码是否显示刷新按钮
                type: Boolean,
                default: true
            },
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
                default:'http://via.placeholder.com/'
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
            idiomWidth: {//验证码div的宽度和底部提示语的宽度，默认为300
                type: Number,
                default: 300
            },
            idiomHeight: {//验证码div的高度，默认为150
                type: Number,
                default: 150
            },
            idiomBotHeight: {//底部提示语的高度，默认为40
                type: Number,
                default: 40
            },
            idiomSize: {//验证码字体大小，默认为30px
                type: Number,
                default: 30
            },
            idiomMsg: {//验证码显示的成语，最少两个才会回显
                type: Array,
                default: [],
            },
        },
        data() {
            return {
                code:'',
                isShow:false,
                // imgUrl:'src/assets/images/backimg/',
                // imgName:['0.jpg','1.jpg','2.jpg'],
                // imgSize:{
                //     width:'100%',
                //     height:'150px'
                // },
                // barSize:{
                //     width:'100%',
                //     height:'50px'
                // }
            }
        },

        mounted() {
        },
        methods: {
            codePrice(msg){
                this.$emit('codePrice',msg)
            },
            operationSuccess(msg){
                this.$emit('codePrice',msg)
            },
            silderSuccess(msg){
                this.$emit('codePrice',msg)
            },
            idiomSuccess(msg){
                this.$emit('codePrice',msg)
            },
            verifySuccess(msg){
                this.$emit('codePrice',msg)
            },
            submit(){
                this.isShow = true;
            },
            // 用户通过了验证
            success(msg){
                this.isShow = false; // 通过验证后，需要手动隐藏模态框
            },
            // 用户点击遮罩层，应该关闭模态框
            close(){
                this.isShow = false;
            }
        },

    }
</script>

<style scoped>
    /*验证码样式*/
    .code {
        width: 124px;
        height: 31px;
        border: 1px solid rgba(186, 186, 186, 1);
    }

    .login-code {
        cursor: pointer;
    }
</style>