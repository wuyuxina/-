<template>
    <div class="meun">
        <ul class="layui-nav layui-nav-tree layui-inline" lay-filter="demo" style="margin-right: 10px;">
            <li class="layui-nav-item layui-this" >
                <router-link to="/home">首页</router-link>
            </li>
            <li class="layui-nav-item ">
                <a href="javascript:;">登录</a>
                <dl class="layui-nav-child">
                    <dd class=""><router-link to="/loginCon">登录页</router-link></dd>
                    <dd class=""><router-link to="/loginCode">登录验证码</router-link></dd>
                </dl>
            </li>
            <li class="layui-nav-item" >
                <router-link to="/dialogPage">弹出层</router-link>
            </li>
            <li class="layui-nav-item ">
                <a href="javascript:;">视频</a>
                <dl class="layui-nav-child">
                    <dd class=""><router-link to="/videoPage">视频</router-link></dd>
                    <dd class=""><router-link to="/videoYt">云台控制</router-link></dd>
                    <dd class=""><router-link to="/videoIE">ie</router-link></dd>
                </dl>
            </li>
            <li class="layui-nav-item" >
                <router-link to="/upload">上传文件</router-link>
            </li>
            <li class="layui-nav-item" >
                <router-link to="/eidtorPage">富文本编辑器</router-link>
            </li>
            <li class="layui-nav-item ">
                <a href="javascript:;">tree树</a>
                <dl class="layui-nav-child">
<!--                    <dd class=""><router-link to="/leftTree">左侧树</router-link></dd>-->
                    <dd class=""><router-link to="/selectTree">下拉树</router-link></dd>
                </dl>
            </li>
            <li class="layui-nav-item ">
                <a href="javascript:;">时间</a>
                <dl class="layui-nav-child">
                    <!--                    <dd class=""><router-link to="/leftTree">左侧树</router-link></dd>-->
                    <dd class=""><router-link to="/timeDate">时间下拉</router-link></dd>
                    <dd class=""><router-link to="/timeShow">时间展示</router-link></dd>
                </dl>
            </li>
            <li class="layui-nav-item" >
                <router-link to="/bufferZone">缓冲区查询</router-link>
            </li>
            <li class="layui-nav-item" >
                <router-link to="/error">404</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "meun",
        data() {
            return{}
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

<style scoped>

</style>