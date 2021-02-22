<template>
    <div>
        <ul class="layui-nav layui-navs">
<!--            <li class="layui-nav-item">-->
<!--                <a href="">控制台<span class="layui-badge">9</span></a>-->
<!--            </li>-->
<!--            <li class="layui-nav-item">-->
<!--                <a href="">个人中心<span class="layui-badge-dot"></span></a>-->
<!--            </li>-->
            <li class="layui-nav-item" lay-unselect="">
                <a href="javascript:;"><img src="//t.cn/RCzsdCq" class="layui-nav-img">我</a>
                <dl class="layui-nav-child">
                    <dd><a href="javascript:;">修改信息</a></dd>
                    <dd><a href="javascript:;">安全管理</a></dd>
                    <dd><router-link to="/login" tag="a">退出登录</router-link></dd>
                </dl>
            </li>
            <li class="zkrlogo">
<!--                <img src="./../../assets/images/zkr.jpg" />-->
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "headerMeun",
        data(){
            return{

            }
        },
        mounted() {
            this.$nextTick(()=>{
                window.layui.use('element', function () {

                    var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
                    //监听导航点击
                    element.init()
                });
            })
        }
    }
</script>

<style scoped lang="less">
   ::v-deep .layui-navs{
        width: 100%;height: 60px;
        .layui-nav-item{
            float: right;
        }
       .zkrlogo{
           width: 120px;
           height: 60px;
           img{
               width: 100%;
               height: 100%;
           }
       }
    }
</style>