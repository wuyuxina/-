<!--
@author: wuyuxin
@description: 数字字母验证码
@time: 2020/01/19
参数说明：
silderBwidth----------验证码div,和验证码底部滑块的宽度,默认为300
refreshShow----------验证码是否显示刷新按钮
contentWidth----------验证码div的宽度  默认120
contentHeight----------验证码div的高度，默认30
/**具体内容请想看props内部传递数据说明*/
-->
<template>
    <div class="mask_layer_model" v-if="visible" style="z-index: 9;">
        <div class="captcha_model">
            <!--头部的提示信息，默认隐藏掉-->
            <div class="header" v-show="false">
                <span>请完成安全验证</span>
                <span style="float: right" title="关闭验证码" @click="close">
                <i class="iconfont icon-Close"></i>
            </span>
            </div>
            <div class="content">
                <div class="sliding-pictures">
                    <i class="layui-icon layui-icon-refresh-3 refresh" @click="onRefresh" title="刷新验证码" v-show="refreshShow&&refreshLoading"></i>
                    <div id="captcha">
                    </div>
                </div>
            </div>
            <div class="sliderContainer" :style="{width: silderBwidth-2+'px'}">
                <div class="sliderMask">
                    <div class="slider">
                        <span class="sliderIcon"></span>
                    </div>
                </div>
                <span class="sliderText">向右滑动填充拼图</span>
            </div>
        </div>
    </div>
</template>
<script>
    import {post} from '@/api/request.js'
    import {ref} from 'vue';
    export default {
        props: {
            silderBwidth: {//验证码div,和验证码底部滑块的宽度
                type: Number,
                default: 300
            },
            refreshShow:{//验证码是否显示刷新按钮
                type: Boolean,
                default: true
            },
            getUrl: {
                type: String,
                default: '',
            },
            verifyUrl: {
                type: String,
                default: '',
            },
            getParams: {
                default: {productId: '1'},
            },
        },
        data() {
            return {
                cv: {
                    w: this.silderBwidth,
                    h: 155,
                },
                block: {
                    l: 42, // 滑块边长
                    L: 42 + 9 * 2 + 3,// 滑块实际边长
                    r: 9, // 滑块半径
                },
                randomPos: {
                    x: 0,
                    y: 0,
                },
                refreshLoading:true,//图片是否加载完毕，完毕后显示刷新按钮
                canvasCtx: null,
                blockCtx: null,
                blockDom: null,
                sliderDom: null,
                sliderContainerDom: null,
                sliderMaskDom: null,
                el: null,
                img: null,
                trail: null,

            };
        },
        setup(){
            let visible=ref(true)
            return{
                visible
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            close() {
                this.visible = false
            },
            init() {
                this.canvasInit();
                this.initImg();
                this.bindEvents();
            },
            onRefresh() {
                this.reset()
            },
            onSuccess() {
                this.$emit('codePrice','验证成功')
            },
            onFail() {
                this.$emit('codePrice','验证失败')
            },
            bindEvents() {
                this.el.onselectstart = () => false
                let originX, originY, trail = [], isMouseDown = false
                const addClass = function (tag, className) {
                    tag.classList.add(className)
                }
                const removeClass = function (tag, className) {
                    tag.classList.remove(className)
                }
                const handleDragStart = function (e) {
                    originX = e.clientX || e.touches[0].clientX
                    originY = e.clientY || e.touches[0].clientY
                    isMouseDown = true
                }
                const handleDragMove = (e) => {
                    if (!isMouseDown) return false
                    const eventX = e.clientX || e.touches[0].clientX
                    const eventY = e.clientY || e.touches[0].clientY
                    const moveX = eventX - originX
                    const moveY = eventY - originY
                    if (moveX < 0 || moveX + 38 >= this.cv.w) return false
                    this.sliderDom.style.left = moveX + 'px'
                    const blockLeft = (this.cv.w - 40 - 20) / (this.cv.w - 40) * moveX
                    this.blockDom.style.left = blockLeft + 'px'

                    addClass(this.sliderContainerDom, 'sliderContainer_active')
                    this.sliderMaskDom.style.width = moveX + 'px'
                    trail.push(moveY)
                }
                const handleDragEnd = (e) => {
                    if (!isMouseDown) return false
                    isMouseDown = false
                    const eventX = e.clientX || e.changedTouches[0].clientX

                    if (eventX == originX) return false
                    removeClass(this.sliderContainerDom, 'sliderContainer_active')
                    this.trail = trail
                    const {spliced, verified} = this.verify()
                    console.log('spliced',spliced);
                    console.log('verified',verified);
                    if (spliced) {
                        if (verified) {
                            addClass(this.sliderContainerDom, 'sliderContainer_success')
                            this.onSuccess();
                        } else {
                            addClass(this.sliderContainerDom, 'sliderContainer_fail')
                            this.onFail();
                            this.reset()
                        }
                    } else {
                        addClass(this.sliderContainerDom, 'sliderContainer_fail')
                        this.onFail();
                        setTimeout(() => {
                            this.reset()
                        }, 1000)
                    }
                }
                this.sliderDom.addEventListener('mousedown', handleDragStart)
                this.sliderDom.addEventListener('touchstart', handleDragStart)
                this.blockDom.addEventListener('mousedown', handleDragStart)
                this.blockDom.addEventListener('touchstart', handleDragStart)
                document.addEventListener('mousemove', handleDragMove)
                document.addEventListener('touchmove', handleDragMove)
                document.addEventListener('mouseup', handleDragEnd)
                document.addEventListener('touchend', handleDragEnd)
            },
            verify() {
                const sum = function (x, y) {
                    return x + y
                }
                const square = function (x) {
                    return x * x
                }
                const arr = this.trail // 拖动时y轴的移动距离
                const average = arr.reduce(sum) / arr.length
                const deviations = arr.map(x => x - average)
                const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)

                const left = parseInt(this.blockDom.style.left)
                console.log('保留移动的左侧距离',left)
                return {
                    spliced: Math.abs(left - this.randomPos.x) < 10,
                    verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
                }
            },
            reset() {
                this.sliderContainerDom.className = 'sliderContainer'
                this.sliderDom.style.left = 0
                this.blockDom.style.left = 0
                this.sliderMaskDom.style.width = 0
                this.clean()
                this.img.setSrc(this.getRandomImgSrc())
            },
            clean() {
                this.canvasCtx.clearRect(0, 0, this.cv.w, this.cv.h)
                this.blockCtx.clearRect(0, 0, this.cv.w, this.cv.h)
                this.blockDom.width = this.cv.w
            },
            draw() {
                // 随机创建滑块的位置
                // this.randomPos.x = this.getRandomNumberByRange(this.block.L + 10, this.cv.w - (this.block.L + 10))
                // this.randomPos.y = this.getRandomNumberByRange(10 + this.block.r * 2, this.cv.h - (this.block.L + 10))
                this.randomPos.x=200
                this.randomPos.y=100
                this.drawBlock(this.canvasCtx, this.randomPos.x, this.randomPos.y, 'fill')
                this.drawBlock(this.blockCtx, this.randomPos.x, this.randomPos.y, 'clip')

                console.log('this.randomPos',this.randomPos);
            },
            drawBlock(ctx, x, y, operation) {
                let r = this.block.r,
                    l = this.block.l,
                    PI = Math.PI;
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
                ctx.lineTo(x + l, y)
                ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
                ctx.lineTo(x + l, y + l)
                ctx.lineTo(x, y + l)
                ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
                ctx.lineTo(x, y)
                ctx.lineWidth = 2
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
                ctx.stroke()
                ctx[operation]()
                ctx.globalCompositeOperation = 'destination-over'
            },
            initImg() {
                const img = this.createImg(() => {
                    this.draw()

                    this.canvasCtx.drawImage(img, 0, 0, this.cv.w, this.cv.h)
                    this.blockCtx.drawImage(img, 0, 0, this.cv.w, this.cv.h)
                    console.log(this.canvasCtx);
                    console.log(this.blockCtx);
                    const y = this.randomPos.y - this.block.r * 2 - 1;
                    const ImageData = this.blockCtx.getImageData(this.randomPos.x - 3, y, this.block.L, this.block.L)
                    this.blockDom.width = this.block.L
                    this.blockCtx.putImageData(ImageData, 0, y)
                })
                this.img = img
            },
            canvasInit() {
                const canvas = this.createCanvas(this.cv.w, this.cv.h) // 画布
                const block = canvas.cloneNode(true) // 滑块

                block.className = 'blocks'
                const el = this.el = document.getElementById('captcha');
                el.style.position = 'relative'
                el.style.width = this.cv.w + 'px'
                Object.assign(el.style, {
                    position: 'relative',
                    width: this.cv.w + 'px',
                    margin: '0 auto'
                })

                this.el = el
                el.appendChild(canvas)
                el.appendChild(block)
                this.canvasCtx = canvas.getContext("2d");
                this.blockCtx = block.getContext("2d");
                this.blockDom = block;
                let Slider = document.getElementsByClassName('blocks')[0]
                Slider.style.position = 'absolute'
                Slider.style.left = '0'
                Slider.style.top = '0'
                this.sliderDom = document.getElementsByClassName('slider')[0];
                this.sliderContainerDom = document.getElementsByClassName('sliderContainer')[0];
                this.sliderMaskDom = document.getElementsByClassName('sliderMask')[0];

            },
            createCanvas(width, height) {
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                return canvas
            },
            createImg(onload) {

                const img = new Image()
                img.crossOrigin = "Anonymous"
                img.onload = onload
                img.onerror = () => {
                    img.setSrc(this.getRandomImgSrc())

                }

                img.setSrc = (src) => {
                    if (window.navigator.userAgent.indexOf('Trident') > -1) { // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
                        const xhr = new XMLHttpRequest()
                        xhr.onloadend = (e) => {

                            const file = new FileReader() // FileReader仅支持IE10+
                            file.readAsDataURL(e.target.response)
                            file.onloadend = function (e) {
                                img.src = e.target.result
                            }
                        }

                        xhr.open('GET', src)
                        xhr.responseType = 'blob'
                        xhr.send()

                    } else img.src = src

                }
                img.setSrc(this.getRandomImgSrc())
                return img
            },

            getRandomNumberByRange(start, end) {
                return Math.round(Math.random() * (end - start) + start)
            },
            // getRandomImgSrc() {
            //     return 'https://picsum.photos/300/150/?image=' + this.getRandomNumberByRange(0, 1084)
            //     // return 'https://picsum.photos/id/407/300/150'
            // },
            //新版获取图片接口
            getRandomImgSrc() {

                return 'https://picsum.photos/300/150/?image=' + this.getRandomNumberByRange(0, 1084)
            },
        }
    };
</script>

<style scoped lang="scss">
    .block {
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        cursor: grab;
    }

    .block:active {
        cursor: pointer;
        cursor: grabbing;
    }

    .sliderContainer {
        position: relative;
        text-align: center;
        height: 40px;
        width: 310px;
        line-height: 40px;
        background: #f7f9fa;
        color: #45494c;
        border: 1px solid #e4e7eb;
    }

    .sliderContainer_active .slider {
        height: 38px;
        top: -1px;
        border: 1px solid #1991FA;
    }

    .sliderContainer_active .sliderMask {
        height: 38px;
        border-width: 1px;
    }

    .sliderContainer_success .slider {
        height: 38px;
        top: -1px;
        margin-left: -1px;
        border: 1px solid #52CCBA;
        background-color: #52CCBA !important;
    }

    .sliderContainer_success .sliderMask {
        height: 38px;
        border: 1px solid #52CCBA;
        background-color: #D2F4EF;
    }

    .sliderContainer_success .sliderIcon {
        background-position: 0 0 !important;
    }

    .sliderContainer_fail .slider {
        height: 38px;
        top: -1px;
        border: 1px solid #f57a7a;
        background-color: #f57a7a !important;
    }

    .sliderContainer_fail .sliderMask {
        height: 38px;
        border: 1px solid #f57a7a;
        background-color: #fce1e1;
    }

    .sliderContainer_fail .sliderIcon {
        top: 14px;
        background-position: 0 -82px !important;
    }

    .sliderContainer_active .sliderText, .sliderContainer_success .sliderText, .sliderContainer_fail .sliderText {
        display: none;
    }

    .sliderMask {
        position: absolute;
        left: 0;
        top: 0;
        height: 40px;
        border: 0 solid #1991FA;
        background: #D1E9FE;
    }

    .slider {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        transition: background .2s linear;
        cursor: pointer;
        cursor: grab;
    }

    .slider:active {
        cursor: grabbing;
    }

    .slider:hover {
        background: #1991FA;
    }

    .slider:hover .sliderIcon {
        background-position: 0 -13px;
    }

    .sliderIcon {
        position: absolute;
        top: 15px;
        left: 13px;
        width: 14px;
        height: 12px;
        background: url(../../assets/images/back.jpg) 0 -26px;
        background-size: 34px 471px;
    }

    .refreshIcon {
        position: absolute;
        right: 0;
        top: 0;
        width: 34px;
        height: 34px;
        cursor: pointer;
        background: url(../../assets/images/back.jpg) 0 -437px;
        background-size: 34px 471px;
    }

    .captcha_model {
        background-color: white;

        .header {
            font-size: .18rem;
            padding: 2% 5%;
            border-bottom: 1px solid #ccc;
        }

        .content {

            .sliding-pictures {
                position: relative;

                i {
                    position: absolute;
                    right: 2%;
                    top: 3px;
                    z-index: 9;
                    font-size: 18px;
                }
            }
        }
    }


    .mask_layer_model {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        font-size: .13rem;
    }
    .refresh{
        font-size: 28px;color: #eee;text-shadow: rgba(0,0,0,0.4) 0.1em 0.1em 0.2em;
    }
</style>