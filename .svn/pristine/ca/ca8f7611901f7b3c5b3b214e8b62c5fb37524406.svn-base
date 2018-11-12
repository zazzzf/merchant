<style lang="less">
    @import './cash.less';
    .page-box{padding-top: 16px; text-align: center }
    .ivu-select-item>.bank-card-username{  font-style:italic; color:#666}
    .ivu-select-item>.bank-card-number{color:blue;}
    .ivu-select-item.ivu-select-item-selected>.bank-card-username{color:#dededf}
    .ivu-select-item.ivu-select-item-selected>.bank-card-number{color:#ffffff;}
    .cashInfro{ margin-bottom: 16px; height:auto;margin-bottom:20px;}
    .cash-infro-card{ height: 38px; line-height: 38px;margin-bottom:20px; border-radius: 5px; overflow: hidden; background-color:#f1f2f3; text-align: center; font-size: 20px; margin-right: 16px; float: left; }
    .cash-infro-card span{ display:block; float:left;  color:#ffffff; padding:0 16px; font-size: 16px}
</style>

<template>
    <div>
        <Card>
            <p slot="title">
               白积分明细
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
                <Table border :columns="columns" size="small" :loading="getLoading" :data="tableData"></Table>
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
    name: 'white',
    data () {
       
        return {
            columns: [
                {
                    title: '时间',
                    key: 'created'
                },
              
                {
                    title: '积分',
                    "sortable": true,
                    key: "amount",
                },
                {
                    title: '来源',
                    "sortable": true,
                    key: 'kind',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="";
                        if(params.row.kind==1){
                          
                            tagText="订单返还（转入）";
                        };
                        if(params.row.kind==2){
                           
                            tagText="白积分转红积分万分之五（转出）";
                        }
                        return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
                                }
                            }, tagText);
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
                        let tagText="";
                        if(params.row.status==1){
                            tagcolor="green";tagText="转出";
                        };
                        if(params.row.status==2){
                            tagcolor="shop";tagText="转入";
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
       
        
       
        init () {
            let postData={
                ssid:Cookies.get('ssid'),
                page:this.page.pageNumber,
                pageSize:this.page.pageSize
            };
            if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
            if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            this.getLoading=true;
            $.ajax({
                url: Config.api.account.white,
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
        }
    },
    mounted () {
        
    },
    activated () {
        this.init(); 
    }
};
</script>
