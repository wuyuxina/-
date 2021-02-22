<template>
    <!--  project作为跟页面-->
    <div class="main">
        <!--    底部导航栏开始-->
        <div class="header">
            <header-meun></header-meun>
        </div>
        <div class="bottoms">
            <left-meun></left-meun>
            <div class="content">
<!--                内容部分开始-->
                    <!--        动画的使用条件 v-if,v-show,动态逐渐，逐渐根节点-->
                    <router-view></router-view>
            </div>
        </div>

    </div>
</template>

<script>
    //首先导入组件
    import leftMeun from "../components/meun";
    import headerMeun from "../components/meun/headerMeun";

    export default {
        components: {leftMeun,headerMeun},
        name: "project",
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style scoped lang="less">
    .main {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .header {
            height: 60px;
        }

        .bottoms {
            flex: 1;
            display: flex;
            justify-content: space-between;

           ::v-deep .meun {
                height: 100%;
                width: 200px;

                .layui-nav {
                    height: 100%;
                }
            }

            .content {
                width: 100%;
                overflow-y: auto;
               height: calc(100vh - 60px);
            }
        }
    }
</style>