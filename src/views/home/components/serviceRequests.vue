<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util.js';
import Config from '../../../config/config';

const echarts = require('echarts');
export default {
    name: 'serviceRequests',
    mounted () {
        let _this=this;
        let postData={
                    ssid:Cookies.get('ssid')
                };
        $.ajax({
            url: Config.api.home.weekCount,
            type: 'POST',
            dataType: 'json',
            data: postData,
            success:function(data){
                if(!!data){
                    if(data.code==0){
                    let order_num=[];
                    let totals=[];
                    let Today = new Date(); 
                    let dateArray=[]; 
                    for(let item in data.data.order_num) {
                        dateArray.push(util.FormatDate(new Date(item),"MM/dd"));
                        order_num.push(data.data.order_num[item]);
                    };
                    for(let item in data.data.totals) {
                        dateArray.push(util.FormatDate(new Date(item),"MM/dd"));
                        totals.push(data.data.totals[item]);
                    };
                    $.unique(dateArray);
                    order_num.reverse();
                    totals.reverse();
                    dateArray.reverse();
                    //----------------------------------------
                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        grid: {
                            top: '3%',
                            left: '1.2%',
                            right: '1.6%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: dateArray
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                minInterval:1
                            }
                        ],
                        series: [
                            {
                                name: '订单数',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#2d8cf0'
                                }},
                                data: order_num
                            },
                            {
                                name: '购物指数',
                                type: 'line',
                                stack: '总量',
                                areaStyle: {normal: {
                                    color: '#10A6FF'
                                }},
                                data: totals
                            }
                        ]
                    };

                    const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
                    serviceRequestCharts.setOption(option);

                    window.addEventListener('resize', function () {
                        serviceRequestCharts.resize();
                    });
                    //--------------------------------------------         
                    }else{
                        Config.showError({vm:_this,data:data,
                            errorMsg:"请求失败"
                        });
                    }
                }else{
                    Config.showError({vm:_this,data:data,
                        errorMsg:"请求失败"
                    });
                }  
            }
        })
    }
};
</script>