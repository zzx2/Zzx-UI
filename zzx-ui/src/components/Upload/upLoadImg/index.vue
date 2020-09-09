<template>
  <div class="previews">
    <div class="preview">
      <div v-for="(file,index) in fileList" :key="index" class="imgView">
        <label v-if="file.status=='success'" class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check" /></label>
        <img :src="file.url" alt="">
        <div v-if="file.status=='uploading'" class="progress">
          <el-progress type="circle" :percentage="parseInt(file.percentage,0)" />
        </div>
        <span class="list_item_action">
          <i v-if="isSetMain" class="set">
            <span style="margin:0 10px 0 0 " @click="setMain(index)"><i v-if="index==0" style="color:rgba(102,102,102,1);">课程主图</i><i v-else>设为主图</i></span>
          </i>
          <i @click="handleDelete(index)">删除{{ type |typeFilter }}</i>
        </span>
      </div>
      <el-upload
        ref="uploadImg"
        class="upload"
        name="files"
        :data="{'userId': userId}"
        :action="action"
        :show-file-list="false"
        list-type="picture"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-remove="beforeRemove"
        :on-progress="uploadProgress"
        :on-change="handleChange"
        :accept="TypeFilter[type]"
        multiple
        :limit="limit"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :disabled="limit==fileList.length"
      >
        <btn :disable="limit==fileList.length" label="上传图片" type="primary" />
      </el-upload>
      <span v-if="hasTip" class="tip">按住ctrl可同时批量选择多{{ type |typeFilter }}上传，最多可以上传{{ limit }}张图片，建议尺寸600*350px</span>
    </div>

  </div>
</template>
<script>
import { getUploadURL } from '@/api/Common/file'
import store from '@/store'

export default {
  filters: {
    typeFilter(val) {
      const typeMap = {
        img: '图片',
        video: '视频'
      }
      return typeMap[val]
    }
  },
  model: {
    prop: 'imgsrc',
    event: 'change'
  },
  props: {
    imgsrc: {
      type: Array,
      default: () => {
        return []
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'img'
    },
    isSetMain: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: getUploadURL()
    },
    isEdit: Boolean,
    hasTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileList: [],
      // ImgUrl: '',
      userId: store.getters.userId,
      Authorization: 'Bearer ' + store.getters.token,
      percentage: 0,
      TypeFilter: {
        video: 'video/wmv,video/asf,video/rm,video/rmvb,video/mov,video/avi,video/dat,video/mpg,video/mpeg,video/mp4',
        img: '.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp',
        doc: '',
        audio: '.wav,.mp3,.aac,.flac,.Ogg'
      }
    }
  },
  computed: {
    imgsrcArr: {
      get() {
        return this.imgsrc
      },
      set(val) {
        this.$emit('update:imgsrc', val)
      }
    }
  },
  watch: {
    imgsrcArr(val) {
      if (val) {
        const list = val.map(url => {
          return {
            url: url,
            status: 'success'
          }
        })
        this.fileList = [...list]
      }
    }
  },
  // watch: {
  //   isEdit(val) {
  //     if (val) {
  //       this.imgsrc.forEach(url => {
  //         this.fileList.push({
  //           url: url,
  //           status: 'success'
  //         })
  //       })
  //     } else {
  //       this.fileList = []
  //     }
  //   }
  // },
  methods: {

    handlePreview() {

    },
    handleRemove() {

    },
    //  删除文件调用的函数
    beforeRemove() {

    },
    //  文件超出个数限制时的函数
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    //  上传成功时调用的函数
    handleSuccess(response, file, fileList) {
      console.log(file)
      console.log(response)
      if (response.code === 0) {
        this.imgsrcArr.push(response.data[0])
        this.percentage = 0
      }
    },
    // 上传进度调用的函数
    uploadProgress(event, file, fileList) {
    //  this.percentage=0
      console.log(file.percentage)
      this.percentage = parseInt(event.percent, 10)
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
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    //  删除文件列表中的元素
    handleDelete(index) {
      this.imgsrcArr.splice(index, 1)
      this.fileList.splice(index, 1)
    },
    // 设为主图
    setMain(index) {
      this.imgsrcArr.unshift(this.imgsrcArr[index])
      this.imgsrcArr.splice(index + 1, 1)
      this.fileList.unshift(this.fileList[index])
      this.fileList.splice(index + 1, 1)
    }
  }

}
</script>
<style lang="scss" scoped>
  .previews{
    .preview{
       position: relative;
      // margin:  15vh auto 50px;
      // background: #fff;
      // border-radius: 2px;
      // box-shadow: 0 1px 3px $boxshadow_color;
      // box-sizing: border-box;
      // min-width: 400px;
      // text-align: center;
      .tip{
        position: absolute;
        left: 117px;
        bottom:30px;
        color: #666666;
        font-size: 12px;
      }
    }
    .imgView{
      position: relative;
      display: inline-block;
      width: 196px;
      border: 1px solid $border_color;
      border-radius: 2px;
      box-shadow: 0 1px 3px $boxshadow_color;
      box-sizing: border-box;
      text-align: center;
      margin: 10px;
      overflow: hidden;
      .list_item_action{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 57px;
        text-align: center;
        color: $theme_color;
        font-size: 14px;
        background-color: #F9FAFC;
        border-radius:0px 0px 2px 2px;
        padding: 20px;
        // transition: opacity .3s;
        &:hover{
            opacity: 1
        }
        .set{
           &:hover{
            color: $theme_color;
          }
        }
        .el-icon-delete{
          cursor: pointer;
          &:hover{
            color: $theme_color;
          }
        }
        i{
          //  padding:0 5px;
           font-style:normal;
           cursor: pointer;
        }
      }
      img{
        position: relative;
        width: 100%;
        height: 196px;
        vertical-align: middle;
        z-index: 1;
      }
    }
    .el-button{
      margin: 20px 10px
    }
    .progress{
       position:absolute;
       width:100%;
       height:196px;
       background:rgba(249,250,252,0.7);
       top:0;
       z-index:3;
       .el-progress{
          margin-top:40px;
       }
    }
     .el-icon-check:before {
          content: "\E6DA";
    }
    .el-upload-list__item-status-label {
        display:block;
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-box-shadow: 0 0 1pc 1px $boxshadow_color;
        box-shadow: 0 0 1pc 1px $boxshadow_color;
        z-index:3;
        i{
          color: #fff;
          font-size:12px;
          margin-top:11px;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
    }
  }

</style>

