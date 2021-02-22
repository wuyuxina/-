<!--
@author: wuyuxin
@description: 下拉树组件封装
@time: 2020/01/19
参数说明：
/**具体内容请想看props内部传递数据说明*/
-->
<template>
    <div>
        <a-tree-select
                :class="'a_tree_select'+multiple"
                :url="url"
                :allowClear="allowClear"
                :defaultValue="defaultValue"
                :disabled="disabled"
                :dropdownClassName="dropdownClassName"
                :dropdownMatchSelectWidth="dropdownMatchSelectWidth"
                :maxTagCount="maxTagCount"
                :multiple="multiple"
                :placeholder="placeholder"
                :searchPlaceholder="searchPlaceholder"
                :showSearch="showSearch"
                :size="size"
                :tree-data-simple-mode=" treeDataSimpleMode"
                :treeCheckable="treeCheckable"
                :tree-data="loadingData?treeDataLazy:treeData"
                :replaceFields="replaceFields"
                :treeDefaultExpandAll="treeDefaultExpandAll"
                :treeNodeFilterProp="treeNodeFilterProp"
                :treeNodeLabelProp="treeNodeLabelProp"
                :dropdownStyle="dropdownStyle"
                v-model:value="values"
                :load-data="loadingData?onLoadData:undefined"
                style="width: 100%"
                @change="change"
                @search="search"
                @select="select"
                @treeExpand="treeExpand"
        />
    </div>
</template>

<script>
    //引入ant-design-vue框架里面的树组件，问题：已经进行了全局引入，不知道这里为什么还要再次单独引入
    import {TreeSelect} from 'ant-design-vue';
    //引入封装的接口
    import {post} from './../../api/request.js'
    export default {
        name: "selectTree",
        props: {
            Url: {//调用后台树接口的Url地址
                type: String,
                default: ''
            },
            params: {//调用后台树接口传递的参数
                default: null,
            },
            inputValue: {//回显或者默认选中的值
                type: Array,
                default: [],
            },
            allowClear: {// 是否显示清除全部按钮
                type: Boolean,
                default: true
            },
            defaultValue: {// 指定默认选中的条目
                default: ''
            },
            disabled: {// 是否禁用
                type: Boolean,
                default: false
            },
            dropdownClassName: {//下拉菜单的 className 属性
                type: String,
                default: ''
            },
            dropdownMatchSelectWidth: {//宽度和指定浏览器的宽度一边高
                type: Boolean,
                default: true
            },
            maxTagCount: {//下拉最多显示多少个
                type: Number,
                default: 100
            },
            multiple: {//是否允许多选
                type: Boolean,
                default: false
            },
            placeholder: {//下拉框的背景提示语
                type: String,
                default: '请输入'
            },
            treeDataSimpleMode: {//使用简单数据格式
                type: Boolean,
                default: false
            },
            searchPlaceholder: {//搜索框默认文字
                type: String,
                default: '请输入搜索内容'
            },
            showSearch: {//在下拉中显示搜索框(仅在单选模式下生效)
                type: Boolean,
                default: false
            },
            size: { //选择框大小，可选 large small default
                type: String,
                default: 'default'
            },
            treeCheckable: {//是否显示复选框
                type: Boolean,
                default: false
            },
            replaceFields: {//将后台返回的数据和渲染树需要的数据进行调整
                type: Object,
                default: {children: 'children', title: 'title', key: 'key', value: 'id'}
            },
            treeDefaultExpandAll: {//默认展开的树节点
                type: Boolean,
                default: false
            },
            treeDefaultExpandedKeys: {//设置展开的树节点
                default: false
            },
            treeNodeFilterProp: { //输入项过滤对应的 treeNode 属性
                type: String,
                default: 'title'
            },
            treeNodeLabelProp: {//作为显示的 prop 设置
                type: String,
                default: 'title'
            },
            dropdownStyle: { //下拉菜单的样式
                type: Object,
                default: {maxHeight: '400px', overflow: 'auto'}
            },
            loadingData: {//是否开启懒加载
                type: Boolean,
                default: false
            },

        },
        data() {
            let SHOW_PARENT = TreeSelect.SHOW_PARENT;
            //树回显数组
            let treeData = [
                {
                    title: 'Node1',
                    id: '0-0',
                    key: '0-0',
                    children: [
                        {
                            title: 'Child Node1',
                            id: '0-0-0',
                            key: '0-0-0',
                        },
                    ],
                },
                {
                    title: 'Node2',
                    id: '0-1',
                    key: '0-1',
                    children: [
                        {
                            title: 'Child Node3',
                            id: '0-1-0',
                            key: '0-1-0',
                            disabled: true,
                        },
                        {
                            title: 'Child Node4',
                            id: '0-1-1',
                            key: '0-1-1',
                        },
                        {
                            title: 'Child Node5',
                            id: '0-1-2',
                            key: '0-1-2',
                        },
                    ],
                },
            ];
            //异步加载树的数组
            let treeDataLazy = [
                {id: 1, pId: 0, value: '1', title: 'Expand to load'},
                {id: 2, pId: 0, value: '2', title: 'Expand to load'},
                {id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true},
            ]
            return {
                values: this.inputValue,//input输入框的内容
                treeData,
                treeDataLazy,
                SHOW_PARENT,
            }
        },
        created() {
            this.treeApi()
        },
        methods: {
            /**获取tree**/
            /**获取服务器时间的API**/
            treeApi() {
                post(this.Url, this.params).then(res => {
                    if (res.code === 200) {
                        console.log(res)
                    } else {

                    }
                })
            },
            /**选中树节点时调用此函数**/
            change(value, label, extra) {
                this.$emit('change', {value: value, label: label, extra: extra})
            },
            /**文本框值变化时回调**/
            search(value) {
                this.$emit('search', value)
            },
            /**被选中时调用**/
            select(value, node, extra) {
                this.$emit('select', {value: value, node: node, extra: extra})
            },
            /**展开节点时调用**/
            treeExpand(expandedKeys) {
                this.$emit('treeExpand', expandedKeys)
            },
            //异步加载树数据的处理
            genTreeNode(parentId, isLeaf = false) {
                const random = Math.random()
                    .toString(36)
                    .substring(2, 6);
                return {
                    id: random,
                    pId: parentId,
                    value: random,
                    title: isLeaf ? 'Tree Node' : 'Expand to load',
                    isLeaf,
                };
            },
            /**异步加载树节点**/
            onLoadData(treeNode) {
                return new Promise(resolve => {
                    const {id} = treeNode.dataRef;
                    //目前的下拉树没有后台数据，所以用定时模拟的
                    setTimeout(() => {//3毫秒完成显示
                        this.treeDataLazy = this.treeDataLazy.concat([
                            this.genTreeNode(id, false),
                            this.genTreeNode(id, true),
                        ]);
                        resolve();
                    }, 300);
                });
            },
        },
    }
</script>

<style scoped lang="less">
    /deep/ .a_tree_selecttrue {
        .ant-select-selector {
            .ant-select-selection-item {
                background: #e3f2fd;
                margin-top: 4px;
                margin-bottom: 4px;
                color: #039be5;

                .anticon-close {
                    color: #039be5;
                    border-left: 3px solid #fff;
                    padding-left: 4px;
                }
            }
        }

    }
</style>