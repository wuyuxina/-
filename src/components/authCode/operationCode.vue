<!--
@author: wuyuxin
@description: 运算验证码
@time: 2020/01/19
参数说明：
operatContentHeight----------验证码div的高度，默认30，宽度为换算后的自适应宽度，所以不允许自定义
operatSize----------字体大小，默认为25
operatLook----------是否需要看不请换一张提示语
/**具体内容请想看props内部传递数据说明*/
-->

<template>
    <div class="s-canvas" >
        <canvas ref="checkCode" class="codeCanvas" @click="operatLook?'':getCode()"></canvas>
        <span class="textVer" v-show="operatLook"  @click="operatLook?getCode():''">看不清，换一张</span>
    </div>
</template>
<script>
    export default {
        name: 'SIdentify',
        props: {
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
        },
        data() {
            return {
                inputCode: "", //验证码的值
                checkCode: "", // 图片验证码的值
                expressValue: "", // 表达式的值
                // canvas各种设置
                cvs: {
                    w: this.contentWidth, // 给出默认宽度  宽度会在图片绘制时根据长度更改
                    h: this.operatContentHeight, // 高 与input保持一致
                    fontSize: this.operatSize, // 字体大小
                    str: "+-*", // 符号生成范围
                    line: 2, // 噪音线个数
                },
            };
        },
        mounted() {
            this.getCode();
        },
        methods: {
            //生成随机整数
            rInt(max) {
                return Math.floor((Math.random() * 100000) % max);
            },
            //生成随机表达式
            rCode() {
                let a = this.rInt(100);
                let b = this.rInt(10);
                let op = this.cvs.str.charAt(this.rInt(this.cvs.str.length));
                let code = `${a}${op}${b}=`;
                this.checkCode = code;
                // 表达式的值
                this.expressValue = eval(code.substr(0, code.length - 1));
                this.$emit('codePrice', this.expressValue)//将最后的值传递给父页面
                return code;
            },
            //生成随机颜色
            rColor() {
                let a = ((Math.random() * 5 + 5) / 10).toFixed(2);
                return `rgba(${this.rInt(256)}, ${this.rInt(256)}, ${this.rInt(
                    256
                )}, ${a})`;
            },
            // 验证码图片绘制
            drawCode(domCvs) {
                let _this = this;
                // 随机表达式
                let checkCode = this.rCode();
                // 宽设置
                this.cvs.w = 10 + this.cvs.fontSize * this.checkCode.length;

                // 判断是否支持canvas
                if (domCvs !== null && domCvs.getContext && domCvs.getContext("2d")) {
                    // 设置显示区域大小
                    domCvs.style.width = _this.cvs.w;
                    // 设置画板宽高
                    domCvs.setAttribute("width", _this.cvs.w);
                    domCvs.setAttribute("height", _this.cvs.h);
                    // 画笔
                    let pen = domCvs.getContext("2d");
                    // 背景: 颜色  区域
                    pen.fillStyle = "#eee";
                    pen.fillRect(0, 0, _this.cvs.w, _this.cvs.h);
                    // 水平线位置
                    pen.textBaseline = "middle"; // top middle bottom
                    // 内容
                    for (let i = 0; i < _this.checkCode.length; i++) {
                        pen.fillStyle = _this.rColor(); // 随机颜色
                        pen.font = `bold ${_this.cvs.fontSize}px 微软雅黑`; // 字体设置
                        // 字符绘制: (字符, X坐标, Y坐标)
                        pen.fillText(
                            checkCode.charAt(i),
                            10 + _this.cvs.fontSize * i,
                            17 + _this.rInt(5)
                        );
                    }
                    // 噪音线
                    for (let i = 0; i < _this.cvs.line; i++) {
                        // 起点
                        pen.moveTo(_this.rInt(_this.cvs.w) / 2, _this.rInt(_this.cvs.h));
                        // 终点
                        pen.lineTo(_this.rInt(_this.cvs.w), _this.rInt(_this.cvs.h));
                        // 颜色
                        pen.strokeStyle = _this.rColor();
                        // 粗细
                        pen.lineWidth = "2";
                        // 绘制
                        pen.stroke();
                    }
                }
            },
            getCode() {
                let domCvs = this.$refs.checkCode;
                this.drawCode(domCvs);
            },
        },
    }
</script>
<style scoped lang="scss">
    .s-canvas {
        height: 32px;

    }
    .s-canvas canvas {
        margin-left: 8px;border-radius: 3px;cursor: pointer;
    }
</style>