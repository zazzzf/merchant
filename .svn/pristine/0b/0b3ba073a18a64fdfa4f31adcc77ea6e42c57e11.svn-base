<template>
    <div class="noUpFileInput">
        <div class="noUpFileInput-filebox" v-if="!!FilePath&&fileInfro.type=='image'">
            <img class="re-noUpFileInput-images" @click="handleView()" :src="FilePath" width="auto" height="58" />
        </div>
        <input ref="fileObj" @change="handleGetFile()" type="file" class="noup-file-Input" />
        <span v-if="imgName" class="noUpFileInput-newfile-name">{{imgName}}</span>
        <Button type="ghost" @click="selectFile" icon="ios-cloud-upload-outline">{{file_infro.uploadMenu}}</Button>
        <Modal title="图片预览" v-model="visible" cancel-text="关闭">
            <img :src="FilePath" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'noUpFileInput',
        data () {
            return {
                uploadApi:"",
                imgName: '',
                newFilePath:"",
                fileData:"",
                visible: false,
                upLoading:false,
                fileType:{
                    "image":/\.(gif|jpg|jpeg|png)$/,
                    "rar":/\.(rar|zip|7z)$/,
                    "txt":/\.(doc|docx|pdf|xsl|xslx|ppt|pptx|txt)$/,
                    "music":/\.(mp3|mp4|wma)$/
                }
            }
        },
        props: ['fileInfro',"uploadModel","giveMeFile"],
        computed: {
            FilePath: function (){
                if(this.newFilePath){
                    return this.newFilePath;
                }else{
                    return this.fileInfro.url;
                }
            },
            file_infro: function () {
                if(typeof this.fileInfro == "Object"){
                    return {
                        uploadApi:this.fileInfro.uploadApi||this.uploadApi,
                        url:this.fileInfro.url||"",
                        fileObj:this.fileInfro.fileObj||"uploadFile",
                        fileObjName:this.fileInfro.fileObjName||"图片",
                        uploadMenu:this.fileInfro.uploadMenu||"选择图片",
                        uploadType:this.fileInfro.uploadType||"sync",//sync or async
                        type:this.fileInfro.type||"image",
                        maxSize:this.fileInfro.maxSize?this.fileInfro.maxSize:2048
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
                        maxSize:2048
                    }
                }
          }
        },
        methods: {
            handleView () {
                this.imgName = this.file_infro.fileObjName;
                this.visible = true;
            },
            selectFile (){
                this.$refs.fileObj.click()
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
                    desc: '上传文件：' + file.name + ' 过大，请不要超过'+
                    this.bytesToSize(this.file_infro.maxSize*1024)
                });
            },
            handleGetFile () {
                let file=this.$refs.fileObj.files[0];
                if(!file){return;};
                //验证文件格式
                let fileExt=file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
                if(!this.fileType[this.file_infro.type].test(fileExt)){  
                    this.handleFormatError(file);  
                    return false;  
                };
                //验证文件大小
                if(Math.round(file.size/1024*100)/100>this.file_infro.maxSize){
                    this.handleMaxSize(file);  
                    return false;
                };
                this.imgName=file.name;
                this.showPreview(file);
                this.file_infro.file=file;
                this.$emit("updateData",file)
            },
            showPreview (file) {
                if(window.FileReader&&file) {  
                    var fr = new FileReader();  
                    fr.onloadend = (e) => {  
                        this.newFilePath = e.target.result; 
                        this.file_infro.url =  e.target.result; 
                    };  
                    fr.readAsDataURL(file); 
                }  
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
            console.log(this.fileInfro)
        },
        activated () {
            console.log(this.fileInfro)
        }
    }
</script>
<style>
    .noimg{ font-size: 60px }
    .noup-file-Input{ display: none; }
    .re-noUpFileInput-images{ max-width:100%; max-height: 100% }
    .noUpFileInput-newfile-name{ color: #aaf; font-style: oblique; display: block; line-height: 28px;height:28px; }
    .spin-uploading.ivu-spin-fix{background-color:hsla(0,0%,100%,0.6)}
    .spin-uploading .ivu-spin-main{width: 100%; height: 100%; text-align: center}
    .spin-uploading .spin-icon-load{display: block; margin-left: 20px; margin-top: 15px}
    .spin-uploading span{display: block; width:100%; clear: both; line-height: 18px;}
    .noUpFileInput-filebox{
        display:block;
        max-width: 120px;
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
    .uploads-noUpFileInput-list img{
        width: auto;
        height: 100%;
    }
    .uploads-noUpFileInput-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .uploads-noUpFileInput-list:hover .uploads-noUpFileInput-list-cover{
        display: block;
    }
    .uploads-noUpFileInput-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>