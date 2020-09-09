import parseTime from './index'

const newArray = function(start, end) {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}// 取得开始到结束的日期数组

export const toDate = function(date) {
  return isDate(date) ? new Date(date) : null
}// 将日期变成日期对象

export const isDate = function(date) {
  if (date === null || date === undefined) return false
  if (isNaN(new Date(date).getTime())) return false
  if (Array.isArray(date)) return false
  return true
}// 判断日期对象

export const formatDate = function(date, format) {
  date = toDate(date)
  if (!date) return ''
  return parseTime(date, format || 'yyyy-MM-dd')
}// 变为时间戳

export const getDayCountOfMonth = function(year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30
  } if (month === 1) {
    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
      return 29
    } else {
      return 28
    }
  }
  return 31
}

export const getDayCountOfYear = function(year) {
  const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
  return isLeapYear ? 366 : 365
}

export const getFirstDayOfMonth = function(date) {
  const temp = new Date(date.getTime())
  temp.setDate(1)
  return temp.getDay()
}

export const prevDate = function(date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount)
}

export const nextDate = function(date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

export const getStartDateOfMonth = function(year, month) {
  const result = new Date(year, month, 1)
  const day = result.getDay()

  if (day === 0) {
    return prevDate(result, 7)
  } else {
    return prevDate(result, day)
  }
}

export const getWeekNumber = function(src) {
  if (!isDate(src)) return null
  const date = new Date(src.getTime())
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

export const getRangeHours = function(ranges) {
  const hours = []
  let disabledHours = [];

  (ranges || []).forEach(range => {
    const value = range.map(date => date.getHours())

    disabledHours = disabledHours.concat(newArray(value[0], value[1]))
  })

  if (disabledHours.length) {
    for (let i = 0; i < 24; i++) {
      hours[i] = disabledHours.indexOf(i) === -1
    }
  } else {
    for (let i = 0; i < 24; i++) {
      hours[i] = false
    }
  }

  return hours
}

export const getPrevMonthLastDays = (date, amount) => {
  if (amount <= 0) return []
  const temp = new Date(date.getTime())
  temp.setDate(0)
  const lastDay = temp.getDate()
  return range(amount).map((_, index) => lastDay - (amount - index - 1))
}

export const getMonthDays = (date) => {
  const temp = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const days = temp.getDate()
  return range(days).map((_, index) => index + 1)
}

function setRangeData(arr, start, end, value) {
  for (let i = start; i < end; i++) {
    arr[i] = value
  }
}

export const getRangeMinutes = function(ranges, hour) {
  const minutes = new Array(60)

  if (ranges.length > 0) {
    ranges.forEach(range => {
      const start = range[0]
      const end = range[1]
      const startHour = start.getHours()
      const startMinute = start.getMinutes()
      const endHour = end.getHours()
      const endMinute = end.getMinutes()
      if (startHour === hour && endHour !== hour) {
        setRangeData(minutes, startMinute, 60, true)
      } else if (startHour === hour && endHour === hour) {
        setRangeData(minutes, startMinute, endMinute + 1, true)
      } else if (startHour !== hour && endHour === hour) {
        setRangeData(minutes, 0, endMinute + 1, true)
      } else if (startHour < hour && endHour > hour) {
        setRangeData(minutes, 0, 60, true)
      }
    })
  } else {
    setRangeData(minutes, 0, 60, true)
  }
  return minutes
}

export const range = function(n) {
  // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.apply(null, { length: n }).map((_, n) => n)
}

// ////
export const numberMake = function(num) {
  if (num <= 9 && num >= 0) {
    return '0' + num
  } else {
    return num
  }
}


/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
export const getDayOfWeek = (date, num) => {
  var day = date.getDay()
  var year = date.getFullYear()
  var month = date.getMonth()
  var Day = date.getDate() - day + (day === 0 ? (num - 7) : num)
  if (Day > getDayCountOfMonth(year, month)) {
    Day = Day - getDayCountOfMonth(year, month)
    month = month + 1
    if (month > 11) {
      month = 0
      year += 1
    }
  }
  if (Day === 0) {
    month = month - 1
    Day = getDayCountOfMonth(year, month)
  }
  if (Day < 0) {
    month = month - 1
    Day = getDayCountOfMonth(year, month) + Day
    if (month < 0) {
      month = 11
      year -= 1
    }
  }
  function makeNumber(num) {
    if (num <= 9 && num >= 0) {
      return '0' + num
    } else {
      return num
    }
  }
  return year + '-' + makeNumber(month + 1) + '-' + makeNumber(Day)
}
