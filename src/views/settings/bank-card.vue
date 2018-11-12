<style lang="less">
    @import './bank-card.less';
    .do-contact{padding-bottom: 15px;}
    .card-explain{ font-size: 12px; color: #f30}
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                绑定银行卡
            </p>
            <div>
                <div v-if="isadd" class="do-contact"><Button type="primary" size="small" @click="addBankCard">添加银行卡</Button> <span class="card-explain">备注：每个商户最多只能添加三张银行卡，用于提现！</span></div>
                <Table border :columns="columns" :data="tableData"></Table>
            </div>
        </Card>
        <Modal v-model="editModal" class-name="vertical-center-modal" :closable='false' :mask-closable=false :width="550">
            <h3 slot="header" style="color:#2D8CF0">修改银行卡信息</h3>
            <Form ref="currentData" :model="currentData" :label-width="146" label-position="right" :rules="currentDataValidate">
                <FormItem label="银行名称" prop="bank_id">
                    <Select v-model="currentData.bank_id" filterable>
                        <Option v-for="(item,key) in bankList" v-if="item" :value="item.bank_id" :key="item.bank_id">{{ item.bank_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="银行卡号" prop="bankCardNumber">
                    <Input v-model="currentData.bankCardNumber" placeholder="请输入银行卡号" ></Input>
                </FormItem>
                <FormItem label="开户行" prop="bankDeposit">
                    <Input v-model="currentData.bankDeposit" placeholder="请输入完整的开户行名称，包含省市信息" ></Input>
                </FormItem>
                <FormItem label="开户名/持卡人姓名" prop="username">
                    <Input v-model="currentData.username" placeholder="请输入开户名/持卡人姓名" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEdit">取消</Button>
                <Button type="primary" :loading="save_loading" @click="saveEdit">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Config from '../../config/config';
import Cookies from 'js-cookie';


export default {
    name: 'settings-bank-card',
    data () {
        return {
            columns: [
                {
                    title: '银行卡号',
                    key: 'bankCardNumber'
                },
                {
                    title: '银行名称',
                    key: 'bankName'
                },
                {
                    title: '开户行',
                    key: 'bankDeposit'
                },
                {
                    title: '开户名/持卡人姓名',
                    key: 'username'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.showEdit(params.index)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            saveType: "new",
            tableData: [],
            isTableDataDataReady:false,
            currentData: {
                id : 0,
                bankCardNumber : "",
                bankName : "",
                bankDeposit : "",
                bankAddress : "",
                username : "",
                bank_id : 0
            },
            bankList :[],
            save_loading: false,
            editModal: false, // 修改模态框显示
            savePassLoading: false,
            currentDataValidate: {
                bank_id: [
                    { required: true, type:"number", message: '请选择银行', trigger: 'blur' }
                ],
                bankCardNumber: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur' }
                ],
                bankDeposit: [
                    { required: true, message: '请输入开户行', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入开户名/持卡人姓名', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        isadd () {
            return this.tableData.length<3&&this.isTableDataDataReady
        }
    },
    methods: {
        remove (index) {
            
            if(!this.tableData[index].id)return;
            //银行选择
            let postData=()=>({
                    ssid:Cookies.get('ssid'),
                    id:this.tableData[index].id
                });
            $.ajax({
                url: Config.api.setting.UserBankCard.deleteBankCard,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        this.$Message.success("成功删除银行卡 "); 
                        this.tableData.splice(index, 1);
                    }else{
                        if(data.code==Config.errorCode.runOut.num){
                            this.$store.commit('logout',this);
                        }else{
                            this.$Message.error(data.message);
                        }
                    }
                }else{
                   this.$Message.error("删除银行卡失败 "+status); 
                }
            })
            .fail((xhr,status,error)=>{
                this.$Message.error("删除银行卡失败 "+status);
            });
        },
        addBankCard () {
            this.currentData={
                id : null,
                bankCardNumber : "",
                bankName : "",
                bankDeposit : "",
                bankAddress : "",
                username : "",
                bank_id : null
            };
            this.saveType="new";
            this.editModal = true;
        },
        showEdit (index) {
            this.currentData = $.extend(true, {}, this.tableData[index]);
            this.currentData.dataIndex=index;
            this.saveType="edit";
            this.editModal = true;
        },
        cancelEdit () {
            this.editModal = false;
        },
        saveEdit () {
            this.$refs['currentData'].validate((valid) => {
                if (valid) {
                    this.save_loading=true;
                    let postData_bankId=this.currentData.bank_id;
                    let postData_bankName=this.currentData.bankName;
                    if(this.currentData.bank_id>0){
                        postData_bankName=this.bankList[this.currentData.bank_id].bank_name;
                        this.currentData.bankName=postData_bankName;
                    };

                    let postData=
                        {
                            ssid:Cookies.get('ssid'),
                            bank_id         : this.currentData.bank_id,
                            name            : postData_bankName,
                            opening_bank    : this.currentData.bankDeposit,
                            number          : this.currentData.bankCardNumber,
                            username        : this.currentData.username
                        };

                    if(this.saveType=="new")postData.id=this.currentData.id;

                    let postUrl=this.saveType=="new"?Config.api.setting.UserBankCard.addBankCard:Config.api.setting.UserBankCard.modifyBankCard;
                    let doName =this.saveType=="new"?"添加":"修改";
                    //保存
                    $.ajax({
                        url: postUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: postData
                    })
                    .done((data)=>{
                        this.save_loading=false;
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("成功"+doName+"银行卡信息！");
                                if(this.saveType=="new"){
                                    this.tableData.push(this.currentData);
                                }else{
     
                                    let newData=$.extend(true, {}, this.currentData);
                                    let newList=$.extend(true, [], this.tableData);
                                    newList.splice(this.currentData.dataIndex,1,newData)
                                    this.tableData=newList;
                                    
                                };
                                this.cancelEdit();
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                           Config.showError({vm:this,data:data,
                                    errorMsg:"数据获取失败"
                                });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.save_loading=false;
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    });
                }

            })

            
        },
        setBankList () {
            //银行选择
            let postData=()=>({
                    ssid:Cookies.get('ssid')
                });
            $.ajax({
                url: Config.api.public.bankList,
                type: 'POST',
                dataType: 'json',
                data: postData()
            })
            .done((data)=>{
                //userTypeList
                if(!!data){
                    if(data.code==0){
                        let bankList=[];
                        for (let item in data.data){
                            for (let item1 in data.data[item]){
                            bankList[data.data[item][item1].bank_id]=data.data[item][item1];
                            };
                        };
                        this.bankList=bankList;
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:""
                    });
                }
            })
            .fail((xhr,status,error)=>{
                Config.showError({vm:this,data:data,
                    errorMsg:""
                });
            });
        },
        init () {
            //银行卡列表
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
                                bankName : data.data[item].name,
                                bankDeposit : data.data[item].opening_bank,
                                bankAddress : "",
                                username : data.data[item].username,
                                created : data.data[item].created,
                                bank_id : data.data[item].bank_id
                            })
                        };
                        this.tableData=bankCardList;
                        this.isTableDataDataReady=true;
                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"数据获取失败"
                    });
                }
            })
            .fail((xhr,status,error)=>{
                Config.showError({vm:this,data:data,
                    errorMsg:"服务器通讯失败"
                });
            });
        }
    },
    mounted () {
        this.setBankList();
    },
    activated () {
        this.init();
    }
};
</script>
