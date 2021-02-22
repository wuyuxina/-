<!--
@author: wuyuxin
@description: 数字字母验证码
@time: 2020/01/19
参数说明：
codeTypes----------想要的验证码类型，可以选择混合，数字或字母，默认为混合
codeLength----------想要的验证码长度,默认为4
contentWidth----------验证码div的宽度  默认120
contentHeight----------验证码div的高度，默认30
/**具体内容请想看props内部传递数据说明*/
-->
<template>
    <div class="s-canvas">
        <div class="img_box">
            <img :src="imgURL.url" @click="sidentCode">
        </div>
    </div>
    <span class="textVer" v-show="operatLook"  @click="operatLook?sidentCode():''">看不清，换一张</span>
    <a-button type="primary" @click="makeCode">
        确定
    </a-button>
</template>
<script>
    import {post} from '@/api/request.js'

    export default {
        name: 'SIdentify',
        props: {
            getUrl: {
                type: String,
                default: '',
            },
            verifyUrl: {
                type: String,
                default: '',
            },
            getParams: {
                default: {productId: '2'},
            },
            verifyParamsValue: {
                type: String,
                defaut: ''
            },
            operatLook: {//是否需要显示看不请换一张
                type: Boolean,
                default: false
            },

        },
        data() {
            return {
                imgURL: {
                    url:'',
                    id:''
                },
                newValue:this.verifyParamsValue
            }
        },
        watch: {
            verifyParamsValue: {
                handler: function (val, oldVal) {
                    this.newValue=val
                },
                deep: true
            }
        },
        mounted() {
            this.sidentCodeApi();
        },
        methods: {
            /**获取后台图片接口**/
            sidentCodeApi() {
                post(this.getUrl, this.getParams).then(res => {
                    console.log('获取数字字母验证码图图片', res)
                });
            },
            /**点击验证码进行图片的切换**/
            sidentCode() {
                this.sidentCodeApi()
            },
            /**验证结果*/
            makeCode() {
                let params={}
                params.productId=this.getParams.productId
                params.idStr=this.imgURL.id
                params.Data=this.newValue
                post(this.verifyUrl,params ).then(res => {
                    console.log('开始验证结果', res)
                });
                this.$emit('codePrice', this.identifyCode)//将最后的值传递给父页面
            },
        },
    }
</script>
<style scoped lang="scss">
    .s-canvas {
        height: 32px;

        .img_box {
            margin-left: 8px;
            border-radius: 3px;
            cursor: pointer;
            width: 120px;
            height: 32px;

            img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }
    }

    .s-canvas canvas {
        margin-left: 8px;
        border-radius: 3px;
        cursor: pointer;
    }
</style>