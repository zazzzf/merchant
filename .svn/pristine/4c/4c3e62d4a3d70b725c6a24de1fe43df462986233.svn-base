<style lang="less">
    @import './integral.less';
    .page-box{padding-top: 16px; text-align: center }
    .ivu-select-item>.bank-card-username{  font-style:italic; color:#666}
    .ivu-select-item>.bank-card-number{color:blue;}
    .ivu-select-item.ivu-select-item-selected>.bank-card-username{color:#dededf}
    .ivu-select-item.ivu-select-item-selected>.bank-card-number{color:#ffffff;}
    .scoreInfro{ margin-bottom: 16px; height: 38px}
    .score-infro-card{ height: 38px; line-height: 38px; border-radius: 5px; overflow: hidden; background-color:#f1f2f3; text-align: center; font-size: 20px; margin-right: 16px; float: left; width: 240px}
    .score-infro-card span{ display:block; float:left; background-color: #c30; color:#ffffff; padding:0 16px; font-size: 16px}
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                积分分发
            </p>
            <div class="ordler-list">
                <div class="search-box">
                    <div class="scoreInfro">
                        <div class="score-infro-card"><span style="background-color:#ea2">当前积分：</span>{{scoreInfroData.total_score}}</div>
                    </div>
                    <Form ref="searchData" :model="searchData" :rules="searchValidata" inline>
                        <FormItem prop="searchDate">
                            <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" icon="search" @click="search">搜索</Button>
                        </FormItem>
                        <FormItem>
                            <Button type="warning" icon="social-yen" @click="showEdit">分发积分</Button>
                        </FormItem>
                    </Form>
                </div>
                <Table border :columns="columns" size="small" :loading="getLoading" :data="tableData"></Table>
                <div class="page-box">
                <Page v-if="page.pageCount>1" :total="page.dataCount" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                </div>
            </div>
            <Modal v-model="editModal" class-name="vertical-center-modal" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">分发积分</h3>
                <Form ref="scoreForm" autocomplete="off" :model="scoreFormData" :label-width="100" label-position="right" :rules="scoreFromValidata">
                    <FormItem label="分发积分" prop="scoreNumber">
                        {{scoreInfroData.total_score}}
                    </FormItem>
                    <FormItem label="提现密码" prop="password">
                        <input type="password" name="password1"  style="display:none"/>
                        <Input type="password" v-model="scoreFormData.password" placeholder="请输入提现密码" ></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelEdit">取消</Button>
                    <Button type="primary" :loading="saveLoading" @click="saveEdit">保存</Button>
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
    name: 'integral',
    data () {
        const validateScoreNumber = (rule, value, callback) => {
            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'));
            } else {
                if(value>this.scoreInfroData.canuse_money||value<=0){
                    callback(new Error('提现金额不正确'));
                }else{
                    callback();
                }
                
            }
        };
        return {
            columns: [
                {
                    title: '分发时间',
                    key: 'date_added'
                },
                {
                    title: '金额',
                    "sortable": true,
                    key: 'total'
                },
                {
                    title: '状态',
                    "sortable": true,
                    width: "12%",
                    align: 'center',
                    key: 'status',
                    render: (h, params) => {
                        let tagcolor="default";
                        let tagText="申请中";
                        if(params.row.status==1){
                            tagcolor="green";tagText="分发成功";
                        };
                        if(params.row.status==2){
                            tagcolor="red";tagText="分发失败";
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
                "total":0,
                "status":0,
                "date_added":""
            },
            getLoading: false,
            searchData:{
                searchDate:[],
                startDate:"",
                endDate:""
            },
            searchValidata: {},
            //score
            editModal:false,
            saveLoading:false,
            scoreInfroData: {
                total_score:0
            },
            scoreFormData:{
                scoreNumber:"",
                password:""
            },
            scoreFromValidata: {
                password: [
                    { required: true, message: '请输入提现密码', trigger: 'blur' }
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
        setScoreInfro () {
            let postData=()=>({
                    ssid:Cookies.get('ssid')
                });
            $.ajax({
                url: Config.api.account.score.getScoreInfro,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        this.scoreInfroData={
                            total_score:data.data.total_score
                        };

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
                Config.showError({vm:this,data:data,
                    errorMsg:"服务器通讯失败"
                });
            });
        },
        showEdit () {
            this.scoreFormData.password="";
            this.editModal = true;
        },
        cancelEdit () {
            this.editModal = false;
        },
        saveEdit () {
            this.$refs['scoreForm'].validate((valid) => {
                if (valid) {
                    this.save_loading=true;
                    let postData=()=>(
                        {
                            ssid:Cookies.get('ssid'),
                            password: this.scoreFormData.password
                        }
                    );
                    //保存
                    $.ajax({
                        url: Config.api.account.score.request,
                        type: 'POST',
                        dataType: 'json',
                        data: postData()
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("积分分发成功！");
                                this.setScoreInfro();
                                this.init();
                                this.cancelEdit();
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
                url: Config.api.account.score.getList,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                this.getLoading=false;
                // get score List
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
        
    },
    activated () {
       this.setScoreInfro();
       this.init();
    }
};
</script>
