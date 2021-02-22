<!--
@author: wuyuxin
@description: 下拉树
@time: 2021/1/19
-->
<template>
    <div class="tree">
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label"><span v-show="inputRequired" class="required">*</span>{{label}}</label>
                <div class="layui-input-inline" @click="treeShow">
                    <input type="text" name="phone" :lay-verify="inputRequired?'required':''" id="btn" autocomplete="off"
                           class="layui-input">
                    <div class="treeselect" id="tree" v-show="treeHide">

                        <div :id="idDom" :class="idDom"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {reactive, toRefs} from 'vue'
    import $ from 'jquery'

    export default {
        name: "index",
        components: {},
        props: {
            showCheckbox: {//是否显示复选框按钮，可以进行多选,默认为可以进行多选
                type: Boolean,
                default: true
            },
            label: {//是否显示复选框按钮，可以进行多选,默认为可以进行多选
                type: String,
                required: true,
                default: ''
            },
            inputRequired:{
                type: Boolean,
                default: false
            },
            elemId: {//指向容器选择器
                type: String,
                required: true,
                default: ''
            },
            id: {//设定实例唯一索引，用于基础方法传参使用。
                type: String,
                required: true,
                default: ''
            },
            data: {
                //传入的下拉树数据，如果传入就使用data数据，如果不传入走默认接口数据（根据实际情况中，数据是否需要处理）
                type: Array,
                default: []
            },
            edit: {
                //是否开启图标操作功能
                // 默认为false,为空，可以传入新增---add,修改----update,删除----del
                type: Array,
                default: []
            },
            accordion: {//是否开启手风琴效果，默认为false
                type: Boolean,
                default: true
            },
            onlyIconControl: {//是否允许节点左侧控制暂开收缩，默认为fasle
                type: Boolean,
                default: true
            },
            isJump: {//点击节点时候是否允许进行跳转，默认关闭
                type: Boolean,
                default: false
            },
            showLine: {//是否将加号显示为三角号，默认不显示三角号，默认值为true
                type: Boolean,
                default: true
            },
            text: {
                type: Object,
                default: {
                    defaultNodeName: '未命名' //节点默认名称
                    , none: '无数据' //数据为空时的提示文本
                }
            },
            treeToggle: {//下拉树是单选还是多选，默认为多选
                type: Boolean,
                default: true
            },
            treeToggleShow: {//默认展开或者收起，或者默认展开某个节点
                default: false
            }
        },
        setup() {
            let treeData2 = reactive([1, 2, 3, 4, 5])
            return {
                treeData2
            }
        },
        data() {
            return {
                idDom: '',
                dataShowLine: this.showLine,
                dataShowCheckbox: this.showCheckbox,
                treeHide: false,
                treeData: [
                    {
                        title: '一级1'
                        , id: 1
                        , field: 'name1'
                        , children: [{
                            title: '二级1-1 可允许跳转'
                            , id: 3
                            , field: 'name11'
                            , href: 'https://www.layui.com/'
                            , children: [{
                                title: '三级1-1-3'
                                , id: 23
                                , field: ''
                                , children: [{
                                    title: '四级1-1-3-1'
                                    , id: 24
                                    , field: ''
                                    , children: [{
                                        title: '五级1-1-3-1-1'
                                        , id: 30
                                        , field: ''
                                    }, {
                                        title: '五级1-1-3-1-2'
                                        , id: 31
                                        , field: ''
                                    }]
                                }]
                            }, {
                                title: '三级1-1-1'
                                , id: 7
                                , field: ''
                                , children: [{
                                    title: '四级1-1-1-1 可允许跳转'
                                    , id: 15
                                    , field: ''
                                    , href: 'https://www.layui.com/doc/'
                                }]
                            }, {
                                title: '三级1-1-2'
                                , id: 8
                                , field: ''
                                , children: [{
                                    title: '四级1-1-2-1'
                                    , id: 32
                                    , field: ''
                                }]
                            }]
                        }, {
                            title: '二级1-2'
                            , id: 4
                            , children: [{
                                title: '三级1-2-1'
                                , id: 9
                                , field: ''
                                , disabled: true
                            }, {
                                title: '三级1-2-2'
                                , id: 10
                                , field: ''
                            }]
                        }, {
                            title: '二级1-3'
                            , id: 20
                            , field: ''
                            , children: [{
                                title: '三级1-3-1'
                                , id: 21
                                , field: ''
                            }, {
                                title: '三级1-3-2'
                                , id: 22
                                , field: ''
                            }]
                        }]
                    },
                    {
                        title: '一级2'
                        , id: 2
                        , field: ''
                        , children: [{
                            title: '二级2-1'
                            , id: 5
                            , field: ''
                            , children: [{
                                title: '三级2-1-1'
                                , id: 11
                                , field: ''
                            }, {
                                title: '三级2-1-2'
                                , id: 12
                                , field: ''
                            }]
                        }, {
                            title: '二级2-2'
                            , id: 6
                            , field: ''
                            , children: [{
                                title: '三级2-2-1'
                                , id: 13
                                , field: ''
                            }, {
                                title: '三级2-2-2'
                                , id: 14
                                , field: ''
                                , disabled: true
                            }]
                        }]
                    },
                    {
                        title: '一级3'
                        , id: 16
                        , field: ''
                        , children: [{
                            title: '二级3-1'
                            , id: 17
                            , field: ''
                            , fixed: true
                            , children: [{
                                title: '三级3-1-1'
                                , id: 18
                                , field: ''
                            }, {
                                title: '三级3-1-2'
                                , id: 19
                                , field: ''
                            }]
                        }, {
                            title: '二级3-2'
                            , id: 27
                            , field: ''
                            , children: [{
                                title: '三级3-2-1'
                                , id: 28
                                , field: ''
                            }, {
                                title: '三级3-2-2'
                                , id: 29
                                , field: ''
                            }]
                        }]
                    }
                ],
                nums: 0,
            }
        },
        created() {
            //下拉树显示与隐藏
            $('body').click((e) => {
                var target = $(e.target);
                if (!target.is('#btn') && !target.parents('#tree').is('#tree')) {
                    this.treeHide = false
                }
            })
            if (this.elemId.indexOf('#') != -1) {
                this.idDom = this.elemId.replace("#", "")
            } else if (this.elemId.indexOf('.') != -1) {
                this.id = this.elemId.replace(".", "")
            } else {
                this.idDom = this.elemId
            }
            if (!this.treeToggle) {
                this.dataShowLine = false;
                this.dataShowCheckbox = false;
            } else {
                this.dataShowCheckbox = true;
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.treeToggles(this.treeData)
                let that = this
                layui.use(['tree', 'util'], function () {
                    var tree = layui.tree
                        , layer = layui.layer
                        , util = layui.util
                    tree.render({
                        elem: that.elemId//指向容器选择器
                        , data: that.treeData
                        , showCheckbox: that.dataShowCheckbox  //是否显示复选框
                        , accordion: that.accordion//手风琴效果
                        , onlyIconControl: that.onlyIconControl//左侧收缩效果
                        , isJump: that.isJump//是否允许跳转
                        , showLine: that.dataShowLine//是否显示三角形收缩按钮
                        , text: that.text//节点默认文字
                        , id: that.id
                        , edit: that.edit
                        , click: function (obj) {
                        }, oncheck: function (obj) {
                        }
                    });
                    //获得选中的节点
                    var checkData = tree.getChecked(that.id);
                    console.log(11111, checkData);
                    //按钮事件
                    util.event('lay-demo', {
                        reload: function () {
                            //重载实例
                            tree.reload(that.id, {});

                        }
                    });

                })
            })
        },
        methods: {
            treeToggles(data) {
                if (this.treeToggleShow == true || this.treeToggleShow == false) {
                    this.recursion(data)
                } else {

                }
            },
            recursion(data) {//递归赋值
                data.forEach((item, index) => {
                    item.spread = this.treeToggleShow
                    if (item.children) {
                        this.recursion(item.children)
                    }
                })
            },
            //下拉树显示与隐藏
            treeShow() {
                this.treeHide = true
            },
        },
    }
</script>

<style scoped lang="scss">
    .tree {
        position: relative;
        .required {
            color: red;
            line-height: 100%;
            padding-right: 3px;
        }
        .layui-input-inline {
            position: relative;

            .treeselect {
                position: absolute;
                left: 0px;
                z-index: 99;
                top: 38px;
                width: calc(100% - 2px);
                padding: 5px 0px;
                max-height: 350px;
                overflow: auto;
                border: 1px solid #e6e6e6;
                border-top: none;
                background: #fff;
            }
        }
    }

</style>