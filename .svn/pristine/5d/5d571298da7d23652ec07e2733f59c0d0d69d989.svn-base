<style lang="less">
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
</style>
<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                会员管理
               <!--  <Button type="warning" class="add-btu margin-left-10" size="small"
                    v-if="doType!='list'"
                    @click="doWhat('list')" >返回列表
                </Button>
                <Button type="primary" class="add-btu" size="small"
                    v-if="doType=='list'"
                    @click="doWhat('add')" >添加账户
                </Button> -->
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div v-if="doType!='list'">
                    <Form
                        ref="currentDatas"
                        :model="currentDatas"
                        :label-width="100"
                        label-position="right"
                        :rules="addDataValidate"
                    >
                      <!--   <FormItem label="会员id：" prop="id">
                            <div style="display:inline-block;width:204px;">
                                <Input v-model="currentDatas.id" ></Input>
                            </div>
                        </FormItem>
                        <FormItem label="店长密码：" prop="password">
                            <div style="display:inline-block;width:204px;">
                                <Input type="password" v-model="currentDatas.password" ></Input>
                            </div>
                        </FormItem> -->
                        <FormItem label="白积分：" prop="whiteScore" >
                            <div style="display:inline-block;width:404px;">
                                <Input v-model="currentDatas.whiteScore" ></Input>
                            </div>
                        </FormItem>
                        <div>
                            <Button type="text" style="width: 100px;" @click="doWhat('list')">取消</Button>
                            <Button type="primary" style="width: 100px;" @click="saveEdit">保存</Button>
                        </div>
                    </Form>
                </div>
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称搜索电话号码">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" icon="search" @click="search()">搜索</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <Table border :columns="columns"  :data="tableData"></Table>
                    <div class="page-box">
                    <Page v-if="page.pageCount>1" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
        </Card>
        <Modal v-model="modal2" width="700">
            <p slot="header">
                <!-- <Icon type="information-circled"></Icon> -->
                <span>添加</span>
            </p>
            <div style="text-align:center">
               <span>消费金额：</span>
               <Input v-model="value" placeholder="请输入消费金额" style="width: 500px"></Input>
               <span style="color: red">金额：{{value==''?0:value}}元</span>
            </div>
            <div slot="footer">
                <Button type="default" @click="close">取消</Button>
                <Button type="success" @click="saveEdit">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
export default {
    name: 'list',
    data () {
        return {
            value:"",
            modal2:false,
            columns: [
                {
                    title: '帐号',
                    key: 'name'
                },
                {
                    title: '手机',
                    key: 'mobile'
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'created'
                },
                {
                    title: '购物积分',
                    key: 'shopping_score'
                },
                 {
                    title: '白积分',
                    key: 'white_score'
                },
                {
                    title: '红积分',
                    key: 'red_score'
                },
                {
                    title: '等级',
                    key: 'level',
                    align: 'center',
                    render: (h, params) => {
                        let tagText="";
                         // 0 普通会员 1分享合伙人 2事业合伙人
                        if(params.row.level==0){
                           tagText='普通会员'
                        }
                        if(params.row.level==1){
                           tagText='分享合伙人'
                        }
                        if(params.row.level==2){
                           tagText='事业合伙人'
                        }
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                        let editButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("edit",params.index)
                                    }
                                }
                            }, '添加白积分');
                        let deleteButton=h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("delete",params.index)
                                    }
                                }
                            }, '删除');
                        let dobutton=[];
                        // if(this.checkPower("edit")){
                        // };
                       dobutton.push(editButton);
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            doType:"list",
            switching:false,
            tableData: [],
            groupData: [],
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            dataReady:0,
            currentData: {},
            currentDatas:{
                password:"",
                whiteScore:"",
                id:"",
            },
            addDataValidate: {
                id: [
                    { required: true, message: '请输入会员ID', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入店长密码', trigger: 'blur' }
                ],
                whiteScore: [
                    { required: true, message: '请输入白积分', trigger: 'blur' }
                ],
            },
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:""
            },
            searchValidata: {}
        };
    },
    computed : {
        getLoading () {
            return !(this.dataReady==0);
        },
        doName () {
            if (this.doType=="list") return "后台管理账户";
            if (this.doType=="edit") return "编辑账户";
            return "添加账户";
        },
        currentDataValidate () {
          return this.addDataValidate;
            // return this.editDataValidate;
        },
        currentDataValidates () {
            if(this.doType=="add")return this.addDataValidate;
            return this.editDataValidate;
        },
        hasDataChange () {
            return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
        }
    },
    methods: {
        //controller
        close(){
            this.modal2=false;
            this.value="";
        },
        doWhat (dotype,dataIndex) {
            this.switching=true;
            if(dotype=="add"){
                this.resetCurrentData();
                this.doType="add";
            };
            if(dotype=="edit"){
                this.showEdit(dataIndex);
                // this.doType="edit";
                this.modal2=true;
            };
            if(dotype=="delete"){
                this.delete(dataIndex);
            };
            if(dotype=="list"){
                this.resetCurrentData();
                this.dataReady+=2;
                this.init();
                this.doType="list";
            };
            this.switching=false;
        },
        showEdit (index) {
            this.currentData=$.extend(true, {}, this.tableData[index]);
            // this.doType="edit";
        },
        //comm
        resetCurrentData () {
            this.currentData = $.extend(true, {}, this.defaultData);
        },
        changePage (pageNumber){
            this.page.pageNumber=pageNumber;
            this.search(pageNumber);
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        //list
        resetSearch () {
            this.searchData={
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:""
            };
            this.page.pageNumber=1;
            this.dataReady+=1;
            this.init();
        },
        search (pageNumber) {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };
            this.page.pageNumber=1;
            if(pageNumber)this.page.pageNumber=pageNumber;
            this.doWhat("list");
        },
        init () {
            // this.getGroups();
            this.getList();
        },
        getList () {
            if(Cookies.get('is_direct')!=1){
                this.$Message.warning("对不起，您没有此操作权限！");
                return false;
            }
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.keyword!="")postData.mobile=this.searchData.keyword;
            $.ajax({
                url: Config.api.member.list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.dataReady--;
                // getList
                if(!!data){
                    if(data.code==0){
                        this.page.dataCount=data.data.count;
                        this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                        this.tableData= data.data.list;
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
        getGroups () {
            let postData={
                ssid:Cookies.get('ssid')
            };
            $.ajax({
                url: Config.apiRootPath+Config.api.member.list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                this.dataReady--;
                if(!!data){
                    if(data.code==0){
                        this.groupData=data.data.list;
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
        //add && edit
        saveEdit () {
           // this.switching = true;
           // this.dataReady--;
           let postData={
                ssid:Cookies.get('ssid'),
                id:this.currentData.id,
                amount:this.value,
            };
            $.ajax({
                url: Config.api.member.addmemberwhitescore,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{

                    if(data.code==0){
                          this.$Message.success(data.message);
                           this.modal2=false;
                           this.value="";
                          this.doWhat('list');

                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }

            })
            .fail((xhr,status,error)=>{
                // this.dataReady--;
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        },
        //edit password
        showEditPassword (id) {
            if(!id)return;
            this.editPasswordForm.userid=id;
            this.editPasswordModal = true;
        },
        cancelEditPass () {
            this.editPasswordForm.userid='';
            this.editPasswordForm.oldPass='';
            this.editPasswordForm.newPass='';
            this.editPasswordForm.rePass='';
            this.editPasswordModal = false;
        },
        saveEditPass () {
            this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    this.savePassLoading = true;
                    let postData={
                        ssid:Cookies.get('ssid'),
                        id:this.editPasswordForm.userid,
                        password:this.editPasswordForm.oldPass,
                        new_password:this.editPasswordForm.newPass,
                        ok_new_password:this.editPasswordForm.rePass
                    };
                    $.ajax({
                        url: Config.apiRootPath+Config.api.system.admin_assignments.modifyPassword,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.savePassLoading=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("修改密码成功！");
                                this.editPasswordForm.oldPass="";
                                this.editPasswordForm.newPass="";
                                this.editPasswordForm.rePass="";
                                this.editPasswordForm.userid="";
                                this.editPasswordModal = false;
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
                        this.savePassLoading=false;
                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
            });
        },
        //delete
        delete (index) {
            if(!this.tableData[index].id)return;
            //银行选择
            let postData=()=>({
                    ssid:Cookies.get('ssid'),
                    id:this.tableData[index].id,
                    status:0
                });
            $.ajax({
                url: Config.apiRootPath+Config.api.system.admin_assignments.delete,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.$Message.success("删除成功!");
                        this.tableData.splice(index, 1);
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
        }
    },
    mounted () {
    },
    activated (){
        this.doWhat("list");
    }
};
</script>
