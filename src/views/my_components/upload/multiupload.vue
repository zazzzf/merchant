<template>
    <div class="multiupload">
        <div class="uploads-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="uploads-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="imagesList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :data="otherFormData"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="uploadAPI"
            :name="uploadName"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;padding-top:10px;line-height:18px; color:#999">
                <Icon type="ios-cloud-upload-outline" size="20"></Icon><br />上传图片
            </div>
        </Upload>
        <Modal title="图片预览" v-model="visible">
            <img :src="ViewImgUrl" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    import Config from '../../../config/config';

    export default {
        name: 'multiupload',
        data () {
            return {
                ViewImgUrl: '',
                visible: false,
                uploadList: [],
                defaultList:[],
                newFile:"",
                uploadName:"image",
                otherFormData: {
                    "ssid":Cookies.get('ssid')
                }
            }
        },
        props: ['imagesList',"uploadAPI","removeAPI"],
        methods: {
            handleView (file) {
                this.ViewImgUrl = file.url;
                this.visible = true;
            },
            handleRemove (file) {
                var _this=this;
                $.ajax({
                    url: _this.removeAPI,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        "ssid": Cookies.get('ssid'),
                        "imageId": file.id
                    }   
                })
                .done((data)=>{
                    if(!!data){
                        if(data.code==0){
                            const fileList = this.uploadList;
                            this.uploadList.splice(fileList.indexOf(file), 1);
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
            handleSuccess (res, file, fileList) { 
                file.name ="images-"+res.data;
                this.uploadList = this.$refs.upload.fileList;
                this.uploadList[this.uploadList.length-1].url=this.newFile;
                this.uploadList[this.uploadList.length-1].id=res.data;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确,请选择图片文件。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件过大',
                    desc: '上传文件：' + file.name + ' 过大，请不要超过'+
                    this.bytesToSize(this.file_infro.maxSize*1024)
                });
            },
            handleBeforeUpload (file) {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传5张图片'
                    });
                    return false;
                };
                if(window.FileReader&&file) {
                    var fr = new FileReader();  
                    fr.onloadend = (e) => {  
                        this.newFile = e.target.result;  
                    };
                    fr.readAsDataURL(file); 
                }
                return check;
            },
            bytesToSize (bytes) {
                if (bytes === 0) return '0 B';
                var k = 1024, // or 1024
                  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                  i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            } 
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>
<style>
    .uploads-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .uploads-upload-list img{
        width: 100%;
        height: 100%;
    }
    .uploads-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .uploads-upload-list:hover .uploads-upload-list-cover{
        display: block;
    }
    .uploads-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>