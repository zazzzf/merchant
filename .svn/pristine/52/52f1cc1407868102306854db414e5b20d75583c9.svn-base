<style lang="less">
    @import './shopinfro.less';
    @import "../../styles/common.less";
    .spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
        float: left;
        margin-top:6px;
        margin-right:7px
    }
    #allmap {width: 50%;height: 300px;overflow: hidden;margin:0;font-family:"微软雅黑";}
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                商铺店铺资料设置
            </p>
            <div>
                <Spin fix v-if="FormSubmiting"></Spin>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="130" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="营业执照：" prop="businessLicense">
                        <input type="hidden" v-model="userForm.businessLicense" />
                        <div style="display:inline-block;width:auto;height:80px;position: relative;">
                            <Upload 
                            class="upload-list" 
                            :before-upload="handleUpload" 
                            :action="updateAPI" 
                            :show-upload-list="true" 
                            :format="['jpg','jpeg','png']" 
                            :max-size="2048000" 
                            >
                                <Tooltip content="点击上传图片" placement="right">
                                    <img class="user-images" :src="userForm.businessLicense" width="auto" height="80"/>
                                    <Icon type="ios-cloud-upload" size="20"></Icon>
                                </Tooltip>
                                <Spin size="large" fix v-if="upLoadingBusinessLicense">
                                    <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                                    <span>上传中...</span>
                                </Spin>
                            </Upload>
                        </div>
                    </FormItem>
                    <FormItem label="商户位置：" prop="Point">
                        <Input v-model="Point" ></Input>
                        经度：<Input v-model="userForm.Point.lng" ></Input>
                        纬度：<Input v-model="userForm.Point.lat" ></Input>
                        纬度：<Input @blur="searcharea" v-model="userForm.Point.address" ></Input>
                        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto;"></div>
                        <div id="allmap"></div>
                    </FormItem>
                    <FormItem label="商户电话：" prop="phone">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.phone" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="联系人身份证照片：" prop="idCardImage">
                        <input type="hidden" v-model="userForm.idCardImage" />
                        <div style="display:inline-block;width:auto;height:80px;position: relative;">
                            <Tooltip content="点击上传图片" placement="right">
                                <img class="user-images" :src="userForm.idCardImage" width="auto" height="80"/>
                                <Icon type="ios-cloud-upload" size="20"></Icon>
                            </Tooltip>
                            <Spin size="large" fix v-if="upLoadingBusinessLicense">
                                <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                                <span>上传中...</span>
                            </Spin>
                        </div>
                    </FormItem>
                    <div>
                        <Button type="text" style="width: 130px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                </Form>

            </div>
        </Card>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import BMap from 'BMap';

export default {
    name: 'settings-shopinfro',
    data () {
        return {
            userForm: {
                name: '',
                address: '',
                businessLicense: '',
                userType: '',
                rebate: '',
                phone: '',
                idCard: '',
                idCardImage: '',
                contactor: '',
                Point:{
                    lat:0,
                    lng:0,
                    address:"西安"
                }
            },
            map:{},
            updateAPI:this.$store.state.public.apiPath+'merchant/basic/types',
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
    computed: {
        Point () {
        
                // var map=this.map;
                // var local = new BMap.LocalSearch(map, {
                //     renderOptions:{map: map}
                // });
                // local.search(this.userForm.Point.address);
                return this.userForm.Point.address;
            }
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
                    this.FormSubmiting=true;
                    let _this=this;
                    let postData=()=>({
                        ssid:Cookies.get('ssid'),
                        merchantName : this.userForm.name,
                        merchantType : this.userForm.userType,
                        merchantBusiness : this.userForm.businessLicense,
                        merchantPhone : this.userForm.phone,
                        merchantAddress : this.userForm.address,
                        applicantName : this.userForm.contactor,
                        applicantIdCard : this.userForm.idCard,
                        applicantIdCardImage : this.userForm.idCardImage
                    });
                    //拉取用户类型
                    $.ajax({
                        url: _this.$store.state.public.apiPath+'merchant/basic/basicInfoEdit',
                        type: 'POST',
                        dataType: 'json',
                        data: postData()
                    })
                    .done((data)=>{
                        this.FormSubmiting=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("成功保存基本信息！");
                            }else{
                                this.$Message.error(data.data.message);
                            }
                        }else{
                           this.$Message.error("修改基本信息失败 "+status); 
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.FormSubmiting=false;
                        this.$Message.error("修改基本信息失败 "+status);
                    });
                }
            });
        },
        setBMap () {
                // 百度地图API功能
                let map = this.map = new BMap.Map("allmap");    

                map.centerAndZoom("西安",12);
                map.enableScrollWheelZoom(true);
                let _this=this;
                //单击获取点击的经纬度
                map.addEventListener("click",function(e){
                    map.clearOverlays()
                    _this.userForm.Point.lat=e.point.lat;
                    _this.userForm.Point.lng=e.point.lng;
                    let marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点
                    map.addOverlay(marker);    //增加点
                });
        },
        searcharea () {
            
        },
        init () {
            let _this=this;
            this.setBMap();
            let sucessFun=(data)=>{
                this.savePassLoading = false;
                if(!!data){
                    if(data.code==0){
                        this.userForm.name=data.data.merchantName;
                        this.userForm.address=data.data.merchantAddress;
                        this.userForm.businessLicense=data.data.merchantBusiness;
                        this.userForm.userType=data.data.merchantType;
                        this.userForm.rebate=data.data.merchantRatio;
                        this.userForm.phone=data.data.merchantPhone;
                        this.userForm.idCard=data.data.applicantIdCard;
                        this.userForm.idCardImage=data.data.applicantIdCardImage;
                        this.userForm.contactor=data.data.applicantName;
                    }else{
                        this.$Message.error(data.message);
                    }
                }else{
                    this.$Message.error("数据获取错误，请刷新重试");
                }
            };
            let errFun=(xhr,status,error)=>{
                this.savePassLoading = false;
                this.$Message.error("服务器请求失败 "+status);
            };
            let postData=()=>({
                    ssid:Cookies.get('ssid')
                });
            $.ajax({
                url: _this.$store.state.public.apiPath+'merchant/basic/basicInfo',
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done(sucessFun)
            .fail(errFun);
            //拉取用户类型
            $.ajax({
                url: _this.$store.state.public.apiPath+'merchant/basic/types',
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
                            typelist.push({ value: parseInt(item) ,label: data.data[item]});
                        }
                        this.userTypeList=typelist;
                    }else{
                        this.$Message.error(data.data.message);
                    }
                }else{
                   this.$Message.error("获取用户类型失败 "+status); 
                }
            })
            .fail((xhr,status,error)=>{
                this.$Message.error("获取用户类型失败 "+status);
            });

        },
        handleUpload (file) {
            console.log("1");
            
            this.file = file;
            return true;
        },
        upload () {
            console.log("3");
            this.loadingStatus = true;
            setTimeout(() => {
                this.file = null;
                this.loadingStatus = false;
                this.$Message.success('Success')
            }, 1500);
        }
    },
    mounted () {
        this.init();
    }
};
</script>