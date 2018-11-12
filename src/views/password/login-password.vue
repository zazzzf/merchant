<style lang="less">
    @import './login-password.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                修改登录密码
            </p>
            <div>
                <Form 
                    ref="editPasswordForm"
                    :model="editPasswordForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="passwordValidate"
                >
                    <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                        <div style="display:inline-block;width:300px;">
                            <Input :disabled="savePassLoading" v-model="editPasswordForm.oldPass" type="password" placeholder="请输入现在使用的密码" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="新密码" prop="newPass">
                        <div style="display:inline-block;width:300px;">
                            <Input :disabled="savePassLoading" v-model="editPasswordForm.newPass" type="password" placeholder="请输入新密码，至少6位字符" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="确认新密码" prop="rePass">
                        <div style="display:inline-block;width:300px;">
                            <Input :disabled="savePassLoading" v-model="editPasswordForm.rePass" type="password" placeholder="请再次输入新密码" ></Input>
                        </div>
                    </FormItem>
                    <div>
                        <Button type="primary" :disabled="savePassLoading" style="width: 100px; margin-left:100px " :loading="savePassLoading" @click="saveEditPass">提交修改</Button>
                    </div>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';

export default {
    name: 'login-password',
    data () {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            savePassLoading: false,
            oldPassError: '',
            checkIdentifyCodeLoading: false,
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    let _this=this;
                    let sucessFun=(data)=>{
                        this.savePassLoading = false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("修改成功");
                                this.closePage("modify-password");
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"数据获取错误，请刷新重试"
                            });
                        }
                    };
                    let errFun=(xhr,status,error)=>{
                        this.savePassLoading = false;
                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器请求失败"
                        });
                    };
                    let postData=()=>({
                            ssid:Cookies.get('ssid'),
                            id:Cookies.get('user_id'),
                            password:this.editPasswordForm.oldPass,
                            new_password:this.editPasswordForm.newPass,
                            ok_new_password:this.editPasswordForm.rePass
                        });
                    $.ajax({
                        url: Config.api.main.modifyPassword,
                        type: 'POST',
                        dataType: 'json',
                        data: postData()
                    })
                    .done(sucessFun)
                    .fail(errFun);
                    // you can write ajax request here
                }
            });
        },
        closePage (pageName) {
            this.$store.commit('removeTag', pageName);
            this.$store.commit('closePage', pageName);
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            if (this.$store.state.currentPageName === pageName) {
                let lastPageName = '';
                if (this.$store.state.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            }
        }
    },
    mounted () {
    }
};
</script>