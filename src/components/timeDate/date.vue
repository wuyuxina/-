<!--
@author: wuyuxin
@description: 时间下拉组件的封装
@time: 2020/01/19
参数说明：
/**具体内容请想看props内部传递数据说明*/
-->
<template>
    <div>
        <a-date-picker
                v-if="type=='radio'"
                v-model:value="changeDateValue"
                :allowClear="allowClear"
                :autofocus="autofocus"
                :disabled="disabled"
                :size="size"
                :format="formats"
                :showTime="showTime"
                :disabled-date="disabledDate"
                :showToday="showTodays"
                :placeholder="placeholder"
                @calendarChange="calendarChange"
                @change="onChange"/>
        <a-range-picker
                v-if="type=='multiple'"
                v-model:value="changesomeDateValue"
                :allowClear="allowClear"
                :autofocus="autofocus"
                :disabled="disabled"
                :size="size"
                :defaultPickerValue="defaultPickerValue"
                :showToday="showTodays"
                :placeholder="placeholder"
                @calendarChange="calendarChange"
                @change="onChange"
                @ok="ok"
                @openChange="openChange"
                :disabled-date="disabledDate"
                :show-time="showTime"
                :format="formats"
        />
    </div>
</template>

<script>
    import moment from 'moment';
    import {post} from "../../api/request";

    export default {
        name: "date",
        props: {
            Url: { //后台接口地址
                type: String,
                default: ''
            },
            params: {// 后台接口参数
                default: null,
            },
            type: { // 展示的类型，是单显，还是联动显示
                type: String,
                default: 'radio'
            },
            defaultTime: {//是否显示默认时间
                type: Boolean,
                default: false,
            },
            dateValue: { //回显的时间
                type: String,
                default: function () {
                    return null; //当前时间
                }
            },
            allowClear: {//	是否显示清除按钮
                type: Boolean,
                default: true
            },
            autofocus: {//自动获取焦点
                type: Boolean,
                default: false
            },
            dateRender: {//使用 dateRender 可以自定义日期单元格的内容和样式。
                typeLiteral: String,
                default: ''
            },
            disabled: {//是否禁用
                type: Boolean,
                default: false
            },
            placeholder: {//渲染时间组件的id
                type: String,
                default: '请选择时间'
            },
            size: {//输入框大小，large 高度为 40px，small 为 24px，默认是 32px
                type: String,
                default: null
            },
            disabledTime: {//不可选择的时间
                type: String,
                default: 'date'
            },
            format: {//设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 moment.js
                default: 'YYYY-MM-DD'
            },
            defaultValue: {
                default: function () {
                    return null
                }
            },
            showTime: {//渲染时间组件的id
                type: Boolean,
                default: false
            },
            showToday: {//渲染时间组件的id
                type: Boolean,
                default: true
            },
            defaultPickerValue: {//渲染时间组件的id
                default: () => {
                    return ''
                }
            },
            someDateValue: {//带时分秒回显的时间字段
                type: String,
                default: function () {
                    return null; //当前时间
                }
            },
            disableBeforeDate: {//禁用当前日期之前的日期
                type: Boolean,
                default: false
            },
            dayServer: {//是否开启服务器时间
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                changeDateValue: null,//单下拉的值
                changesomeDateValue: null,//多下拉的值
                formats: this.format, //父级传过来的时间格式
                showTodays: this.showToday,//是否显示获取当前时间按钮
                dateServer: '2021-01-15 12:22:03',//服务器时间
            }
        },
        created() {
            this.showDfauTime()
            this.api()
        },
        methods: {
            moment,
            /**获取服务器时间的API**/
            api() {
                post(this.Url, this.params).then(res => {
                    if (res.code === 200) {
                        console.log(res)
                    } else {

                    }
                })
            },
            /**功能待确认开发**/
            calendarChange() {
                console.log(23432432, this.changeDateValue);
            },
            /**时间配置操作内容**/
            showDfauTime() {
                //判断时间格式
                if (this.showTime) {
                    this.formats = 'YYYY-MM-DD HH:mm:ss';
                } else {
                    this.formats = 'YYYY-MM-DD';
                }
                if (this.dayServer) {
                    this.showTodays = false;//如果显示服务器的时间，那么取消插件的自动获取当前时间
                }
                //是否默认展示当前时间
                if (this.dateValue == null || this.dateValue == '') {
                    if (this.defaultTime) {
                        if (this.dayServer) {
                            this.changeDateValue = moment(this.dateServer, this.formats)
                        } else {
                            this.changeDateValue = moment(this.getCurrentData(), this.formats)
                        }

                    } else {
                        this.changeDateValue = this.dateValue;
                    }
                } else {
                    if (this.showTime) {
                        this.changeDateValue = moment(this.dateValue, this.formats)
                    } else {
                        this.changeDateValue = moment(this.dateValue, this.formats)
                    }

                }

                if (this.someDateValue == null || this.someDateValue == '') {
                    // if(this.defaultTime){
                    //     this.changesomeDateValue=this.someDateValue;
                    // }else{
                    //     this.changesomeDateValue=this.someDateValue;
                    // }
                } else {
                    if (this.showTime) {
                        this.changesomeDateValue = [moment(this.someDateValue[0], 'YYYY-MM-DD HH:ss:mm'), moment(this.someDateValue[1], 'YYYY-MM-DD HH:ss:mm')]
                    } else {
                        this.changesomeDateValue = [moment(this.someDateValue[0], 'YYYY-MM-DD'), moment(this.someDateValue[1], 'YYYY-MM-DD')]
                    }

                }


            },
            /**对当前时间进行处理**/
            getCurrentData() {
                return new Date().toLocaleString();
            },
            range(start, end) {
                const result = [];
                for (let i = start; i < end; i++) {
                    result.push(i);
                }
                return result;
            },
            /**选择下拉时间被触发**/
            onChange(date, string) {
                console.log('oncahnge', date);
                console.log('oncahnge', string);
            },
            /**点击ok按钮是时候触发**/
            ok() {
                this.$emit('ok')
            },
            /**打开时间下拉的时候触发**/
            openChange(status) {
                console.log('statusstatus', status)
            },
            /**对时间进行限制   目前缺少向日期之后进行限制**/
            disabledDate(current) {
                if (this.disableBeforeDate) {
                    //今天之前的年月日不可选，不包括今天
                    // return current && current < moment().endOf('day');// 当天之前的不可选，包括当天
                    // return current && current <moment().subtract(1, "days"); //当天之前的不可选，不包括当天
                    // return current && current < moment('2020-12-15').endOf('day');// 2020-12-15之前的不可选，包括当天
                    if (this.dayServer) {
                        // return current && current < moment(this.dateServer).subtract(1, "day");
                        return current && current < moment(this.dateServer).subtract(1, "days")
                    } else {
                        return current < moment().subtract(1, 'day')
                    }
                } else {

                }
                // Can not select days before today and today
                // return current && current < moment().endOf('day');
            },
            //以下两个方法是否后续会派上用途
            disabledRangeTime(_, type) {
                if (type === 'start') {
                    return {
                        disabledHours: () => this.range(0, 60).splice(4, 20),
                        disabledMinutes: () => this.range(30, 60),
                        disabledSeconds: () => [55, 56],
                    };
                }
                return {
                    disabledHours: () => this.range(0, 60).splice(20, 4),
                    disabledMinutes: () => this.range(0, 31),
                    disabledSeconds: () => [55, 56],
                };
            },
            disabledDateTime() {
                return {
                    disabledHours: () => this.range(0, 24).splice(4, 20),
                    disabledMinutes: () => this.range(30, 60),
                    disabledSeconds: () => [55, 56],
                };
            },

        },
    }
</script>

<style scoped>

</style>