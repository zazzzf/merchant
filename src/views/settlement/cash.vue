<style lang="less">
    @import './cash.less';
    .page-box{padding-top: 16px; text-align: center }
    .ivu-select-item>.bank-card-username{  font-style:italic; color:#666}
    .ivu-select-item>.bank-card-number{color:blue;}
    .ivu-select-item.ivu-select-item-selected>.bank-card-username{color:#dededf}
    .ivu-select-item.ivu-select-item-selected>.bank-card-number{color:#ffffff;}
    .cashInfro{ margin-bottom: 16px; height:auto;margin-bottom:20px;}
    .cash-infro-card{ height: 48px; line-height: 48px;margin-bottom:20px; border-radius: 5px; overflow: hidden; background-color:#f1f2f3; text-align: center; font-size: 20px; margin-right: 16px; float: left; }
    .cash-infro-card span{ display:block; float:left;  color:#ffffff; padding:0 16px; font-size: 16px}
     .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
</style>


<template>
    <div>
        <Card>
            <p slot="title" class="hasButtonP">
                <Icon type="person"></Icon>
                预付款账户
                   
                <Button type="warning" class="add-btu margin-left-10" size="small" v-if="doType=='add'"  @click="doWhat('add')" > 预付款账户
                </Button>
                <Button type="warning" class="add-btu margin-left-10" size="small" 
                    v-if="doType=='list'" 
                    @click="doWhat('list')" >入账明细
                </Button>
            </p>
            <div class="ordler-list">
                <div class="search-box">
                     
                    <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" icon="search" @click="search">搜索</Button>
                        </FormItem>
                    </Form>
                </div>
                <Table border :columns="doType=='list'?columns:columns2" size="small" :loading="getLoading" :data="tableData"></Table>
                <div class="page-box">
                <Page v-if="page.pageCount>1" :total="page.dataCount" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                </div>
            </div>
           
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
       
        return {
            doType:'list',
            columns: [
                {
                    title: '时间',
                    key: 'date_added'
                },
                {
                    title: '金额(元)',
                    "sortable": true,
                    key: 'total',
                    render: (h, params) => {
                        let tagText=Util.fmoney(Util.numberCarry(params.row.total,100,2),2);
                        return h('span', {}, tagText);
                    }
                },
                {
                    title: '状态',
                    "sortable": true,
                    width: "12%",
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="审核中";
                        if(params.row.status==1){
                            tagcolor="green";tagText="提现成功";
                        };
                        if(params.row.status==2){
                            tagcolor="red";tagText="提现失败";
                        };
                        return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);
                    }
                }
            ],
            columns2: [
                {
                    title: '订单id',
                    key: 'id'
                },
                {
                    title: '金额(元)',
                    "sortable": true,
                    key: 'total_score',
                    render: (h, params) => {
                        let tagText=Util.fmoney(Util.numberCarry(params.row.total_score,100,2),2);
                        return h('span', {}, tagText);
                    }
                },
                 {
                    title: '订单日期',
                    key: 'date_added'
                },
                 {
                    title: '商品名称',
                    key: 'name'
                },
               
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
            currentData: {
                "merchant_id":0,
                "bank_id":0,
                "total":0,
                "status":0,
                "comment":"",
                "date_added":""
            },
            getLoading: false,
            searchData:{
                searchDate:[],
                startDate:"",
                endDate:""
            },
            searchValidata: {},
            //cash
            bankCardData:[],
            editModal:false,
            cashLoading:false,
            cashInfroData: {
                total_money:0,
                canuse_money:0
            },
          
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
       doWhat(index){
        this.page={
                dataCount:0,
                pageCount:0,
                pageSize: 10,
                pageNumber: 1,
                pageSizeOpts:[10,20,50,100]
            };
        
        if(index=='list'){
            this.doType='add';
                this.init(2);
        }else{
            this.doType='list';
            this.init(1);

        }
        console.log(this.doType);

       },
        
       
        init () {
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            var url=Config.api.account.cash.getList;
            if(this.doType=='add'){
                url=Config.api.account.cash.recordLists;
            }
            this.getLoading=true;
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.getLoading=false;
                // getBankCardList
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
                Config.showError({vm:this,
                    errorMsg:"服务器通讯失败"
                });
            });
        },


    },
    mounted () {
         this.init();
    },
    activated () {
       this.init();
    }
};
</script>
