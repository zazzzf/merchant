<style lang="less">
    @import './login.less';
    .logincode{ position: relative;}
    .logincode-input .ivu-input{ width: 50%; float: left}
    .logincode-img{ width: 130px; float: right; margin:2px 0 0; position: absolute;top: 0;right:0;}
    .logincode-img img{border-radius: 3px;}
    .login-right{
        float:right;
        width:634px;
        height:435px;
        margin-top:50px;
        padding:50px;
        box-sizing: border-box;
        border-radius: 10px;
        background-color:rgba(255,255,255,0.2);
    }

    .login-con .ivu-input-group-prepend{
        width:58px!important;
    }
    .login-con .ivu-input{
        height:58px!important;
        height-line:58px!important;
    }

    .login-left{
        float: left;
        position: relative;
        top: -15px;
    }

</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">

                <div class="login-left">
                    <img src="../styles/loginApp.png" class="loginImg">
                </div>
                <div class="login-right">
                     <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules">
                            <div  style="width:518px;margin: auto;height:58px;margin-bottom:20px;">
                                <FormItem prop="userName" style="height:58px;">
                                    <Input v-model="form.userName"  style="height:58px !important;line-height:58px !important;" placeholder="请输入用户名">
                                        <span slot="prepend">
                                            <Icon :size="28" type="person"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                            </div>
                            <div style="width:518px;margin: auto;height:58px;margin-bottom:20px;">
                                <FormItem prop="password">
                                    <Input type="password"  style="" v-model="form.password" placeholder="请输入密码">
                                        <span slot="prepend">
                                            <Icon :size="14" type="locked"></Icon>
                                        </span>
                                    </Input>
                                </FormItem>
                            </div>
                            <div style="width:518px;margin: auto;height:58px;margin-bottom:20px;">
                                <FormItem prop="logincode" class="logincode">
                                    <Input v-model="form.logincode"  :maxlength="4" style="width: 378px; float:left;" class="logincode-input" placeholder="请输入验证码">
                                        <span slot="prepend">
                                            <Icon :size="14" type="ios-eye"></Icon>
                                        </span>
                                    </Input>
                                    <Tooltip content="看不清？点击刷新" placement="top" class="logincode-img">
                                        <img :src="loginCodeBaseUrl+form.random" @click="changeCodeImg" width="130" height="58" />
                                    </Tooltip>
                                    <div class="clearfix"></div>
                                </FormItem>
                            </div>
                            <div style="width:518px;margin: auto;margin-bottom:20px;">
                                <FormItem>
                                    <Button style="height:58px;background:#cea34c;border:none" @click="handleSubmit()" type="primary" long>登录</Button>
                                </FormItem>
                            </div>
                        </Form>
                        <!-- <p class="login-tip"><a href="javascript:;"  @click="register" >没有帐号？点击注册</a></p> -->
                    </div>
                </div>

        </div>
        <div class="copy-right">
            © 2018陕西振华网络科技有限责任公司 <br /> 技术支持：陕西振华网络科技有限责任公司     客服热线：000-000-0000
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';

Cookies.remove('user');
Cookies.remove('user_id');
Cookies.remove('merchant_id');
Cookies.remove('ssid');
Cookies.remove('cloud_account');
Cookies.remove('cloud_status');
Cookies.remove('user_power');


export default {
    data () {
        return {
            loginCodeBaseUrl:this.$store.state.public.api.login.CodeImage+"&code=",
            form: {
                userName: '',
                password: '',
                logincode:"",
                random:(parseInt(Math.random()*1000000))
            },
            rules: {
                userName: [
                    {   whitespace:true, //不能输入空白字符
                        required: true, // len  — 输入值不能为空
                                        // pattern — 必须匹配pattern表示的正则表达式
                                        // values <array> in
                                        // type [
                                                // array：必须是由所确定的数组Array.isArray。
                                                // boolean：必须是类型的boolean。
                                                // date：值必须是有效的，由确定moment().isValid()。
                                                // enum：价值必须存在于list。
                                                // float：必须是类型number和浮点数。
                                                // function：必须是类型的function。
                                                // integer：必须是类型number和整数。
                                                // null：必须严格平等null。
                                                // number：必须是类型的number。
                                                // object：必须是类型object而不是Array.isArray。
                                                // regexp：必须是一个RegExp或一个有效的字符串正则表达式的实例。
                                                // string：必须是类型的string。
                                                // ]
                                        // whitespace — 输入的值不能大于maxlength表示的值
                                        // list [ type ：“ enum ”，  list ：[ ' admin '，' user '，' guest ' ] ]
                                        // min — 输入值不能小于min表示的值
                                        // max — 输入值不能大于max表示的值
                      message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { whitespace:true, required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                logincode: [
                    { required: true, max: 4 ,min: 4, message: '请正确输入验证码', trigger: 'blur' },
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            Cookies.set('access', 1);
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let _this=this;
                    let postData={
                        account: this.form.userName,
                        password: this.form.password,
                        code: this.form.logincode,
                        random: this.form.random
                    };
                    let sucessFun=function(data){
                        console.log(data);
                        if(!!data){
                            if(data.code==0&&data.data.ssid){
                                Cookies.set('user', data.data.username);
                                Cookies.set('user_id', data.data.id);
                                Cookies.set('merchant_id', data.data.merchant_id);
                                Cookies.set('ssid', data.data.ssid);
                                Cookies.set('cloud_account', data.data.cloud_account);
                                Cookies.set('cloud_mobile', data.data.cloud_mobile);
                                Cookies.set('cloud_status', data.data.cloud_status);
                                Cookies.set('is_direct', data.data.is_direct);
                                Cookies.set('merchant_type', data.data.merchant_type);
                                // Cookies.set('user_power', JSON.stringify(defaultData.power));
                                _this.$store.commit('setAvator', data.data.logo);
                                _this.$store.commit('setPower');
                                _this.$router.push({
                                    name: 'home_index'
                                });
                            }else{
                                _this.$Modal.error({
                                    title: "登录失败",
                                    content: `<span style="font-size:14px;color:red">${data.message}</span><br />
                                              <p style="color:#999;padding-top:20px">错误代码：${data.code}</p>
                                             `
                                });
                                _this.changeCodeImg();
                            }
                        }else{
                            _this.$Modal.error({
                                title: "服务器错误",
                                content: ""
                            });
                        }
                    };
                    let errFun=function (){
                        _this.$Modal.error({
                            title: "登录失败",
                            content: "服务器请求失败"
                        });
                    };
                    $.ajax({
                        url: this.$store.state.public.api.login.request,
                        type: 'POST',
                        dataType: 'json',
                        data: postData,
                    })
                    .done(sucessFun)
                    .fail(errFun);
                }
            });
        },
        changeCodeImg () {
            this.form.random=(parseInt(Math.random()*1000000))
        },
        register (){
            this.$router.push({
                name: 'register'
            });
        }
    }
};
</script>

<style>

</style>
