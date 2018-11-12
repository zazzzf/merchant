<style lang="less">
    .page-box{padding-top: 16px; text-align: center }
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .ivu-select-item>.bank-card-username{  font-style:italic; color:#666}
    .ivu-select-item>.bank-card-number{color:blue;}
    .ivu-select-item.ivu-select-item-selected>.bank-card-username{color:#dededf}
    .ivu-select-item.ivu-select-item-selected>.bank-card-number{color:#ffffff;}
    .cashInfro{ margin-bottom: 16px; height: 38px}
    .cash-infro-card{ height: 38px; line-height: 38px; border-radius: 5px; overflow: hidden; background-color:#f1f2f3; text-align: center; font-size: 20px; margin-right: 16px; float: left; }
    .cash-infro-card span{ display:block; float:left;  color:#a9a9a9; padding:0 16px; font-size: 16px}
    .ivu-collapse-header{ padding-left: 16px !important; }
    .ivu-collapse-item{position: relative;}
    .add-button{font-size:18px; color:#ccc;float:right; margin-right: 10px; position:absolute; top:6px; right:0px; display:block;}
    .add-button:hover{color:#2d8cf0;}
    .add-btu{position: relative; float: right}
    .specs-item{margin-right:16px; margin-bottom:16px}
    .ivu-btn.smallbutton{ padding-left:8px;padding-right:8px;}
    .nofootmodel .ivu-modal-footer{margin-top:-16px !important; padding-bottom:16px !important;}
    .specs-list-warp{margin-bottom:-16px;}
</style>

<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                商品规格管理 
                <Button type="primary" class="add-btu" size="small" 
                    @click="addSpecs" >添加规格
                </Button>
            </p>
            <div class="ordler-list">
                <template v-if="specs_list.length>0">
                    <div class="specs-list-warp">
                        <template v-for="item,key in specs_list">
                                <ButtonGroup class="specs-item">
                                    <Button @click="showchilds(key)">{{item.name}}</Button>
                                    <Button @click="editSpecs(key)" class="smallbutton" type="dashed"><Icon type="edit"></Icon></Button>
                                    <Button @click="deleteSpecs(key)" class="smallbutton" type="dashed"><Icon type="close"></Icon></Button>
                                </ButtonGroup>
                        </template>
                    </div>
                </template>    
                <template v-else>
                    暂时没有添加规格
                </template>
            </div>
            <Modal v-model="editSpecsModal" class-name="vertical-center-modal nofootmodel" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">{{specsEditType=="add"?"添加格规":"修改规格"}}</h3>
                <Form ref="specsForm"  autocomplete="off" :model="currentData" :label-width="0" :rules="specsFormValidata">
                    <FormItem prop="name">
                        <Input v-model="currentData.name" placeholder="请输入新格规名称" >
                            <Icon type="plus"  slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" :loading="save_loading" @click="saveEditSpecs">保存</Button>
                    <Button type="primary" @click="cancelEditSpecs">关闭</Button>
                </div>
            </Modal>
            <Modal v-model="editChildsModal" class-name="vertical-center-modal nofootmodel" :closable='false' :mask-closable=false :width="600">
                <Spin size="large" fix v-if="getChildLoading"></Spin>
                <h3 slot="header" style="color:#2D8CF0">规格属性列表 - {{currentData.name}}</h3>
                <div class="specs-child-list">
                    <template v-if="childsData.length>0">
                        <template v-for="item,key in childsData">
                            <ButtonGroup class="specs-item">
                                <Button>{{item.name}}</Button>
                                <Button @click="deleteChilds(key)" class="smallbutton"><Icon type="close"></Icon></Button>
                            </ButtonGroup>
                        </template>
                    </template>
                    <template v-else>
                        <div style="padding-bottom:15px">暂时没有添加规格</div>
                    </template>    
                </div>
                
                <div slot="footer">
                    <Form ref="childForm" style="float:left" autocomplete="off" :model="currentChildData" :label-width="0" inline label-position="right" :rules="childFormValidata">
                    <FormItem prop="cashMoney">
                        <Input v-model="currentChildData.name" placeholder="请输入新属性名称" >
                            <Icon type="plus" v-if="childEditType=='add'" slot="prepend"></Icon>
                            <Icon type="settings" v-else slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="info" :loading="save_loading" @click="saveEditChilds">保存</Button>
                        <Button type="default" @click="cancelEditChilds">取消</Button>
                    </FormItem>
                </Form>
                    <Button type="primary" @click="cancelChilds">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';



export default {
    name: 'specs-list',
    data () {
        const validatecashMoney = (rule, value, callback) => {
            if (!Number.isInteger(+value)) {
                callback(new Error('请输入整数值'));
            } else {
                if(value*100>this.cashInfroData.canuse_money_orign||value<100){
                    if(value*100>this.cashInfroData.canuse_money_orign){
                        callback(new Error('可用余额不足'));
                    }else{
                        callback(new Error('提现金额不正确，不能小于100元'));
                    }
                }else{
                    callback();
                }
                
            }
        };
        const validateBankCardId = (rule, value, callback) => {
            if (value=="") {
                callback(new Error('请选择银行卡'));
            } else {
                callback();  
            }
        };
        return {
            specs_list:[] ,
            saveType: "new",
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            currentData: {
                "id":"",
                "name":""
            },
            currentChildData: {
                "id":"",
                "option_id":"",
                "name":""
            },
            getLoading: false,
            getChildLoading: false,
            save_loading:false,
            searchData:{
                searchDate:[],
                startDate:"",
                endDate:""
            },
            searchValidata: {},
            //cash
            specsForm:{
                id:"",
                name:""
            },
            childsData:[],
            editSpecsModal:false,
            editChildsModal:false,
            cashLoading:false,
            cashInfroData: {
                id:"",
                option_id:"",
                name:""
            },
            specsEditType:"edit",
            childEditType:"add",
            childFormValidata: {
                name: [
                     { required: true, message: '请输入规格属性名称', trigger: 'blur' }
                ]
            },
            specsFormValidata:{
                name: [
                     { required: true, message: '请输入规格名称', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        changePage (pageNumber){         
            this.page.pageNumber=pageNumber;
            this.search();
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        search () {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            }
            this.init();
        },
        //specs
        addSpecs () {
            this.currentData={
                name:""
            };
            this.specsEditType="add";
            this.editSpecsModal = true;
        },
        editSpecs (dataIndex) {
            this.currentData={};
            this.currentData=$.extend(true, {}, this.specs_list[dataIndex]);
            this.specsEditType="edit";
            this.editSpecsModal = true;
        },
        cancelEditSpecs () {
            this.editSpecsModal = false;
        },
        saveEditSpecs () {
            this.$refs['specsForm'].validate((valid) => {
                if (valid) {
                    this.save_loading=true;
                    let postData={
                            ssid:Cookies.get('ssid'),
                            name  : this.currentData.name
                        };
                    if(this.specsEditType=="edit"){
                        postData.option_id=this.currentData.id;
                    }
                    //保存
                    $.ajax({
                        url: this.specsEditType=="edit"?Config.api.mall.specs.edit:Config.api.mall.specs.add,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("规格保存成功");
                                this.init();
                                this.cancelEditSpecs();
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
                        this.save_loading=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }

            })
            this.editSpecsModal = false;
        },
        deleteSpecs (dataIndex) {
            console.log(dataIndex);
            let _this=this;
            this.$Modal.confirm({
                title:"系统提示",
                content:"确定要删除此规格吗？删除规格可能影响到已上架商品。",
                onOk:()=>{
                    _this.save_loading=true;
                    let postData={
                            ssid:Cookies.get('ssid'),
                            option_id  : _this.specs_list[dataIndex].id
                        };
                    //保存
                    $.ajax({
                        url: Config.api.mall.specs.delete,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        _this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                _this.$Message.success("删除成功");
                                _this.init();
                                _this.cancelEditSpecs();
                            }else{
                                Config.showError({vm:_this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:_this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        _this.save_loading=false;
                        Config.showError({vm:_this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                },
                onCancel:()=>{}
            })
        },
        showchilds (dataIndex){
            this.currentData=this.specs_list[dataIndex];
            this.childsData=[];
            this.getChilds();
            this.childEditType="add";
            this.editChildsModal=true;
        },
        //childs
        editChilds (dataIndex) {
            this.currentChildData=$.extend(true, {}, this.childsData[dataIndex]);
            this.currentChildData.dataIndex=dataIndex;
            this.childEditType="edit";
            this.editChildsModal = true;
        },
        cancelChilds () {
            this.editChildsModal = false;
        },
        cancelEditChilds () {
            this.currentChildData={id:"",option_id:"",name:""};
            this.childEditType="add";
        },
        saveEditChilds () {
            this.$refs['childForm'].validate((valid) => {
                if (valid) {
                    this.save_loading=true;
                    let newChilds=[];
                    let requestUrl=Config.api.mall.specs.editchild;
                    if(this.childEditType=="edit"){
                        for(let i=0;i<this.childsData.length;i++){
                            if(i===this.currentChildData.dataIndex){
                                newChilds.push({name:this.currentChildData.name})
                            }else{
                                newChilds.push({name:this.childsData[i].name})
                            }
                            
                        };
                    };
                    if(this.childEditType=="add"){
                        requestUrl=Config.api.mall.specs.addchild;
                        newChilds=[{name:this.currentChildData.name}];
                    };
                    let childstring=JSON.stringify(newChilds)
                    let postData={
                            ssid:Cookies.get('ssid'),
                            option_id : this.currentData.id,
                            data:'{"data":'+childstring+'}'
                        };
                    this.cancelEditChilds();
                    //保存
                    $.ajax({
                        url: requestUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("规格属性保存成功");
                                this.getChilds();
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
                        this.save_loading=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }

            })
        },
        deleteChilds (dataindex) {
            console.log(dataindex);
            this.$Modal.confirm({
                title:"系统提示",
                content:"确定要删除此属性吗？删除规格属性可能影响到已上架商品。",
                onOk:()=>{
                    let newChilds=[];
                    let requestUrl=Config.api.mall.specs.deletechild;
                    this.getChildLoading=true;                   
                   
                    newChilds.push({name:this.childsData[dataindex].name})                 
                    let childstring=JSON.stringify(newChilds)
                    let postData={
                            ssid:Cookies.get('ssid'),
                            attributeId:this.childsData[dataindex].id,
                            option_id : this.currentData.id,
                            data:'{"data":'+childstring+'}'
                        };
                    //保存
                    $.ajax({
                        url: requestUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.getChildLoading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("规格属性删除成功");
                                this.getChilds();
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
                        this.getChildLoading=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                },
                onCancel:()=>{}
            })
        },
        init () {
            let postData={
                ssid:Cookies.get('ssid')
            };
            this.getLoading=true;
            $.ajax({
                url: Config.api.mall.specs.list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.getLoading=false;
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        this.specs_list=data.data.list;
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
                this.getLoading=false;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        },
        getChilds () {
            let postData={
                ssid:Cookies.get('ssid'),
                option_id:this.currentData.id
            };
            this.getChildLoading=true;
            $.ajax({
                url: Config.api.mall.specs.childList,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.getChildLoading=false;
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        if(data.data!=="")this.childsData=data.data;
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
                this.getChildLoading=false;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        }
    },
    updated: function () {
          this.$nextTick(function () {
          })
    },
    mounted () {
    },
    activated () {
        this.init(); 
    }
};
</script>
