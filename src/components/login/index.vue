<template>
    <div class="login">
        <login-box :loginType="'allUp'" :encrypt="'sha512'"></login-box>
    </div>
</template>

<script>
    // import loginBox from "./../authCode/index";
    import loginBox from "./loginBox";
    export default {
        name: "login",
        components:{loginBox},
        data(){
            return{}
        },
    }
</script>

<style scoped lang="less">
    .login{
        background: url(./assets/image/background.jpg)no-repeat;
        background-size: 100% 100%;
    }
</style>