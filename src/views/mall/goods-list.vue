<style lang="less">
    .page-box{padding-top: 16px; text-align: center }
    .auto-width-table table{ width:auto !important; min-width:100%}
    .ivu-table-cell{ padding-right: 8px !important; padding-left:8px !important;}
    .ivu-table td.order-col-1 .ivu-table-cell,.ivu-table th.order-col-1 .ivu-table-cell{min-width: 160px}
    .ivu-table td.order-col-2 .ivu-table-cell,.ivu-table th.order-col-2 .ivu-table-cell{min-width: 100px}
    .ivu-table td.order-col-3 .ivu-table-cell,.ivu-table th.order-col-3 .ivu-table-cell{min-width: 60px}
    .ivu-table td.order-col-4 .ivu-table-cell,.ivu-table th.order-col-4 .ivu-table-cell{min-width: 130px}
    .ivu-table td.order-col-5 .ivu-table-cell,.ivu-table th.order-col-5 .ivu-table-cell{min-width: 100px}
    .ivu-table td.order-col-6 .ivu-table-cell,.ivu-table th.order-col-6 .ivu-table-cell{min-width: 100px}
    .ivu-table td.order-col-7 .ivu-table-cell,.ivu-table th.order-col-7 .ivu-table-cell{min-width: 100px}
    .ivu-table td.order-col-8 .ivu-table-cell,.ivu-table th.order-col-8 .ivu-table-cell{min-width: 76px}
    .ivu-table td.order-col-9 .ivu-table-cell,.ivu-table th.order-col-9 .ivu-table-cell{min-width: 70px}
    .ivu-table td.order-col-10 .ivu-table-cell,.ivu-table th.order-col-10 .ivu-table-cell{min-width: 76px}
    .ivu-table td.order-col-11 .ivu-table-cell,.ivu-table th.order-col-11 .ivu-table-cell{min-width: 80px}
</style>

<template>
        <div class="ordler-list">
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                    <FormItem prop="keyword">
                        <ButtonGroup>
                            <Button :type="listType=='used'?'primary':'ghost'" @click="changeListType('used')">已上架商品</Button>
                            <Button :type="listType=='non-used'?'primary':'ghost'" @click="changeListType('non-used')">未上架商品</Button>
                        </ButtonGroup>
                    </FormItem>
                    <FormItem prop="keyword">
                        <Input type="text" v-model="searchData.keyword" placeholder="输入商品名称搜索">
                            <Icon type="ios-eye" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" icon="search" @click="search()">搜索</Button>
                    </FormItem>
                </Form>
            </div>
            <Table class='auto-width-table' border :columns="columns" :loading="getLoading" :data="tableData"></Table>
            <div class="page-box">
            <Page v-if="page.pageCount>1" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
            </div>
        </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';


export default {
    name: 'goods-list',
    data () {
        const valideStatus = (rule, value, callback) => {
            if (value==1||value==2) {
                if(value==2){
                    if(!!this.updateStatusForm.express_number!=""){
                        callback();
                    }else{
                        callback(new Error("已发货状态必须填写快递单号！"));
                    }
                }else{
                    callback();
                }
            } else {
                callback(new Error("请选择发货状态"));
            }
        };
        return {
            autowidthtable:"autowidthtable",
            listType:"",
            columns: [
                {
                    title: '商品ID',
                    width:80,
                    align: 'center',
                    key: 'id'
                },
                {
                    title: '上架时间',
                    align: 'center',
                    width:130,
                    key: 'date_added'
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '价格',
                    align: 'center',
                    key: 'price'
                },
                {
                    title: '评论数量',
                    align: 'right',
                    key: 'comment_num'
                },
                {
                    title: '退款数量',
                    align: 'right',
                    key: 'return_num'
                },
                {
                    title: '销量',
                    align: 'right',
                    key: 'sales_quantity'
                },
                {
                    title: '余下库存',
                    key: 'quantity',
                    align: 'center'
                },
                {
                    title: '审核状态',
                    key: 'status',
                    width:80,
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="未审核";
                        if(params.row.status==1){
                            tagcolor="green";tagText="通过";
                        };
                        if(params.row.status==2){
                            tagcolor="red";tagText="拒绝";
                        };
                        return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);
                    }
                },
                {
                    title: '操作',
                    key: 'id',
                    width:70,
                    align: 'center',
                    render: (h, params) => {

                        let editButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.index)
                                    }
                                }
                            }, '编辑');
                        let downButton=h('Button', {
                                props: {
                                    type: 'default',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.updateStatus(params.index)
                                    }
                                }
                            }, '下架');
                        let dobutton=[];
                        if(params.row.status!=1)dobutton.push(editButton);
                        if(params.row.status==1)dobutton.push(downButton);
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            tableData: [],
            page: {
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            },
            getLoading: false,
            currentData: {
                "id":0,
                "order_no":"",
                "merchant_id":0,
                "member_name":"",
                "total_score":1,
                "status":1,
                "date_added":"",
                "cash":0,
                "score":0
            },
            searchData:{
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                payStatus:"",
                shipStatus:""
            },
            searchValidata: {},
            updateStatusForm: {},
            updateStatusValidate: {
                ship_status: [
                    { required: true, validator: valideStatus,  trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        showEdit (index) {
            let currentData = $.extend(true, {}, this.tableData[index]);

            this.$emit("doWhat","edit",currentData);

        },
        cancelEdit () {
            this.updateStatusForm = {};
            this.updateStatus = false;
        },
        updateStatus (dataIndex) {
            let postData={
                ssid:Cookies.get('ssid'),
                id:this.tableData[dataIndex].id
            };

            $.ajax({
                url: Config.api.mall.goods.offline,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.init();
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
        changePage (pageNumber){
            this.page.pageNumber=pageNumber;
            this.search(pageNumber);
        },
        changePageSize (pageSize){
            this.page.pageSize=pageSize;
            this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
            this.search();
        },
        search (pageNumber) {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };
            this.page.pageNumber=1;
            console.log(pageNumber);
            if(pageNumber)this.page.pageNumber=pageNumber;
            this.init();
        },
        changeListType (newListType) {
            if(this.listType==newListType){
                this.listType="";
            }else{
                this.listType=newListType;
            }
            
            this.init();
        },
        init () {
            //订单列表
            // startDate
            // endDate
            // search
            // page
            // pageSize
            this.getLoading=true;
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.listType!="")postData.status=this.listType==="used"?1:0;
            if(this.searchData.keyword!="")postData.name=this.searchData.keyword;
            // if(this.searchData.payStatus>0)postData.status=this.searchData.payStatus;
            // if(this.searchData.shipStatus>0)postData.ship_status=this.searchData.shipStatus;
            // if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.api.mall.goods.list,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // getBankCardList
                this.getLoading=false;
                if(!!data){
                    if(data.code==0){
                        this.page.dataCount=data.data.count;
                        this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                        this.tableData=data.data.list;
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
                Config.showError({vm:this,data:data,
                    errorMsg:"服务器通讯失败"
                });
            });
        }
    },
    mounted () {},
    activated () {
        this.init();
    }
};
</script>
