<style lang="less">
    @import "../../styles/common.less";
    #allmap {height: 290px;overflow: hidden;margin:0;font-family:"微软雅黑";max-width: 600px}
    .loadingforsubmit.ivu-spin-fix{ z-index:9999 }
    .tangram-suggestion-main{z-index: 999}
    .upload-list{ float:left}
    .sepcs-data-list{color:#f00}
    .sepcs-data-items{ height:13px !important; margin-bottom:17px; border-bottom:1px dashed #dededf;}
    .currentQuantity{border-bottom-color: #57a3f3;}
    .currentQuantity .ivu-tag{border-color: #57a3f3; color:#57a3f3}
    .specs-data-box{margin-top:16px;}
</style>

<template>
    <div>
        <Spin fix v-if="FormSubmiting">
            <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
            <div>保存中，请稍等...</div>
        </Spin>
        <Form
            ref="userForm"
            :model="currentData"
            :label-width="130"
            label-position="right"
            :rules="inforValidate"
        >
            <Spin size="large" fix v-if="!isDataReady"></Spin>
            <Row v-if="isDataReady">
                <Col span="12">
                   <FormItem label="商品名称：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="currentData.name" placeholder="商品名称" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="商品标签：" prop="tag">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="currentData.tag" placeholder="商品标签" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="商品分类：" prop="category_id">
                        <div style="display:inline-block;width:300px;">
                            <Select v-model="currentData.category_id" @on-change="product_cl" placeholder="选择类型" style="width:145px">
                                <template>
                                         <Option v-for="item,key in product_class" :value="item.id" :key="item.id">  {{ item.name }}</Option>
                                </template>
                            </Select>
                            <Select v-model="currentData.product_cl" placeholder="" style="width:145px">
                                <template>
                                         <Option v-for="item,key in product_classs" :value="item.id" :key="item.id">  {{ item.name }}</Option>
                                </template>
                            </Select>
                        </div>
                    </FormItem>
                    <FormItem label="上架数量：" prop="quantity">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="currentData.quantity" placeholder="上架数量" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="商品列表图：">
                        <noUpFileInput :fileInfro="goods_image" @updateData="giveMeFile" :uploadModel="goods_image"></noUpFileInput>
                        <div v-if="goods_image.isErr" class="ivu-form-item-error-tip">请设置商品列表图</div>
                    </FormItem>
                    <FormItem label="商品轮播图：">
                            <multiupload  v-if="imagesReady" :imagesList="goods_images.list" :productID="currentData.id" :uploadAPI="uploadAPI" :ImageType="1" :removeAPI="removeAPI" :uploadModel="goods_images"></multiupload>

                        <div v-if="goods_images.isErr" class="ivu-form-item-error-tip">请上传商品轮播图</div>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="商品规格：">
                        <template v-for="item in currentSpecsData.specs">
                            <Tag>{{item.name}}</Tag>
                        </template>  <Button type="success" style="width: 100px;" @click="setSpecs">设置规格</Button>
                        <div v-if="currentSpecsData.isErr" class="ivu-form-item-error-tip">请输入商品价格</div>
                    </FormItem>

                    <FormItem label="商品价格：" prop="price">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="currentData.price" placeholder="商品价格" ></Input>
                        </div>
                    </FormItem>
                    <FormItem v-if="currentData.carriage_type!==1" label="物流费用：" prop="logistics_price">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="currentData.logistics_price" placeholder="物流费用" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="物流类型：" prop="carriage_type">
                        <RadioGroup v-model="currentData.carriage_type">
                            <template v-for="item,key in publicData.carriage_type" v-if="key>0">
                                <div v-if="key===3" class="clearfix"></div>
                                <Radio :label="key">
                                    <span>{{item}}</span>
                                </Radio>
                            </template>
                            <div v-if="currentData.carriage_type===3" style="display:inline-block;width:70px;">
                                <Input v-model="currentData.carriage" placeholder="附加费用" ></Input>
                            </div>
                        </RadioGroup>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="商品描述：" prop="description">
                <Input type="textarea" :rows="4" v-model="currentData.description" ></Input>
            </FormItem>
             <FormItem label="商品详情图：">
                <multiupload  v-if="imagesReady" :imagesList="goods_images_details.list" :productID="currentData.id" :uploadAPI="uploadAPI" :ImageType="2" :removeAPI="removeAPI" :uploadModel="goods_images_details"></multiupload>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
            </FormItem>
        </Form>
        <Modal v-model="isEditSpecs" :closable='false' :mask-closable=false :width="600">
            <h3 slot="header" style="color:#2D8CF0">设置商品规格</h3>
            <div class="specs-box">
                <CheckboxGroup @on-change="setCurrentSpecsValues" v-model="currentSpecsData.currentSpecs">
                    <template v-for="item,key in specs_list.list">
                        <Checkbox :label="item.id">{{item.name}}</Checkbox>
                    </template>
                </CheckboxGroup>
            </div>
            <div class="specs-data-box" v-if="currentSpecsData.specs_list_data.length>0">
                <template v-for="item,key in currentSpecsData.specs_list_data">
                    <Row class="sepcs-data-items" :class="{'currentQuantity':currentQuantity===key}">
                    <Col span="12">
                        <template v-for="items,key in item.showtext">
                            <Tag v-if="(key%2)===0">{{item.showtext[key]}}：{{item.showtext[key+1]}}</Tag>
                        </template>
                        </Col>
                        <Col span="12" style="text-align:right">
                            <div style="display:inline-block;width:120px;">
                                <Input @on-focus="changeBgLine(key)" size="small" v-model="currentSpecsData.specs_list_data[key].quantity"><span slot="prepend">库存</span></Input>
                            </div>
                            <div style="display:inline-block;width:120px;">
                                <Input @on-focus="changeBgLine(key)" size="small" v-model="currentSpecsData.specs_list_data[key].price"><span slot="prepend">价格</span></Input>
                            </div>
                            <Button type="default" style="display:inline-block;float:right;margin-left:5px;" @click="deleteSpecsData(key)" shape="circle" size="small" icon="close-round"></Button>
                        </Col>
                    </Row>
                </template>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelEditSpecs">取消</Button>
                <Button type="primary" @click="setEditSpecs">保存设置</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Config from '../../config/config';
import noUpFileInput from '../my_components/upload/noUpFileInput.vue';
import multiupload from '../my_components/upload/multiuploadforproduct.vue';

export default {
    name: 'edit-goods',
    components: {
        noUpFileInput,
        multiupload
    },
    props:["param","publicData"],
    data () {
        const validateNumber = (rule, value, callback) => {
            if (value=="") {
                callback(new Error(rule.message));
            } else {
                callback();
            }
        };
        const validateObject = (rule, value, callback) => {
            console.log(value);
            if (value) {
                callback();
            } else {
                callback(new Error(rule.message));
            }
        };
        const validateArray = (rule, value, callback) => {
            console.log(value);
            if (value&&value.length>0) {
                callback();
            } else {
                callback(new Error(rule.message));
            }
        };
        const validateCarriageType = (rule, value, callback) => {
            if (value=="") {
                callback(new Error('请选择运费类型'));
            } else {
                if(value===3){
                    if(this.currentData.carriage>0){
                        callback();
                    }else{
                        callback(new Error('请填写附加运费金额'));
                    }
                }else{
                    callback();
                }

            }
        };
        return {
            uploadAPI:Config.api.mall.goods.uploadImage,
            addUploadAPI:Config.api.mall.goods.uploadImage,
            editUploadAPI:Config.api.mall.goods.edituploadImage,
            removeAPI:Config.api.mall.goods.deleteImage,
            product_class: [],
            product_classs:[],
            specs_list:[],
            specs_list_ready:false,
            currentData:{},
            currentQuantity:-1,
            goods_image: {
                url:"",
                file:"",
                fileObj:"goods_image",
                fileObjName:"店铺照片",
                uploadMenu:"选择图片",
                uploadType:"sync",
                type:"image",
                maxSize:2048,
                isErr:false
            },
            goods_images:{
                list:[],
                newlist:[],
                isErr:false
            },
            goods_images_details:{
                list:[],
                newlist:[],
                isErr:false
            },
            imagesReady:false,
            currentSpecsData:{
                isErr:false,
                currentSpecs:[],
                specs_list_data:[],
                specs:[],
                quantityValues:{},
                specs_childs:[],
                product_options:[],
                getchilding:false,
                product_option_values:[]
            },
            defaultData:{
                "id": "",
                "image": "",
                "name": "",
                "description": "",
                "tag": "",
                "quantity": "",
                "sort_order": "",
                "price": "",
                "logistics_price": "",
                "carriage_type": "",
                "carriage": 0,
                "status": "",
                "date_added": "",
                "category_id": "",
                "merchant_id": "",
                "merchant_name": "",
                "return_num": "",
                "comment_num": "",
                "sales_quantity": "",
                "images": [],
                "product_cl":"",
                "product_option_values": [],
                "category": []
            },
            isEditSpecs:false,
            upLoadingshopLogo: false,
            upLoadingshopImages:false,
            FormSubmiting:false,
            save_loading: false,
            dataReady:3,
            isDataReady:false,
            inforValidate: {
                name: [
                    { required: true, message: '请输入商户名称', trigger: 'blur' }
                ],
                tag: [
                    { required: true, message: '请输入商户标签', trigger: 'blur' }
                ],
                category_id: [
                    { required: true, validator: validateNumber, message:"请选择分类ID", trigger: 'change' }
                ],
                quantity: [
                    { validator: validateNumber, message:"请输入商品数量", trigger: 'change' }
                ],
                price: [
                    { validator: validateNumber, message:"请输入商品价格", trigger: 'change' }
                ],
                logistics_price: [
                    { validator: validateNumber, message:"请输入物流费用", trigger: 'change' }
                ],
                carriage_type: [
                    { validator: validateCarriageType, trigger: 'change' }
                ],
                description: [
                    { required: true, message: '请输入商品描述', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
    },
    methods: {
        inArrayValue : function (arr, targetArr) {
            let res = false;
            arr.forEach(item => {
                if (targetArr === item) {
                    res = true;
                }
            });
            return res;
        },
        resetFields : function () {
            this.currentData=$.extend(true,{},this.defaultData);
            this.goods_image={
                url:"",
                file:"",
                fileObj:"goods_image",
                fileObjName:"商品列表图",
                uploadMenu:"选择图片",
                uploadType:"sync",
                type:"image",
                maxSize:2048,
                isErr:false
            };
            this.goods_images={
                list:[],
                newlist:[],
                isErr:false
            };
            this.goods_images_details={
                list:[],
                newlist:[],
                isErr:false
            },
            this.imagesReady=false;
            this.currentSpecsData={
                isErr:false,
                currentSpecs:[],
                specs_list_data:[],
                specs:[],
                quantityValues:{},
                priceValues:{},
                specs_childs:[],
                product_options:[],
                getchilding:false,
                product_option_values:[]
            };
            this.$refs['userForm'].resetFields();

            this.$nextTick(function () {
                this.goods_image.isErr=false;
                this.goods_images.isErr=false;
                this.goods_images_details.isErr=false;
                this.currentSpecsData.isErr=false;
            })
        },
        giveMeFile : function (file) {
            this.currentData.goods_image.file=file;
        },
        getProductClass () {
            $.ajax({
                url: Config.api.mall.goods.getClass,
                type: 'POST',
                dataType: 'json',
                data: {
                    ssid:Cookies.get('ssid'),
                    parent_id:0,
                    type:2,
                }
            })
            .done((data)=>{
                this.dataReady--;
                //userTypeList
                if(!!data){
                    if(data.code === 0){
                        this.product_class=data.data;
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

                this.dataReady--;
                Config.showError({vm:this,data:data,
                    errorMsg:"服务器通讯失败"
                });
            });

        },
        product_cl:function(){
             $.ajax({
                url: Config.api.mall.goods.getClass,
                type: 'POST',
                dataType: 'json',
                data: {
                    ssid:Cookies.get('ssid'),
                    parent_id:this.currentData.category_id,
                    type:2,
                }
            })
            .done((data)=>{
                this.dataReady--;
                //userTypeList
                if(!!data){
                    if(data.code === 0){
                        this.product_classs=data.data;
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

                this.dataReady--;
                Config.showError({vm:this,data:data,
                    errorMsg:"服务器通讯失败"
                });
            });

        },

         getProductClassParent (index) {
            $.ajax({
                url: Config.api.mall.goods.getClass,
                type: 'POST',
                dataType: 'json',
                data: {
                    ssid:Cookies.get('ssid'),
                    parent_id:index,
                    type:2,
                }
            })
            .done((data)=>{
                this.dataReady--;
                //userTypeList
                if(!!data){
                    if(data.code === 0){
                        this.product_class=data.data;
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

                this.dataReady--;
                Config.showError({vm:this,data:data,
                    errorMsg:"服务器通讯失败"
                });
            });

        },

        testaa (){
            console.log(this.specs_list_data)
        },
        changeBgLine (itemIndex) {
            this.currentQuantity=itemIndex
        },
        getSpecs () {
            $.ajax({
                url: Config.api.mall.goods.getSpecs,
                type: 'POST',
                dataType: 'json',
                data: {
                    ssid:Cookies.get('ssid')
                }
            })
            .done((data)=>{
                this.dataReady--;
                //userTypeList
                if(!!data){
                    if(data.code === 0){
                        this.specs_list=data.data;
                        this.specs_list_ready=true;
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

                this.dataReady--;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        },
        getSpecsOptions (optionId,giveIndex) {
            $.ajax({
                url: Config.api.mall.goods.getSpecsChilds,
                type: 'POST',
                dataType: 'json',
                data: {
                    ssid:Cookies.get('ssid'),
                    option_id:optionId
                }
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code === 0){
                        this.currentSpecsData.specs_childs[giveIndex]=data.data;

                        this.currentSpecsData.sepcs_child_ready--;
                        this.createSpecsArray();
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
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        },
        setSpecs () {
            this.isEditSpecs=true;
        },
        cancelEditSpecs () {
            this.isEditSpecs=false;
        },
        setEditSpecs () {
            this.currentData.product_option_values=[];
            for(let i=0;i<this.currentSpecsData.specs.length;i++){
                this.currentData.product_option_values.push(this.currentSpecsData.specs[i].name)
            };
            this.isEditSpecs=false;
        },
        getSpecsById (SpecsId) {
            let finded=false;
            for(let i=0;i<this.specs_list.list.length;i++){
                if(this.specs_list.list[i].id===SpecsId)finded=this.specs_list.list[i];
            };
            return finded;
        },
        setSpecsValue (SpecsId) {
            if(SpecsId){
                if(this.currentSpecsData.currentSpecs.length>2){
                    this.currentSpecsData.currentSpecs.splice(0,1)
                };
                this.currentSpecsData.currentSpecs.push(SpecsId);
            }else{
                if(this.currentSpecsData.product_options.length>2){
                    this.currentSpecsData.product_options.splice(0,1)
                };
            };
            this.setSpecsOptions();
        },
        setCurrentSpecsValues(item){
            if(this.currentSpecsData.currentSpecs.length>2){
                this.currentSpecsData.currentSpecs.splice(0,1)
            };
            this.setSpecsOptions();
        },
        setSpecsOptions(){
            if(!this.specs_list_ready)return;
            this.currentSpecsData.sepcs_child_ready=this.currentSpecsData.currentSpecs.length;
            if(this.currentSpecsData.currentSpecs.length>=1){
                this.currentSpecsData.specs=[];
                this.currentSpecsData.specs_childs=[];
                for(let i=0;i<this.currentSpecsData.currentSpecs.length;i++){
                    this.currentSpecsData.specs.push(this.getSpecsById(this.currentSpecsData.currentSpecs[i]));
                    this.currentSpecsData.specs_childs.push({});
                    this.getSpecsOptions(this.currentSpecsData.currentSpecs[i],i);
                };

            }else{
                this.currentSpecsData.specs=[];
                this.currentSpecsData.specs_childs=[];
            };
        },
        createSpecsArray () {
            if(this.currentSpecsData.sepcs_child_ready===0){
                let length=1;
                if(this.currentSpecsData.specs_childs.length>=2&&this.currentSpecsData.specs_childs[0].length%this.currentSpecsData.specs_childs[1].length===0){
                    this.currentSpecsData.specs_childs[1].push({"id":"0","name":"","option_id":"0",});
                    // this.currentSpecsData.specs.push({"id":"0","name":"","option_id":"0",});
                }
                for(let i=0;i<this.currentSpecsData.specs_childs.length;i++){
                    length=length*this.currentSpecsData.specs_childs[i].length;
                };
                let newSpecsListData=new Array(length);


                for(let i=0;i<this.currentSpecsData.specs_childs.length;i++){

                    let _index="";
                    if(i>0){_index="_"+(i+1)};
                    let loopNumber=length/this.currentSpecsData.specs_childs[i].length;

                    for(let n=0;n<loopNumber;n++){
                        for(let j=0;j<this.currentSpecsData.specs_childs[i].length;j++){
                            let item_index=n*this.currentSpecsData.specs_childs[i].length+j;
                            let item=newSpecsListData[item_index]||{};
                            item["option_value_id"+_index]=this.currentSpecsData.specs_childs[i][j].id;
                            item["option_value_name"+_index]=this.currentSpecsData.specs_childs[i][j].name;
                            item["option_name"+_index]=this.currentSpecsData.specs[i].name;
                            item["option_id"+_index]=this.currentSpecsData.specs[i].id;
                            item["showtext"]=item["showtext"]||[];
                            item["quantity"]=item["quantity"]||0;
                            item["price"]=item["price"]||0;
                            item["showtext"].push(this.currentSpecsData.specs[i].name);
                            item["showtext"].push(this.currentSpecsData.specs_childs[i][j].name);
                            newSpecsListData[item_index]=item;
                        }
                    }
                };
                let specsNumber=this.currentSpecsData.specs.length;
                for(let i=0;i<newSpecsListData.length;i++){
                    let value_index=[];
                    let _index;
                    if(newSpecsListData[i].option_value_name_2 == ''){
                        newSpecsListData.splice(i,1);
                        continue;
                    }
                    for(let j=0;j<specsNumber;j++){
                        _index="";
                       if(j>0){_index="_"+(j+1)};
                       if(newSpecsListData[i]["option_id"+_index])value_index.push(newSpecsListData[i]["option_id"+_index]);
                       if(newSpecsListData[i]["option_value_id"+_index])value_index.push(newSpecsListData[i]["option_value_id"+_index]);
                    }
                    value_index.sort(function(a,b){
                        return a-b;
                    });
                    if(this.currentSpecsData.quantityValues[value_index.join("_")]){
                        newSpecsListData[i]["quantity"]=this.currentSpecsData.quantityValues[value_index.join("_")];
                        newSpecsListData[i]["price"]=this.currentSpecsData.priceValues[value_index.join("_")];
                    };
                }
                this.currentSpecsData.specs_list_data = newSpecsListData;

            }else{
                this.currentSpecsData.specs_list_data = [];
            }

        },
        deleteSpecsData (dataIndex) {
            this.currentSpecsData.specs_list_data.splice(dataIndex,1)
        },
        setEditSpecsListData () {
            let specs_list_data=this.param.currentProduct.product_option_values;
            if(specs_list_data.length>0){
                for(let i=0;i<specs_list_data.length;i++){
                    if(specs_list_data[i].option_id&&!this.inArrayValue(this.currentSpecsData.currentSpecs,specs_list_data[i].option_id))
                        {
                            this.currentSpecsData.currentSpecs.push(specs_list_data[i].option_id);
                            this.currentSpecsData.specs.push(this.getSpecsById(specs_list_data[i].option_id));
                        };
                    if(specs_list_data[i].option_id_2&&!this.inArrayValue(this.currentSpecsData.currentSpecs,specs_list_data[i].option_id_2))
                        {
                            this.currentSpecsData.currentSpecs.push(specs_list_data[i].option_id_2);
                            this.currentSpecsData.specs.push(this.getSpecsById(specs_list_data[i].option_id_2));
                        };
                    specs_list_data[i].showtext=[];
                    specs_list_data[i].showtext.push(specs_list_data[i].option_name);
                    specs_list_data[i].showtext.push(specs_list_data[i].option_value_name);
                    if(specs_list_data[i].option_name_2)specs_list_data[i].showtext.push(specs_list_data[i].option_name_2);
                    if(specs_list_data[i].option_value_name_2)specs_list_data[i].showtext.push(specs_list_data[i].option_value_name_2);
                    let value_index=[];
                    if(specs_list_data[i].option_id>0){
                        value_index.push(specs_list_data[i].option_id);
                    };
                    if(specs_list_data[i].option_value_id>0){
                        value_index.push(specs_list_data[i].option_value_id);
                    };
                    if(specs_list_data[i].option_id_2>0){
                        value_index.push(specs_list_data[i].option_id_2);
                    };
                    if(specs_list_data[i].option_value_id_2>0){
                        value_index.push(specs_list_data[i].option_value_id_2);
                    }
                    value_index.sort(function(a,b){
                        return a-b;
                    });

                    this.currentSpecsData.quantityValues[value_index.join("_")]=specs_list_data[i].quantity;
                    this.currentSpecsData.priceValues[value_index.join("_")]=specs_list_data[i].price;
                };
            };
            this.currentSpecsData.specs_list_data=specs_list_data;
        },
        getProductDetail () {
            this.resetFields();
            if(!this.param.currentProduct.id){
                this.uploadAPI=this.addUploadAPI;
                this.currentData=$.extend(true,{},this.defaultData);
                this.imagesReady=true;
                this.dataReady--;
            }else{
                this.uploadAPI=this.editUploadAPI;
                this.currentData=this.param.currentProduct;
                this.goods_image.url=this.currentData.image;
                if(this.goods_image.url)this.goods_image.isErr=false;
                let old_images_list=[];
                let old_goods_images_details=[];
                if(this.currentData.banner&&this.currentData.banner.length>0){
                    this.currentData.banner.forEach(
                        (item,i) => {
                            old_images_list.push({
                                name:item.image_key,
                                url:item.image,
                                id:item.id,
                                productID:item.product_id,
                                status:"finished"
                            });
                        }
                    );
                };
                if(this.currentData.images&&this.currentData.images.length>0){
                    this.currentData.images.forEach(
                        (item,i) => {
                            old_goods_images_details.push({
                                name:item.image_key,
                                url:item.image,
                                id:item.id,
                                productID:item.product_id,
                                status:"finished"
                            });
                        }
                    );
                };
                this.goods_images.list=old_images_list;
                this.goods_images_details.list=old_goods_images_details;
                console.log(old_goods_images_details);
                this.goods_images_details.newlist=$.extend(true,[],old_goods_images_details);
                this.goods_images.newlist=$.extend(true,[],old_images_list);
                console.log(old_goods_images_details);
                this.imagesReady=true;
                this.setEditSpecsListData();
                this.dataReady--;
            }
            this.$refs['userForm'].resetFields();
        },
        saveEdit () {

            if(!this.currentData.id&&!this.goods_image.file){
                this.goods_image.isErr=true
            }else{
                this.goods_image.isErr=false
            };
            if(this.goods_images_details.newlist.length>0){
                this.goods_images_details.isErr=false
            }else{
                this.goods_images_details.isErr=true
            };

            if(this.goods_images.newlist.length>0){
                this.goods_images.isErr=false
            }else{
                this.goods_images.isErr=true
            };
            console.log(this.currentSpecsData.specs_list_data.length);
            if(this.currentSpecsData.specs_list_data.length>0){
                this.currentSpecsData.isErr=false
            }else{
                this.currentSpecsData.isErr=true
            };

            this.$refs['userForm'].validate((valid) => {
                if (valid&&!this.goods_image.isErr&&!this.goods_images.isErr&&!this.currentSpecsData.isErr) {


                    this.FormSubmiting=true;

                    var formData = new FormData();
                    formData.append("ssid",                 Cookies.get('ssid'));
                    formData.append("name",                 this.currentData.name);
                    formData.append("quantity",             this.currentData.quantity);
                    formData.append("tag",                  this.currentData.tag);
                    formData.append("description",          this.currentData.description);
                    formData.append("price",                this.currentData.price);
                    formData.append("logistics_price",      this.currentData.logistics_price || 0);
                    formData.append("carriage_type",        this.currentData.carriage_type);
                    formData.append("carriage",             this.currentData.carriage);
                    formData.append("category_id",          this.currentData.product_cl);

                    if(this.goods_image.file){
                        formData.append("image", this.goods_image.file);
                    };
                    let inof_images=[];
                    if(this.goods_images.newlist.length>0){
                        for(let i=0;i<this.goods_images.newlist.length;i++){
                            // formData.append("images", this.goods_images.newlist[i].name);
                            inof_images.push(this.goods_images.newlist[i].name);
                        }
                    };

                    let content_images=[];
                    if(this.goods_images_details.newlist.length>0){
                        for(let i=0;i<this.goods_images_details.newlist.length;i++){
                            // formData.append("images", this.goods_images.newlist[i].name);
                            content_images.push(this.goods_images_details.newlist[i].name);
                        }
                    };

                    formData.append("inof_images", inof_images.join(","));
                    formData.append("content_images", content_images.join(","));
                    let new_specs_list_data=[];
                    if(this.currentSpecsData.specs_list_data.length>0){


                        for(let i=0;i<this.currentSpecsData.specs_list_data.length;i++){
                            new_specs_list_data.push({
                                "option_id":this.currentSpecsData.specs_list_data[i].option_id,
                                "option_value_id":this.currentSpecsData.specs_list_data[i].option_value_id,
                                "option_id_2":this.currentSpecsData.specs_list_data[i].option_id_2||0,
                                "option_value_id_2":this.currentSpecsData.specs_list_data[i].option_value_id_2||0,
                                "quantity":this.currentSpecsData.specs_list_data[i].quantity,
                                "price":this.currentSpecsData.specs_list_data[i].price,
                            });
                        }


                        let giveString=JSON.stringify(new_specs_list_data);
                        giveString='{"product_option_values":'+giveString+'}';
                        formData.append("product_option_value", giveString);
                    };

                    let saveApi=Config.api.mall.goods.add;
                    if(this.currentData.id){
                        saveApi=Config.api.mall.goods.edit;
                        formData.append("id",this.currentData.id);
                    };
                    //拉取用户类型
                    $.ajax({
                        url: saveApi,
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
                                this.$emit("doWhat","list");
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
            this.dataReady=3;
            this.resetFields();
            this.getProductClass();
            this.getSpecs();

        }
    },
    mounted () {
    },
    watch :{
        "goods_image.file": function (value,oldvalue) {
            if(value){this.goods_image.isErr=false}else{this.goods_image.isErr=true}
        },
        "goods_images.newlist": function (value,oldvalue) {
            if(this.goods_images.newlist.length>0){this.goods_images.isErr=false}else{this.goods_images.isErr=true}
        },
        
        "goods_images_details.newlist": function (value,oldvalue) {
            if(this.goods_images_details.newlist.length>0){this.goods_images_details.isErr=false}else{this.goods_images_details.isErr=true}
        },
        "currentSpecsData.specs_list_data": function (value,oldvalue) {
            if(this.currentSpecsData.specs_list_data.length>0){this.currentSpecsData.isErr=false}else{this.currentSpecsData.isErr=true}
        },
        dataReady : function (value) {
            if(value===1){
                this.getProductDetail();
            };
            if(value===0){
                this.isDataReady=true;
            };
        }
    },
    created () {
         this.currentData=$.extend(true,{},this.defaultData);
    },
    activated () {
        this.dataReady=3;
        this.init();
    }
};
</script>
