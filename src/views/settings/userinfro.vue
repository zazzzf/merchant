<style lang="less">
    @import './userinfro.less';
    @import "../../styles/common.less";
    .shop-ewm{ position: absolute; left:480px; top:67px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
</style>

<template>
    <div>
             

        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                基本信息设置
            </p>
            <div>
                <Spin fix v-if="FormSubmiting">
                    <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                    <div>保存中，请稍等...</div>
                </Spin>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="130" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="商户名称：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.name" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="审核状态：">
                        <div style="display:inline-block;width:300px;">
                            <template v-if="userForm.applicantStatus==1"><span style="color:green">已通过</span></template>
                            <template v-else-if="userForm.applicantStatus==2"><span style="color:red">未通过</span></template>
                            <template v-else><span style="color:gray">审核中</span></template>
                        </div>
                    </FormItem>
                    <FormItem label="商户地址：" prop="address">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.address" ></Input>

                        </div>
                    </FormItem>
                      <FormItem label="商户面积：" prop="address">
                        <div style="display:inline-block;width:300px;">
                            <!-- <Input v-model="userForm.operating_area" ></Input> -->
                             {{userForm.merchantOperatingArea }}
                        </div>
                    </FormItem>
                    <FormItem label="营业执照：" prop="businessLicense">                 
                        <noUpFileInput :fileInfro="userForm.businessLicense"></noUpFileInput>
                    </FormItem>
                    <FormItem label="商户类型：">
                        <div style="display:inline-block;width:300px;">
                            {{ merchantType[userForm.merchantType] }}
                        </div>
                    </FormItem>
                    <FormItem label="商户分类：">
                        <div style="display:inline-block;width:300px;">
                            {{ userForm.merchantCategory }}
                        </div>
                    </FormItem>
                    <FormItem label="商户折扣差：" prop="rebate">
                        <div style="display:inline-block;width:300px;">
                            <span class="number color-blue">{{userForm.rebate*100}}%</span>
                        </div>
                    </FormItem>
                    <FormItem label="联系人姓名：" prop="contactor">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.contactor" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="商户电话：" prop="phone">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.phone" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="联系人身份证号码：" prop="idCard">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.idCard" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="联系人身份证照片：" prop="idCardImage">
                        <noUpFileInput :fileInfro="userForm.idCardImage"></noUpFileInput>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 130px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                    <div class="shop-ewm" v-if="userForm.applicantStatus==1"><a :href="userewm" target="blank"><img :src="userewm" /></a><br>点击右键选择图片另存为<br>即可下载二维码</div>
                </Form>
                
            </div>
        </Card>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';
import upload from '../my_components/upload/upload.vue';

export default {
    name: 'settings-userinfro',
    components: {
        upload,noUpFileInput
    },
    data () {
        return {
            merchantType:["","商圈","商城"],
            userForm: {
                name: '',
                address: '',
                businessLicense: {
                    url:"",
                    file:"",
                    fileObj:"file_businessLicense",
                    fileObjName:"营业执照",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                userType: '',
                rebate: '',
                phone: '',
                idCard: '',
                idCardImage: {
                    url:"",
                    file:"",
                    fileObj:"file_idCardImage",
                    fileObjName:"身份证照片",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                contactor: ''
            },
            userewm:"",
            userTypeList: [
                {
                    value: -1,
                    label: '未知'
                }
            ],
            upLoadingBusinessLicense: false,
            upLoadingIdCardImage:false,
            FormSubmiting:false,
            uid: '',  // 登录用户的userId
            save_loading: false,
            inforValidate: {
                name: [
                    { required: true, message: '请输入商户名称', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入商户地址', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入商户电话', trigger: 'blur' }
                ],
                idCard: [
                    { required: true, message: '请输入商户联系人身份证号码', trigger: 'blur' }
                ],
                contactor: [
                    { required: true, message: '请输入商户联系人', trigger: 'blur' }
                ]//,
                // idCardImage: [
                //     { required: true, message: '请上传联系人身份证照片', trigger: 'blur' }
                // ],
                // businessLicense: [
                //     { required: true, message: '请上传营业执照', trigger: 'blur' }
                // ]
            }
        };
    },
    methods: {
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'settings-userinfro');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    
                    var formData = new FormData();
                    formData.append("ssid", Cookies.get('ssid'));
                    formData.append("merchantName", this.userForm.name);
                    // formData.append("merchantType", this.userForm.userType);
                    formData.append("merchantPhone", this.userForm.phone);
                    formData.append("merchantAddress", this.userForm.address);
                    formData.append("applicantName", this.userForm.contactor);
                    formData.append("applicantIdCard", this.userForm.idCard);

                    if(this.userForm.businessLicense.file){
                        formData.append("merchantBusiness", this.userForm.businessLicense.file);
                    };
                    if(this.userForm.idCardImage.file){
                        formData.append("applicantIdCardImage", this.userForm.idCardImage.file);
                    };
      
                    this.FormSubmiting=true;
                    let _this=this;
                    //拉取用户类型
                    $.ajax({
                        url: Config.api.setting.Userinfro.update,
                        type: 'POST',
                        dataType: 'json',
                        data: formData,   
                        cache: false,  
                        contentType: false,  
                        processData: false 
                    })
                    .done((data)=>{
                        this.FormSubmiting=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.userForm.businessLicense.file="";
                                this.userForm.idCardImage.file="";
                                this.init();
                                this.$Message.success("成功保存基本信息！");
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.FormSubmiting=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            });
        },
        init () {
            let _this=this;
            let sucessFun=(data)=>{

                this.savePassLoading = false;
                if(!!data){
                    if(data.code==0){
                        this.userForm.name=data.data.merchantName;
                        this.userForm.address=data.data.merchantAddress;
                        this.userForm.businessLicense.url=data.data.merchantBusiness;
                        this.userForm.userType=data.data.merchantType;
                        this.userForm.rebate=data.data.merchantRatio;
                        this.userForm.phone=data.data.merchantPhone;
                        this.userForm.idCard=data.data.applicantIdCard;
                        this.userForm.idCardImage.url=data.data.applicantIdCardImage;
                        this.userForm.contactor=data.data.applicantName;
                        this.userForm.applicantStatus=data.data.applicantStatus;
                        this.userForm.merchantCategory=data.data.merchantCategory;
                        this.userForm.merchantType=data.data.merchantType;
                        this.userewm=Config.api.public.ewm+"&merchantId="+Cookies.get('merchant_id')
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:"获取基本信息失败"
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"数据获取错误"
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
                    ssid:Cookies.get('ssid')
                }); 
            $.ajax({
                url: Config.api.setting.Userinfro.getInfro,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done(sucessFun)
            .fail(errFun);
            //拉取用户类型
            $.ajax({
                url: Config.api.public.merchantType,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        let typelist=[];
                        for (let item in data.data){
                            typelist.push({ value: data.data[item].id ,label: data.data[item].name});
                        }
                        this.userTypeList=typelist;
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"获取用户类型失败"
                    });
                }
            })
            .fail((xhr,status,error)=>{
                Config.showError({vm:this,
                    errorMsg:"获取用户类型失败"
                });
            });

        }
    },
    created () {
       
    },
    mounted () {
        
    },
    activated () {
       this.init();
    }
};
</script>
