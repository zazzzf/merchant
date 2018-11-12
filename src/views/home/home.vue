<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
    .center p{

        height:100px;
        line-height: 100px;
        font-size:18px;

    }

    .center:after{
        content:"";
        display:block;
        clear:both;
    }
    .center p b{
        font-size:32px;

        color:rgb(242, 94, 67);
    }
    .center .right{
        float:right;
        min-width: 100px;
        margin-left:20px;
    }
</style>
<template>
    <div class="home-main">
        <Row>
            <Col span="24">
                <Row v-if="dataComplete">
                    <Col span="8">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.total_order"
                            iconType="clipboard"
                            color="#2d8cf0"
                            intro-text="今日订单"
                        ></infor-card>
                    </Col>
                  <!--   <Col span="6" class-name="padding-left-5">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.total"
                            iconType="connection-bars"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日获得购物指数"
                        ></infor-card>
                    </Col> -->
                    <Col span="8" class-name="padding-left-5">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.total_cash"
                            iconType="social-yen"
                            color="#f25e43"
                            intro-text="累计现金余额"
                        ></infor-card>
                    </Col>
                     <Col span="8" class-name="padding-left-5">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.white_score"
                            iconType="social-yen"
                            color="#43f1f2"
                            intro-text="白积分"
                        ></infor-card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    七日数据统计
                </p>
                <div class="line-chart-con">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Row>
        <Row class="margin-top-10" style="height:250px">

             
            
            <Col span="8" class-name="padding-left-5">
                <Card>
                    <p slot="title" class="card-title"> 
                      红积分
                    </p>
                   <div class="center">
                       

                    <p>余额：<b>{{count.red_score}}</b></p>
                    <Button type="primary" class="right" @click="btn1">转换</Button>
                    <Button type="primary" class="right" @click="btn2">转账</Button>
                   </div>
                </Card>
            </Col>
            <Col span="8" class-name="padding-left-5">
                <Card>
                    <p slot="title" class="card-title"> 
                      购物积分
                    </p>
                    <div class="center">
                        <p>余额：<b style="color:rgb(255, 213, 114);">{{count.shopping_score}}</b></p>
                        <Button type="primary" class="right" @click="btn3">转账</Button>
                       
                    </div>
                </Card>
            </Col>  
           <Col span="8" class-name="padding-left-5">
                <Card>
                    <p slot="title" class="card-title"> 
                      预付款
                    </p>
                    <div class="center">
                        
                        <p>余额：<b style="color:rgb(100, 213, 114);">{{count.total_withdraw_cash}}</b></p>
                        
                        <Button type="primary" class="right"  @click="showEdit">申请提现</Button>
                    </div>
                </Card>
            </Col>
           
           

        </Row>
        <Modal v-model="editModal" class-name="vertical-center-modal" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">申请提现</h3>
                <Form ref="CashForm" autocomplete="off" :model="cashFormData" :label-width="100" label-position="right" :rules="cashFromValidata">
                    <FormItem label="银行卡" prop="bankId">
                        <Select v-model="cashFormData.bankId" placeholder="请选择银行卡">
                            <Option v-for="(item,key) in bankCardData" v-if="item" :label="item.bankCardNumber" :value="item.id" :key="item.id"><span class="bank-card-number">{{ item.bankCardNumber }}</span> <label class="bank-card-username">{{item.username}}</label></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="提现金额" prop="cashMoney">
                        <Input v-model="cashFormData.cashMoney" placeholder="请输入提现金额" ></Input>
                    </FormItem>
                    <FormItem label="提现密码" prop="password">
                        <input type="password" name="password1"  style="display:none"/>
                        <Input type="password" v-model="cashFormData.password" placeholder="请输入提现密码" ></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelEdit">取消</Button>
                    <Button type="primary" :loading="cashLoading" @click="saveEdit">保存</Button>
                </div>
            </Modal>

  

            <!-- 商户购物积分转用户购物积分 -->
            <Modal v-model="editModal3" class-name="vertical-center-modal" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">积分转账</h3>
                <Form ref="IntegraForm" autocomplete="off" :model="Integral" :label-width="100" label-position="right" :rules="IntegraValidata">
                   
                    <FormItem label="对方账号" prop="uname">
                        <Input v-model="Integral.uname" placeholder="请输入对方账号" ></Input>
                    </FormItem>
                    <FormItem label="转账积分" prop="integral">
                        <Input type="text" v-model="Integral.integral" placeholder="请输入转账积分" ></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="IntegralcancelEdit">取消</Button>
                    <Button type="primary" :loading="IntegralLoading" @click="IntegralsaveEdit">保存</Button>
                </div>
            </Modal>



    </div>
      
</template>

<script>
import dataSourcePie from './components/dataSourcePie.vue';
import Config from '../../config/config';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import Cookies from 'js-cookie';

export default {
    name: 'home-index',
    components: {
        dataSourcePie,
        serviceRequests,
        userFlow,
        countUp,
        inforCard
    },
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
            count: {
                total: 1,
                total_order: 1,
                total_cash: 1,
                red_score:1,//当前红积分余额
                white_score:1,//当前白积分余额
                shopping_score:1,//当前购物积分余额
                total_withdraw_cash:1,//商户可提现余额
            },
            //积分
            editModal2:false,
            editModal3:false,
            IntegralLoading:false,

             //cash
            bankCardData:[],
            editModal:false,

            cashLoading:false,
            cashInfroData: {
                total_money:0,
                canuse_money:0
            },
            cashFormData:{
                bankId:"",
                cashMoney:"",
                password:""
            },
            Integral:{
                uname:"",
                Integral:"",
            },
            cashFromValidata: {
                bankId: [
                    { required: true, validator: validateBankCardId, trigger: 'blur' }
                ],
                cashMoney: [
                    {   
                        required: true,
                        message: '请输入提现金额',
                        trigger: 'blur'
                    },
                    {validator: validatecashMoney, trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入提现密码', trigger: 'blur' }
                ]
            },
            //提现结束
            //
            IntegraValidata: {
                uname: [
                    { required: true, message: '对方账号不能为空', trigger: 'blur' }
                ],
               
                integral: [
                    { required: true, message: '装转积分不能为空', trigger: 'blur' }
                ]
            },
            typeIntegra:null,
            dataComplete: false,
            newToDoItemValue: ''
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        },
        setCount () {
            let _this=this;
            let postData={
                ssid:Cookies.get('ssid')
            };
            $.ajax({
                url: Config.api.home.count,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                if(!!data){
                    if(data.code==0){
                        console.log(data);
                        this.count.total_order=+data.data.total_order;//今日订单数量
                        this.count.total=+data.data.total;//今日获得购物指数
                        this.count.total_cash=+data.data.total_cash;//累计现金余额
                        this.count.red_score=+data.data.red_score;//当前红积分余额
                        this.count.white_score=+data.data.white_score;//当前白积分余额
                        this.count.shopping_score=+data.data.shopping_score;//当前购物积分余额
                        this.count.total_withdraw_cash=+Math.floor(data.data.total_withdraw_cash/100);//商户可提现余额
                        this.dataComplete=true;
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:"请求失败"
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"数据获取错误，请刷新重试"
                    });
                }
            });
        },
        /**
         * [提现账号]
         * @Author   BigCousin
         * @DateTime 2018-08-24
         */
        setBankCardList () {
            let postData=()=>({
                    ssid:Cookies.get('ssid')
                });
            $.ajax({
                url: Config.api.setting.UserBankCard.getBankCardList,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                // getBankCardList
                if(!!data){
                    if(data.code==0){
                        let bankCardList=[];
                        for (let item in data.data){
                            bankCardList.push({
                                id : data.data[item].id,
                                bankCardNumber : data.data[item].number,
                                username : data.data[item].username
                            })
                        };
                        this.bankCardData=bankCardList;
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
        /**
         * [提现]
         * @Author   BigCousin
         * @DateTime 2018-08-24
         * @return   {[type]}   [description]
         */
        showEdit () {
            this.setBankCardList();
            this.cashFormData={
                bankId:"",
                cashMoney:"",
                password:""
            };
            this.$refs['CashForm'].resetFields();
            this.editModal = true;
        },
        //关闭弹窗
        cancelEdit () {
            this.editModal = false;
        },
        saveEdit () {
            this.$refs['CashForm'].validate((valid) => {
                if (valid) {
                    this.save_loading=true;
                    let postData=()=>(
                        {
                            ssid:Cookies.get('ssid'),
                            bankId  : this.cashFormData.bankId,
                            money   : this.cashFormData.cashMoney*100,
                            password: this.cashFormData.password
                        }
                    );
                    //保存
                    $.ajax({
                        url: Config.api.account.cash.request,
                        type: 'POST',
                        dataType: 'json',
                        data: postData()
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("提现申请成功！我们将尽快处理");
                                
                                this.setCount();
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
            //商户购物积分转用户购物积分
        btn1(){

            this.typeIntegra=1;
            this.editModal3=true;
            this.$refs['IntegraForm'].resetFields();
            this.Integral.uname="";    
            this.Integral.Integral="";    
        },

        //商户红积分转用户购物积分
        btn2(){
            this.typeIntegra=2;
            this.$refs['IntegraForm'].resetFields();
            this.editModal3=true;
            this.Integral.uname="";    
            this.Integral.Integral="";   

        },
        //商户红积分转用户购物积分
        btn3(){
            this.typeIntegra=3;
            this.$refs['IntegraForm'].resetFields();
            this.editModal3=true;
            this.Integral.uname="";    
            this.Integral.Integral="";   

        },

        //保存
        IntegralsaveEdit(){
            let typeIntegra=this.typeIntegra;
            let url=Config.api.home.list1;
            if(typeIntegra==1){
                url=Config.api.home.list1;
            }else if(typeIntegra==2){
                url=Config.api.home.list2;
            }else{
                url=Config.api.home.list3;
            }
            this.$refs['IntegraForm'].validate((valid) => {
                if (valid) {
                    this.save_loading=true;
                    let postData=()=>(
                        {
                            ssid:Cookies.get('ssid'),
                            uname      : this.Integral.uname,
                            Integral   : this.Integral.Integral,
                            
                        }
                    );
                    //保存
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        data: postData()
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("操作成功,我们将尽快处理");
                               
                                this.setCount();
                                this.IntegralcancelEdit();
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


        //关闭弹窗
        IntegralcancelEdit () {
            this.editModal3 = false;
        },
    },
    
    created () {
        this.setCount();
    },
    activated () {
       
    }
};
</script>
