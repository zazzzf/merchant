<style lang="less">
    @import './shopinfro.less';
    @import "../../styles/common.less";
    #allmap {height: 290px;overflow: hidden;margin:0;font-family:"微软雅黑";max-width: 600px}
    .loadingforsubmit.ivu-spin-fix{ z-index:9999 }
    .tangram-suggestion-main{z-index: 999}
    .upload-list{ float:left}
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                商铺店铺资料设置
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
                    <FormItem label="商户Logo：" prop="shopLogo">
                        <noUpFileInput :fileInfro="userForm.shop_logo"></noUpFileInput>
                    </FormItem>
                    <FormItem label="店铺照片：" prop="shopImages">
                        <multiupload v-if="userForm.isImagesListDataReady" :imagesList="userForm.shopImages" :uploadAPI="uploadAPI" :removeAPI="removeAPI" :uploadModel="userForm.shopImages"></multiupload>
                    </FormItem>
                    <FormItem label="商户位置：" prop="Point">
                        <div id="r-result">
                            <Row>
                                <Col span="10">
                                    <Input 
                                    type="text" 
                                    v-model="userForm.newPoint.address" 
                                    placeholder="请输入关键字定位或直接在地图上点击获取坐标" 
                                    element-id="suggestId" 
                                    value="" 
                                    style="position: relative;z-index:999;max-width: 600px">
                                    </Input>
                                    <div id="allmap" style="margin-top:6px"></div>
                                </Col>
                                <Col span="14" class="padding-left-5">
                                    <div>
                                        <Tag>原位置</Tag> <br />
                                        <span class="color-gray ">经度：</span> <span class="number">{{userForm.Point.lng}}</span> 
                                        <span class="color-gray ">纬度：</span> <span class="number">{{userForm.Point.lat}}</span>
                                    </div>
                                    <div v-if="userForm.newPoint.lng>0">
                                        <Tag>新位置</Tag><Button @click="clearAddress" size="small" type="error">清除</Button> <br />
                                        关键字：<span>{{userForm.newPoint.address}}</span> <br />
                                        经度：<span class="number color-gray ">{{userForm.newPoint.lng}}</span> 
                                        纬度：<span class="number color-gray ">{{userForm.newPoint.lat}}</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </FormItem>
                    <FormItem label="商户简介：" prop="phone">
                        <div style="display:inline-block;width:300px;">
                            <Input type="textarea" :rows="4" v-model="userForm.information" ></Input>
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
import Config from '../../config/config';
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';
import multiupload from '../my_components/upload/multiupload.vue';

export default {
    name: 'settings-shopinfro',
    components: {
        noUpFileInput,
        multiupload
    },
    data () {
        return {
            uploadAPI:Config.api.setting.shopInfro.multiUpload,
            removeAPI:Config.api.setting.shopInfro.removeImage,
            userForm: {
                information: '',
                shop_logo: {
                    url:"",
                    file:"",
                    fileObj:"file_shopLogo",
                    fileObjName:"店铺照片",
                    uploadMenu:"选择图片",
                    uploadType:"sync",
                    type:"image",
                    maxSize:2048
                },
                shopImages:[],
                isImagesListDataReady:false,
                Point:{
                    lat:34.275993,
                    lng:108.953924,
                    address:"西安市"
                },
                newPoint:{
                    lat:0,
                    lng:0,
                    address:""
                }
            },
            map:{},
            userTypeList: [
                {
                    value: -1,
                    label: '未知'
                }
            ],
            upLoadingshopLogo: false,
            upLoadingshopImages:false,
            FormSubmiting:false,
            save_loading: false,
            inforValidate: {
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

                    this.FormSubmiting=true;

                    var formData = new FormData();
                    formData.append("ssid", Cookies.get('ssid'));
                    formData.append("lng", this.userForm.newPoint.lng||this.userForm.Point.lng);
                    formData.append("lat", this.userForm.newPoint.lat||this.userForm.Point.lat);
                    formData.append("logo", this.userForm.shop_logo.file);
                    formData.append("description", this.userForm.information);

                    if(this.userForm.shop_logo.file){
                        formData.append("logo", this.userForm.shop_logo.file);
                    };

                    //拉取用户类型                   
                    $.ajax({
                        url: Config.api.setting.shopInfro.update,
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
                                this.$Message.success("成功保存基本信息！");
                                this.setMapCenter(this.userForm.newPoint.lng||this.userForm.Point.lng,this.userForm.newPoint.lat||this.userForm.Point.lat);
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
                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            });
        },
        clearAddress () {
            this.userForm.newPoint.lat=0;
            this.userForm.newPoint.lng=0;
            this.userForm.newPoint.address="";
        },
        setBMap () {
            var map = this.map = new BMap.Map("allmap");    
            var geoc = new BMap.Geocoder(); 
            let default_point=new BMap.Point(this.userForm.Point.lng,this.userForm.Point.lat);
            map.centerAndZoom(default_point,14);
            map.addOverlay(new BMap.Marker(default_point));
            map.enableScrollWheelZoom(true);
            let _this=this;
            //单击获取点击的经纬度
            map.addEventListener("click",function(e){
                map.clearOverlays();
                var pt = e.point;
                geoc.getLocation(pt, function(rs){
                    var addComp = rs.addressComponents;
                    var newAddress=addComp.province + "" + addComp.city + "" + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
                    _this.userForm.newPoint.address=newAddress;
                });  
                _this.userForm.newPoint.lat=e.point.lat;
                _this.userForm.newPoint.lng=e.point.lng;

                let marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点
                map.addOverlay(marker);    //增加点
            });
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : "suggestId"
                ,"location" : map
                , "onSearchComplete" :function(e){}
            });
            ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件 
            });

            var myValue;
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;    
                _this.userForm.newPoint.address=myValue;              
                setPlace();
            });

            function setPlace(){
                map.clearOverlays();    //清除地图上所有覆盖物
                function myFun(){
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                    _this.userForm.newPoint.lat=pp.lat;
                    _this.userForm.newPoint.lng=pp.lng;
                    map.centerAndZoom(pp, 16);
                    map.addOverlay(new BMap.Marker(pp));    //添加标注
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                  onSearchComplete: myFun
                });
                local.search(myValue);
            }
        },
        setMapCenter (lng,lat) {
            this.map.clearOverlays();
            let default_point=new BMap.Point(lng,lat);
            this.map.centerAndZoom(default_point,14);
            this.map.addOverlay(new BMap.Marker(default_point));
        },
        init () {
            let _this=this;
            
            let sucessFun=(data)=>{
                this.savePassLoading = false;
                if(!!data){
                    if(data.code==0){
                        this.userForm.shop_logo.url=data.data.merchantLogo||""
                        let old_images_list=[];
                        data.data.merchantImages.forEach(
                            (item,i) => {
                                old_images_list.push({
                                    name:"item"+i,
                                    url:item.image,
                                    id:item.id,
                                    merchant_id:item.merchant_id,
                                    status:"finished"
                                });
                            }
                        );
                        this.userForm.shopImages=old_images_list;
                        this.userForm.Point.lat=data.data.merchantLat||"34.275993";
                        this.userForm.Point.lng=data.data.merchantLng||"108.953924";
                        this.userForm.Point.address=data.data.address||"西安市";
                        this.userForm.information=data.data.merchantDescription;
                        this.setMapCenter(this.userForm.Point.lng,this.userForm.Point.lat);
                        this.userForm.isImagesListDataReady=true;
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
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
                url: Config.api.setting.shopInfro.getInfro,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done(sucessFun)
            .fail(errFun);
        }
    },
    mounted () {
        this.setBMap();
    },
    activated () {
       this.init();
    }
};
</script>