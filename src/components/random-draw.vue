<template>
  <div class="random-draw">
    <div class="random-container">
      <div style="position: absolute;bottom:40px;right:10px;color:#fff9b0;font-size:40px;">DesignBy: AloneTu</div>
      <el-input-number
        size="small"
        v-model="drawNumber"
        style="width:calc(100% - 100px);"
      ></el-input-number>
      <el-button type="primary" size="small" @click="startDraw" v-if="drawing">开始抽奖</el-button>
      <el-button type="danger" size="small" @click="closeDraw" v-else>结束抽奖</el-button>

      <div style="display: flex; justify-content: space-between;margin:8px;">
        <span v-show="allNumber !== 0">参与抽奖人数：{{ allNumber }}人</span>
        <span v-show="fetchData.length !== 0">剩余未中奖人数：{{ fetchData.length }}人</span>
      </div>

      <div class="show-draw">
        <div style="display: flex;justify-content: space-between;font-size: 40px;" v-if="showDrawInfo">
          <span>中奖人姓名</span>
          <span>中奖人手机号</span>
        </div>
        <div class="show-draw-item" v-for="item in drawList" :key="item.phone">
          <span style="fontSize: 32px;margin-left: 40px;">{{ item.name }}</span>
          <span style="fontSize: 32px;margin-right: 40px;">{{ plusXing(item.phone.toString()) }}</span>
        </div>
      </div>

      <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :file-list="fileListUpload"
        :limit="limitUpload"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false"
      >
        <el-button type="primary" size="small">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileTemp: null,
      limitUpload: 1,
      fetchData: [],
      drawNumber: 1,
      drawList: [],
      fileListUpload: [],
      allNumber: 0,
      drawing: true,
      showDrawInfo: false
    }
  },
  methods: {
    handleChange(file) {
      this.fileTemp = file.raw
      if (this.fileTemp) {
        if (
          this.fileTemp.type ==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          this.fileTemp.type == 'application/vnd.ms-excel'
        ) {
          this.importfxx(this.fileTemp)
        } else {
          this.$message({
            type: 'warning',
            message: '附件格式错误，请删除后重新上传！'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请上传附件！'
        })
      }
    },
    handleRemove(file) {
      this.fileTemp = null
    },
    handleExceed() {},
    importfxx(obj) {
      let _this = this
      // 通过DOM取文件数据
      this.file = obj
      var rABS = false //是否将文件读取为二进制字符串
      var f = this.file
      var reader = new FileReader()
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = ''
        var rABS = false //是否将文件读取为二进制字符串
        var pt = this
        var wb //读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          var XLSX = require('xlsx')
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) //outdata就是你想要的东西
          this.da = [...outdata]
          let arr = []
          this.da.map(v => {
            let obj = {}
            obj.code = v['设备ID']
            obj.type = v['设备型号']
            arr.push(obj)
          })
          _this.fetchData = JSON.parse(JSON.stringify(outdata))
          _this.allNumber = outdata.length;
          return arr
        }
        reader.readAsArrayBuffer(f)
      }

      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random())
        temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
      }
      return shuffled.slice(min)
    },
    startDraw() {
      if (!this.fetchData.length) {
        this.$message.warning({
          message: `请先上传参与抽奖人员信息！`
        })
        return
      }

      if (this.drawNumber > this.fetchData.length) {
        this.$message.warning({
          message: `抽奖人数(${this.drawNumber}人)大于剩余未中奖人数(${this.fetchData.length}人)，请重新输入！`
        })
        return
      }
      this.showDrawInfo = true;

      this.timeInterval = setInterval(() => {
        this.drawing = false;
        this.drawList = this.getRandomArrayElements(this.fetchData, this.drawNumber);
      }, 10)
    },
    closeDraw() {
      clearInterval(this.timeInterval)
      this.drawList.forEach(item => {
        let index = this.fetchData.findIndex(test => test.phone === item.phone);
        this.fetchData.splice(index, 1)
      })
      this.drawing = true;
    },
    // 替换字符串
    plusXing(str, frontLen=3, endLen=4, cha="*") {
      var len = str.length - frontLen - endLen;
      var xing = '';
      for (var i = 0; i < len; i++) {
        xing += cha;
      }
      return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
  }
}
</script>

<style lang="scss">
.random-draw {
  height: 100%;
  width: 100%;
  display: flex;
  overflow: auto;
  color: #fff;
  background-image: url('../assets/background.png');
  background-size: 100%;
  .random-container {
    width: 60%;
    min-width: 900px;
    margin: 0 auto;
    margin-top: 134px;
    .show-draw {
      margin: 16px 0;
      overflow: auto;
      .show-draw-item {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .el-upload-list__item .el-icon-close {
    display: none;
  }
  .el-upload-list__item-name {
    color: #fff;
  }
  .el-upload__tip {
    color: #f1f1f1;
  }
}
</style>
