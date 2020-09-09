<template>
  <div v-loading="loading" class="calendar">
    <div class="dateTitle">
      <div class="title">
        <slot name="title" />
        <div class="dateSelect" style="width:600px">
          <el-row type="flex" justify="center" align="middle" style="text-align:center;height:57px">
            <i class="arrow-left" @click="preMonth" />
            <p class="date" @click="showCander">
              <i class="dateText">{{ year }}-{{ month|numberMake }}</i>
              <!-- <el-date-picker
                ref="eldate"
                v-model="selectDay"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="{'firstDayOfWeek': 1}"
              /> -->
            </p>
            <i class="arrow-right" @click="nextMonth" />
          </el-row>
        </div>
      </div>
    </div>
    <table class="table_body">
      <tr>
        <td v-for="day in 7" :key="day">
          <div class="header">
            <span class="number">{{ weekDay[day-1] }}</span>
          </div>
        </td>
      </tr>
      <tr v-for="(day,index) in days" :key="index">
        <td v-for="(item,itemIndex) in day" :key="itemIndex" :class="{disabled:item.disabled}">
          <div
            class="block"
            :class="{'blue':dataObj.day==item.day,
                     'green':timeParse(item.day)==timeParse(new Date()),
                     'gray':false,
                     'red':false
            }"
            @click="check(item)"
          >
            <span class="number">{{ item.day |parseTime('{d}') }}</span>
            <slot :cell="item" />
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { getDayCountOfMonth, numberMake } from '@/utils/data-util'
import { parseTime } from '@/utils'
export default {
  components: {
  },
  filters: {
    parseTime(val, type) {
      return parseTime(val, type)
    },
    numberMake(val) {
      return numberMake(val)
    }
  },
  props: {
    date: {
      type: Date,
      default: new Date()
    }
  },
  data() {
    return {
      group: 'mission',
      weekDay: ['一', '二', '三', '四', '五', '六', '日'],
      dataObj: {},
      days: [],
      selectDay: new Date(),
      watchModel: 'month',
      simpleModel: true,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      loading: false
    }
  },
  watch: {
  },
  created() {
    this.rander(new Date().getFullYear(), new Date().getMonth())
  },
  destroyed() {
  },
  methods: {
    rander(y, m) {
      // const firstDayOfMonth = new Date(y, m, 1).getDay() // 当月第一天
      const lastDateOfMonth = new Date(y, m + 1, 0).getDate() // 当月最后一天
      // const lastDayOfLastMonth = new Date(y, m, 0).getDate() // 最后一月的最后一天
      const temp = Array(6)
      for (let index = 0; index < temp.length; index++) {
        temp[index] = []
      }
      let line = 0
      for (let i = 1; i <= lastDateOfMonth; i++) {
        const day = new Date(y, m, i).getDay() // 返回星期几（0～6）
        if ((line === 0) && (i === 1)) {
          const k = day ? day - 1 : 6
          let lastmonth = m - 1
          let year = y
          if (m < 0) {
            year = y - 1
            lastmonth = 11
          }
          const monthCount = getDayCountOfMonth(year, lastmonth)
          console.log(temp)
          for (let index = 1; index <= k; index++) {
            console.log(year, lastmonth, monthCount - (k - index))
            temp[line].push({
              day: new Date(year, lastmonth, monthCount - (k - index)),
              disabled: true
            })
          }// 第一行补充上个月天数
          temp[line].push({
            day: new Date(y, m, i),
            disabled: false
          })
          if (day === 0) {
            line++
            console.log(line)
          }
          // console.log(temp)
        } else {
          temp[line].push({
            day: new Date(y, m, i),
            disabled: false
          })
          if (day === 0) {
            line++
            console.log(line)
          }
        }
      }// 循环本月
      const lackDayCount = line === 4 ? 14 - temp[line].length : 7 - temp[line].length
      for (let x = 1; x <= lackDayCount; x++) {
        let NextMonth = m + 1
        let year = y
        if (m > 11) {
          year = y + 1
          NextMonth = 1
        }
        temp[line].push({
          day: new Date(year, NextMonth, x),
          disabled: true
        })
        if (temp[line].length === 7) {
          line++
        }
      }
      this.days = temp
      console.log(this.days)
    },
    showCander(event) {
      this.$refs.eldate.pickerVisible = true
    },
    preMonth() {
      this.month--
      if (this.month < 1) {
        this.year--
        this.month = 12
      }
      this.rander(this.year, this.month - 1)
    },
    nextMonth() {
      this.month++
      if (this.month > 12) {
        this.year++
        this.month = 1
      }
      this.rander(this.year, this.month - 1)
    },
    timeParse(val) {
      return parseTime(val, '{y}-{m}-{d}')
    },
    check(item) {
      this.dataObj = item
      this.$emit('update:date', item.day)
      this.$emit('change', item)
    }
  }
}
</script>

<style lang='scss' scoped>
.calendar{
  border: 1px solid $border_color;
  overflow: hidden;
  // box-shadow:0px 5px 5px 0px rgba(56,79,134,0.15);
  border-radius:5px;
}
  .dateTitle{
    .title{
      position: relative;
      height:57px;
      width:100%;
      border: 1px solid $border_color;
      border-left:none;
      border-right:none;
      background: #fff;
    }
    .dateSelect{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .weekSelect{
      position: absolute;
      top: 50%;
      transform:translateY(-50%);
      right: 90px;
    }
    .simpleSelect{
      position: absolute;
      top: 50%;
      transform:translateY(-50%);
      right: 10px;
    }
  }
  .arrow-left,.arrow-right{
    position:relative;
    display:inline-block;
    width:22px;
    height:22px;
    border-radius:50%;
    border:2px solid $theme_color;
    cursor: pointer;
  }
  .date{
    position:relative;
    color:$theme_color;
    height: 94%;
    width:150px;
    .dateText{
      display:block;
      height:100%;
      line-height:3.5;
      width:100%;
      background: #ffffff;
      position:absolute;
      font-style: normal;
      cursor: pointer;
      z-index:8
    }
    /deep/ input{
      min-width: 50px;
    }
    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width:0
    }
  }
  .arrow-left{
     &:before{
        position: absolute;
        left: 30%;
        top: 50%;
        transform: translate(-50%, -50%);
        content: '';
        display: block;
        border: 5px solid transparent;
        border-right: 5px solid $theme_color;
     }
  }
  .arrow-right{
     &:before{
        position: absolute;
        left: 70%;
        top: 50%;
        transform: translate(-50%, -50%);
        content: '';
        display: block;
        border: 5px solid transparent;
        border-left: 5px solid $theme_color;
     }
  }
 .table_body{
   width: 100%;
   background: #fff;
  //  height:calc(100vh - 190px);
   height: 400px;
   border-collapse: collapse;
   font-size: 14px;
   td{
    //  border:solid 3px #fff;
     border-bottom:none;
     border-top:none;
    .block{
      position: relative;
      // border-top:3px solid $border_color;
      height: 100%;
      color:#666666;
      cursor: pointer;
      .number{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        z-index: 2;
         @media screen and( max-width: 1366px) {
               font-size:14px
          }
      }
    }
    .header{
      position: relative;
       text-align:center;
      .number{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        color:#666666;
        font-weight: bold;
      }
    }

    .green{
      border-color: rgba(23, 164, 136, 1);
      background:rgba(23, 164, 136, 0.1);
      color:rgba(23, 164, 136, 1);
    }
    .blue {
      border-color:$theme_color;
      background:rgba(52,133,255, 0.1);
      color:$theme_color
    }
     .red {
      border-color:#F56C6C;
      background:rgba(245,108,108, 0.1);
      color:#F56C6C
    }
    .gray {
      border-color:#909399;
      background:rgba(144,147,153, 0.1);
      color:#909399
    }
   }
   .disabled{
      pointer-events:none !important;
      cursor: default !important;
      opacity: 0.5;
    }
 }
</style>
