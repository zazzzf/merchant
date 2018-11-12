import Env from './env';
// const server_route = 'http://tapi.yugoubao.net/index.php?s=';
//生产环境
const server_route = 'https://wktapi.yugoubao.net/index.php?s=';
let config = {
    env: Env,
    apiPath: server_route,
    api: {
    	'login': {
    		'request': server_route + 'wkmerchant/Logon/merchantLogin',
    		'CodeImage': server_route + 'wkmerchant/Logon/loginCode'
    	},
    	'public': {
    		'merchantType': server_route + 'wkmerchant/basic/types',
    		'bankList': server_route + 'wkmerchant/bank/bankLists',
            'ewm': server_route + 'wkclient/merchant/createQRCode', 
            'Expressage': server_route + 'wkmerchant/online_order/getExpressageNos'
    	},
        'member':{
                'list':server_route + 'wkmerchant/member/lists',
                'addmemberwhitescore':server_route + 'wkmerchant/member/addmemberwhitescore',
        },
    	'main': {
    		'yunlianhui': server_route + 'wkmerchant/merchant_basics/bindingPhone',
    		'modifyPassword': server_route + 'wkmerchant/merchant_basics/updateMerchantUserPassword',
            'addmember':server_route +'wkmerchant/member/addmember',
    		'modifyCashPassword': server_route + 'wkmerchant/merchant_basics/updateMerchantPassword'
    	},
    	'home': {
    		'count': server_route + 'wkmerchant/statistic/bases',
    		'weekCount': server_route + 'wkmerchant/statistic/orders',
            'list1': server_route +'wkmerchant/merchant_integral/merchant_transfer_member_shopping',
            'list2': server_route +'wkmerchant/merchant_integral/merchant_transfer_shopping',
            'list3': server_route +'wkmerchant/merchant_integral/shopping_transfer_member_shopping',
    	},
    	'setting': {
    		'Userinfro': {
    			'getInfro': server_route + 'wkmerchant/basic/basicInfo',
    			'update': server_route + 'wkmerchant/basic/basicInfoEdit'
    		},
    		'shopInfro': {
    			'getInfro': server_route + 'wkmerchant/basic/basicInfo',
    			'update': server_route + 'wkmerchant/basic/otherInfoEdit',
                'removeImage': server_route + 'wkmerchant/basic/removeImage',
                'multiUpload': server_route + 'wkmerchant/basic/uploadImage'
    		},
    		'UserBankCard': {
    			'getBankCardList': server_route + 'wkmerchant/bank/merchantBankList',
    			'getBankCardInfro': server_route + 'wkmerchant/bank/view',
    			'addBankCard': server_route + 'wkmerchant/bank/add',
    			'modifyBankCard': server_route + 'wkmerchant/bank/edit',
    			'deleteBankCard': server_route + 'wkmerchant/bank/delete'
    		}
    	},
        'shop': {
            'order': {
                'getList': server_route + 'wkmerchant/order/lists',
                'fahuo': server_route + 'wkmerchant/order/updateordershipstatus'
            }
        },
        'mall': {
            'goods': {
                'list': server_route + 'wkmerchant/product/lists',
                'add': server_route + 'wkmerchant/product/add',
                'edit': server_route + 'wkmerchant/product/edit',
                "getClass":server_route+"wkmerchant/Product/LevelCategory",
                "getSpecs":server_route+"wkmerchant/option/getoptionlist",
                "getSpecsChilds":server_route+"wkmerchant/option/getattribute",
                'offline': server_route + 'wkmerchant/product/updateStatus',
                'uploadImage': server_route + 'wkmerchant/product/uploadImage',
                'edituploadImage': server_route + 'wkmerchant/product/editProductAddImage',
                'deleteImage': server_route + 'wkmerchant/product/deleteImage',
                'view': server_route + 'wkmerchant/product/view',
                'delete':server_route +'wkmerchant/option/delAttribute',
            },
            'reviews': {
                'list': server_route + 'wkmerchant/review/getreviewlist',
                'reply': server_route + 'wkmerchant/review/reply'
            },
            'order': {
                'getList': server_route + 'wkmerchant/order/lists',
                'getOnlineList': server_route + 'wkmerchant/online_order/lists',
                'orderDetail': server_route + 'wkmerchant/online_order/view',
                'fahuo': server_route + 'wkmerchant/online_order/ship'
            },
            'return': {
                'list': server_route + 'wkmerchant/online_return/lists',
                'review': server_route + 'wkmerchant/online_return/review'
            },
            'specs': {
                'list': server_route + 'wkmerchant/option/getoptionlist',
                'add': server_route + 'wkmerchant/option/addoption',
                'edit': server_route + 'wkmerchant/option/editoption',
                'delete': server_route + 'wkmerchant/option/deloption',
                //
                 // 'delete': server_route + 'wkmerchant/option/delAttribute',

                'addchild': server_route + 'wkmerchant/option/addattribute',
                'childList': server_route + 'wkmerchant/option/getattribute',
                'editchild': server_route + 'wkmerchant/option/editattribute',
                'deletechild': server_route + 'wkmerchant/option/delAttribute'
            }
        },
    	'account': {
            'cash': {
                'getList': server_route + 'wkmerchant/withdraw_cash/lists',
                'recordLists':server_route +'wkmerchant/withdraw_cash/recordLists',
                'getCashInfro': server_route + 'wkmerchant/statistic/bases',
                'request': server_route + 'wkmerchant/withdraw_cash/withdraw'
    		},
            "red":server_route +"wkmerchant/Statistic/merchant_red_detail",
            "white":server_route +"wkmerchant/Statistic/merchant_white_detail",
            "shop":server_route +"wkmerchant/Statistic/merchant_shopping_detail",
    		'score': {
    			'getList': server_route + 'wkmerchant/score/lists',
    			'getScoreInfro': server_route + 'wkmerchant/statistic/bases',
    			'request': server_route + 'wkmerchant/score/withdraw'
    		}
    	}

    },
    errorCode: {
    	'runOut': { num: 1111, text: '登录超时，请重新登录！' }
    },
    showError (errorObj) {
        if (!!errorObj.data && errorObj.data.code == this.errorCode.runOut.num) {
            errorObj.vm.$store.commit('logout', errorObj.vm);
        } else {
            if (!!errorObj.data && errorObj.data.code != 0) {
                errorObj.vm.$Message.error(errorObj.errorMsg + ' ' + errorObj.data.message);
            } else {
                errorObj.vm.$Message.error(errorObj.errorMsg);
            };
        }
    }
};
export default config;
