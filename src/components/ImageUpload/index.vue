<template>
  <div>
    <!-- filelist是上传的文件列表，可以绑定到上传组件上，让上传组件显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-change="changeFile"
      :on-preview="preview"
      :on-remove="remove"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{ disabled : fileComputed }"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云COS包
const cos = new COS({
  SecretId: 'AKID9A2jEXihRywz4ziFYcTHuLZbPceWEhxB', // 身份识别ID
  SecretKey: '96tSp280f7PTbbT8ex3wb5QdcMuGxUvB' // 身份密钥
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的Uid
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    // 如果它为true 就不应该显示加号
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file 是要删除的文件， fileList是删过之后的文件
    remove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // 将 当前的删除的 文件 排除在外
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    changeFile(file, fileList) {
      // file 是当前的文件
      // filelist 是最新数组
      // console.log(file)
      // console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 超过限制文件大小
        this.$message.error('上传的文件大小不能大于5M')
        return false
      }
      // 确定当前上传的就是当前的这个file
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload(params) {
      // console.log(params)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          // 上传的腾讯云 => 哪个存储捅，哪个地域的存储桶  文件、格式、名称
          Bucket: 'democeshi-1305496652', // 存储桶名称
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 上传的文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型
          onProgress: params => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            // 说明文件上传成功 要获取成功的返回地址
            this.fileList = this.fileList.map(item => {
              // 找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址，赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // 关闭进度条并且重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
            // 将上传的地址，回写到 fileList当中
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}

</style>
