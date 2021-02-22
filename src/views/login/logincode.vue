<template>
    <div class="form-group" style="margin: 15px">
        <a-form layout="inline" :model="formInline">
            <!--数字字母验证码开始-->
            <div class="dateTime_type">
                <h3 class="h_title" style="padding-top: 0px">1、数字字母验证码</h3>
                <a-form-item label="验证码" class="item_con" style="display: flex;align-items: center">
                    <a-input style="width: 120px" v-model:value="value1"    @click="sss"  />
                    <i style="display: inline-block;width: 300px;display: flex;justify-content: start;align-items: center" class="code_span">
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
<!--                        <sidentify-serve-->
<!--                                :getUrl="getUrl"-->
<!--                                :verifyUrl="verifyUrl"-->
<!--                                :getParams="getParams"-->
<!--                                :verifyParamsValue="value1"-->
<!--                        >-->

<!--                        </sidentify-serve>-->
                    </i>
                </a-form-item>
                <div><span>基本用法：<span style="color: #40a9ff">{{msg}}</span></span></div>
                <a-table size="middle" class="table" :columns="columns" :data-source="dataIdentify" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Attributes</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
                <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Events</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>

            </div>

            <!--运算验证码开始-->
            <div class="dateTime_type">
                <h3 class="h_title">2、运算符验证码</h3>
                <a-form-item label="验证码" class="item_con" style="display: flex;align-items: center">
                    <a-input  v-model:value="value2"  style="width: 120px"/>
                    <i style="display: inline-block;width: 300px;display: flex;justify-content: start;align-items: center" class="code_span">
                        <operation-code
                                @codePrice="operationSuccess"
                                :operatContentHeight="operatContentHeight"
                                :operatSize="operatSize"
                                :operatLook="operatLook"
                        >
                        </operation-code>
<!--                        <operationCodeServe-->
<!--                                :operatLook="false"-->
<!--                        >-->

<!--                            </operationCodeServe>-->
                    </i>
                </a-form-item>
                <div><span>基本用法：<span style="color: #40a9ff">{{msg2}}</span></span></div>
                <a-table size="middle" class="table" :columns="columns" :data-source="dataOperation" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Attributes</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
                <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Events</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
            </div>
            <!--滑块验证码开始-->
            <div class="dateTime_type">
                <h3 class="h_title">3、滑块验证码</h3>
                <div class="layui-form-item" style="width: 300px">
                    <slider-code
                            @codePrice="silderSuccess"
                            :silderBwidth="silderBwidth"
                            :refreshShow="refreshShow"
                    >
                    </slider-code>
                </div>
                <div><span>基本用法：<span style="color: #40a9ff">{{msg3}}</span></span></div>
                <a-table size="middle" class="table" :columns="columns" :data-source="dataSlider" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Attributes</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
                <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Events</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
            </div>
            <!--选汉字验证码-->
            <div class="dateTime_type">
                <h3 class="h_title">4、选汉字验证码</h3>
                <div class="layui-form-item">
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
                <div><span>基本用法：<span style="color: #40a9ff">{{msg4}}</span></span></div>
                <a-table size="middle" class="table" :columns="columns" :data-source="dataVerify" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Attributes</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
                <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
                    <template #name="{ text }">
                        <a>{{ text }}</a>
                    </template>
                    <template #title="currentPageData">
                        <span class="parameter">Events</span>
                    </template>
                    <template #footer="currentPageData">
                        <span class="parameter">End</span>
                    </template>
                </a-table>
            </div>
            <!--选成语验证码-->
            <div class="dateTime_type">
                <h3 class="h_title">5、选成语验证码</h3>
                <div class="layui-form-item">
                    <idiom-code
                            :idiomMsg="idiomMsg"
                            :idiomWidth="idiomWidth"
                            :idiomHeight="idiomHeight"
                            :idiomBotHeight="idiomBotHeight"
                            :idiomSize="idiomSize"
                            @codePrice="idiomSuccess"
                    ></idiom-code>
                    <div style="margin-top: 20px"><span>基本用法：<span style="color: #40a9ff">{{msg5}}</span></span></div>
                    <a-table size="middle" class="table" :columns="columns" :data-source="dataIdiom" bordered>
                        <template #name="{ text }">
                            <a>{{ text }}</a>
                        </template>
                        <template #title="currentPageData">
                            <span class="parameter">Attributes</span>
                        </template>
                        <template #footer="currentPageData">
                            <span class="parameter">End</span>
                        </template>
                    </a-table>
                    <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
                        <template #name="{ text }">
                            <a>{{ text }}</a>
                        </template>
                        <template #title="currentPageData">
                            <span class="parameter">Events</span>
                        </template>
                        <template #footer="currentPageData">
                            <span class="parameter">End</span>
                        </template>
                    </a-table>
                </div>
            </div>
            <!--根据汉字选择数字-->
            <div class="dateTime_type">
                <h3 class="h_title">6、根据汉字选择数字</h3>
                <hanzi-number>
                </hanzi-number>
                <div class="layui-form-item">
                    <div style="margin-top: 20px"><span>基本用法：<span style="color: #40a9ff">{{msg5}}</span></span></div>
                    <a-table size="middle" class="table" :columns="columns" :data-source="dataIdiom" bordered>
                        <template #name="{ text }">
                            <a>{{ text }}</a>
                        </template>
                        <template #title="currentPageData">
                            <span class="parameter">Attributes</span>
                        </template>
                        <template #footer="currentPageData">
                            <span class="parameter">End</span>
                        </template>
                    </a-table>
                    <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
                        <template #name="{ text }">
                            <a>{{ text }}</a>
                        </template>
                        <template #title="currentPageData">
                            <span class="parameter">Events</span>
                        </template>
                        <template #footer="currentPageData">
                            <span class="parameter">End</span>
                        </template>
                    </a-table>
                </div>
            </div>
        </a-form>

    </div>

</template>

<script>
    import SIdentify from '../../components/authCode/sidentify'
    import sidentifyServe from '../../components/authCode/sidentifyServe'
    import operationCode from '../../components/authCode/operationCode'
    import operationCodeServe from '../../components/authCode/operationCodeServe'

    import sliderCode from '../../components/authCode/sliderCode'
    import verify from '../../components/authCode/selCharacters/Verify'
    import idiomCode from "../../components/authCode/idiomCode";
    import hanziNumber from "../../components/authCode/hanziNumber";//根据汉字选择数字
    export default {
        name: "meun",
        components: {SIdentify, sliderCode, operationCode, verify, idiomCode
            ,sidentifyServe,operationCodeServe,hanziNumber
        },
        props: {
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
            getUrl:{
                type: String,
                default: ''
            },
            verifyUrl:{
                type: String,
                default: ''
            },
            getParams:{
                default:{"productId": "1"}
            },
            verifyParamsValue:{
                type:String,
                default:''
            },
            codeShow: {
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
                default: 32
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
                default: 32
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
            refreshShow: {//验证码是否显示刷新按钮
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
            let columns = [
                {
                    title: '参数',
                    dataIndex: 'name',
                    slots: {customRender: 'name'},
                },
                {
                    title: '说明',
                    className: 'column-money',
                    dataIndex: 'money',
                },
                {
                    title: '类型',
                    dataIndex: 'address',
                },
                {
                    title: '可选值',
                    className: 'optionalValue',
                    dataIndex: 'optionalValue',
                },
                {
                    title: '默认值',
                    className: 'defalutValue',
                    dataIndex: 'defalutValue',
                },
            ];
            let dataIdentify = [
                {
                    key: '1',
                    name: 'codeTypes',
                    money: '想要的验证码类型，可以选择混合，数字或字母，默认为混合',
                    address: 'String',
                    optionalValue: 'number | string | mixture',
                    defalutValue: 'mixture'
                },
                {
                    key: '2',
                    name: 'codeLength',
                    money: '想要的验证码长度,默认为4',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '4'
                },
                {
                    key: '3',
                    name: 'fontSizeMin',
                    money: '验证码字体最小换算标准，默认为25',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '25'
                },
                {
                    key: '4',
                    name: 'fontSizeMax',
                    money: '验证码字体最大换算标准，默认为30',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '30'
                },
                {
                    key: '5',
                    name: 'backgroundColorMin',
                    money: '生成一个随机背景颜色（最小换算）',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '255'
                },
                {
                    key: '6',
                    name: 'backgroundColorMax',
                    money: '生成一个随机背景颜色（最大换算）',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '255'
                },
                {
                    key: '7',
                    name: 'lineColorNum',
                    money: '绘制干扰线的数量，默认为4条',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '4'
                },
                {
                    key: '8',
                    name: 'dotcolorNum',
                    money: '绘制干扰点的数量，默认为20个',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '20'
                },
                {
                    key: '9',
                    name: 'contentWidth',
                    money: '验证码div的宽度  默认120',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '120'
                },
                {
                    key: '10',
                    name: 'contentHeight',
                    money: '验证码div的高度，默认30',
                    address: 'Number',
                    optionalValue: 'length',
                    defalutValue: '30'
                },
            ];
            let dataOperation = [
                {
                    key: '1',
                    name: 'operatContentHeight',
                    money: '验证码div的高度',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '30'
                },
                {
                    key: '2',
                    name: 'operatSize',
                    money: '字体大小',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '25'
                },
                {
                    key: '3',
                    name: 'operatLook',
                    money: '是否需要显示看不请换一张',
                    address: 'Boolean',
                    optionalValue: 'false | true',
                    defalutValue: 'false'
                },
            ]
            let dataVerify=[
                {
                    key: '1',
                    name: 'defaultNum',
                    money: '默认的文字数量',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '4'
                },
                {
                    key: '2',
                    name: 'checkNum',
                    money: '校对的文字数量',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '3'
                },
                {
                    key: '3',
                    name: 'imgUrl',
                    money: '本地背景图片回显的地址',
                    address: 'String',
                    optionalValue: 'String',
                    defalutValue: 'http://via.placeholder.com/'
                },
                {
                    key: '4',
                    name: 'imgName',
                    money: '将要回显的背景图片数组',
                    address: 'Array',
                    optionalValue: '["1.jpg","2.jpg"]',
                    defalutValue: '["350x150", "350x450"]'
                },
                {
                    key: '5',
                    name: 'imgSize',
                    money: '背景图片大小',
                    address: 'Object',
                    optionalValue: 'Object',
                    defalutValue: '{width:"400px",height:"200px"}'
                },
                {
                    key: '7',
                    name: 'sanvasWidth',
                    money: 'sanvas 宽度',
                    address: 'Number',
                    optionalValue: 'Number',
                    defalutValue: '300'
                },
                {
                    key: '8',
                    name: 'sanvasHeight',
                    money: 'sanvas 高度',
                    address: 'Number',
                    optionalValue: 'Number',
                    defalutValue: '300'
                },
            ]
            let dataIdiom=[
                {
                    key: '1',
                    name: 'idiomWidth',
                    money: '验证码div的宽度和底部提示语的宽度，默认为300',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '300'
                },
                {
                    key: '2',
                    name: 'idiomHeight',
                    money: '验证码div的高度，默认为150',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '150'
                },
                {
                    key: '3',
                    name: 'idiomBotHeight',
                    money: '底部提示语的高度，默认为40',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '40'
                },
                {
                    key: '4',
                    name: 'idiomSize',
                    money: '验证码字体大小，默认为30px',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '30'
                },
                {
                    key: '5',
                    name: 'idiomMsg',
                    money: '验证码显示的成语，最少两个才会回显',
                    address: 'Array',
                    optionalValue: 'Array，例如["恭喜发财","大吉大利","今晚吃鸡"]',
                    defalutValue: '[]'
                },
            ]
            let dataSlider = [
                {
                    key: '1',
                    name: 'silderBwidth',
                    money: '验证码div,和验证码底部滑块的宽度',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '300'
                },
                {
                    key: '2',
                    name: 'refreshShow',
                    money: '验证码是否显示刷新按钮',
                    address: 'Boolean',
                    optionalValue: 'false | true',
                    defalutValue: 'true'
                },
            ]
            let columnsEvents = [
                {
                    title: '事件',
                    dataIndex: 'name',
                    slots: {customRender: 'name'},
                },
                {
                    title: '说明',
                    className: 'column-money',
                    dataIndex: 'money',
                },
                {
                    title: '回调参数',
                    dataIndex: 'address',
                },
            ]

            let dataEvents = [
                {
                    key: '1',
                    name: 'codePrice',
                    money: '验证结果或验证的值',
                    address: 'function(data)',
                },
            ]
            return {
                columns,
                dataIdentify,
                dataOperation,
                dataSlider,
                dataVerify,
                dataIdiom,
                columnsEvents,
                dataEvents,
                code: '',
                isShow: false,
                formInline: {
                    user: '',
                    password: ''
                },
                //对应的输入框的值
                value1:'',//数字字母验证码
                value2:'',//运算符验证码
                msg:'<s-identify></s-identify>',
                msg2:'<operation-code></operation-code>',
                msg3:'<slider-code></slider-code>',
                msg4:'<verify></verify>',
                msg5:'<idiom-code></idiom-code>',
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
            codePrice(msg) {
                this.$emit('codePrice', msg)
            },
            operationSuccess(msg) {
                this.$emit('codePrice', msg)
            },
            silderSuccess(msg) {
                this.$emit('codePrice', msg)
            },
            idiomSuccess(msg) {
                this.$emit('codePrice', msg)
            },
            verifySuccess(msg) {
                this.$emit('codePrice', msg)
            },
            submit() {
                this.isShow = true;
            },
            // 用户通过了验证
            success(msg) {
                this.isShow = false; // 通过验证后，需要手动隐藏模态框
            },
            // 用户点击遮罩层，应该关闭模态框
            close() {
                this.isShow = false;
            },
            sss(){
                alert(this.value1)
            },
        },

    }
</script>

<style scoped lang="less">
    /*验证码样式*/
    .code {
        width: 124px;
        height: 32px;
        border: 1px solid rgba(186, 186, 186, 1);
    }

    /deep/ .item_con {
        margin: 10px 0px;
        margin-bottom: 25px !important;

        .ant-form-item-children {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
        }
    }

    .login-code {
        cursor: pointer;
    }

    .dateTime_type {
        border-bottom: 1px solid #e2e2e2;

        th.column-money,
        td.column-money {
            text-align: right !important;
        }

        .h_title {
            font-size: 22px;
            font-weight: normal;
            color: #333;
            padding-top: 20px;
            padding-bottom: 10px;
        }

        .col_row {
            margin: 15px 0px;
            width: 50%;
            float: left;
        }

        .label_title {
            margin-right: 20px;
            display: inline-block;
            width: 270px;
            text-align: right
        }
    }

    .table {
        margin-top: 30px;
        width: 70%;

        .parameter {
            font-size: 19px;
        }
    }
</style>