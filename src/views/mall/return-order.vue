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
                退款申请管理
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
                            <Input type="text" v-model="searchData.member_name" placeholder="搜索会员名">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="keyword">
                            <Input type="text" v-model="searchData.product_name" placeholder="搜索商品名">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                        </FormItem>
                        <Select v-model="searchData.return_status" style="width:100px" placeholder="选择退款状态">
                            <Option v-for="item,key in return_status" :value="key" :key="key">{{ item }}</Option>
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
            <Modal v-model="viewReturnDetail" :width="500">
                <h3 slot="header" style="color:#2D8CF0">退款详情</h3>
                <table class="detail-table" cellspacing="0" cellpadding="5">
                    <tbody>
                        <tr>
                            <td class="detail-title" width="100">订单编号</td>
                            <td>{{currentData.order_no}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">用户名称</td>
                            <td>{{currentData.member_name}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">会员联系电话</td>
                            <td>{{currentData.mobile}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">商品名称</td>
                            <td>{{currentData.product_name}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">数量</td>
                            <td>{{currentData.quantity}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">退货原因</td>
                            <td>{{return_reason[currentData.return_reason]}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">退货状态</td>
                            <td>{{return_status[currentData.return_status]}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">备注</td>
                            <td>{{decodeURI(currentData.comment)}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">新增时间</td>
                            <td>{{currentData.date_added}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">变更时间</td>
                            <td>{{currentData.date_modified}}</td>
                        </tr>
                    </tbody>
                </table>
                <div slot="footer">
                    <Button type="primary" @click="cancelViewReturn">关闭</Button>
                </div>
            </Modal>
            <Modal v-model="updateStatus" :width="500">
                <h3 slot="header" style="color:#2D8CF0">退款处理</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="100" label-position="right" :rules="updateStatusValidate">
                    
                    <FormItem label="订单编号：" style="margin-bottom:0px">
                        {{updateStatusForm.order_no}}
                    </FormItem>
                    <FormItem label="用 户 名：" style="margin-bottom:0px">
                        {{updateStatusForm.member_name}}
                    </FormItem>
                    <FormItem label="商品名称：" style="margin-bottom:0px">
                        {{updateStatusForm.product_name}}
                    </FormItem>   
                    <FormItem label="数量：" style="margin-bottom:0px">
                        {{updateStatusForm.quantity}}
                    </FormItem> 
                    <FormItem label="备注：" style="margin-bottom:0px">
                        {{updateStatusForm.comment}}
                    </FormItem>
                    <FormItem label="提交时间：" style="margin-bottom:0px">
                        {{updateStatusForm.date_added}}
                    </FormItem>
                    <FormItem label="退款处理：" prop="return_status">
                        <RadioGroup v-model="updateStatusForm.return_status">
                            <Radio label="2">
                                <span>同意</span>
                            </Radio>
                            <Radio label="3">
                                <span>驳回</span>
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
    name: 'return-orders',
    data () {
        const valideStatus = (rule, value, callback) => {
            if (value==1||value==2) {
                callback();
            } else {
                callback(new Error("请选择退款处理"));
            }
        };
        return {
            autowidthtable:"autowidthtable",
            payStatus:["不限","待支付","已支付"],
            shipStatus:["不限","待发货","已发货"],
            return_status:["审核中","同意","驳回"],
            return_reason:["未知","商品破损、损坏","商品质量问题","商品错发、漏发","收到商品与描述不符","其他"],
            expressage:[],
            expressageReady:false,
            viewReturnDetail:false,
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
                    title: '会员联系电话',
                    key: 'mobile',
                    align: 'center',
                    className : "order-col-2"
                },
                {
                    title: '商品名称',
                    className : "order-col-5",
                    align: 'center',
                    key: 'product_name'
                },
                {
                    title: '总金额',
                    className : "order-col-5",
                    align: 'center',
                    key: 'total',
                    render: (h, params) => {
                     
                        let tagText=Math.floor(params.row.total);
                        return h('span',tagText);
                    }
                },
                {
                    title: '申请时间',
                    align: 'center',
                    className : "order-col-4",
                    key: 'date_added'
                },
                {
                    title: '状态',
                    key: 'return_status',
                    className : "order-col-8",
                    width: "9%",
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText=this.return_status[params.row.return_status-1];;
                        return h('span', {props: {}}, tagText);
                    }
                },
                {
                    title: '操作',
                    key: 'id',
                    className : "order-col-11",
                    width: 250,
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
                            }, '审核处理');
                        let viewButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.viewReturnOrder(params.index)
                                    }
                                }
                            }, '退款详情');
                        let viewOrderButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style:{
                                    "margin-left":"8px"
                                },
                                on: {
                                    click: () => {
                                        this.viewOrder(params.index)
                                    }
                                }
                            }, '订单详情');
                        let dobutton=[viewButton,viewOrderButton];
                        if(params.row.return_status==1) dobutton.push(settlementButton);
                        return h('div', dobutton);
                    }
                }
            ],
            saveType: "new",
            tableData: [],
            order_states:["查看全部","待支付", "已支付", "待发货", "已发货", "退款中", "已退款", "已完成", "待评价","取消订单","确认收货","11","已删除"],
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
                return_status:"",
                member_name:"",
                product_name:""
            },
            searchValidata: {},
            updateStatusForm: {
                return_status:""
            },
            updateStatusValidate: {
                ship_status: [
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
        viewReturnOrder (index) {
            this.currentData=this.tableData[index];
            this.viewReturnDetail=true;
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
        cancelViewReturn () {
            this.viewReturnDetail = false;
        },
        saveUpdateStatus () {

            this.$refs['updateStatusForm'].validate((valid) => {

                if(valid){

                    this.saveUpdateStatusLoading = true;
                    let postData={
                        ssid:Cookies.get('ssid'),
                        id:this.updateStatusForm.id,
                        return_status:this.updateStatusForm.return_status
                    };

                    $.ajax({
                        url: Config.api.mall.return.review,
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
                order_id:this.currentData.order_id
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
                return_status:"",
                member_name:"",
                product_name:""                
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
            if(this.searchData.product_name!="")postData.product_name=this.searchData.product_name;
            if(this.searchData.return_status>0)postData.return_status=this.searchData.return_status;
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.api.mall.return.list,
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
