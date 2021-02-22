<template>
    <div class="login">
        <login-code></login-code>
    </div>
</template>

<script>
    import {} from 'vue'
    import loginCode from '../../components/login/index'
    export default {
        name: "login",
        components: {
            loginCode
        },
        setup(){

        },
        data () {
            return {

            }
        },
        mounted() {
        },
        methods:{}

    };
</script>

<style lang="less" scoped>
    .login{
        height: 100%;
    }
</style>

