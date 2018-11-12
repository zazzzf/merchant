import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录-预购宝管理平台商户版'
    },
    component: resolve => {
        require(['./views/login.vue'], resolve);
    }
};

export const register = {
    path: '/register',
    name: 'register',
    meta: {
        title: '商户注册-预购宝管理平台商户版'
    },
    component: resolve => {
        require(['./views/register/register.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['./views/error_page/404.vue'], resolve);
    }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => {
        require(['./views/error_page/401.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => {
        require(['./views/error_page/500.vue'], resolve);
    }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => {
        require(['./views/form/article-publish/preview.vue'], resolve);
    }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => {
        require(['./views/main_components/locking-page.vue'], resolve);
    }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [{
        path: 'home',
        title: {
            i18n: 'home'
        },
        name: 'home_index',
        component: resolve => {
            require(['./views/home/home.vue'], resolve);
        }
    }, {
        path: 'ownspace',
        title: '个人中心',
        name: 'ownspace_index',
        component: resolve => {
            require(['./views/own-space/own-space.vue'], resolve);
        }
    },
    {
        path: 'shopping',
        title: '购物详情',
        name: 'shopping',
        component: resolve => {
            require(['./views/advanced-router/component/shopping-info.vue'], resolve);
        }
    }, // 用于展示带参路由
    {
        path: 'modify-cash-password',
        title: '修改提现密码',
        access: 1,
        name: 'modify-cash-password',
        component: resolve => {
            require(['./views/password/cash-password.vue'], resolve);
        }
    }, // 用于展示带参路由
    {
        path: 'modify-password',
        title: '修改登录密码',
        access: 1,
        name: 'modify-password',
        component: resolve => {
            require(['./views/password/login-password.vue'], resolve);
        }
    }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
    path: '/settings',
    icon: 'android-settings',
    name: 'settings',
    title: '商户基本信息',
    access: 1,
    component: Main,
    children: [{
        path: 'userinfro',
        icon: 'aperture',
        access: 1,
        name: 'settings-userinfro',
        title: '基本信息',
        component: resolve => {
            require(['./views/settings/userinfro.vue'], resolve);
        }
    },{
        path: 'shopinfro',
        icon: 'social-skype',
        name: 'settings-shopinfro',
        access: 1,
        title: '商户店铺资料',
        component: resolve => {
            require(['./views/settings/shopinfro.vue'], resolve);
        }
    }, {
        path: 'bank-card',
        icon: 'card',
        name: 'settings-bank-card',
        title: '绑定银行卡',
        access: 1,
        component: resolve => {
            require(['./views/settings/bank-card.vue'], resolve);
        }
    }]
}, {
    path: '/order',
    icon: 'android-cloud-circle',
    name: 'offline',
    title: '商圈',
    access: 1,
    component: Main,
    children: [{
        path: 'order-list',
        icon: 'android-clipboard',
        name: 'order-list',
        title: '订单查询',
        access: 1,
        component: resolve => {
            require(['./views/order/order-list.vue'], resolve);
        }
    },{
        path: 'review',
        icon: 'android-clipboard',
        name: 'review',
        title: '评论管理',
        access: 1,
        component: resolve => {
            require(['./views/order/review.vue'], resolve);
        }
    }]
}, {
    path: '/mall',
    icon: 'ios-cart',
    name: 'inline',
    title: '商城',
    access: 1,
    component: Main,
    children: [{
        path: 'goods',
        icon: 'android-apps',
        name: 'goods',
        title: '商品管理',
        access: 1,
        component: resolve => {
            require(['./views/mall/goods.vue'], resolve);
        }
    }, {
        path: 'goods-reviews',
        icon: 'android-list',
        name: 'review-list',
        title: '商品评论管理',
        access: 1,
        component: resolve => {
            require(['./views/mall/review.vue'], resolve);
        }
    }, {
        path: 'goods-orders',
        icon: 'android-clipboard',
        name: 'goods-orders',
        title: '商品订单管理',
        access: 1,
        component: resolve => {
            require(['./views/mall/order-list.vue'], resolve);
        }
    }, {
        path: 'return-orders',
        icon: 'android-clipboard',
        name: 'return-orders',
        title: '退款申请管理',
        access: 1,
        component: resolve => {
            require(['./views/mall/return-order.vue'], resolve);
        }
    }, {
        path: 'specs-list',
        icon: 'ios-pricetags-outline',
        name: 'specs-list',
        title: '商品规格管理',
        access: 1,
        component: resolve => {
            require(['./views/mall/specs.vue'], resolve);
        }
    }]
}, {
    path: '/settlement',
    icon: 'clipboard',
    name: 'settlement',
    title: '结算中心',
    component: Main,
    access: 1,
    children: [
       {
            path: 'cash',
           
            name: 'cash',
            title: '预付款账户',
            access: 1,
            component: resolve => {
                require(['./views/settlement/cash.vue'], resolve);
            },

        },
        {
            path: 'shop',
           
            name: 'shop',
            title: '购物积分',
            access: 1,
            component: resolve => {
                require(['./views/settlement/shop.vue'], resolve);
            },
        },
        {
            path: 'red',
           
            name: 'red',
            title: '共享消费红积分',
            access: 1,
            component: resolve => {
                require(['./views/settlement/red.vue'], resolve);
            },
        },
         {
            path: 'white',
           
            name: 'white',
            title: '共享消费白积分',
            access: 1,
            component: resolve => {
                require(['./views/settlement/white.vue'], resolve);
            },
        }
    ]
},
 {
    path: '/menber',
    icon: 'clipboard',
    name: 'menber',
    title: '会员管理',
    component: Main,
    access: 1,
    children: [
       {
            path: 'list',
           
            name: 'list',
            title: '会员管理',
            access: 1,
            component: resolve => {
                require(['./views/menber/list.vue'], resolve);
            },

        },
   
    ]
}
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    register,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
