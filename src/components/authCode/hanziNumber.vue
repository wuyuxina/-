<!--
@author: wuyuxin
@description: 根据汉字选择数字的验证码
@time: 2020/01/19
参数说明：
/**具体内容请想看props内部传递数据说明*/
-->

<template>
    <div class="hanziNumber">
        <h3 class="title">请依次点击<span>{{chars}}</span></h3>
        <ul class="Keypad_ul">
            <li class="keypad_li" v-for="item in 9">
                <span :class="{'active':indexActive.indexOf(item)>=0}" @click="showCilck?numberActive(item):undefined">{{item}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "hanziNumber",
        data() {
            return {
                indexActive: [],
                hanzi: '壹贰叁肆伍陆柒捌玖',//可能出现的1到9数字繁体
                chars: '',////需要显示的数字繁体
                showCilck: true,//选择的长度大于给定的数字
            }
        },
        created() {
            this.newStr(3)
        },
        methods: {
            /**获取点击的数字**/
            numberActive(index) {
                let ids = this.indexActive.indexOf(index);
                if (ids >= 0) {
                    console.log(ids);
                    //如果包含了该ID，则删除（单选按钮由选中变为非选中状态）
                    this.indexActive.splice(ids, 1);
                } else {
                    //选中该按钮
                    if (this.indexActive.length < 3) {
                        this.indexActive.push(index)
                        this.showCilck = true
                    } else {
                        this.showCilck = false
                    }
                }
                console.log(this.indexActive);
            },
            /**生成字符串**/
            newStr(leng) {
                // 大写字母、小写字母、数字能出现的情况
                for (var i = 0; i < leng; i++) {
                    this.comp(this.hanzi)
                }
            },
            //生成字符串的内部方法
            comp(str) {
                let comp = str.charAt(parseInt(Math.random() * (str.length)))
                if (this.chars.indexOf(comp) >= 0) {
                    this.comp(this.hanzi)
                } else {
                    this.chars += comp
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .hanziNumber {
        width: 300px;

        .title {
            line-height: 28px;
            font-size: 15px;

            span {
                margin-left: 15px;
                letter-spacing: 3px;
                line-height: 28px;
                font-size: 14px;
                font-weight: bold;
            }
        }

        .Keypad_ul {
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            flex-flow: wrap;

            li {
                width: 33%;
                display: block;
                height: 35px;
                margin-bottom: 10px;

                span {
                    text-align: center;
                    height: 35px;
                    line-height: 35px;
                    border-radius: 50%;
                    background: #40a9ff;
                    width: 35px;
                    display: block;
                    margin: auto;
                    color: #fff;
                    cursor: pointer;
                }

                .active {
                    background: #9a6e3a;
                }
            }
        }
    }
</style>