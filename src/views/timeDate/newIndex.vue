<template>
    <div>
        <div class="dateTime_type">
            <div>
            <h3 class="h_titles" style="padding-top: 0px">1、普通时间</h3>
            <date-show
            ></date-show>
           </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">2、显示全部</h3>
                <date-show
                        :type="'all'"
                        :splitStr="'-'"
                        :kanjiShow="false"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">3、只显示年月日</h3>
                <date-show
                        :type="'YYYY-MM-DD'"
                        :splitStr="'-'"
                        :kanjiShow="false"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">4、只显示年月</h3>
                <date-show
                        :type="'YYYY-MM'"
                        :splitStr="'-'"
                        :kanjiShow="false"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">5、只显示时分秒</h3>
                <date-show
                        :type="'HH:mm:ss'"
                        :splitStr="'-'"
                        :kanjiShow="false"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">6、只显示时分</h3>
                <date-show
                        :type="'HH:mm'"
                        :splitStr="'-'"
                        :kanjiShow="false"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">7、年月日+时分</h3>
                <date-show
                        :type="'YYYY-MM-DD HH:mm'"
                        :splitStr="'-'"
                        :kanjiShow="false"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">8、汉字显示形式</h3>
                <date-show
                        :type="'YYYY-MM-DD HH:mm:ss'"
                        :splitStr="'-'"
                        :kanjiShow="true"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">9、时分秒也显示汉字</h3>
                <date-show
                        :type="'YYYY-MM-DD HH:mm:ss'"
                        :splitStr="'-'"
                        :kanjiShow="'hanziTime'"
                ></date-show>
            </div>
            <div>
                <h3 class="h_titles" style="padding-top: 0px">10、显示当年月份的第几周</h3>
                <date-show
                        :type="'all'"
                        :showNearlyWeek="true"
                        :splitStr="'-'"
                        :kanjiShow="'hanziTime'"
                        @change="onChange"
                ></date-show>
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
    </div>
</template>

<script>
    //引入时间组件
    import dateShow from "../../components/timeDate/dateShow";

    export default {
        name: "newIndex",
        data(){
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
            const data=[
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
                    key: '123',
                    name: 'type',
                    money: '显示时间的类型',
                    address: 'String',
                    optionalValue: '例如"YYYY-MM-DD HH:mm:ss"，"YYYY-MM-DD"，"HH:mm:ss"，"YYYY-MM"，"YYYY"，"MM-DD"，"HH:mm"，"all"',
                    defalutValue: 'all'
                },
                {
                    key: '124',
                    name: 'splitStr',
                    money: '年月日的分割类型',
                    address: 'String',
                    optionalValue: '例如："-"，"/"',
                    defalutValue: '-'
                },
                {
                    key: '126',
                    name: 'kanjiShow',
                    money: '是否显示汉字类型,如果为true，将默认替换splitStr内容',
                    address: 'Boolean | string',
                    optionalValue: 'true | false | "hanziTime"',
                    defalutValue: 'false'
                },
                {
                    key: '127',
                    name: 'showNearlyWeek',
                    money: '是否显示当前月份的第几周',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
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
                    name: 'change',
                    money: '获取当前显示的时间',
                    address: 'change(结果)',
                },
            ]
            return {
                data,
                columns,
                dataEvents,
                columnsEvents,
            }
        },
        methods:{
            onChange(msg){
            },
        },
        components: {
            dateShow
        },
    }
</script>

<style scoped lang="less">
    .dateTime_type {
        padding: 20px;
        .h_titles {
            font-size: 16px;
            font-weight: normal;
            color: #333;
            padding-top: 20px;
            padding-bottom: 5px;
        }
    }
    .table {
        margin-top: 30px;
        width: 70%;

        .parameter {
            font-size: 19px;
        }
    }
</style>