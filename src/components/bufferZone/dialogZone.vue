<template>
    <!--周边搜索弹窗start-->
    <div>
        <div class="cover_layer" v-show="coverShow"></div>
        <div class="map_dialog zbss_dialog zkr-dialog"
             v-show="searchAroundDialogVisible"
             :footerAlign="'center'"
             submitBtnText="查询">
            <!--            //需要把elementui的内容替换掉-->
            <div class="search_around_box">
                <div class="header_box">
                    <span class="spantitle">周边搜索</span>
                    <i @click="cancelSearchAroundDialog()" class="layui-icon layui-icon-close header_close"
                       style="font-size: 20px;"></i>
                </div>
                <div class="content">
                    <div class="around_item_box" v-for="(item, index) in searchAroundTypeArrs" :key="'around_'+index">
                        <div class="around_count_box" :class="item.active?'active':''"
                             @click="chengeAroundChecked(index)">
                            <i class="layui-icon layui-icon-ok-circle" v-show="item.active"
                               style="font-size: 17px;position: absolute;left: 5px;top: 50%;transform: translateY(-50%); color: #1E9FFF;"></i>
                            <div class="around_img"><img :src="imgUrl+item.src"></div>
                            <div class="around_name">{{item.name}}</div>
                        </div>
                    </div>

                </div>
<!--                                      oninput="value=value.replace(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))/g,'')"-->
<!--                @input="inputNum"-->
<!--                <form class="layui-form layui-form-pane login_form" lay-filter="example">-->
<!--                    <div class="around_input_box input_flex">-->
<!--                        <input type="text" name="number" lay-verify="required|number|numbers" v-model="newRadiu"-->
<!--                               placeholder="请输入半径" autocomplete="off" class="layui-input">-->
<!--                        <span class="show_title">千米</span>-->
<!--                    </div>-->
<!--                    <div class="slider">-->
<!--                        <div v-show="sliderShow" id="slideTest3" class="demo-slider"></div>-->
<!--                    </div>-->
<!--                    <div class="layui-form-item">-->
<!--                        <div class="layui-input-block">-->
<!--                            <button type="button" class="layui-btn diabtn"-->
<!--                                    @click="cancelSearchAroundDialog()">取消-->
<!--                            </button>-->
<!--                            <button type="button" lay-submit="" lay-filter="serch" class="layui-btn diabtn"-->
<!--                            >查询-->
<!--                            </button>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </form>-->
                <a-form
                        name="custom-validation"
                        ref="formRef"
                        :model="formState"
                        :rules="rules"
                        v-bind="layout"
                        @finish="handleFinish"
                        @finishFailed="handleFinishFailed"
                >
                    <a-row >
                        <a-col :span="12">
                            <a-slider v-model:value="newRadiu" :marks="newMack" :min="Number(minNumber)" :max="Number(maxNumber)" />
                        </a-col>
                        <a-col :span="12">
                            <a-input-number v-model:value="newRadiu" :min="Number(minNumber)" :max="Number(maxNumber)" style="margin-left: 16px" />
                            <span class="show_title">千米</span>>
                        </a-col>

                    </a-row>

                    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                        <a-button class="diabtn"   @click="cancelSearchAroundDialog">取消</a-button>
                        <a-button class="diabtn" style="margin-left: 10px"  type="primary" html-type="submit">查询</a-button>

                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
    <!--周边搜索弹窗end-->
</template>

<script>
    import * as api from '@/api/api.js' //页面中引入
    import * as mUtil from '@/utils/plugin.js';
    import * as mConfig from '@/utils/config.js';
    import { defineComponent, reactive, ref } from 'vue';
    export default  defineComponent({
        name: "dialogZone",
        props: {
            searchAroundDialogVisible: {
                type: Boolean,
                default: false
            },
            sliderShow: {
                type: Boolean,
                default: false
            },
            searchAroundTypeArr: {
                type: Array,
                default: function () {
                    return [
                        {name: '站点', src: '/event/yjzd.png', type: '1', active: false},
                        {name: '固定视频', src: '/event/gdsp.png', type: '2', active: false},
                        {name: '情报板', src: '/event/qbb.png', type: '3', active: false},
                        {name: '车载', src: '/event/cz_online.png', type: '4', active: false},
                        {name: '无人机', src: '/event/frj_online.png', type: '5', active: false},
                        {name: '桥梁', src: '/event/ql.png', type: '6', active: false},
                        {name: '隧道', src: '/event/sd.png', type: '7', active: false},
                    ]
                }
            },
            imgUrl: {
                type: String,
                default: '',
            },
            radius: {
                type: Number,
                default: 50,
            },
            coverShow: {
                type: Boolean,
                default: false,
            },
            minNumber: {
                type: Number,
                default: 10
            },
            maxNumber: {
                type: Number,
                default: 200,
            },
            lengthNumber: {
                type: Number,
                defalut: 7
            },
            currentPoint: {
                type: Array,
                defalut: []
            },
        },
        setup() {
            const formRef = ref();
            const formState = reactive({
                pass: '',
            });


            let validatePass = async (rule, value) => {
                if (value === '') {
                    return Promise.reject('请输入');
                } else {
                    return Promise.resolve();
                }
            };

            const rules = {
                pass: [
                    {
                        validator: validatePass,
                        trigger: 'change',
                    },
                ],
            };
            const layout = {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 14,
                },
            };

            const handleFinish = values => {
                console.log(values, formState);
            };

            const handleFinishFailed = errors => {
                console.log(errors);
            };

            const resetForm = () => {
                formRef.value.resetFields();
            };

            return {
                formState,
                formRef,
                rules,
                layout,
                handleFinishFailed,
                handleFinish,
                resetForm,
            };
        },
        data() {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password'));
                } else {
                    if (this.ruleForm.pass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                }
            };
            return {
                show: this.searchAroundDialogVisible,
                coverShows: this.coverShow,
                newRadiu: this.radius,
                newMack: {
                    50: {
                        style: {
                            color: '#fff',
                        },
                        label: ''
                    },
                },
                searchAroundTypeArrs: this.searchAroundTypeArr,
                ruleForm: {
                    pass: '',
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
                rules:{
                    pass: [{ validator: validatePass, trigger: 'change' }],
                }
            }
        },
        created() {

        },
        mounted() {
            this.$nextTick(() => {
                let that = this
                layui.use(['form', 'layedit', 'laydate', 'slider'], () => {
                    var $ = layui.$
                        , form = layui.form
                        , slider = layui.slider
                        , layer = layui.layer
                        , layedit = layui.layedit
                        , laydate = layui.laydate;
                    //设置最大最小值
                    slider.render({
                        elem: '#slideTest3'
                        , min: Number(that.minNumber) //最小值
                        , max: Number(that.maxNumber) //最大值
                        , theme: 'rgb(30, 159, 255)'
                        , value: Number(that.radius)
                        , change: function (value) {
                            setTimeout(() => {
                                that.newRadiu = value
                            }, 300)
                        }
                    });

                    /**
                     * 自定义验证规则
                     *
                     * */
                    form.verify({
                        numbers: function (value) {
                            if (value <= Number(that.minNumber)) {
                                return '输入半径应该大于' + Number(that.minNumber);
                            }
                            if (value > Number(that.maxNumber)) {
                                return '输入半径不能大于' + Number(that.maxNumber);
                            }
                            if (value.length > that.lengthNumber) {
                                return '输入半径最多为' + that.lengthNumber + '位';
                            }
                        }
                    });
                    /**
                     * 表单提交
                     *
                     * */
                    form.on('submit(serch)', (data) => {
                        that.submitSearchAroundDialog()
                        return false;
                    });
                })

            })
        },
        computed: {
            mUtil() {
                return mUtil.getMyUtil();
            },
        },
        methods: {
            //周边搜索
            cancelSearchAroundDialog() {
                this.$emit('cancelSearchAroundDialog')
            },
            //表单提交
            submitForm(formName) {
                console.log(this.$refs[formName]);
                this.$refs.ruleForm[0].validate((valid) => {
                    // if (valid) {
                    //     alert('submit!');
                    // } else {
                    //     console.log('error submit!!');
                    //     return false;
                    // }
                });
            },
            /**
             * 改变周边搜索选中状态
             * @param index
             */
            chengeAroundChecked(index) {
                this.searchAroundTypeArrs[index].active = !this.searchAroundTypeArrs[index].active;
            },
            /**
             * 查询周边搜索
             */
            submitSearchAroundDialog() {
                const radius = this.newRadiu * 1000;
                let type = [];
                this.searchAroundTypeArrs.forEach((d) => {
                    if (d.active) {
                        type.push(d.type);

                        if ('2,4,5'.indexOf(d.type) > -1) {
                            this.$parent.loginVideo();
                        }
                    }

                });

                if (type.length == 0) {
                    this.mUtil.errorAxios('请选择周边类型', this);
                    return false;
                }
                const params = {
                    longitude: this.currentPoint.longitude,
                    latitude: this.currentPoint.latitude,
                    radius: this.newRadiu,
                    type: type.join(',')
                };

                this.loading = true;
                api.getRange(params).then((res) => {
                    if (res.code == 200) {
                        this.$emit('submitSearchAroundDialog', [res, radius])
                    } else {
                        layer.msg(res.msg)
                    }
                }).catch(err => {
                    this.$emit('submitSearchAroundDialog', ['error', err])
                });

            },
        },

    })
</script>

<style lang="less" scoped>
    @import "../../static/css/my_style";

    @bgImg: 'data:image/jpg;base64,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AAAo1knhNxvp3ozea6b1dHbVZrgLvVd8IKGGSfZAXciIoACioALl3wbm55PAC+vKcCAv4gAAILQzKSaovTuZ5ym78buJu5qA1nXueczUvwvbMusoLd8VAADQADMAAAAQAADj4AF3UzN30Srm7mcaBvTme/4hz50ADMvgA/pOfKANf+Z51mfYACoiooegQVAUAACUAAAABUAUQVFmk+Vzr3E3q3qApqLgB/DYgALBS6efJ+mZfAi7nvPDLpnTxzsXt6Z5CsXcO7d9pszTIAGoDWbPVW5vqMAKcl4hdAogDXd1fKVAopygiqgKilAEFBUAQAAAAFqAKBFQDwAT7AAAARQEUAAAAAAAAAAABKoAHgAAAoAAUACgHJS0DDlFA0AAAAAARb9Agt+hRAGFUQAVAFQAUQBRFoAigAgKRAFEUABQF8oIACgFACiAAAAoAgAqIAAAAAAAACoKKIAogCiKAAAAAUAAAAAKIAoigCAKCCKgCgACiCACqAIAL05u7woQ8LvTueUERUoC0pYKHkAAXOM8IAAAv6gC7PVQX15UQXd4RBZrXb+M7u75FG8/z4u7mE6MznnWczerIzubmzUR26M6erJ2p1dfT07M6cY3eOOpJvwEXq696t5xmr+4gpQPIACBufIUA4+RZmeWunOjc8zVGbPCLszeNqIEF3DMvhRNKbk3yIAuZu+MTfPIBUayewTCau7luHTzvmAnrwNdW747qwCovPygredvtnforp05kEch23oyb8ue9MCpzvCabgigAAAAAAAAAAAACAAoFAClAAugALmbq9u+4DIu9M9pAAIAAAqQACLN+AQAAFBFzKAACocrk94nhc2aDfZnyzvTDu3zTeu+gZJABFAAgABfkAAAA3IAAAAAAAAACAogC0uIoAhAUAAAAABFARQBAAABQAAAAAAAAAAAABkURQNQAUQAAAVAFAAEUEFIAEXAIYhVRq5icIAuxAFAq3QJ8pogKIIKIAqAAACoAAAAABQAABUUUEBBRAFEFFEAUAAEBQQFKAAgCoqAogAAAqACoAAAAANZ1bmcMgLl3eDenc846f5709ObvtOrrueFRgAADwoAAubNTduhAAAAJu+gBd4TdKDp09fTnTNxyEpF3c3fhrN6c9VgKRvf9d9cMbt26BSFnhrv6t4rIK3m/OVN34QWoAAvEShsQN3C/SLmbvhARd6d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';
    @box: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABKAAAAQQCAYAAADVkyPJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5OEYyMjk1MzEyNzkxMUVCQjdEMTg3NkUzOTk0RUZDMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5OEYyMjk1NDEyNzkxMUVCQjdEMTg3NkUzOTk0RUZDMiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk4RjIyOTUxMTI3OTExRUJCN0QxODc2RTM5OTRFRkMyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk4RjIyOTUyMTI3OTExRUJCN0QxODc2RTM5OTRFRkMyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KtSqPgAALK9JREFUeNrs3VGMpWdB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CVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACA1MEAdenYliMBAAAA4DzNjenSk18cDFCfHvuzse9yRgAAAACco7ktzY3p0ydfOHjF01+ObY+9d+zqsYecFwAAAAAbmOPT3Jb+YtpvTd+yfMvdu8cuGfubaT9CPezcAAAAAFjDk6f9pvSeab8xnbLqQ8hvHnvf4gee5OwAAAAAOMTckOaWNDelm5e/eabfgvfHYx8cu30SoQAAAAA4s7kdzQ3p76b9pvQYR8/ywzeO/ePYbZPfjgcAAADAY83NaG5Hc0N615nedPSQP+SdY58ce4PzBAAAAGDJ3IzmdvTOs73p6Bp/0J2T34gHAAAAwGPNzejOw9501DkBAAAAUBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApLYOfnHi2M5j3rC9u+eUAAAAADhnWytee9PYL4x9fuxljggAAACAdZw4tvO28fCzY5/f3t071ZVWBajLx3587LhjAwAAAGADV0wrupLPgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAILW14rUbx/527ITjAQAAAGADN4y9e1rqSqsC1L2LAQAAAMDatnf37hkP9yy/7hY8AAAAAFICFAAAAACpVbfgXTf28rH7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AhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAAICVAAQAAAJASoAAAAABICVAAAAAApAQoAAAAAFICFAAAAAApAQoAAACAlAAFAAAAQEqAAgAAACAlQAEAAACQEqAAAAAASAlQAAAAAKQEKAAAAABSAhQAAAAAKQEKAAAAgJQABQAAAEBKgAIAAAAgJUABAAAAkBKgAAAAAEgJUAAAAACkBCgAAAAAUgIUAAAAACkBCgAAAICUAAUAAABASoACAAAA/p+9ewG2rZ7jAL7u6XS7XSVCRZEelFxELjF5Vp6JIiZpxmOYEjFGIkUY5JVHBqURIyLG4ypGHuNdIXmElLoZj6koErerrnP8fnev4+57rNV5/k43fT4zv85/t357rX3W3vucs773v9aGUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAAAIBSAigAAAAASgmgAAAAACglgAIAAACglAAKAAAAgFICKAAAAABKCaAAAAAAKCWAAgAAAKCUAAoAAACAUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAAAIBSAigAAAAASgmgAAAAACglgAIAAACglAAKAAAAgFICKAAAAABKCaAAAAAAKCWAAgAAAKCUAAoAAACAUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAAAIBSAigAAAAASgmgAAAAACglgAIAAACglAAKAAAAgFICKAAAAABKCaAAAAAAKCWAAgAAAKCUAAoAAACAUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAAAIBSAigAAAAASgmgAAAAACglgAIAAACglAAKAAAAgFICKAAAAABKCaAAAAAAKCWAAgAAAKCUAAoAAACAUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAAAIBSAigAAAAASgmgAAAAACglgAIAAACglAAKAAAAgFICKAAAAABKCaAAAAAAKCWAAgAAAKCUAAoAAACAUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAAAIBSAigAAAAASgmgAAAAACglgAIAAACglAAKAAAAgFICKAAAAABKCaAAAAAAKCWAAgAAAKCUAAoAAACAUgIoAAAAAEoJoAAAAAAoJYACAAAAoJQACgAA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';
    @dialog: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAz4AAAG4CAYAAACEvTI0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMTI5NkUyNzgyRUMxMUVBOEZBREQ4MTA2OEU2NUI0OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMTI5NkUyODgyRUMxMUVBOEZBREQ4MTA2OEU2NUI0OSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQxMjk2RTI1ODJFQzExRUE4RkFERDgxMDY4RTY1QjQ5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQxMjk2RTI2ODJFQzExRUE4RkFERDgxMDY4RTY1QjQ5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7AJ0vQAADxpJREFUeNrs3V2MXFUB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AAAIHwAAQPgAAAAIHwAAAOEDAAAgfAAAAIQPAACA8AEAABA+AAAAwgcAABA+AAAAwgcAAED4AAAACB8AAADhAwAAIHwAAACEDwAAgPABAACEDwAAgPABAAAQPgAAAMIHAABA+AAAAAgfAAAA4QMAAAgfAAAA4QMAACB8AAAAhA8AAIDwAQAAED4AAADCBwAAQPgAAADCBwAAQPgAAAAIHwAAAOEDAAAgfAAAAIQPAACA8AEAABA+AACA8AEAABA+AAAAwgcAAED4AAAACB8AAADhAwAAIHwAAACEDwAAIHwAAACEDwAAgPABAAAQPgAAAMIHAABA+AAAAAgfAAAA4QMAAAgfAAAA4QMAACB8AAAAhA8AAIDwAQAAED4AAADCBwAAED4AAADCBwAAQPgAAAAIHwAAAOEDAAAgfAAAAIQPAACA8AEAAIQPAACA8AEAABA+AAAAwgcAAED4AAAACB8AAADhAwAAIHwAAADhAwAAIHwAAACEDwAAgPABAAAQPgAAAMIHAABA+AAAAAgfAABA+AAAAAgfAAAA4QMAACB8AAAAhA8AAIDwAQAAED4AAADCBwAAED4AAADCBwAAQPgAAAAIHwAAAOEDAAAgfAAAAIQPAACA8AEAAIQPAACA8AEAABA+AAAAwgcAAED4AAAACB8AAADhAwAACB8AAADhAwAAIHwAAACEDwAAgPABAAAQPgAAAMIHAABA+AAAAMIHAABA+AAAAAgfAAAA4QMAACB8AAAAhA8AAIDwAQAAED4AAIDwAQAAED4AAADCBwAAQPgAAAAIHwAAAOEDAAAgfAAAAIQPAAAgfAAAAIQPAACA8AEAABA+AAAAwgcAAED4AAAACB8AAADhAwAACB8AAADhAwAAIHwAAACEDwAAgPABAAAQPgAAAMIHAAAQPgAAAMIHAABA+AAAAAgfAAAA4QMAACB8AAAAhA8AAIDwAQAAhA8AAIDwAQAAED4AAADCBwAAQPgAAAAIHwAAAOEDAAAgfAAAAOEDAAAgfAAAAIQPAACA8AEAABA+AAAAwgcAAED4AAAACB8AAED4AAAACB8AAADhAwAAIHwAAACEDwAAgPABAAAQPgAAAMIHAAAQPgAAAMIHAABA+AAAAAgfAAAA4QMAACB8AAAAhA8AAIDwAQAAhA8AAIDwAQAAED4AAADCBwAAQPgAAAAIHwAAAOEDAAAIHwAAAOEDAAAgfAAAAIQPAACA8AEAABA+AAAAwgcAAED4AAAAwgcAAED4AAAACB8AAADhAwAAIHwAAACEDwAAgPABAAAQPgAAgPABAAAQPgAAAMIHAABA+AAAAAgfAAAA4QMAACB8AAAAhA8AACB8AAAAhA8AAIDwAQAAED4AAADCBwAAQPgAAAAIHwAAAOEDAAAIHwAAAOEDAADQX4bz1rwhfAAAgMEXYyg+c/Oa7k+dMU34AAAAAxs7kyOJobzw0uXluRteSFaUJ/eEz3QANXxaAADAYIbP1KFcfdZIcfEXVsTh8t3N97YnqktpfblnCB8AAGAQo6ee6UliGF6aFJ++cW1YOnT10Edbz1SvNKtRzBmlpW4AAMDgRU8925Mkobhi8+pw2sqfL/lY6/7qypLscOOc6jgUpiZ56pmfunmi8AEAAAYvetJGLN9zyfLyvPX7m+uyzdWVkbKdLK/G3XUAdeKnGz6WugEAAIMUPnXOpLFcfeZwcdHnVqQri48kK4v66rLsaPqt6nhmNYY7d9fL3PJwrBmfuLG6Y9f2dT5VAACgf6Kns69npN7Xs2Vtcmrzq413Zfsmo+dQ8/JQxEs6d9bhM2vGx1I3AABgMKKnu6/nk5tXx9NXPtR8X/vhOnqK8fScMovX9dzd3eMzub8n2OMDAAAMTPR09vWE8y58sXFB9vU6eso8viUfS28NM8vbwpzomb4AAADQx+ETZu/rOaO4KFle1GGzLD/SuDaU4W0LvKM2/V0+ZnwAAIA+jp4F9vWcnz1XvbK0ip6Lyzx+cM476i8w7T7UoOiEjz0+AABAH0fPsff1nF20kqvmvaVZbK0OWWdMx4/wAQAA+jd6Ft7XsyIfS28KU9/XM/OWpHy0MZo9GKZmfdo94WOPDwAA0I/hE15tX8+mUIZVc+7fm45mt1Vnr1RjvBqtMDXrY8YHAADox+jpPJtg+KSk+NSWtcmbmtc1zs/21Feq6Nm40L6edCTfEtPypep8LMye8bHHBwAA6FNJEovLN68Ob135YPP97QeqK0PFeHpm0UqumXfrUHFnMpw/XZ0eDVMzPnX4TM/2BDM+AABAPyovvGR5+Y71LzTOzTZVP6ZlHpfmY+ktYYF9PemybFt1eqQTPt1lbt3ZnskZn1fd41Ps2r7uuINs7fod/j0AAMAbjp5Vbx8uLrpyeRwtN6SrijpklmaHG1+rEmbNrBtj2JOOZt+szg4vED3Tj7J+zfB5PfI7jj+SAAAAjilOlspnhz7Q2lmdDWcvNy8NRfz4nLvG0+F8U0zL/4X5S9xmzfZM/sqyLN/Q39Q4fb1/DAAAsCga+37bTZ80TE3UDNXx0zPqa0knbuoHGIz3jHaYvbcnLFr4AAAALJbhvNUNn2RO/Ax1ztPOrUUnclqd4On93p5iXlD5aAEAgD5UdgIm78RN0Yme2BM+eZhZ2tYNngVndoQPAADQz+HTPc870RPnvD79yOowZ1+P8AEAAPo9euKcuIkL3LPQMQgfAABgkOLnNYPmeHm4AQAAcML7vwADALWf0OWqdKVSAAAAAElFTkSuQmCC';
    .cover_layer {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9;
    }

    .map_dialog {
        width: 445px;
        height: auto;
        z-index: 99;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-image: url("@{dialog}");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        padding: 10px;
        border: none;
        box-shadow: none;

        &.zkr-dialog {
            /deep/ .el-dialog {


                /deep/ .zkr-dialog-btn.el-button {
                    background: #4379b1;
                    border: none;
                    color: #ffffff;
                }
            }

            /deep/ .el-dialog__header, /deep/ .el-dialog {
                background-color: transparent;

                .el-dialog__title {
                    color: #50ace7;
                }

            }
            /deep/ .inputWidth{
                width: 150px;
            }

            .show_title {
                display: inline-block;
                width: 90px;
                height: 32px;
                border-top-right-radius: 3px;
                border-bottom-right-radius: 3px;
                background: #4379b1;
                color: #fff;
                text-align: center;
                line-height: 32px;
            }
            .search_around_box {
                .header_box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .spantitle {
                        height: 50px;
                        line-height: 50px;
                        color: #50ace7;
                        padding-left: 10px;
                        font-size: 17px;
                    }

                    .header_close {
                        padding-right: 10px;
                        cursor: pointer;
                        color: #909399;
                    }

                    .header_close:hover {
                        color: #50ace7;
                    }
                }

                /deep/ .slider {
                    margin: 10px 0px;

                    .demo-slider {
                        width: auto;
                        padding: 0px 15px;

                        .layui-slider {
                            background: #2d88b3;
                        }
                    }
                }

                .input_flex {
                    display: flex;
                    justify-content: space-evenly;
                    padding: 0px 10px;
                    width: auto;
                    margin: 10px 0px;
                    /* 谷歌 */

                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        appearance: none;
                        margin: 0;
                    }

                    /* 火狐 */

                    input {
                        -moz-appearance: textfield;
                    }

                    input {
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid #0468a6;
                        color: #fff;
                    }

                    /deep/ .layui-input:hover, .layui-textarea:hover {
                        border: 1px solid #0468a6 !important;
                        color: #fff;
                    }

                    /deep/ .layui-input:focus, .layui-textarea:focus {
                        border: 1px solid #0468a6 !important;
                        color: #fff;
                    }




                }

                .diabtn {
                    background: #4379b1;
                    color: #fff;
                    border:none
                }

                .content {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    padding: 0px 10px;
                    .around_item_box {
                        width: 30%;
                        padding-bottom: 10px;
                        padding-top: 10px;

                        .around_count_box {
                            border-radius: 5px;
                            border: 1px dashed #0468a6;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            padding: 5px;
                            cursor: pointer;
                            color: #50ace7;
                            position: relative;
                            &.active {
                                .around_name {
                                    color: #ffffff;
                                }
                            }
                            &:hover {
                                .around_name {
                                    color: #ffffff;
                                }
                            }
                            .around_img {
                                padding-left: 18%;
                            }
                            .around_name {
                                padding-left: 5px;
                            }
                        }

                    }
                }

            }

            /deep/ .around_input_box {
                width: 100%;
                padding: 5Px 5Px 10Px 5Px;

                .el-input__inner {
                    background-color: rgba(0, 0, 0, .3);
                    border: 1px solid #0468a6;
                    color: #ffffff;
                }

                .el-input-group__append {
                    background-color: #4379b1;
                    color: #ffffff;
                    border: 1px solid #0468a6;
                }
            }

            /*/deep/ .zkr-dialog .el-dialog__body{*/
            /*  width: calc(100% + 28px);*/
            /*}*/

            /deep/ .tabs .el-tabs__header .el-tabs__item {
                color: #fff !important;
            }

            /*站点样式*/

            .station_box {
                height: 60vh;
                /**/

                /deep/ .el-tabs--card > .el-tabs__header {
                    border-bottom: 1px dashed #007ec4;

                    .el-tabs__nav {
                        border-color: #007ec4;
                        border-radius: 0;
                    }


                    .el-tabs__item {
                        background: #021435;
                        color: #ffffff;
                        border-color: #007ec4;

                        &.is-active {
                            background: #3687d0;
                            border-color: #007ec4;
                        }
                    }
                }

                .form_info {
                    color: #ffffff;
                    line-height: 50Px;
                    .text_nowrap;

                    &.info_filed {
                        text-align: right;
                    }
                }

            }

            /*视频样式*/

            .video_box {
                height: 100%;

                /deep/ .vjs-error .vjs-error-display:before {
                    content: '';
                }

                /deep/ .video-player {

                    > div {
                        width: 100%;
                        height: 100% !important;

                        &:first-child {
                            height: 100% !important;
                        }
                    }

                    .vjs-big-play-button {
                        display: none;
                    }
                }
            }

            /*情报板样式*/

            .info_board_box {
                height: 50vh;

                .info_board_content {
                    width: 100%;
                    height: 100%;
                    background: #000000;

                    /*信息发布*/

                    .info__text {
                        position: relative;
                        transform: scale(2) translateY(-50%);
                        top: 50%;
                        display: block;
                        margin: auto;

                        .info_item {
                            position: absolute;
                        }
                    }

                    /*智慧路*/

                    .info_text {
                        color: #ffffff;
                        height: 100%;
                        text-align: center;
                        font-size: .5rem;

                        &:before {
                            display: inline-block;
                            content: "";
                            height: 100%;
                            vertical-align: middle;
                        }
                    }

                    img {
                        height: 100%;
                        display: block;
                        margin: auto;
                    }
                }

            }
        }

    }

    .zbss_dialog {
        /deep/ .el-dialog__body {
            height: 100% !important;
            padding: 0px !important;
            width: 100% !important;
        }

        /deep/ .el-dialog {
            width: 100%;
        }

        /deep/ .el-dialog__body::-webkit-scrollbar {
            width: 0px !important;
        }

        /deep/ .el-dialog__footer {
            padding: 0px 20Px 7Px 20Px !important;
        }
    }

    .emergency_disposal {
        background: url('@{bgImg}') no-repeat center center;
        background-size: cover;

        .legend_box {
            position: absolute;
            bottom: 25Px;
            left: 21%;
            color: #ffffff;
            background: rgba(0, 0, 0, .3);

            .legend_header {
                text-align: center;
                line-height: 30Px;
                background: #10214f;
                font-size: 16px;
                padding: 5px 0;
            }

            .legend_body {
                padding: 5Px 15Px;

                .legend_item {
                    display: flex;

                    .clear_float {
                        clear: both;
                    }

                    .legend_color, .legend_icon, .legend_name {
                        display: inline-block;
                        float: left;
                        margin: 10px;
                        font-size: 12px;
                    }

                    .legend_color {
                        width: 40px;
                        height: 15px;
                    }

                    .legend_icon {
                        width: 24Px;
                        height: 24Px;

                        img {
                            height: 100%;
                            display: block;
                            margin: auto;
                        }
                    }
                }
            }


        }

        .clear_around_btn {
            position: fixed;
            top: 5px;
            right: 135Px;
            z-index: 3;
            padding: 0;
            height: 20px;

            /deep/ .el-button {
                font-size: 17Px;
                color: #ffffff;
                padding: 0;
            }
        }

        #map {
            width: calc(100% - 220px);
            margin: 0 10px 10px 10px;
            height: calc(100% - 70px); //- 0.26042rem
            position: absolute;
            z-index: 0;
            top: 60px;


            background-size: 100% 100%;
            background-repeat: no-repeat;

            .ol-tooltip.ol-tooltip-static {
                color: rgb(255, 255, 255);
                padding: 5px 10px;
                margin-left: -10px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 5px;
            }
        }

        .center_box {
            position: absolute;
            top: 50px;
            width: 40%;
            max-width: 700px;
            margin: auto;
            z-index: 1;
            left: 0;
            right: 0;

            .num_box {
                width: 33.3333333%;
                display: inline-block;
                float: left;
            }

            .center_title {

            }
        }

        .left_box, .right_box {
            width: 20%;
            height: calc(100% - 50px);
            overflow: hidden;
            position: absolute;
            z-index: 1;
            top: 30px;
            flex: 1;
            display: flex;
            flex-flow: column;
        }

        .left_box {
            left: 0;

            .duty {
                max-height: 15vh;
                margin-bottom: 15Px;
            }
        }

        .right_box {
            right: 0;

            .disposal_max_h {
                height: calc(100% - 270Px);

            }
        }


    }
</style>
