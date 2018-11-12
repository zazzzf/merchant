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
                商品评论管理
            </p>
            <div class="ordler-list">
                <!-- <div class="search-box">
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
                </div> -->
                <Table class='auto-width-table' border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                <div class="page-box">
                <Page v-if="page.pageCount>1" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                </div>
            </div>
            <Modal v-model="updateStatus" :width="500">
                <h3 slot="header" style="color:#2D8CF0">订单处理</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="90" label-position="right" :rules="updateStatusValidate">
                    
                    <FormItem label="商品名称：" style="margin-bottom:0px">
                        {{updateStatusForm.pname}}
                    </FormItem>
                    <FormItem label="买家名称：" style="margin-bottom:0px">
                        {{updateStatusForm.name}}
                    </FormItem>
                    <FormItem label="评分：" style="margin-bottom:0px">
                        {{updateStatusForm.rating}}
                    </FormItem>
                    <FormItem label="评论：" style="margin-bottom:0px">
                        {{decodeURI(updateStatusForm.text)}}
                    </FormItem>
                    <FormItem label="提交时间：" style="margin-bottom:0px">
                        {{updateStatusForm.date_added}}
                    </FormItem>
                    <FormItem label="回复状态：" style="margin-bottom:0px">
                        {{review_states[updateStatusForm.status]}}
                    </FormItem>
                    <FormItem label="回复内容：" prop="reply" style="margin-bottom:8px">
                        <Input type="textarea" v-model="updateStatusForm.reply"></Input>
                    </FormItem>                    
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelEdit">取消</Button>
                    <Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>
                </div>
            </Modal>
            <Modal v-model="viewModel" width="500">
                <p slot="header">
                    <!--<Icon type="information-circled"></Icon>-->
                    <span>评论详情</span>
                </p>
                <table class="detail-table" cellspacing="0" cellpadding="5">
                    <tbody>
                        <tr>
                            <td class="detail-title" width="100">商品名称</td>
                            <td>{{currentData.pname}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">买家名称</td>
                            <td>{{currentData.name}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">评分</td>
                            <td>{{currentData.rating}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">评论</td>
                            <td>{{decodeURI(currentData.text)}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">评论时间</td>
                            <td>{{currentData.date_added}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">回复状态</td>
                            <td>{{review_states[currentData.status]}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">商家回复</td>
                            <td>{{currentData.reply}}</td>
                        </tr>
                        <tr>
                            <td class="detail-title">商家回复时间</td>
                            <td>{{currentData.update_time}}</td>
                        </tr>
                    </tbody>
                </table>
                <div slot="footer">
                    <Button type="error" @click="closeview">关闭</Button>
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
    name: 'review-list',
    data () {
        const valideStatus = (rule, value, callback) => {
            if (value==1||value==2) {
                if(value==2){
                    console.log(this.updateStatusForm.express_type);
                    if(!!this.updateStatusForm.express_number&&!!this.updateStatusForm.express_type){
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
            review_states:["未回复","已回复"],
            expressage:[],
            expressageReady:false,
            columns: [
                {
                    title: 'ID',
                    width: 80,
                    key: 'id'
                },
                
                {
                    title: '用户名',
                    width: 120,
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '商品名称',
                    key: 'pname',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '评论',
                    key: 'text',
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText=decodeURI(params.row.text);;
                        return h('div', {props: {},style:{"text-align":"left","padding-top":"5px","padding-bottom":"5px"}}, tagText);
                    }

                },
                {
                    title: '评分',
                    align: 'center',
                    width: 70,
                    key: 'rating'
                },
                {
                    title: '时间',
                    align: 'center',
                    width: 130,
                    key: 'date_added'
                },
                
                {
                    title: '状态',
                    key: 'status',
                    width: 70,
                    align: 'center',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText=this.review_states[params.row.status];;
                        return h('span', {props: {}}, tagText);
                    }
                },
                {
                    title: '操作',
                    key: 'id',
                    width: 110,
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
                            }, '回复');
                        let viewButton=h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.viewReview(params.index)
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
                reply: [
                    { required: true, message:"请输入回复内容",  trigger: 'blur' }
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
        viewReview (index) {
            this.currentData=this.tableData[index];
            this.viewModel=true;
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
                        id:this.updateStatusForm.id,
                        reply:this.updateStatusForm.reply
                    };

                    $.ajax({
                        url: Config.api.mall.reviews.reply,
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
                merchantId:Cookies.get('merchant_id'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            // if(this.searchData.keyword!="")postData.order_no=this.searchData.keyword;
            // if(this.searchData.member_name!="")postData.member_name=this.searchData.member_name;
            // if(this.searchData.mobile!="")postData.member_name=this.searchData.mobile;
            // if(this.searchData.shipStatus>0)postData.status=this.searchData.shipStatus;
            // if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            // if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            $.ajax({
                url: Config.api.mall.reviews.list,
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
    created () {
       console.log(13); 
    },
    mounted () {
        // this.getExpressage();
        console.log(12);
    },
    activated () {
        console.log(11);
        this.init();
    }
};
</script>
