<!--
@author: wuyuxin
@description: 数字字母验证码
@time: 2020/01/19
参数说明：
idiomWidth----------验证码div的宽度和底部提示语的宽度，默认为300
idiomHeight----------验证码div的高度，默认为150
idiomBotHeight----------底部提示语的高度，默认为40
idiomSize----------验证码字体大小，默认为30px
idiomMsg----------验证码显示的成语，最少两个才会回显
/**具体内容请想看props内部传递数据说明*/
-->


<template>
    <div>
        <div id="box" :style="{width:idiomWidth-2+'px',height:idiomHeight+'px'}">
            <div class="bg-blur"></div>
        </div>
        <div id="minbox"
             :style="{width:idiomWidth-2+'px',height:idiomBotHeight+'px',lineHeight:idiomBotHeight+'px'}"></div>
    </div>
</template>

<script>
    import $ from 'jquery'

    export default {
        name: "idiomCode",
        props: {
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
            return {}
        },
        mounted() {
            this.idiomCodeStrat()
        },
        methods: {
            idiomCodeStrat() {

                let verify = []
                let divs=null
                let arr = ["新春快乐", "阖家快乐", "恭贺新禧", "万事如意", "张灯结彩", "恭喜发财", "假期愉快", "今晚吃鸡"];
                //随机词汇表
                if(this.idiomMsg.length<=2){
                    arr=this.idiomMsg.concat(arr)
                }else{
                    arr=this.idiomMsg
                }

                //创建随机成语
                let math = arr[Math.floor(Math.random() * (arr.length - 1))];

                $('#minbox').html(`请依次点击: <span>${math}</span>`)

                //创建一个位置数组
                let place = [{left: '0px', top: '0px'}, {left: this.idiomWidth / 2, top: '0px'}, {
                    left: '0px',
                    top: this.idiomHeight / 2
                }, {left: this.idiomWidth / 2, top: this.idiomHeight / 2}]

                // var left=Math.floor(Math.random()*(boxs[0].offsetWidth-51)) ;
                // 			var top=Math.floor(Math.random()*(boxs[0].offsetHeight-51));

                //随机打乱位置数组
                place.sort(() => {
                    return Math.random() - 0.5
                })

                //创建一个数组用于与最终结果验证


                //遍历随机成语并创建标签
                for (var i in math) {

                    verify.push(i)
                    //创建随机左边位置
                    let left = Math.floor(Math.random() * (this.idiomWidth / 3))
                    let top = Math.floor(Math.random() * (this.idiomHeight / 4));

                    //创建存放span的div对象
                    divs = $('<div class="fl"></div>')
                    //给div定位
                    divs.css({
                        left: place[i].left,
                        top: place[i].top,
                        width: this.idiomWidth / 2,
                        height: this.idiomHeight / 2,
                        position: 'absolute',
                        cursor: 'pointer',
                    })
                    //创建储存文字的span标签
                    let span = $(`<span>${math[i]}</span>`)
                    //随机span的位置
                    span.css({
                        left: left + 'px',
                        top: top + 'px',
                        fontSize: this.idiomSize,
                        position: 'absolute',
                        zIndex: 4,
                        color: 'blueviolet',
                        fontWeight: 'bold',
                        transition: 'all 2s',
                    })

                    span.data('index', i);
                    span.data('judge', 'true');
                    divs.append(span);
                    $('#box').append(divs)

                }

                //span点击事件
                let cspan = []
                $('#box .fl span').click(function () {
                    if ($(this).data('judge') == 'true') {
                        cspan.push($(this).data('index'))
                        $(this).data('judge', 'false')
                    } else {
                    }
                })

                let a = 0
                //大盒子点击事件,用于生成小绿点
                var that=this
                $('#box').click(function (event) {
                    a++
                    if (a <= 4) {
                        let rad = $(`<div class='radio'>${a}</div>`)
                        rad.css({
                            left: event.pageX - $(this).offset().left - 15 + 'px',
                            top: event.pageY - $(this).offset().top - 15 + 'px',
                            backgroundColor: '#1abd6c',
                            width: '30px',
                            height: '30px',
                            textAlign: 'center',
                            borderRadius: ' 50%',
                            position: 'absolute',
                            zIndex: '10',
                            lineHeight: '30px',
                            color: 'white',
                        })
                        $(this).append(rad)
                        if (a == 4) {
                            if (cspan.join() == verify.join()) {
                                $('#minbox').addClass('size')
                                $('#box').unbind("click");
                                $('#minbox').html('验证成功')
                                that.$emit('codePrice', '验证成功')//将最后的值传递给父页面
                            } else {
                                $('#minbox').html('验证失败')
                                that.$emit('codePrice', '验证失败')//将最后的值传递给父页面
                                $('#minbox').css('color', 'red')
                                setTimeout(() => {
                                    cspan=[];
                                    verify=[];
                                    $('#box').find('.fl').remove()
                                    $('#box').find('.radio').remove()
                                    $('#box').unbind("click");
                                    that.idiomCodeStrat()
                                }, 1000)
                            }
                            a = 0
                        }
                    }

                })


            },
        },
    }
</script>

<style scoped>
    #box {
        border: #009aff solid 1px;
        background-repeat: no-repeat;
        background-size: 100%;
        position: relative;
        transition: all 2s;
        border-radius: 3px 3px 0px 0px;
    }

    #box .fl {

        width: 200px;
        height: 100px;
        position: absolute;

    }

    #box .radio {
        background-color: #1abd6c;
        color: #fff;
        z-index: 9999;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius: 50%;
        position: absolute;
        z-index: 10;
        line-height: 30px;
        color: white;
    }

    #box span {
        font-size: 40px;
        position: absolute;
        z-index: 4;
        color: blueviolet;
        font-weight: bold;
        transition: all 2s;
    }

    #box span:hover {
        font-family: 'Audiowide';
        text-align: center;
        color: #E0FFFF;
        font-size: 50px;
        transition: all 1.5s ease;
        color: #fff;
        animation: Glow 1.5s ease infinite alternate;
        margin-bottom: 30px;
    }

    @keyframes Glow {
        from {
            text-shadow: 0 0 10px #fff,
            0 0 20px #fff,
            0 0 30px #fff,
            0 0 40px #C71585,
            0 0 70px #C71585,
            0 0 80px #C71585,
            0 0 100px #C71585,
            0 0 150px #C71585;

            /* text-shadow: 0 0 10px red; */
        }
        to {
            text-shadow: 0 0 5px #fff,
            0 0 10px #fff,
            0 0 15px #fff,
            0 0 20px #C71585,
            0 0 35px #C71585,
            0 0 40px #C71585,
            0 0 50px #C71585,
            0 0 75px #C71585;

            /* text-shadow: 0 0 10px blue; */
        }
    }

    #minbox {
        border: #009aff solid 1px;
        text-align: center;
        font-size: 15px;
        color: #565656;
        /*font-weight: bold;*/
        transition: all 2s;
        border-radius: 0px 0px 3px 3px;
        background-color: white;
    }

    #minbox span {
        color: aqua;
        transition: all 2s;
    }

    .size {
        color: #009aff !important;
        /*animation: Alow 1.5s ease infinite alternate;*/
    }

    @keyframes Alow {
        from {
            text-shadow: 0 0 10px #fff,
            0 0 20px #fff,
            0 0 30px #fff,
            0 0 40px #00FA9A,
            0 0 70px #00FA9A,
            0 0 80px #00FA9A,
            0 0 100px #00FA9A,
            0 0 150px #00FA9A;

            /* text-shadow: 0 0 10px red; */
        }
        to {
            text-shadow: 0 0 5px #fff,
            0 0 10px #fff,
            0 0 15px #fff,
            0 0 20px #00FA9A,
            0 0 35px #00FA9A,
            0 0 40px #00FA9A,
            0 0 50px #00FA9A,
            0 0 75px #00FA9A;

            /* text-shadow: 0 0 10px blue; */
        }
    }

    .bg-blur {
        background-image: url("./assets/image/t1.png");
        width: 100%;
        height: 100%;
        /* background-position: center; */
        background-size: cover;
        /* -webkit-filter: blur(15px);
        -moz-filter: blur(15px);
        -o-filter: blur(15px);
        -ms-filter: blur(15px); */
        filter: blur(5px);
    }

</style>