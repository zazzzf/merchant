<style lang="less">
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
                <Icon type="compose"></Icon>
                {{doName}}
                <Button type="warning" class="add-btu margin-left-10" size="small" 
                    v-if="checkPower('list')&&doType!='list'" 
                    @click="doWhat('list')" >返回商品列表
                </Button>
                <Button type="warning" class="add-btu margin-left-10" size="small" 
                    v-if="checkPower('add')&&doType=='list'" 
                    @click="doWhat('add')" >添加商品
                </Button>
            </p>
            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <keep-alive>
                    <component @doWhat="doWhat" :param="paramData" :publicData="publicData" :is="currentView">
                        <!-- 非活动组件将被缓存！ -->
                    </component>
                </keep-alive>
            </div>
        </Card>
    </div>
</template>

<script>
import Config from '../../config/config';
import Util from '../../libs/util';
import Cookies from 'js-cookie';
import goodsList from './goods-list.vue';
import editGoods from './edit-goods.vue';
import multiupload from '../my_components/upload/multiupload.vue';

export default {
    name: 'agents_list',
    components: {   
        goodsList  : goodsList,
        editGoods  : editGoods,
        multiupload: multiupload
    },
    data () {
        return {
            doType:"list",
            switching:false,
            publicData:{
                product_status: ["未审核","审核通过","拒绝"],
                carriage_type:["未知","包邮","全国统一邮费","新疆、西藏用户需附加邮费"]
            },
            dataReady:0,
            areaData:{
                areaDataReady:3,
                province:[],
                citys:[],
                district:[]
            },
            paramData:{
                currentProduct:{}
            },
            currentView:"goodsList"
        };
    },
    computed : {
        doName () {

            if (this.doType=="list") return "商品管理";
            if (this.doType=="edit") return "编辑商品";
            if (this.doType=="add") return "添加商品";
            return "商品管理";
        }
    },
    methods: {
        //controller
        checkPower (dotype) {
            return true;
            return !!this.$store.state.Rights[Config.api.agents.agents_list[dotype]];
        },
        doWhat (dotype,paramData) {
            if(!this.checkPower(dotype)){
                this.$Message.warning("对不起，您没有此操作权限！");
                return;
            };
            // if(paramData){
            //     this.paramData=paramData;
            // }
            this.switching=true;
            if(dotype=="add"){
                // this.paramData.agent=paramData;
                this.paramData.currentProduct={};
                this.currentView="editGoods";
                this.doType="add";
            };
            if(dotype=="edit"){
                console.log(paramData);
                this.paramData.currentProduct=paramData;
                this.currentView="editGoods";
                this.doType="edit";
            };
            if(dotype=="list"){
                this.currentView="goodsList";
                this.doType="list";
            };
            this.switching=false;
        },
        //comm
        resetCurrentData () {
            this.paramData = {};
        }
    },
    mounted () {

    },
    activated (){
        this.doWhat("list",this.paramData);   
    }
};
</script>