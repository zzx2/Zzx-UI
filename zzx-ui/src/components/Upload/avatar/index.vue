<template>
  <div style="position:relative">
    <el-upload
      ref="upload"
      class="upload"
      name="files"
      :data="{'userId': userId}"
      :action="action"
      :show-file-list="false"
      :headers="{Authorization:Authorization}"
      list-type="picture"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-remove="beforeRemove"
      :on-progress="uploadProgress"
      :on-error="handleError"
      multiple
      :limit="limit"
      :accept="TypeFilter[type]"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <div class="avatar">
        <img v-if="type!=='docx'" :src="imgSrc+(type=='video'?'?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast':'')" alt="">
        <div v-if="type=='docx'&&imgSrc" class="docxImg">
          <img src="@/assets/ic_file@2x.png" alt="">
          <p class="filename">{{ fileName }}</p>
        </div>

        <div v-if="!imgSrc" class="upLoadtext">
          <i class="el-icon-plus" />
          <span>上传{{ type|typeFilter }}</span>
        </div>
      </div>
    </el-upload>
    <template v-for="(file,index) in fileList">
      <div v-if="file.status=='uploading'" :key="index+1" class="progress">
        <el-progress type="circle" :percentage="parseInt(file.percentage, 10)" />
      </div>
    </template>
    <span v-if="imgSrc" class="list_item_action">
      <i class="el-icon-delete" @click="handleDelete()" />
    </span>
  </div>

</template>
<script>
// import imgDialog from './ImgDialog'
import { getUploadURL } from '@/api/Common/file'
import store from '@/store'

export default {
  name: 'UpLoadImg',
  components: {
    // imgDialog
  },
  filters: {
    typeFilter(val) {
      const TypeMap = {
        'img': '图片',
        'video': '视频',
        'docx': '课件'
      }
      return TypeMap[val]
    }
  },
  // model:{
  //   prop:'imgurl',
  //   event: 'change'
  // },
  props: {
    imgurl: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '30%'
    },
    type: {
      type: String,
      default: 'img'
    },
    action: {
      type: String,
      default: getUploadURL()
    },
    resourceId: {
      type: [Number, String],
      default: 0
    }

  },
  data() {
    return {
      DiaVisible: false,
      fileName: '',
      fileList: [],
      ImgUrl: '',
      userId: store.getters.userId,
      percentage: 0,
      Authorization: 'Bearer ' + store.getters.token,
      TypeFilter: {
        video: 'video/wmv,video/asf,video/rm,video/rmvb,video/mov,video/avi,video/dat,video/mpg,video/mpeg,video/mp4',
        img: '.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp,.jpeg',
        docx: '.rar,.zip,.doc,.docx,.pdf'
      }
    }
  },
  computed: {
    limitSize() {
      return this.limit
    },
    Width() {
      return this.width
    },
    imgSrc: {
      get() {
        return this.imgurl
      },
      set(val) {
        console.log(val)
        this.$emit('update:imgurl', val)
      }
    },
    Type() {
      return this.type
    },
    uploadurl() {
      return this.action
    },
    resourceid: {
      get() {
        return this.resourceId
      },
      set(val) {
        console.log(val)
        this.$emit('update:resourceId', val)
      }
    }

  },
  methods: {
    handleDelete() {
      this.imgSrc = ''
      // this.fileList.splice(0, 1)
      this.fileList = []
    },
    handlePreview() {

    },
    handleRemove() {

    },
    //  删除文件调用的函数
    beforeRemove() {

    },
    //  文件超出个数限制时的函数
    handleExceed() {

    },
    //  上传成功时调用的函数
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        const res = response.data[0]
        if (this.uploadurl.indexOf('document') !== -1) {
          this.imgSrc = res.resourceUrl
          this.fileName = res.name
          this.resourceid = res.id
          console.log(this.fileName)
        } else {
          this.imgSrc = res
        }
        this.percentage = 0
        this.$message.success('上传成功')
      } else {
        this.percentage = 0
      }
    },

    // 上传进度调用的函数
    uploadProgress(event, file, fileList) {
    //  this.percentage=0
      // console.log(file.percentage)
      this.fileList.push(file)
      // this.percentage = parseInt(event.percent, 10)
    },

    // 添加文件，上传文件都会触发的函数
    // ImgForPreview(file, fileList) {
    //   console.log(file)
    //   const reader = new FileReader()
    //   reader.readAsDataURL(file.raw)
    //   reader.onload = (e) => {
    //     this.ImgUrl = e.target.result// 将图片转成base64的格式并显示出来
    //   }
    //   this.fileList = fileList
    //   // console.log(fileList)
    // },
    // 上传失败
    handleError(err) {
      this.$message.error(err)
    }
  }

}
</script>
<style lang="scss" scoped>
.avatar{
   position: relative;
   width: 129px;
   height: 129px;
   border: 1px dashed $border_color;
   cursor: pointer;
   line-height: 129px;
   .filename{
     line-height: 1;
     margin-top: -20px;
     color: $theme_color;
     overflow:hidden;
     text-overflow:ellipsis;
     white-space:nowrap;
   }
   img{
        position: relative;
        width: 100%;
        height: 90%;
        vertical-align: middle;
        z-index: 1;
      }
    .docxImg{
       position: relative;
       background:#EFEFEF;
       text-align: center;
       width: 100%;
       height: 100%;
       z-index: 1;
       img{
          width: 50%;
          height: auto;
       }
    }
   .upLoadtext{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      color: #d9d9d9;
      font-size:14px;
      line-height: 1;
     .el-icon-plus{
        font-size:20px
      }
      span{
        display: block;
        margin: 10px 0 0 0;
        line-height: 1.5;
      }
   }
   &:hover{
     border: 1px dashed $border_color;
     .upLoadtext{
        color:$theme_color;
     }

   }
}
 .list_item_action{
    position: absolute;
    width: 129px;
    height: 129px;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
    z-index: 6;
    &:hover{
        opacity: 1
    }
    .el-icon-delete{
      margin-top:50px;
      cursor: pointer;
      &:hover{
        color:$theme_color
      }
    }
  }
   .progress{
       position:absolute;
       width:129px;
       height:129px;
       background:rgba(249,250,252,0.7);
       top:0;
       z-index:3;
       .el-progress{
        // transform:
        transform: scale(0.8);
       }
    }

</style>
