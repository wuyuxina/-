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
    <div class="s-canvas" @click="refreshCode">
        <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
    </div>
</template>
<script>
    export default {
        name: 'SIdentify',
        props: {
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
                default: 25
            },
            lineColorNum:{//干扰线的条数，默认为4条
                type: Number,
                default: 4
            },
            lineColorMin: {//绘制干扰线的深浅（最小换算），数值越小越深
                type: Number,
                default: 200
            },
            lineColorMax: {//绘制干扰线的深浅（最大换算），数值越小越深
                type: Number,
                default: 255
            },
            dotcolorNum:{// 绘制干扰点数量
                type: Number,
                default: 20
            },
            dotColorMin: {//备用，暂时没有被用到，绘制干扰点
                type: Number,
                default: 0
            },
            dotColorMax: {//备用，暂时没有被用到，绘制干扰点
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
            }
        },
        data() {
            return {
                identifyCodesNum: "1234567890",//数字类型
                identifyCodesStr: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",//字母类型
                identifyCodes: '',//最终的类型，可能是数字或字母，或者两者混合
                identifyCode: "",//产生的验证码的值
            }
        },
        watch: {
            identifyCode() {
                this.drawPic()
            }
        },
        mounted() {
            this.identifyCode = "";//置空值
            /**判断 想要的验证码是string还是number类型，或者是混合类型*/
            switch (this.codeTypes) {
                case 'number' :
                    this.identifyCodes = this.identifyCodesNum
                    break;
                case 'string' :
                    this.identifyCodes = this.identifyCodesStr
                    break;
                case 'mixture' :
                    this.identifyCodes = this.identifyCodesNum + this.identifyCodesStr
                    break;
            }
            this.makeCode(this.identifyCodes, this.codeLength);
            this.drawPic();
        },
        methods: {
            /**加载验证码方法*/
            refreshCode() {
                this.identifyCode = "";
                this.makeCode(this.identifyCodes, this.codeLength);
            },
            /**生成最终的验证码的值*/
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                        this.randomNum(0, this.identifyCodes.length)
                        ];
                }
                this.$emit('codePrice', this.identifyCode)//将最后的值传递给父页面
            },
            /**生成一个随机数*/
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            },
            /** 生成一个随机的颜色 */
            randomColor(min, max) {
                let r = this.randomNum(min, max)
                let g = this.randomNum(min, max)
                let b = this.randomNum(min, max)
                return 'rgb(' + r + ',' + g + ',' + b + ')'
            },
            /**以下部分为验证码的样式和规则，一般情况下不做修改 开始*/
            drawPic() {
                let canvas = document.getElementById('s-canvas')
                let ctx = canvas.getContext('2d')
                ctx.textBaseline = 'bottom'
                // 绘制背景
                ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
                ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
                // 绘制文字
                for (let i = 0; i < this.identifyCode.length; i++) {
                    this.drawText(ctx, this.identifyCode[i], i)
                }
                this.drawLine(ctx)
                this.drawDot(ctx)
            },
            drawText(ctx, txt, i) {
                ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
                ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
                let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
                let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
                var deg = this.randomNum(-45, 45)
                // 修改坐标原点和旋转角度
                ctx.translate(x, y)
                ctx.rotate(deg * Math.PI / 180)
                ctx.fillText(txt, 0, 0)
                // 恢复坐标原点和旋转角度
                ctx.rotate(-deg * Math.PI / 180)
                ctx.translate(-x, -y)
            },
            drawLine(ctx) {
                // 绘制干扰线
                for (let i = 0; i < this.lineColorNum; i++) {
                    ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
                    ctx.beginPath()
                    ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.stroke()
                }
            },
            drawDot(ctx) {
                // 绘制干扰点
                for (let i = 0; i < this.dotcolorNum; i++) {
                    ctx.fillStyle = this.randomColor(this.dotColorMin, this.dotColorMax)
                    ctx.beginPath()
                    ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
                    ctx.fill()
                }
            },
            /**以上部分为验证码的样式和规则，一般情况下不做修改 结束*/
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