<style lang="less">
    @import "./main.less";
    .yunlianhui {
        float: right;
        height: 100%;
        margin-right: 18px
    }
    .bind-btu {
        display: inline-block;
        height: 100%;
        line-height: 60px;
        font-size: 14px
    }
    .yunlianhui_content {
        padding: 2px 20px;
        text-align: center;
    }
    .yunlianhui_content .yunlianhui_account {
        line-height: 28px;
        font-size: 20px;
        color: rgb(45, 140, 240);
        padding: 8px 0
    }
    .yunlianhui_content .ivu-form-item {
        margin-bottom: 24px
    }
    .yunlianhui_content h3 {
        margin-bottom: 0px;
        margin-top: 12px
    }
    .yunlianhui-bottom.ivu-form-item {
        margin-bottom: 6px
    }
    .yunlianhui_content .ivu-form {
        margin-top: 12px
    }
</style>
<template>
    <div class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'200px', overflow: hideMenuText ? 'visible' : 'auto', background: $store.state.menuTheme === 'dark'?'#495060':'white'}">
            <div class="logo-con">
                <img v-show="!hideMenuText" src="../images/logo.png" key="max-logo" />
                <img v-show="hideMenuText" src="../images/logo-min.png" key="min-logo" />
            </div>
            <sidebar-menu v-if="!hideMenuText" :menuList="menuList" :iconSize="14" />
            <sidebar-menu-shrink :icon-color="menuIconColor" v-else :menuList="menuList" />
        </div>
        <div class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                            <Icon type="navicon" size="32"></Icon>
                        </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <!-- 绑定云联惠 -->
                    <Poptip v-if="yunlianhui.status==1&&topBarRights.bindYunlianhui" v-model="yunlianhui.visible" placement="bottom-end" class="yunlianhui">
                        <a class="bind-btu" type="ghost">已绑定云联惠</a>
                        <div class="api" slot="content">
                            <div class="yunlianhui_content">
                                <h3>已绑定云联惠手机号</h3>
                                <div class="yunlianhui_account">{{yunlianhui.account}}<br />{{yunlianhui.mobile}}</div>
                                <Button type="error" @click="handleUnBindYunlianhui()">解除绑定</Button>
                            </div>
                        </div>
                    </Poptip>
                    <Poptip v-else-if="yunlianhui.status==0&&topBarRights.unbindYunlianhui" v-model="yunlianhui.visible" placement="bottom-end" class="yunlianhui">
                        <a class="bind-btu" type="ghost">未绑定云联惠</a>
                        <div class="yunlianhui_content" slot="content">
                            <h3>您还未绑定云联惠帐号，请添加绑定</h3>
                            <Form ref="yunlianhui" :model="yunlianhui" :rules="rules_yunlianhui">
                                <FormItem prop="account">
                                    <Input v-model="yunlianhui.account" placeholder="请输入云联惠帐号"></Input>
                                </FormItem>
                                <FormItem prop="mobile">
                                    <Input v-model="yunlianhui.mobile" placeholder="请输入云联惠绑定手机号"></Input>
                                </FormItem>
                                <FormItem class="yunlianhui-bottom">
                                    <Button type="primary" @click="handleBindYunlianhui('yunlianhui')">添加</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Poptip>
                    <!-- #绑定云联惠结束 -->
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">您好！{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-if="topBarRights.modifyCashPassword" name="modify-cash-password">提现密码</DropdownItem>
                                    <DropdownItem v-if="topBarRights.modifyPassword" name="modify-password">登录密码</DropdownItem>
                                    <DropdownItem name="loginout" v-bind:divided="topBarRights.modifyCashPassword==1||topBarRights.modifyPassword==1">退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </div>
                    <!--   <div @click="lockScreen" class="lock-screen-btn-con">
                
                                                            <Tooltip content="锁屏" placement="bottom">
                
                                                                <Icon type="locked" :size="20"></Icon>
                
                                                            </Tooltip>
                
                                                        </div> -->
                    <div @click="handleFullScreen" v-if="showFullScreenBtn" class="full-screen-btn-con">
                        <Tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
                            <Icon :type="isFullScreen ? 'arrow-shrink' : 'arrow-expand'" :size="23"></Icon>
                        </Tooltip>
                    </div>
                    <Button type="primary" style="margin-right:20px;margin-top:15px;" @click="dianji">注册会员</Button>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: hideMenuText?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <Modal v-model="modal1" title="注册会员">
            <Input v-model="value" placeholder="请输入电话号码" style="width: 300px" />
            <div slot="footer">
                <Button size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="ok">保存</Button>
            </div>
        </Modal>
        <!-- 协议书 -->
        <Modal v-model="agreement" width="100%" :styles="agreementstyle" :closable='false' class-name="agreementtext">
            <h1 slot="header" style="text-align:center">
                <span>商家入驻协议书</span>
            </h1>
            <div>
                <Row>
                    <Col span="12">
                    <h3>甲方：西安悟空团网络科技有限公司</h3>
                    <h3>法定代表人：龚立</h3>
                    <h3>社会信用代码：91610104MA6W1WU94G</h3>
                    <h3>所属行业：{{agreementData.secondJob}}</h3>
                    <h3>地址：陕西省西安市莲湖区团结中路43号翡丽城第2幢4单元1层40104号</h3>
                    <h3>电话：029-87408259</h3>
                    <br>
                    </Col>
                    <Col span="12">
                    <h3>乙方：{{agreementData.secondName}}</h3>
                    <h3>法定代表人：{{agreementData.secondRep}}</h3>
                    <h3>社会信用代码：{{agreementData.secondCode}}</h3>
                    <h3>所属行业：{{agreementData.secondJob}}</h3>
                    <h3>详细地址：{{agreementData.secondAdress}}</h3>
                    <h3>联系方式：{{agreementData.secondTel}}</h3>
                    </col>
                </Row>
                <h3>基于乙方充分了解并认同悟空团商城系统“团购+共享消费促销奖励”平台运营管理规则，甲乙双方本着平等合作、互惠互利的原则，在符合相关法律法规，不违反市场竞争的情况下，经友好协商，为明确双方权利义务，特签署本入驻协议：</h3>
                <h3>一、合作内容及方式</h3>
                <p>1.乙方确认已经自愿注册成为悟空团商城系统的□普通会员、□商家会员、□区域代理会员。</p>
                <p>2.甲方为乙方提供悟空团商城系统平台消费会员的资源。</p>
                <p>3.甲方按照悟空团商城系统运营管理规则为乙方的产品（或服务）提供强大、专业的宣传、推广并对接相应的买方客户。</p>
                <p>4.乙方确认遵循悟空团商城系统之运营管理规范及结算规则。</p>
                <p>5.双方经营运行涉及的相关税、费，由双方依法各自承担。</p>
                <p>6.本协议合作有效期为壹年，自<u>&nbsp&nbsp{{agreementData.agreeData}}&nbsp&nbsp</u>起至<u>&nbsp&nbsp{{agreementData.endDate}}&nbsp&nbsp</u>止；若签署本协议时乙方仅注册成为悟空团商城系统的普通会员，则乙方应在甲方所属悟空团商城销售额达20000元之日起五日内，升级为商家会员，缴纳升级费（即合作期间的平台使用费）________________元／年；合作期满，乙方自愿续约，甲方承诺续约时缴纳的平台使用费与本协议保持不变。</p>
                <p>7.乙方作为悟空团商城系统平台的联盟商家，按照悟空团商城运营管理规则，双方约定折扣差（悟空团商城系统平台会员购买乙方的产品或服务所支付的金额与乙方提现之间的差额）为<u>&nbsp&nbsp{{agreementData.secondRatio}}&nbsp&nbsp</u>，按照商家销售结算系统规则结算（扣除折扣差，赠送商家折扣差等额白积分），甲方承诺乙方（商家营业款账户）提现24小时内到账（因银行系统升级迟延除外）。</p>
                <h3>甲方的权利和义务</h3>
                <p>1.甲方是悟空团商城系统的开发运营商，按照悟空团商城系统运营管理规则享有该商城的独立完整运营权。</p>
                <p>2.甲方履行国家、地区、行业相关法律、法规、悟空团商城系统运营管理规则以及与乙方约定的相关协议约定行使权利，履行义务。</p>
                <p>3.甲方借助相应的资讯、媒体平台对悟空团商城进行展示、宣传。</p>
                <h3>三、乙方的权利和义务</h3>
                <p>1.乙方入驻甲方商城平台拥有以下权利：</p>
                <p>①提供悟空团商城<u>&nbsp&nbsp{{agreementData.secondType}}&nbsp&nbsp</u>展示店铺一间，应用悟空团商城APP等工具推广和宣传乙方经营的产品和服务，促进自有产品、服务的销售；</p>
                <p>②授权使用悟空团商城商家销售结算系统；</p>
                <p>2.乙方按照甲方运营管理的相关要求，严格遵守国家、地区、行业相关法律法规、悟空团商城系统的相关规则，承担协议约定的义务责任，并承诺在甲方平台销售的商品或服务的交易价格不高于其他平台，否则，甲方按照悟空团商城运营管理规则处理。</p>
                <p>3.乙方确认诚信务实、守法经营自己或分销的产品和服务，并独立、全面地完成将销售产品（或服务）提供给用户。</p>
                <p>4.乙方独立承担经营中各项社会、客户、员工等的各项义务、费用；如在合作期间，因乙方原因造成消费者损失或投诉的，由乙方承担全部责任；若因此造成甲方承担连带责任的，造成甲方损失的，甲方有权向乙方追偿，乙方应全额赔偿。</p>
                <p>5.乙方对在悟空团商城中所销售的产品（或服务）的安全性、产品质（数）量、线上线下的经营行为承担全部责任，并保证向甲方提供的用于推广使用的商家介绍信息（文字、图片）、产品详细信息（文字、图片）的真实性和合法性负责。</p>
                <p>6.乙方应当在营业执照登记的经营范围内销售商品或提供服务，因销售的商品或提供的服务超出营业执照经营范围，触犯国家、地方法律法规的，由乙方承担全部责任；若因此造成甲方承担连带责任，造成甲方损失的，甲方有权向乙方追偿，乙方应全额赔偿。。</p>
                <p>7.乙方承诺享有本协议所涉经营或所分销产品、企业名称、商标、字号等知识产权、资产的完全权利，并授权甲方及甲方的系统、平台、工具进行推广活动使用，而不会招致任何第三方的知识产权或其他侵权请求。如有第三方因上述事项向甲方主张相关权利，经查证属实后，甲方将有权立即暂停与乙方的合作，相关争议由乙方自行解决；如未能及时解决，甲方有权终止本协议。由于乙方侵权第三方任何知识产权或其他权利，造成甲方承担连带责任或实际经济损失的，甲方有权向乙方追偿。</p>
                <p>8.合作期间内，乙方提供给用户的产品内容须真实有效不得发生改变。乙方线上线下经营产品、服务，不得以实际更优惠的条件在其他任何渠道、场合销售。如乙方违反此项造成甲方用户投诉，乙方应对甲方用户进行差额部分双倍的赔偿。</p>
                <p>9.合法、正面、正确使用、宣传悟空团商城系统的经营理念、系统平台、促销工具。</p>
                <h3>三、保密</h3>
                <p>1. 本协议任何一方对在合作过程中所获知的对方未向社会公开的技术情报和商业 秘密均负有保密义务，未经对方书面许可，任何一方不得将其泄露给第三者，否则应承担违约责任并赔偿由此给对方造成的损失，包括诉讼费、保全费、律师费。
                </p>
                <p>2. 在本协议终止之后，各方在本协议项下的义务并不随之终止，各方仍需遵守本 协议之保密条款，履行其所承担的保密义务，直到对方同意解除此项义务。
                </p>
                <h3>四、违约条款</h3>
                <p>1. 本协议由双方自愿订立，所涉协议内容、条款均为双方真实意思的表达，双方享有权利，履行义务。如有违反本协议约定，守约方有权解除或终止本协议，并要求违约方承担壹万元的违约金。违约行为若造成守约方实际经济损失的，违约方除支付违约金外，还应赔偿守约方其余全部损失。</p>
                <p>2.任何一方如发生严重违反本协议条款，严重违背商业道德和法律或损坏对方利益时，另一方均可以书面形式解除或终止本协议。</p>
                <p>3.因不可抗力因素导致的责任，双方互不承担责任。</p>
                <h3>五、争议处理</h3>
                <p> 双方发生争议时应协议解决，协商不成的，任何一方均可向甲方所在地法院以诉讼方式予以解决。本协议所涉有关悟空团商城系统规则，以最新公告的系统规则为准。 </p>
                <h3>七、生效条件</h3>
                <p>本协议经双方签字盖章后生效。</p>
                <h3>八、 协议中未尽事宜双方可协商签订补充协议，与本协议具有同等的法律效力</h3>
                <h3>九、 本协议一式两份，甲乙双方各执一份，附件是本协议不可分割的一部分，均具有同等法律效力。</h3>
                <Row>
                    <Col span="12">
                    <h3>甲方：西安悟空团网络科技有限公司 </h3>
                    <h3>法定代表人：龚立</h3>
                    <h3>经办人：龚立</h3>
                    <h3>电话/传真：029-87408259</h3>
                    <h3>签约时间：{{agreementData.agreeData}}</h3>
                    </Col>
                    <Col span="12">
                    <h3>乙方：{{agreementData.secondName}}</h3>
                    <h3>法定代表人：{{agreementData.secondRep}}</h3>
                    <h3>经办人：{{agreementData.secondRep}}</h3>
                    <h3>电话/传真：{{agreementData.secondTel}}</h3>
                    <h3>签约时间：{{agreementData.agreeData}}</h3>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Checkbox v-model="imagree1" @on-change="imagreecheck()">我已阅读并同意《商家入驻协议书》</Checkbox>
                <Button type="primary" size="large" @click="merchantyes()" :disabled='imagree'>下一步</Button>
                <Button type="text" size="large" @click="handleClickUserDropdown('loginout')">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import sidebarMenu from './main_components/sidebarMenu.vue';
    import tagsPageOpened from './main_components/tagsPageOpened.vue';
    import breadcrumbNav from './main_components/breadcrumbNav.vue';
    import themeDropdownMenu from './main_components/themeDropdownMenu.vue';
    import sidebarMenuShrink from './main_components/sidebarMenuShrink.vue';
    import Config from '../config/config';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import config from '../config/config';
    export default {
        components: {
            sidebarMenu,
            tagsPageOpened,
            breadcrumbNav,
            themeDropdownMenu,
            sidebarMenuShrink
        },
        data() {
            return {
                single: false,
                agreementstyle: {
                    height: '100%',
                    top: 0,
                    background: 'white',
                    margin: 0,
                },
                agreement: true,
                spanLeft: 4,
                value: '',
                modal1: false,
                spanRight: 20,
                currentPageName: '',
                hideMenuText: false,
                topBarRights: {
                    modifyPassword: 1,
                    modifyCashPassword: 1,
                    bindYunlianhui: 1,
                    unbindYunlianhui: 1
                },
                userName: '',
                access_yunlianhui: {
                    name: "bindYunlianhui",
                    access: 0
                },
                rules_yunlianhui: {
                    account: {
                        required: true,
                        message: '请正确输入云联惠帐号',
                        trigger: 'blur'
                    },
                    mobile: {
                        pattern: /^1[34578]\d{9}$/,
                        required: true,
                        message: '请正确输入云联惠绑定手机号',
                        trigger: 'blur'
                    }
                },
                yunlianhui: {
                    status: Cookies.get('cloud_status'),
                    account: Cookies.get('cloud_account'),
                    mobile: Cookies.get('cloud_mobile'),
                    visible: false
                },
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                messageCount: 0,
                lockScreenSize: 0,
                agreementData: {
                    secondName: '',
                    firstCode: '',
                    firstAdress: '',
                    secondRep: '',
                    secondCode: '',
                    secondJob: '',
                    secondAdress: '',
                    secondTel: '',
                    firstPer: '',
                    secondPer: '',
                    agreeData: '',
                    endDate: '',
                    secondRatio: ''
                },
                imagree: true,
                imagree1: false,
            };
        },
        computed: {
            menuList() {
                return this.$store.state.menuList;
            },
            tagsList() {
                return this.$store.state.tagsList; // 所有页面的页面对象
            },
            pageTagsList() {
                return this.$store.state.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath() {
                return this.$store.state.currentPath; // 当前面包屑数组
            },
            menuIconColor() {
                return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
            },
            avatorPath() {
                return localStorage.avatorImgPath;
            },
            cachePage() {
                return this.$store.state.cachePage;
            },
            lang() {
                return this.$store.state.lang;
            },
            isFullScreen() {
                return this.$store.state.isFullScreen;
            },
        },
        methods: {
            init() {
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
            },
            imagreecheck() {
                this.imagree = !this.imagree1
            },
            dianji() {
                let _this = this;
                _this.modal1 = true;
            },
            cancel() {
                this.$Message.info('放弃注册会员');
            },
            ok() {
                console.log(this.value);
                let _this = this;
                if (this.checkTel(this.value)) {
                    let postData = {
                        mobile: this.value,
                        ssid: Cookies.get('ssid'),
                    };
                    let sucessFun = function(data) {
                        if (!!data) {
                            if (data.code == 0) {
                                _this.modal1 = false;
                                _this.value = '';
                                _this.$Message.success("会员注册成功！");
                            } else {
                                Config.showError({
                                    vm: _this,
                                    data: data,
                                    errorMsg: ""
                                });
                            }
                        }
                    };
                    let errFun = function(data) {
                        Config.showError({
                            vm: _this,
                            data: data,
                            errorMsg: "会员注册失败，请刷新页面重新尝试!"
                        });
                    };
                    $.ajax({
                            url: _this.$store.state.public.api.main.addmember,
                            type: 'POST',
                            dataType: 'json',
                            data: postData,
                        })
                        .done(sucessFun)
                        .fail(errFun);
                } else {
                    this.$Message.error('请输入正确的手机号或电话号码');
                }
            },
            getmerchant() {
                if (Cookies.get('is_agreement') == 0) {
                    this.agreement = true
                } else {
                    this.agreement = false
                }
                let postData = {
                    id: Cookies.get('user_id'),
                    ssid: Cookies.get('ssid')
                }
                $.ajax({
                        url: config.api.main.agreementData,
                        type: 'POST',
                        dataType: 'json',
                        data: postData,
                    })
                    .done(res => {
                        var date = res.data.merchantCreateDateTime
                        var date1 = date.split(' ')[0].split('-')
                        var year = Number(date1[0])
                        var month = date1[1]
                        var day = date1[2]
                        var endyear = year + 1
                        var Ratio = Number(res.data.merchantRatio) * 100 + '%'
                        var type
                        if (res.data.merchantMerchantType == 1) {
                            type = '线下实体'
                        } else {
                            type = '线上商家'
                        }
                        this.agreementData.secondName = res.data.merchantName
                        this.agreementData.secondRep = res.data.applicantName
                        this.agreementData.secondTel = res.data.merchantPhone
                        this.agreementData.secondJob = res.data.merchantIndustryInvolved
                        this.agreementData.secondAdress = res.data.merchantAddress
                        this.agreementData.secondType = type
                        this.agreementData.agreeData = year + '年' + month + '月' + day + "日"
                        this.agreementData.endDate = endyear + '年' + month + '月' + day + "日"
                        this.agreementData.secondRatio = Ratio
                        this.agreementData.secondCode = res.data.merchantSocialCreditCode
                    })
            },
            merchantyes() {
                console.log(111)
                // this.agreement = false
                let agreementText = $('.agreementtext').text()
                let postData = {
                    merchantIsAgreement: 1,
                    merchantAgreement: agreementText,
                    ssid:Cookies.get('ssid')
                }
                $.ajax({
                        url: config.api.main.agreementCode,
                        type: 'POST',
                        dataType: 'json',
                        data: postData,
                    })
                    .done(res => {
                        console.log(res)
                        if (!!res) {
                            if (res.code == 0) {
                                Cookies.set('is_agreement', 1)
                                this.agreement = false
                                this.$Message.success('欢迎您')
                            }
                        }else{
                            this.$Message.success(res.message)
                        }
                    })
            },
            checkTel(tel) {
                // var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
                if ((/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
                    return true;
                } else {
                    return false;
                }
            },
            toggleClick() {
                this.hideMenuText = !this.hideMenuText;
            },
            handleBindYunlianhui(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        let postData = {
                            id: Cookies.get('merchant_id'),
                            ssid: Cookies.get('ssid'),
                            yun_account: this.yunlianhui.account,
                            yun_mobile: this.yunlianhui.mobile,
                            yun_account_status: 1
                        };
                        let sucessFun = function(data) {
                            if (!!data) {
                                if (data.code == 0) {
                                    Cookies.set('cloud_account', _this.yunlianhui.account);
                                    Cookies.set('cloud_mobile', _this.yunlianhui.mobile);
                                    Cookies.set('cloud_status', 1);
                                    _this.yunlianhui.status = 1;
                                    _this.$Message.success("绑定成功");
                                    _this.yunlianhui.visible = false;
                                } else {
                                    Config.showError({
                                        vm: _this,
                                        data: data,
                                        errorMsg: ""
                                    });
                                }
                            } else {
                                Config.showError({
                                    vm: _this,
                                    data: data,
                                    errorMsg: "绑定失败，请刷新页面重新尝试!"
                                });
                            }
                        };
                        let errFun = function(data) {
                            Config.showError({
                                vm: _this,
                                data: data,
                                errorMsg: "绑定失败，请刷新页面重新尝试!"
                            });
                        };
                        $.ajax({
                                url: _this.$store.state.public.api.main.yunlianhui,
                                type: 'POST',
                                dataType: 'json',
                                data: postData,
                            })
                            .done(sucessFun)
                            .fail(errFun);
                    } else {
                        this.$Message.error('请正确输入云联惠帐号和手机号!');
                    }
                })
            },
            handleUnBindYunlianhui() {
                if (!this.yunlianhui.status) return;
                let _this = this;
                let postData = {
                    id: Cookies.get('merchant_id'),
                    ssid: Cookies.get('ssid'),
                    yun_account: this.yunlianhui.account,
                    yun_mobile: this.yunlianhui.mobile,
                    yun_account_status: 0
                };
                let sucessFun = function(data) {
                    if (!!data) {
                        if (data.code == 0) {
                            _this.yunlianhui.account = "";
                            _this.yunlianhui.mobile = "";
                            _this.yunlianhui.status = 0;
                            Cookies.set('cloud_account', "");
                            Cookies.set('cloud_mobile', "");
                            Cookies.set('cloud_status', 0);
                            _this.yunlianhui.visible = false;
                            _this.$Message.success("成功解除绑定！");
                        } else {
                            Config.showError({
                                vm: _this,
                                data: data,
                                errorMsg: ""
                            });
                        }
                    }
                };
                let errFun = function(data) {
                    Config.showError({
                        vm: _this,
                        data: data,
                        errorMsg: "绑定失败，请刷新页面重新尝试!"
                    });
                };
                $.ajax({
                        url: _this.$store.state.public.api.main.yunlianhui,
                        type: 'POST',
                        dataType: 'json',
                        data: postData,
                    })
                    .done(sucessFun)
                    .fail(errFun);
            },
            handleClickUserDropdown(name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    Cookies.remove('user');
                    Cookies.remove('ssid');
                    Cookies.remove('hasGreet');
                    Cookies.remove('access');
                    Cookies.remove('user_power');
                    Cookies.remove('cloud_account');
                    Cookies.remove('cloud_status');
                    Cookies.remove('merchant_id');
                    Cookies.remove('user_id');
                    this.$Notice.close('greeting');
                    this.$store.commit('clearOpenedSubmenu');
                    // 回复默认样式
                    let themeLink = document.querySelector('link[name="theme"]');
                    themeLink.setAttribute('href', '');
                    // 清空打开的页面等数据，但是保存主题数据
                    let theme = '';
                    if (localStorage.theme) {
                        theme = localStorage.theme;
                    }
                    localStorage.clear();
                    if (theme) {
                        localStorage.theme = theme;
                    }
                    this.$router.push({
                        name: 'login'
                    });
                } else {
                    util.openNewPage(this, name);
                    this.$router.push({
                        name: name
                    });
                }
            },
            handleFullScreen() {
                this.$store.commit('handleFullScreen');
                // this.$store.commit('changeFullScreenState');
            },
            showMessage() {
                util.openNewPage(this, 'message_index');
                this.$router.push({
                    name: 'message_index'
                });
            },
            lockScreen() {
                let lockScreenBack = document.getElementById('lock_screen_back');
                lockScreenBack.style.transition = 'all 3s';
                lockScreenBack.style.zIndex = 10000;
                lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize + 'px #667aa6 inset';
                this.showUnlock = true;
                this.$store.commit('lock');
                Cookies.set('last_page_name', this.$route.name); // 本地存储锁屏之前打开的页面以便解锁后打开
                setTimeout(() => {
                    lockScreenBack.style.transition = 'all 0s';
                    this.$router.push({
                        name: 'locking'
                    });
                }, 800);
            },
            checkTag(name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            setTopBarRights() {
                if (this.$store.state.Rights && this.$store.state.Rights.other) {
                    this.$store.state.Rights.other.forEach(item => {
                        if (item.name == "bind-yunlianhui") {
                            this.topBarRights.bindYunlianhui = item.access
                        };
                        if (item.name == "unbind-yunlianhui") {
                            this.topBarRights.unbindYunlianhui = item.access
                        };
                        if (item.name == "modify-cash-password") {
                            this.topBarRights.modifyCashPassword = item.access
                        };
                        if (item.name == "modify-password") {
                            this.topBarRights.modifyPassword = item.access
                        };
                    })
                };
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                this.$Message.destroy();
                this.$Notice.destroy();
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
            },
            lang() {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted() {
            this.init();
            // 锁屏相关
            let lockScreenBack = document.getElementById('lock_screen_back');
            let x = document.body.clientWidth;
            let y = document.body.clientHeight;
            let r = Math.sqrt(x * x + y * y);
            let size = parseInt(r);
            this.lockScreenSize = size;
            window.addEventListener('resize', () => {
                let x = document.body.clientWidth;
                let y = document.body.clientHeight;
                let r = Math.sqrt(x * x + y * y);
                let size = parseInt(r);
                this.lockScreenSize = size;
                lockScreenBack.style.transition = 'all 0s';
                lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            });
            lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            // 问候信息相关
            if (!Cookies.get('hasGreet')) {
                let now = new Date();
                let hour = now.getHours();
                let greetingWord = {
                    title: '',
                    words: ''
                };
                let userName = Cookies.get('user');
                if (hour > 5 && hour < 6) {
                    greetingWord = {
                        title: '凌晨好~' + userName,
                        words: '早起的鸟儿有虫吃~'
                    };
                } else if (hour >= 6 && hour < 9) {
                    greetingWord = {
                        title: '早上好~' + userName,
                        words: '来一杯咖啡开启美好的一天~'
                    };
                } else if (hour >= 9 && hour < 12) {
                    greetingWord = {
                        title: '上午好~' + userName,
                        words: '工作要加油哦~'
                    };
                } else if (hour >= 12 && hour < 14) {
                    greetingWord = {
                        title: '中午好~' + userName,
                        words: '午饭要吃饱~'
                    };
                } else if (hour >= 14 && hour < 17) {
                    greetingWord = {
                        title: '下午好~' + userName,
                        words: '下午也要活力满满哦~'
                    };
                } else if (hour >= 17 && hour < 19) {
                    greetingWord = {
                        title: '傍晚好~' + userName,
                        words: '下班没事问候下爸妈吧~'
                    };
                } else if (hour >= 19 && hour < 21) {
                    greetingWord = {
                        title: '晚上好~' + userName,
                        words: '工作之余品一品书香吧~'
                    };
                } else {
                    greetingWord = {
                        title: '深夜好~' + userName,
                        words: '夜深了，注意休息哦~'
                    };
                }
                this.$Notice.config({
                    top: 130
                });
                this.$Notice.info({
                    title: greetingWord.title,
                    desc: greetingWord.words,
                    duration: 4,
                    name: 'greeting'
                });
                Cookies.set('hasGreet', 1);
            }
        },
        created() {
            this.getmerchant()
            // 查找当前用户之前登录时设置的主题
            let name = Cookies.get('user');
            if (localStorage.theme) {
                let hasThisUser = JSON.parse(localStorage.theme).some(item => {
                    if (item.userName === name) {
                        this.$store.commit('changeMenuTheme', item.menuTheme);
                        this.$store.commit('changeMainTheme', item.mainTheme);
                        return true;
                    } else {
                        return false;
                    }
                });
                if (!hasThisUser) {
                    this.$store.commit('changeMenuTheme', 'dark');
                    this.$store.commit('changeMainTheme', 'b');
                }
            } else {
                this.$store.commit('changeMenuTheme', 'dark');
                this.$store.commit('changeMainTheme', 'b');
            }
            // 根据用户设置主题
            if (this.$store.state.theme !== 'b') {
                let stylesheetPath = './dist/' + this.$store.state.theme + '.css';
                let themeLink = document.querySelector('link[name="theme"]');
                themeLink.setAttribute('href', stylesheetPath);
            }
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
            this.$store.commit('setPower');
            this.setTopBarRights();
        }
    };
</script>
