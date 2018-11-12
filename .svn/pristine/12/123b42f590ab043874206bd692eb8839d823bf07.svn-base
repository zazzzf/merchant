<template>
    <div class="singleUpload">
        <div class="upload-filebox" v-if="!!FilePath">
            <img class="re-upload-images" @click="handleView()" :src="FilePath" width="auto" height="58" />
            <Spin size="large" class="spin-uploading" fix v-if="upLoading">
                <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                <span>上传中...</span>
            </Spin>
        </div>
        <Upload 
        class="upload-singleUpload" 
        :before-upload="handleBeforeUpload" 
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-success="handleSuccess" 
        :on-error="handleError" 
        :action="uploadApi" 
        :show-upload-list="false" 
        :format="['jpg','jpeg','png']" 
        :max-size="file_infro.maxSize" 
        >
           <Button type="ghost" icon="ios-cloud-upload-outline">{{file_infro.uploadMenu}}</Button>
        </Upload>
        <span class="upload-newfile-name">{{imgName}}</span>
        <Modal title="图片预览" v-model="visible" cancel-text="关闭">
            <img :src="FilePath" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'upload',
        data () {
            return {
                uploadApi:"",
                imgName: '',
                newFilePath:"",
                fileData:"",
                visible: false,
                upLoading:false
            }
        },
        props: ['fileInfro'],
        computed: {
            FilePath: function (){
                if(this.newFilePath){
                    return this.newFilePath;
                }else{
                    return this.fileInfro.url;
                }
            },
            file_infro: function () {
                if(this.fileInfro){
                    return {
                        uploadApi:this.fileInfro.uploadApi||this.uploadApi,
                        url:this.fileInfro.url||"",
                        fileObj:this.fileInfro.fileObj||"uploadFile",
                        fileObjName:this.fileInfro.fileObjName||"图片",
                        uploadMenu:this.fileInfro.uploadMenu||"选择图片",
                        uploadType:this.fileInfro.uploadType||"sync",//sync or async
                        type:this.fileInfro.type||"image",
                        maxSize:this.fileInfro.maxSize||0   
                    }
                    return this.fileInfro;
                }else{
                    return {
                        url:"",
                        fileObj:"uploadFile",
                        fileObjName:"图片",
                        uploadMenu:"选择图片",
                        uploadType:"sync",//sync or async
                        type:"image",
                        maxSize:0
                    }
                }
          }
        },
        methods: {
            handleView () {
                this.imgName = this.file_infro.fileObjName;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                this.upLoading=false;
                // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleError (error, file, fileList) {
                this.upLoading=false;
                this.$Notice.warning({
                    title: '上传失败',
                    desc: '上传文件：' + file.name + ' 失败！请重试。'
                });
            },
            handleFormatError (file) {
                this.upLoading=false;
                this.$Notice.warning({
                    title: '文件类型错误',
                    desc: '上传文件：' + file.name + ' 文件类型不正确'
                });
            },
            handleMaxSize (file) {
                this.upLoading=false;
                this.$Notice.warning({
                    title: '文件过大',
                    desc: '上传文件：' + file.name + ' 过大，请不要超过'+parseInt(this.file_infro.maxSize/(1024))+'MB'
                });
            },
            handleBeforeUpload (file) {
                this.imgName=file.name;
                this.showPreview(file);
                
                if(this.file_infro.uploadType=="sync"){
                    this.fileInfro.file=file;
                    return false;
                }else{
                    this.upLoading=true;
                    return true;
                }  
            },
            showPreview (file) {
                if(window.FileReader&&file) {  
                    var fr = new FileReader();  
                    fr.onloadend = (e) => {  
                        this.newFilePath = e.target.result;  
                    };  
                    fr.readAsDataURL(file); 
                }  
            }  
        }
    }
</script>
<style>
    .noimg{ font-size: 60px }
    .re-upload-images{ width:auto; height: 100% }
    .upload-newfile-name{ color: #faa; font-style: oblique; }
    .spin-uploading.ivu-spin-fix{background-color:hsla(0,0%,100%,0.6)}
    .spin-uploading .ivu-spin-main{width: 100%; height: 100%; text-align: center}
    .spin-uploading .spin-icon-load{display: block; margin-left: 20px; margin-top: 15px}
    .spin-uploading span{display: block; width:100%; clear: both; line-height: 18px;}
    .upload-filebox{
        display:block;
        
        height: 60px;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
        position: relative;
        float: left
    }
    .uploads-upload-list img{
        width: auto;
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