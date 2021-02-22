<!--
@author: wuyuxin
@description: 时间显示组件封装
@time: 2020/01/19
参数说明：
/**具体内容请想看props内部传递数据说明*/
-->
<template>
    <div>
        <!-- date 为年月日 week为周几  time为时分秒-->
        <ul class="date_ul">
            <li v-if="showDate">{{date}}</li>
            <li v-if="showWeek">{{week}}</li>
            <li v-if="showNearlyWeeks">{{NearlyWeek}}</li>
            <li v-if="showTime">{{time}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            Url: {//后台路径
                type: String,
                default: '',
            },
            params: {//后台接口参数
                type: Object,
                default: {},
            },
            type: {//显示时间的类型
                type: String,
                default: 'YYYY-MM-DD HH:mm:ss',
            },
            splitStr: {//年月日的分割类型
                type: String,
                default: '-',
            },
            kanjiShow: {
                //是否显示汉字类型 比如2021年12月22日 5时46分27秒
                //如果为true，将默认替换splitStr内容
                default: false,
            },
            showNearlyWeek: {//是否显示当前月份的第几周
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                date: '',//年月日
                week: '',//星期几
                NearlyWeek: '',//第几周
                time: '',//时分秒
                //年月日，周，时分秒，本月第几周是否显示
                //本月第几周为父组件传递过来的数据
                showDate: true,
                showWeek: true,
                showNearlyWeeks: this.showNearlyWeek,
                showTime: true,
            };
        },
        mounted() {
            this.getShow();
            //判断是否需要显示当前月的第几周
            if (this.showNearlyWeek) {
                this.getWeeks();
            }
            //每一秒钟重新获取一次当前的时间
            this.timer = setInterval(() => {
                this.getShow();
                if (this.showNearlyWeek) {
                    this.getWeeks();
                }
                //把时间传递给父集
                this.$emit('change', this.onChange())
            }, 1000)
        },
        methods: {
            /**获取年月日**/
            getdate(str) {
                let typeStr = str;
                //定义new date()，获取年月日
                let time = new Date();
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let day = time.getDate();
                //处理完最后的年月日时间 this.date
                //根据类型判断显示类型
                if (!this.kanjiShow) {//是否显示中文类型的年月日（显示）
                    if (typeStr == 'YYYY-MM') {
                        this.date = year + this.splitStr + month
                    } else if (typeStr == 'YYYY') {
                        this.date = year
                    } else if (typeStr == 'MM-DD') {
                        this.date = month + this.splitStr + day
                    } else {
                        this.date = year + this.splitStr + month + this.splitStr + day
                    }
                } else if (this.kanjiShow) {//是否显示中文类型的年月日（不显示）
                    if (typeStr == 'YYYY-MM') {
                        this.date = year + '年' + month + '月'
                    } else if (typeStr == 'YYYY') {
                        this.date = year + '年'
                    } else if (typeStr == 'MM-DD') {
                        this.date = month + '月' + day + '日'
                    } else {
                        this.date = year + '年' + month + '月' + day + '日'
                    }
                }

            },
            /**获取星期几**/
            getWeek() {
                let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                let time = new Date();
                let week = weeks[time.getDay()];
                //处理完最后的星期的时间 this.week
                this.week = week;
            },
            /**获取当月的第几周**/
            getWeeks() {
                //定义new date()，获取年月日
                let time = new Date();
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let day = time.getDate();
                let weeks = this.getYearWeek(year, month, day)
                this.NearlyWeek = '第' + weeks.getWeek + '周';
            },
            /**获取时分秒**/
            getTime(str) {
                let typeStr = str
                //定义new date()，获取时分秒
                let time = new Date();
                let hour = time.getHours();
                let minutes = time.getMinutes();
                var second = time.getSeconds();
                //如果时分秒小于10的话，就在前面添加一个0
                if (hour < 10) {
                    hour = '0' + hour
                }
                if (minutes < 10) {
                    minutes = '0' + minutes
                }
                if (second < 10) {
                    second = '0' + second
                }
                //处理完最后的时分秒时间 this.time
                if (!this.kanjiShow || this.kanjiShow == true) {//是否显示中文类型的时分秒（显示）
                    if (typeStr == 'HH:mm') {
                        this.time = hour + ':' + minutes
                    } else {
                        this.time = hour + ':' + minutes + ':' + second
                    }
                } else if (this.kanjiShow == 'hanziTime') {//是否显示中文类型的时分秒（不显示）
                    if (typeStr == 'HH:mm') {
                        this.time = hour + '时' + minutes + '分'
                    } else {
                        this.time = hour + '时' + minutes + '分' + second + '秒'
                    }
                }


            },
            /**获取当前日期是当前月份的第几周**/
            getYearWeek(a, b, c) {
                /**
                 3         * a = d = 当前日期
                 4         * b = 6 - w = 当前周的还有几天过完(不算今天)
                 5         * a + b 的和在除以7 就是当天是当前月份的第几周
                 6         */
                var date = new Date(a, parseInt(b) - 1, c),
                    w = date.getDay(),
                    d = date.getDate();
                if (w == 0) {
                    w = 7;
                }
                var config = {
                    getMonth: date.getMonth() + 1,
                    getYear: date.getFullYear(),
                    getWeek: Math.ceil((d + 6 - w) / 7),
                }
                return config;
            },
            /**显示的具体内容(时间格式)**/
            getShow() {
                //按照给定的 ‘YYYY-MM-DD HH:mm:ss’不同类型，判断显示时间的类型
                if (this.type == 'YYYY-MM-DD HH:mm:ss' || !this.type) {
                    this.getdate();
                    this.getTime();
                } else if (this.type == 'YYYY-MM-DD') {
                    this.getdate();
                } else if (this.type == 'YYYY-MM-DD HH:mm') {
                    this.getdate('YYYY-MM-DD');
                    this.getTime('HH:mm');
                } else if (this.type == 'YYYY-MM') {
                    this.getdate('YYYY-MM');
                } else if (this.type == 'YYYY') {
                    this.getdate('YYYY');
                } else if (this.type == 'MM-DD') {
                    this.getdate('MM-DD');
                } else if (this.type == 'HH:mm:ss') {
                    this.getTime();
                } else if (this.type == 'HH:mm') {
                    this.getTime('HH:mm');
                } else if (this.type == 'all') {
                    this.getdate();
                    this.getWeek();
                    this.getTime();
                }

            },
            //获取当前显示的内容
            onChange() {
                return this.date + this.week + this.NearlyWeek + this.time;
            },
        },
        //当结束当前页面销毁定时器
        beforeDestroy() {
            //离开页面清除定时器
            if (this.timer) {
                clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
            }
        }
    };
</script>

<style scoped lang="less">
    .date_ul {
        display: inline-block;
        line-height: 27px;
        color: #40a9ff;

        li {
            display: inline-block;
            padding-right: 5px;

            &:last-child {
                padding-right: 0px;
            }
        }

    }
</style>