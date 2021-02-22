<!--
@author: wuyuxin
@description: 数字字母验证码
@time: 2020/01/19
参数说明：
/**具体内容请想看props内部传递数据说明*/
-->

<template>
    <div class="loginBox">
        <div class="contentBox">
            <div class="back" v-show="phonesShow"><i @click="userShowClcik" class="layui-icon layui-icon-return "
                                                     title="返回为用户名登录"></i></div>
            <form class="layui-form layui-form-pane login_form" lay-filter="example">
                <div v-if="loginType=='userPass'||loginType=='allUp'&&!phonesShow">
                    <!--                用户名-->
                    <div class="layui-form-item">
                        <label class="layui-form-label"><span class="required">*</span>用户名</label>
                        <div class="layui-input-block">
                            <input type="text" lay-verify="required" name="username" autocomplete="off"
                                   placeholder="请输入用户名" class="layui-input">
                        </div>
                    </div>
                    <!--                密码-->
                    <div class="layui-form-item">
                        <label class="layui-form-label"><span class="required">*</span>密码</label>
                        <div class="layui-input-block">
                            <input type="password" name="password" lay-verify="required|password" autocomplete="off"
                                   placeholder="请输入密码" class="layui-input">
                        </div>
                    </div>
                </div>
                <div v-if="loginType=='phoneCode'||phonesShow">
                    <!--                手机号-->
                    <div class="layui-form-item">
                        <label class="layui-form-label"><span class="required">*</span>手机号</label>
                        <div class="layui-input-block">
                            <input type="phone" name="phone" autocomplete="off" placeholder="请输入手机号"
                                   class="layui-input">
                        </div>
                    </div>
                    <!--                手机短信验证码-->
                    <div class="layui-form-item">
                        <label class="layui-form-label phonecode-label"><span class="required">*</span>短信验证码</label>
                        <div class="layui-input-block phoneCode">
                            <input class="layui-input " type="text" name="phoneCode" autocomplete="off"
                                   placeholder="请输入验证码">
                            <span class="btn_span">获取验证码</span>
                            <!--                        <button type="button" class="layui-btn layui-btn-primary">获取验证码</button>-->
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <login-code
                            :codeType="'numberLetter'"
                            :contentHeight="36"
                            :contentWidth="90"
                            @codePrice="codePrice"
                            :codeShow="true"></login-code>
                </div>
                <!--                提交按钮-->
                <div class="layui-form-item sumbit">
                    <button type="" class="layui-btn layui-btn-normal" lay-submit="" lay-filter="demo1">立即提交</button>
                </div>
                <!--                第三方登录按钮-->
                <div class="layui-form-item third">
                    <img v-if="loginType=='allUp'" @click="phoneShowClcik" src="./assets/image/5.png"/>
                    <!--微信登录-->
                    <img src="./assets/image/6.png"/>
                    <!--qq登录-->
                    <img src="./assets/image/7.png"/>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue'
    import loginCode from "./../authCode/index";
    import * as api from '@/api/api.js' //页面中引入
    import md5 from 'js-md5';
    import sha512 from 'js-sha512'

    export default {
        name: "loginBox",
        components: {
            loginCode
        },
        props: {
            loginType: {
                //用户名密码登录方式，---  userPass
                //手机号验证码登录方式，---  phoneCode
                //用户名密码和手机号验证码登录同时存在的话 allUp
                type: String,
                default: 'userPass'
            },
            encrypt: {
                //userPass的情况下，可以对密码进行加密  默认为md5
                //MD5-----md5
                //SHA512------sha512
                //none------- 不加密
                type: String,
                default: 'md5'
            },
        },
        setup() {
            let phonesShow = ref(false)
            let codeMsg = ref('')
            /**显示电话验证码登录*/
            let phoneShowClcik = () => {
                phonesShow.value = true
            };
            /**显示电话验证码登录*/
            let userShowClcik = () => {
                phonesShow.value = false
            }
            return {
                //定义的数据
                phonesShow,
                codeMsg,
                //定义的方法
                phoneShowClcik,
                userShowClcik

            }
        },
        data() {
            return {}
        },
        mounted() {
            this.$nextTick(() => {
                let that = this
                layui.use(['form', 'layedit', 'laydate'], () => {
                    var form = layui.form
                        , layer = layui.layer
                        , layedit = layui.layedit
                        , laydate = layui.laydate;
                    /**
                     * 自定义验证规则
                     *
                     * */
                    form.verify({
                        title: function (value) {
                            if (value.length < 1) {
                                return '用户名不能为空';
                            }
                        }
                        , password: [
                            /^[\S]{6,12}$/
                            , '密码必须6到12位，且不能出现空格'
                        ]
                        , operation: function (value) {
                            if (value != that.codeMsg) {
                                return '验证码填写错误';
                            }
                        }
                        , identify: function (value) {
                            if (value.toString().toLowerCase() != that.codeMsg.toString().toLowerCase()) {
                                return '验证码填写错误';
                            }
                        }
                    });
                    /**
                     * 表单提交
                     *
                     * */
                    form.on('submit(demo1)', (data) => {
                        data.field.accountSource = 'auth'
                        if (that.loginType == 'userPass' || that.loginType == 'allUp' && !that.phonesShow) {
                            switch (that.encrypt) {
                                case ('md5'):
                                    data.field.password = md5(data.field.password)
                                    break;
                                case ('sha512'):
                                    data.field.password = sha512(data.field.password)
                                    break;
                                case ('none'):
                                    break;
                            }
                        }

                        that.loginApi(data.field)
                        return false;
                    });
                })
            })
        },
        methods: {
            loginApi(params) {
                api.login(params).then(data => {// 请求数据成功并返回数据。
                    if (data.code == '200') {
                        layer.msg("登录成功");
                        localStorage.setItem("token", data.resultData.accessTokenEntity.access_token);
                        setTimeout(() => {
                            console.log(data.resultData);
                            this.$router.push('/home')
                        }, 1000)
                    } else {

                        layer.msg(data.msg);
                    }

                }).catch(data => {
                    // _this.Message();
                    layer.msg("aa");
                    console.log('请求失败')
                });
            },
            codePrice(msg) {
                console.log(msg);
                this.codeMsg = msg

            },
        },
    }
</script>

<style scoped lang="less">
    .loginBox {
        position: relative;
        height: 100%;

        .back {
            padding-bottom: 10px;

            i {
                font-size: 18px;
                color: #f2f2f2;
                cursor: pointer;
                transition: all ease 0.3s;
            }

            i:hover {
                color: #1988fb;
            }
        }

        .contentBox {
            position: absolute;
            right: 18%;
            top: 50%;
            transform: translateY(-50%);
            width: 350px;
            padding: 40px 30px;
            height: auto;
            background: rgba(0, 0, 0, 0.7);

            ::v-deep .login_form {
                .layui-form-item label, .layui-input-block input {
                    /*background: none;*/
                }

                .layui-form-item label {
                    .required {
                        color: red;
                        line-height: 100%;
                        padding-right: 3px;
                    }

                    /*color: #d0cfcf;*/
                }

                .phonecode-label {
                    padding: 8px 10px;
                }

                .layui-input-block input {
                    /*color: #d0cfcf;*/
                }

                .phoneCode {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .layui-input {
                        flex: 1;
                    }

                    .btn_span {
                        transition: all ease 0.2s;
                        border-radius: 3px;
                        width: 100px;
                        height: 38px;
                        background: #f2f2f2;
                        color: #1988fb;
                        cursor: pointer;
                        margin-left: 10px;
                        line-height: 38px;
                        text-align: center;
                    }

                    .btn_span:hover {
                        background: #f7ececf5;
                    }
                }

                .sumbit {
                    .layui-btn {
                        width: 100%;
                    }
                }

                .third {
                    display: flex;
                    justify-content: center;

                    img {
                        width: 35px;
                        height: 35px;
                        margin: 0 15px;
                        cursor: pointer;
                    }
                }
            }

        }
    }

</style>