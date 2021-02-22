<template>
    <div class="dateTime">
        <div class="dateTime_type" style="overflow:hidden;">
            <h3 class="h_title" style="padding-top: 0px">普通下拉</h3>
            <div class="col_row">
                <span class="label_title">单选正常时间</span>
                <date
                        :type="'radio'"
                        :defaultTime="false"
                        :showTime="false"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">单选正常时间赋值默认</span>
                <date
                        :type="'radio'"
                        :defaultTime="false"
                        :showTime="false"
                        :dateValue="'2022-10-11'"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">单选正常时间带默认当前时间</span>
                <date
                        :type="'radio'"
                        :defaultTime="true"
                        :showTime="false"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">单选正常时间(带时分秒)</span>
                <date
                        :type="'radio'"
                        :defaultTime="false"
                        :showTime="true"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">单选正常时间(带时分秒)默认当前时间</span>
                <date
                        :type="'radio'"
                        :defaultTime="true"
                        :showTime="true"
                        :dateValue="''"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">单选正常时间(带时分秒)默认赋值时间</span>
                <date
                        :type="'radio'"
                        :defaultTime="true"
                        :showTime="true"
                        :dateValue="'2022-10-11 12:20:30'"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">禁用当前日期之前日期(计算机时间)</span>
                <date
                        :type="'radio'"
                        :defaultTime="false"
                        :showTime="true"
                        :disableBeforeDate="true"
                        :dateValue="''"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">禁用当前日期之前日期(服务器时间)</span>
                <date
                        :type="'radio'"
                        :defaultTime="false"
                        :showTime="true"
                        :disableBeforeDate="true"
                        :dayServer="true"
                        :dateValue="''"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">显示当前时间（服务器时间）</span>
                <date
                        :type="'radio'"
                        :defaultTime="true"
                        :showTime="true"
                        :disableBeforeDate="true"
                        :dayServer="true"
                        :dateValue="''"
                        style="display: inline-block"></date>
            </div>
            <div style="width: 100%;clear:both;margin-bottom: 20px">
                <span>基本用法：<span style="color: #40a9ff">{{msg}}</span></span>
            </div>
        </div>

        <div class="dateTime_type" style="overflow: hidden">
            <h3 class="h_title">联动下拉</h3>
            <div class="col_row">
                <span class="label_title">多选正常时间</span>
                <date
                        :type="'multiple'"
                        :showTime="false"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">多选正常时间默认赋值给定时间</span>
                <date
                        :type="'multiple'"
                        :showTime="false"
                        :defaultTime="true"
                        :someDateValue="['2020-10-11','2021-10-11']"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">多选正常时间(带时分秒)</span>
                <date
                        :type="'multiple'"
                        :showTime="true"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span class="label_title">多选正常时间(带时分秒)默认赋值给定时间</span>
                <date
                        :type="'multiple'"
                        :showTime="true"
                        :defaultTime="true"
                        :someDateValue="['2020-10-11 12:20:30','2021-10-11 12:20:30']"
                        style="display: inline-block"></date>
            </div>
            <div class="col_row">
                <span>联动基本用法：<span style="color: #40a9ff">{{msg2}}</span></span>
            </div>
        </div>


        <a-table class="table" :columns="columns" :data-source="data" bordered>
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
        <a-table class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
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

</template>

<script>
    import date from "@/components/timeDate/date";

    export default {
        name: "index",
        components: {date},

        data() {
            const columns = [
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
            const data = [
                {
                    key: '121',
                    name: 'Url',
                    money: '获取服务器端时间url',
                    address: 'String',
                    optionalValue: '例如：www.baidu.com/a/b',
                    defalutValue: '""'
                },
                {
                    key: '122',
                    name: 'params',
                    money: '向后台传递的接口参数',
                    address: 'String | Objct',
                    optionalValue: '例如：{type:"123"}',
                    defalutValue: 'null'
                },
                {
                    key: '1',
                    name: 'Type',
                    money: '普通时间下拉或者联动时间下拉',
                    address: 'String',
                    optionalValue: 'radio | multiple',
                    defalutValue: 'radio'
                },
                {
                    key: '2',
                    name: 'defaultTime',
                    money: '是否显示默认时间',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '3',
                    name: 'dateValue',
                    money: '普通时间下拉回显值',
                    address: 'String',
                    optionalValue: '例如："2021-12-22"',
                    defalutValue: 'null'
                },
                {
                    key: '333',
                    name: 'someDateValue',
                    money: '联动时间下拉回显值',
                    address: 'Array',
                    optionalValue: '例如：["2021-10-22","2021-12-22"] 或 ["2021-10-22 12:22:12","2021-12-22 09:02:22"]',
                    defalutValue: 'null'
                },
                {
                    key: '4',
                    name: 'allowClear',
                    money: '是否显示清除按钮',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'true'
                },
                {
                    key: '5',
                    name: 'autofocus',
                    money: '自动获取焦点',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '6',
                    name: 'disabled',
                    money: '是否禁用',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '7',
                    name: 'placeholder',
                    money: '背景提示语',
                    address: 'String',
                    optionalValue: '请输入...',
                    defalutValue: '请选择时间'
                },
                {
                    key: '8',
                    name: 'size',
                    money: '输入框高度大小，large 高度为 40px，small 为 24px，默认是 32px',
                    address: 'String',
                    optionalValue: 'large | small | null',
                    defalutValue: 'null'
                },
                {
                    key: '9',
                    name: 'format',
                    money: '设置日期格式',
                    address: 'String',
                    optionalValue: 'YYYY-MM-DD | YYYY-MM-DD HH:ss:mm',
                    defalutValue: 'YYYY-MM-DD '
                },
                {
                    key: '10',
                    name: 'showTime',
                    money: '是否显示时分秒',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '11',
                    name: 'disableBeforeDate',
                    money: '是否禁用当前日期之前的日期',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '12',
                    name: 'dayServer',
                    money: '是否开启服务器默认时间',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '333a',
                    name: 'dateRender',
                    money: '自定义日期单元格的内容',
                    address: 'String',
                    optionalValue: '待开发',
                    defalutValue: '待开发'
                },
            ];
            const columnsEvents=[
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
            const dataEvents=[
                {
                    key: '1',
                    name: 'onChange',
                    money: '选择的时间发生变化的回调',
                    address: 'function(date: moment | string, dateString: string)，string为最后想要获取的数据',
                },
                {
                    key: '2',
                    name: 'ok',
                    money: '点击ok后触发的函数',
                    address: 'function()',
                },
                {
                    key: '3',
                    name: 'openChange',
                    money: '弹出日历和关闭日历的回调,',
                    address: 'function(status),status最后返回的为true|false',
                },
            ]
            return {
                data,
                columns,
                dataEvents,
                columnsEvents,
                msg:'  <date\n' +
                    '                        :type="\'radio\'"\n' +
                    '                        :defaultTime="false"\n' +
                    '                        :showTime="false"\n' +
                    '></date>',
                msg2:'<date\n' +
                    '                        :type="\'multiple\'"\n' +
                    '                        :showTime="false"\n' +
                    '                        ></date>'

            }
        },
    }
</script>
<style scoped lang="less">
    .dateTime {
        margin: 20px;
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
            width: 90%;

            .parameter {
                font-size: 22px;
            }
        }
    }
</style>