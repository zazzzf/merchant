<style lang="less">
    @import './order-list.less';
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
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                订单列表
            </p>
            <div class="ordler-list">
                <div class="search-box">
                    <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.keyword" placeholder="搜索订单号或者用户名">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                        </FormItem>
                        <Select v-model="searchData.payStatus" style="width:140px" placeholder="选择支付状态">
                            <Option v-for="item,key in payStatus" :value="key" :key="key">{{ item }}</Option>
                        </Select>
                        <Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择发货状态">
                            <Option v-for="item,key in shipStatus" :value="key" :key="key">{{ item }}</Option>
                        </Select>
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
            <Modal v-model="updateStatus" :width="500">
                <h3 slot="header" style="color:#2D8CF0">订单处理</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="100" label-position="right" :rules="updateStatusValidate">
                    
                    <FormItem label="订单编号：" style="margin-bottom:0px">
                        {{updateStatusForm.order_no}}
                    </FormItem>
                    <FormItem label="商品名称：" style="margin-bottom:0px">
                        <template v-if="updateStatusForm.product_pay_type==0">
                            线下购买
                        </template>
                        <template v-else>
                            {{updateStatusForm.product_name}}
                        </template>
                    </FormItem>
                    <FormItem label="用 户 名：" style="margin-bottom:0px">
                        {{updateStatusForm.member_name}}
                    </FormItem>
                    <FormItem label="提交时间：">
                        {{updateStatusForm.date_added}}
                    </FormItem>
                    <FormItem label="快递单号：" prop="express_number">
                        <Input type="text" style="width:200px" v-model="updateStatusForm.express_number"></Input>
                    </FormItem>                    
                    <FormItem label="发货状态：" prop="ship_status">
                        <RadioGroup v-model="updateStatusForm.ship_status">
                            <Radio label="1">
                                <span>待发货</span>
                            </Radio>
                            <Radio label="2">
                                <span>已发货</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelEdit">取消</Button>
                    <Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>
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
    name: 'order-list',
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
            payStatus:["不限","待支付","已支付"],
            shipStatus:["不限","待发货","已发货"],
            columns: [
                {
                    title: '订单编号',
                    className : "order-col-1",
                    width: "10%",
                    key: 'order_no'
                },
                {
                    title: '商品名称',
                    key: 'product_name',
                    className : "order-col-2",
                    width: "9%",
                    render: (h, params) => {
                        let putText=params.row.product_name;
                        if(params.row.product_pay_type==0)putText="线下购买";
                        return h('span', {}, putText );
                    }
                },
                {
                    title: '用户名',
                    className : "order-col-3",
                    width: "9%",
                    align: 'center',
                    key: 'member_name'
                },
                {
                    title: '时间',
                    align: 'center',
                    sortable: true,
                    className : "order-col-4",

                    key: 'date_added'
                },
                {
                    title: '返现(元)',
                    sortable: true,
                    className : "order-col-5",
                    width: "9%",
                    align: 'right',
                    key: 'cash',
                    render: (h, params) => {
                        let tagText=Util.fmoney(Util.numberCarry(params.row.cash,100,6),6);
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '返积分',
                    sortable: true,
                    className : "order-col-6",
                    width: "9%",
                    align: 'right',
                    key: 'score'
                },
                {
                    title: '积分金额',
                    "sortable": true,
                    className : "order-col-7",
                    width: "9%",
                    align: 'right',
                    key: 'total_score'
                },
                {
                    title: '状态',
                    "sortable": true,
                    key: 'status',
                    className : "order-col-8",
                    width: "9%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="已拆红包";
                        if(params.row.status==1){
                            tagcolor="red";tagText="待支付";
                        };
                        if(params.row.status==2){
                            tagcolor="green";tagText="已支付";
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
                    title: '快递单号',
                    key: 'express_number',
                    align: 'center',
                    className : "order-col-9",
                    width: "9%",
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="------";
                        if(params.row.express_number){
                           tagText=params.row.express_number;
                        };
                        return h('span', {style: {
                                    color: "#999999"
                                }}, tagText);

                    }
                },
                {
                    title: '发货状态',
                    key: 'ship_status',
                    className : "order-col-10",
                    width: "9%",
                    align: 'center',
                    render: (h, params) => {

                        let tagcolor="default";
                        let tagText="--";
                        if(params.row.status==2){
                            let tagText="未处理";
                            if(params.row.ship_status==2){
                                tagcolor="green";tagText="已发货";
                            };
                            if(params.row.ship_status==1){
                                tagcolor="red";tagText="待发货";
                            };
                            return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);
                        };
                        return h('span', {}, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'id',
                    className : "order-col-11",
                    width: "9%",
                    align: 'center',
                    render: (h, params) => {

                        let settlementButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.index)
                                    }
                                }
                            }, '发货处理');

                        let dobutton=[];
                        if(params.row.status==2)dobutton.push(settlementButton);
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
            },
            updateStatus: false, // 修改模态框显示
            saveUpdateStatusLoading: false
        };
    },
    methods: {
        showEdit (index) {
            this.updateStatusForm = $.extend(true, {}, this.tableData[index]);
            this.updateStatusForm.dataIndex=index;
            this.saveType="edit";
            this.updateStatus = true;
        },
        cancelEdit () {
            this.updateStatusForm = {};
            this.updateStatus = false;
        },
        saveUpdateStatus () {

            this.$refs['updateStatusForm'].validate((valid) => {

                if(valid){

                    this.saveUpdateStatusLoading = true;
                    let postData={
                        ssid:Cookies.get('ssid'),
                        id:this.updateStatusForm.id,
                        ship_status:this.updateStatusForm.ship_status,
                        express_number:this.updateStatusForm.express_number
                    };

                    $.ajax({
                        url: Config.api.shop.order.fahuo,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.saveUpdateStatusLoading=false;
                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("操作成功！");
                                let newListData=$.extend(true, [], this.tableData);
                                newListData[this.updateStatusForm.dataIndex]=this.updateStatusForm;
                                this.updateStatusForm={};
                                this.tableData=newListData;
                                this.updateStatus = false;
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
                        this.saveUpdateStatusLoading=false;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });
                }
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
            if(this.searchData.keyword!="")postData.search=this.searchData.keyword;
            if(this.searchData.payStatus>0)postData.status=this.searchData.payStatus;
            if(this.searchData.shipStatus>0)postData.ship_status=this.searchData.shipStatus;
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.api.shop.order.getList,
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
