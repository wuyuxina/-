<template>
    <div style="margin: 20px">
        <div class="dateTime_type">
            <h3 class="h_titles" style="padding-top: 0px">1、普通单选下拉树</h3>
            <div class="tree_box">
                <select-tree
                        @change="change"
                ></select-tree>
            </div>
        </div>
        <div class="dateTime_type">
            <h3 class="h_titles" >2、不带复选框的多选效果</h3>
            <div class="tree_box">
                <select-tree
                        :multiple="true"

                        @change="change"
                ></select-tree>
            </div>
        </div>
        <div class="dateTime_type">
            <h3 class="h_titles" >3、带复选框和默认回显、选中效果的下拉树</h3>
            <div class="tree_box">
                <select-tree
                        :multiple="true"
                        :inputValue="values"
                        :treeCheckable="true"
                        @change="change"
                ></select-tree>
            </div>
        </div>
        <div class="dateTime_type">
            <h3 class="h_titles" >4、异步加载树单选</h3>
            <div class="tree_box">
                <select-tree
                        :multiple="false"
                        :treeCheckable="false"
                        :loadingData="true"
                        @change="change"
                ></select-tree>
            </div>
        </div>
        <div class="dateTime_type" style="margin-bottom: 30px">
            <h3 class="h_titles" >4、异步加载树多选</h3>
            <div class="tree_box">
                <select-tree
                        :multiple="true"
                        :inputValue="values2"
                        :treeCheckable="true"
                        :loadingData="true"
                        @change="change"
                ></select-tree>
            </div>
        </div>
        <div>
            <span>基本用法：<span style="color: #40a9ff">{{msg}}</span></span>
        </div>
        <a-table size="middle" class="table" :columns="columns" :data-source="data" bordered>
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
        <a-table size="middle" class="table" :columns="columnsEvents" :data-source="dataEvents" bordered>
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
        <a-table size="middle" class="table" :columns="columns" :data-source="dataNode" bordered>
            <template #name="{ text }">
                <a>{{ text }}</a>
            </template>
            <template #title="currentPageData">
                <span class="parameter">TreeNode props</span>
            </template>
            <template #footer="currentPageData">
                <span class="parameter">End</span>
            </template>
        </a-table>
    </div>
</template>

<script>
    import selectTree from "@/components/selectTree/selectTree";
    export default {
        name: "index",
        components:{
            selectTree
        },
        data(){
            let columns = [
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
            let data = [
                {
                    key: '1',
                    name: 'Url',
                    money: '调用后台树接口的Url地址',
                    address: 'String',
                    optionalValue: '例如：www.baidu.com/a/b',
                    defalutValue: '""'
                },
                {
                    key: '111',
                    name: 'params',
                    money: '调用后台树接口传递的参数',
                    address: 'String | Objct',
                    optionalValue: '{id:1,type:"tree"} | "12"',
                    defalutValue: 'null'
                },
                {
                    key: '2',
                    name: 'inputValue',
                    money: '回显或者默认选中的值',
                    address: 'Array',
                    optionalValue: 'id数组',
                    defalutValue: '[]'
                },
                {
                    key: '3',
                    name: 'allowClear',
                    money: '是否显示清除全部按钮',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'true'
                },
                {
                    key: '4',
                    name: 'defaultValue',
                    money: '指定默认选中的条目',
                    address: 'Number',
                    optionalValue: '功能待确认',
                    defalutValue: '功能待确认'
                },
                {
                    key: '5',
                    name: 'disabled',
                    money: '是否禁用',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '6',
                    name: 'dropdownClassName',
                    money: '下拉菜单的 className 属性 (class名称)',
                    address: 'String',
                    optionalValue: '"tree"',
                    defalutValue: '""'
                },
                {
                    key: '7',
                    name: 'dropdownMatchSelectWidth',
                    money: '宽度和指定浏览器的宽度一边高',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'true'
                },
                {
                    key: '8',
                    name: 'maxTagCount',
                    money: '下拉最多显示多少个',
                    address: 'Number',
                    optionalValue: 'number',
                    defalutValue: '100'
                },
                {
                    key: '9',
                    name: 'multiple',
                    money: '是否允许多选',
                    address: 'Boolean',
                    optionalValue: 'Boolean',
                    defalutValue: 'false'
                },
                {
                    key: '10',
                    name: 'placeholder',
                    money: '下拉框的背景提示语',
                    address: 'String',
                    optionalValue: 'string',
                    defalutValue: '请输入'
                },
                {
                    key: '11',
                    name: 'treeDataSimpleMode',
                    money: '使用简单数据格式',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '12',
                    name: 'searchPlaceholder',
                    money: '请输入搜索内容',
                    address: 'String',
                    optionalValue: 'string',
                    defalutValue: '请输入搜索内容'
                },
                {
                    key: '13',
                    name: 'showSearch',
                    money: '在下拉中显示搜索框(仅在单选模式下生效)',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },      {
                    key: '14',
                    name: 'size',
                    money: '选择框大小，可选 large small default',
                    address: 'String',
                    optionalValue: 'string',
                    defalutValue: 'default'
                },
                {
                    key: '15',
                    name: 'treeCheckable',
                    money: '是否显示复选框',
                    address: 'Object',
                    optionalValue: 'object',
                    defalutValue: "{children:'children', title:'title', key:'key', value: 'id' }"
                },
                {
                    key: '16',
                    name: 'replaceFields',
                    money: '将后台返回的数据和渲染树需要的数据进行调整',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '17',
                    name: 'treeDefaultExpandAll',
                    money: '默认展开的树节点',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '18',
                    name: 'treeDefaultExpandedKeys',
                    money: '设置展开的树节点',
                    address: 'Boolean|string[]',
                    optionalValue: '功能待确认',
                    defalutValue: 'false'
                },
                {
                    key: '19',
                    name: 'treeNodeFilterProp',
                    money: '输入项过滤对应的 treeNode 属性',
                    address: 'String',
                    optionalValue: 'Node中的节点字段',
                    defalutValue: 'title'
                },
                {
                    key: '20',
                    name: 'treeNodeLabelProp',
                    money: '作为回显显示的 prop 设置',
                    address: 'String',
                    optionalValue: 'Node中的节点字段',
                    defalutValue: 'title'
                },
                {
                    key: '21',
                    name: 'dropdownStyle',
                    money: '下拉菜单的样式',
                    address: 'Object',
                    optionalValue: 'object',
                    defalutValue: "{ maxHeight: '400px', overflow: 'auto' }"
                },
                {
                    key: '22',
                    name: 'treeNodeLabelProp',
                    money: '是否开启懒加载',
                    address: 'Boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },


            ];
            let dataNode = [
                {
                    key: '1',
                    name: 'selectable',
                    money: '是否可选',
                    address: 'boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'true'
                },
                {
                    key: '2',
                    name: 'checkable',
                    money: '当树为 checkable 时，设置独立节点是否展示 Checkbox',
                    address: 'boolean',
                    optionalValue: 'true | false',
                    defalutValue: '-'
                },
                {
                    key: '3',
                    name: 'disableCheckbox',
                    money: '当树为 checkable 时，设置独立节点是否展示 Checkbox',
                    address: 'boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '4',
                    name: 'disabled',
                    money: '是否禁用',
                    address: 'boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '5',
                    name: 'isLeaf',
                    money: '是否是叶子节点',
                    address: 'boolean',
                    optionalValue: 'true | false',
                    defalutValue: 'false'
                },
                {
                    key: '6',
                    name: 'key',
                    money: '此项必须设置（其值在整个树范围内唯一',
                    address: 'string | number',
                    optionalValue: '',
                    defalutValue: '-'
                },
                {
                    key: '7',
                    name: 'title',
                    money: '树节点显示的内容',
                    address: 'string | slot',
                    optionalValue: '',
                    defalutValue: '-'
                },
                {
                    key: '8',
                    name: 'value',
                    money: '默认根据此属性值进行筛选（其值在整个树范围内唯一）',
                    address: 'string',
                    optionalValue: 'string',
                    defalutValue: '-'
                },
                {
                    key: '9',
                    name: 'value',
                    money: '使用 treeData 时，可以通过该属性配置支持 slot 的属性，如 scopedSlots: { title: "XXX"}',
                    address: 'object',
                    optionalValue: 'object',
                    defalutValue: '-'
                },
            ]
            let columnsEvents = [
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
            let dataEvents = [
                {
                    key: '1',
                    name: 'change',
                    money: '选中树节点时调用此函数',
                    address: 'function({value, label, extra})',
                },
                {
                    key: '2',
                    name: 'search',
                    money: '文本框值变化时回调',
                    address: 'function(value: string)',
                },
                {
                    key: '3',
                    name: 'select',
                    money: '被选中时调用',
                    address: 'function({value, node, extra})',
                },
                {
                    key: '4',
                    name: 'treeExpand',
                    money: '展开节点时调用',
                    address: 'unction(expandedKeys)',
                },
            ]
            return{
                columns,
                data,
                columnsEvents,
                dataEvents,
                dataNode,
                msg:'<select-tree @change="change"></select-tree>',
                values:['0-0-0'],
                values2:[1],
            }
        },
        methods:{
            change(){},
        }
    }
</script>

<style scoped lang="less">
    .dateTime_type {

        th.column-money,
        td.column-money {
            text-align: right !important;
        }

        .h_titles {
            font-size: 16px;
            font-weight: normal;
            color: #333;
            padding-top: 20px;
            padding-bottom: 5px;
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
        .tree_box{
            width: 300px;
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