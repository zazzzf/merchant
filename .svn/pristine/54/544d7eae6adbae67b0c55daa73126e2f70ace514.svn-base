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
    .detail-table{width:100%; box-sizing: border-box;border-bottom:#dededf 1px solid; border-left: #dededf 1px solid;}
    td.detail-title{background-color:#f5f6f7; font-weight: 700; text-align:center;}
    .detail-table tr{ }
    .detail-table td{ border-top:#dededf 1px solid; border-right: #dededf 1px solid;line-height: 22px; padding: 5px;}
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                商品订单管理
            </p>
            <div class="ordler-list">
                <div class="search-box">
                    <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.keyword" placeholder="搜索订单号">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.member_name" placeholder="搜索收货人">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.mobile" placeholder="搜索收货人电话">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                        </FormItem>
                        <Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择订单状态">
                            <Option v-for="item,key in order_states" :value="key" :key="key">{{ item }}</Option>
                        </Select>
                        <FormItem>
                            <ButtonGroup>
                                <Button type="primary" icon="search" @click="search()">搜索</Button>
                                <Button @click="resetSearch">清空</Button>
                            </ButtonGroup>
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
                    <FormItem label="用 户 名：" style="margin-bottom:0px">
                        {{updateStatusForm.member_name}}
                    </FormItem>
                    <FormItem label="提交时间：" style="margin-bottom:0px">
                        {{updateStatusForm.date_added}}
                    </FormItem>
                    <FormItem label="快递公司：" prop="shipping_express_code" style="margin-bottom:10px">
                        <Select v-model="updateStatusForm.shipping_express_code" style="width:140px" placeholder="选择快递公司">
                            <Option v-for="item,key in expressage" :value="item.expressage_no" :key="key">{{ item.expressage_name }}</Option>
                        </Select>
                    </FormItem> 
                    <FormItem label="快递单号：" prop="shipping_express_no" style="margin-bottom:8px">
                        <Input type="text" style="width:200px" v-model="updateStatusForm.shipping_express_no"></Input>
                    </FormItem>                    
                    <FormItem label="发货状态：" prop="order_status">
                        <RadioGroup v-model="updateStatusForm.order_status">
                            <Radio label="3">
                                <span>待发货</span>
                            </Radio>
                            <Radio label="4">
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
            <Modal v-model="viewModel" width="900">
                <p slot="header" style="color:black;font-weight:bold;text-align:left;font-size: 18px">
                    <!--<Icon type="information-circled"></Icon>-->
                    <span>订单详情</span>
                </p>
                <div  v-if="orderDetailReady">
                    <Card>
                        <p slot="title">收货人信息</p>
                        <table class="detail-table" cellspacing="0" cellpadding="5">
                            <tbody>
                                <tr>
                                    <td class="detail-title" width="80">会员姓名</td>
                                    <td style="min-width:100px">{{orderDetailData.member_name}}</td>
                                    <td class="detail-title" width="80">会员电话</td>
                                    <td width="120">{{orderDetailData.mobile}}</td>
                                    <td class="detail-title" width="80">收货人</td>
                                    <td style="min-width:100px">{{orderDetailData.shipping_member_name}}</td>
                                    <td class="detail-title" width="110">收货人联系电话</td>
                                    <td width="120">{{orderDetailData.shipping_mobile}}</td>
                                </tr>
                                <tr>
                                    <td class="detail-title">收货地址1</td>
                                    <td colspan="7">{{orderDetailData.shipping_address_1}}</td>
                                </tr>
                                <tr>
                                    <td class="detail-title">收货地址2</td>
                                    <td colspan="7">{{orderDetailData.shipping_address_2}}</td>
                                </tr>
                                <tr>
                                    <td class="detail-title">邮寄方式</td>
                                    <td>{{orderDetailData.shipping_method}}</td>
                                    <td class="detail-title">快递单号</td>
                                    <td colspan="2">{{orderDetailData.shipping_express_no}}</td>
                                    <td class="detail-title">快递编号</td>
                                    <td colspan="2">{{orderDetailData.shipping_express_code}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>

                    <div style="margin-top: 20px">
                        <Card>
                            <p slot="title">商品信息</p>
                            <table class="detail-table" cellspacing="0" cellpadding="5">

                                <tbody>
                                    <tr>
                                        <td class="detail-title" width="80">订单ID</td>
                                        <td class="detail-title">商品名称</td>
                                        <td class="detail-title" width="80">数量</td>
                                        <td class="detail-title" width="120">单价</td>
                                        <td class="detail-title" width="120">小计</td>
                                    </tr>
                                    <tr v-for="item in orderDetailData.product">
                                        <td align="center">{{item.order_id}}</td>
                                        <td>{{item.name}}</td>
                                        <td align="center">{{item.quantity}}</td>
                                        <td align="right">&yen;{{item.price}}</td>
                                        <td align="right">&yen;{{item.total}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>    
                     
                    </div>
                    <div style="margin-top: 20px">
                        <table width="100%">
                            <tr>
                                <td width="50%" valign="top">
                                    <Card style="margin:0 20px 0 0">
                                        <p slot="title">订单信息</p>
                                        <p>订单总金额(元)：<span style="font-size: 16px;color: red">&yen;{{orderDetailData.total}}</span></p>
                                        <p>支付方式：<span style="font-size: 16px">{{orderDetailData.payment_method}}</span></p>
                                        <p>订单状态：<Tag>{{order_states[orderDetailData.order_status]}}</Tag></p>
                                    </Card>

                                </td>
                                <td valign="top">
                                    <Card style="margin:0 0 0 10px">
                                        <p slot="title">其他信息</p>
                                        <p>备注：
                                            <span style="font-size: 16px">{{decodeURI(orderDetailData.comment)}}</span></p>
                                        <p>
                                            新增时间：<span style="font-size: 16px">{{orderDetailData.date_added}}</span>
                                        </p>
                                        <p>
                                            修改时间：<span style="font-size: 16px">{{orderDetailData.date_modified}}</span>
                                        </p>

                                    </Card>
                                </td>
                            </tr>
                        </table>

                    </div>


                </div>
                <div slot="footer">
                    <Button type="error" size="large" long  @click="closeview">关闭</Button>
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
    name: 'goods-orders',
    data () {
        const valideStatus = (rule, value, callback) => {
            console.log(value);
            if (value==3||value==4) {
                if(value==4){
                    if(!!this.updateStatusForm.shipping_express_no&&!!this.updateStatusForm.shipping_express_code){
                        callback();
                    }else{
                        callback(new Error("请选择快递公司并填写快递单号"));
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
            expressage:[],
            expressageReady:false,
            columns: [
                {
                    title: '订单编号',
                    className : "order-col-1",
                    width: "10%",
                    key: 'order_no'
                },
                
                {
                    title: '用户名',
                    className : "order-col-3",
                    width: "9%",
                    align: 'center',
                    key: 'member_name'
                },
                {
                    title: '收货人姓名',
                    key: 'shipping_member_name',
                    align: 'center',
                    className : "order-col-2"
                },
                {
                    title: '收货电话',
                    className : "order-col-5",
                    align: 'center',
                    key: 'shipping_mobile'
                },
                 {
                    title: '总金额',
                    className : "order-col-5",
                    align: 'center',
                    key: 'total',
                    render: (h, params) => {
                     
                        let tagText=Math.floor(params.row.total/100);
                        return h('span',tagText);
                    }
                },
                {
                    title: '时间',
                    align: 'center',
                    className : "order-col-4",
                    key: 'date_added'
                },
                
                {
                    title: '状态',
                    key: 'order_status',
                    className : "order-col-8",
                    width: "9%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText=this.order_states[params.row.order_status];;
                        return h('span', {props: {}}, tagText);
                    }
                },
                {
                    title: '快递单号',
                    key: 'shipping_express_no',
                    align: 'center',
                    className : "order-col-9",
                    width: "9%",
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="------";
                        if(params.row.shipping_express_no){
                           tagText=params.row.shipping_express_no;
                        };
                        return h('span', {style: {
                                    color: "#999999"
                                }}, tagText);

                    }
                },
                {
                    title: '操作',
                    key: 'id',
                    className : "order-col-11",
                    width: 150,
                    align: 'center',
                    render: (h, params) => {

                        let settlementButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },

                                style:{
                                    "margin-left":"8px"
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.index)
                                    }
                                }
                            }, '发货处理');
                        let viewButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.viewOrder(params.index)
                                    }
                                }
                            }, '详情');
                        let dobutton=[viewButton];
                        dobutton.push(settlementButton);
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            tableData: [],
            order_states:["查看全部","待支付", "已支付", "待发货", "已发货", "退款中", "已退款", "已完成", "待评价","取消订单","确认收货","已评价","已删除"],
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
                shipStatus:"",
                member_name:"",
                mobile:""
            },
            searchValidata: {},
            updateStatusForm: {
                express_number:"",
                express_type:"",
                ship_status:""
            },
            updateStatusValidate: {
                order_status: [
                    { required: true, validator: valideStatus,  trigger: 'blur' }
                ]
            },
            viewModel:false,
            orderDetailReady:false,
            orderDetailData:{},
            orderDetail:[],
            orderShoping:[],
            updateStatus: false, // 修改模态框显示
            saveUpdateStatusLoading: false
        };
    },
    methods: {
        viewOrder (index) {
            this.currentData=this.tableData[index];
            this.viewModel=true;
            this.orderDetailReady=false;
            this.getOrderDetail();
        },
        closeview () {
            this.viewModel=false;
            this.orderDetailReady=false;
            this.orderDetailData={};
            this.orderDetail=[];
            this.orderShoping=[];
        },
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
                        order_id:this.updateStatusForm.id,
                        type:this.updateStatusForm.order_status,
                        express_no:this.updateStatusForm.shipping_express_no,
                        express_code:this.updateStatusForm.shipping_express_code
                    };

                    $.ajax({
                        url: Config.api.mall.order.fahuo,
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
        getOrderDetail(){
            let postData={
                ssid:Cookies.get('ssid'),
                order_id:this.currentData.id
            };
            $.ajax({
                url: Config.api.mall.order.orderDetail,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.orderDetailData=data.data;
                        this.orderDetailReady=true;

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
        getExpressage () {
            let postData={
                ssid:Cookies.get('ssid')
            };
            $.ajax({
                url: Config.api.public.Expressage,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{             
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.expressage=data.data;
                        this.expressageReady=true;
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
        resetSearch () {
            this.searchData={
                keyword:"",
                searchDate:[],
                startDate:"",
                endDate:"",
                payStatus:"",
                shipStatus:"",
                member_name:"",
                mobile:""               
            };
            this.init();
        },
        search (pageNumber) {
            if(this.searchData.searchDate.length){
                this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
            };
            this.page.pageNumber=1;
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
            if(this.searchData.keyword!="")postData.order_no=this.searchData.keyword;
            if(this.searchData.member_name!="")postData.member_name=this.searchData.member_name;
            if(this.searchData.mobile!="")postData.member_name=this.searchData.mobile;
            if(this.searchData.shipStatus>0)postData.status=this.searchData.shipStatus;
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.api.mall.order.getOnlineList,
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
    mounted () {
        this.getExpressage();
    },
    activated () {
        this.init();
    }
};
</script>
