// components/calendar/calendar.js
/**
 * 日历选择组件
 */

const moment = require('moment')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: null,
      value: moment()
    },
    storeData: {
      type: Object,
      value: {
        prices: {
          default: 20,
          weekend: 30,
          calendar: [{date: '2020-3-17', price: 50}]
        }
      },
      observer(newVal, oldVal) {
        this.getWeek(moment(), newVal);
      }
    },
    isOpen: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    calendar: {
      "weeks": [],
    },
    currentSelectedDate: {},
    monthBeforeCurrent: true,
  },
  ready() {
    this.getWeek(moment(), this.data.storeData);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectDay(e) {
      let index = e.currentTarget.dataset.index;
      let week = e.currentTarget.dataset.week;
      let calendar = this.data.calendar;
      let month = calendar.weeks[week][index].month < 10 ? "0" + calendar.weeks[week][index].month : calendar.weeks[week][index].month
      let date = calendar.weeks[week][index].date < 10 ? "0" + calendar.weeks[week][index].date : calendar.weeks[week][index].date
      const moreThan30Days = this.checkAfter30Days(moment(calendar.moment));
      if (moreThan30Days || calendar.weeks[week][index].reserved) {
        return;
      }
      console.log(moment().year(calendar.year).month(month - 1).date(date))
      this.getWeek(moment().year(calendar.year).month(month - 1).date(date), this.data.storeData);
      this.checkIsMonthBeforeCurrent();
    },
    // 返回今天
    backtoday() { this.getWeek(moment()); },
    // 前一天|| 后一天
    dataBefore(e) {
      let num = -1;
      let types = e.currentTarget.dataset.type;
      let year = this.data.calendar.year + "-" + this.data.calendar.month + "-" + this.data.calendar.date
      let _date = this.getDate(year, num, types === 'month' ? "month" : "day");
      this.getWeek(_date, this.data.storeData);
      this.checkIsMonthBeforeCurrent();
    },
    dataAfter(e) {
      this.setData({
        monthBeforeCurrent: false
      })
      let num = 1;
      let types = e.currentTarget.dataset.type;
      let year = this.data.calendar.year + "-" + this.data.calendar.month + "-" + this.data.calendar.date
      let _date = this.getDate(year, num, types === 'month' ? "month" : "day");
      this.getWeek(_date, this.data.storeData);
    },
    // 获取日历内容
    checkAfter30Days(date) {
      const closedDays = ['2020-03-20', '2020-03-21'];
      let isClosed = false;
      const formatDate = moment(date.format('YYYY-MM-DD'))
      closedDays.map(close => {
        if (moment(close).isSame(formatDate)) {
          isClosed = true
        }
      })
      return isClosed || formatDate.isAfter(moment().set('month', moment().month() + 1));
      // return isClosed
    },
    checkIsMonthBeforeCurrent() {
      if (new Date().getMonth() === Number(this.data.calendar.month) - 1 && new Date().getFullYear() === Number(this.data.calendar.year)) {
        this.setData({
          monthBeforeCurrent: true
        })
        return;
      }
      this.setData({
        monthBeforeCurrent: false
      })
    },
    getWeek(dateData, storeData) {
      const { prices } = storeData;
      let formatDate = moment(dateData);
      let currentDys= [];
      let selectedDate = {
        year: formatDate.year(),
        month: formatDate.month() + 1,
        date: formatDate.date(),
        day: formatDate.day(),
        moment: formatDate,
        price: 45,
        reserved: formatDate.month() + 1 === 3 && formatDate.date() === 17
      }
     
      let dates = {
        firstDay: moment(dateData).startOf('month').day(),
        lastMonthDays: [],// 上个月末尾几天
        currentMonthDys: [], // 本月天数
        nextMonthDays: [], // 下个月开始几天
        endDay: moment(dateData).endOf('month').day(),
        weeks: []
      }
      // 循环上个月末尾几天添加到数组
      for (let i = dates.firstDay - 1; i >= 0; i--) {
        const moreThan30Days = this.checkAfter30Days(moment(dateData).set('date', -i));
        const checkDate = moment(dateData).set('date', -i).day();
        dates.lastMonthDays.push({
          date: checkDate + '',
          moment: moment(dateData).set('date', -i).format('YYYY-MM-DD'),
          month: selectedDate.month - 1,
          disableReserve: moreThan30Days,
          isWeekend: checkDate === 6 || checkDate === 0 ? true : false
        })
      }
      // 循环本月天数添加到数组
      for (let i = 1; i <= moment(dateData).endOf('month').date(); i++) {
        let reserved = false;
        if (selectedDate.month === 3 && i === 17) {
          reserved = true
        }
        const checkDate = moment(dateData).date(i).day();
        const moreThan30Days = this.checkAfter30Days(moment(dateData).set('date', i));
        dates.currentMonthDys.push({
          date: i + "",
          moment: moment(dateData).set('date', i).format('YYYY-MM-DD'),
          month: selectedDate.month,
          disableReserve: moreThan30Days,
          reserved,
          isWeekend: checkDate === 6 || checkDate === 0 ? true : false
        })
      }
      // 循环下个月开始几天 添加到数组
      for (let i = 1; i < 7 - dates.endDay; i++) {
        const moreThan30Days = this.checkAfter30Days(moment(dateData).set({'date': i, 'month': moment(dateData).month() + 1}));
        const checkDate = moment(dateData).set('date', i).day();
        dates.nextMonthDays.push({
          date: i + '',
          moment: moment(dateData).set({'date': i, 'month': moment(dateData).month() + 1}).format('YYYY-MM-DD'),
          month: selectedDate.month + 1,
          disableReserve: moreThan30Days,
          isWeekend: checkDate === 6 || checkDate === 0 ? true : false
        })
      }

      currentDys = [...dates.lastMonthDays, ...dates.currentMonthDys, ...dates.nextMonthDays]
      // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
      for (let i = 0; i < currentDys.length; i++) {
        if (i % 7 == 0) {
          dates.weeks[parseInt(i / 7)] = new Array(7);
        }
        dates.weeks[parseInt(i / 7)][i % 7] = currentDys[i]
      }
      if (prices.calendar && prices.calendar.length > 0) {
        prices.calendar.map(cal => {
          if (moment(dateData).isSame(cal.date)) {
            selectedDate.price = cal.price
          }
          dates.weeks.forEach(w => {
            w.forEach(d => {
              if (moment(cal.date).isSame(d.moment)) {
                d.costs = cal.price;
              } else {
                if (d.isWeekend) {
                  d.costs = prices.weekend;
                }else {
                  d.costs = prices.default;
                }
              }
              if (moment().set('hour', 0).isAfter(moment(d.moment).set('hour', 1))) {
                d.disableReserve = true
              }
            })
          })
        })
      } else {
        selectedDate.price = prices.default
        dates.weeks.forEach(w => {
          w.forEach(d => {
            if (d.isWeekend) {
              d.costs = prices.weekend;
            }else {
              d.costs = prices.default;
            }
            if (moment().set('hour', 0).isAfter(moment(d.moment).set('hour', 1))) {
              d.disableReserve = true
            }
          })
        })
      }
      // 渲染数据
      this.setData({
        "calendar.weeks": dates.weeks
      });
      this.setData({
        'calendar.month': selectedDate.month,
        'calendar.date': selectedDate.date,
        "calendar.day": selectedDate.day,
        'calendar.year': selectedDate.year,
        'calendar.price': selectedDate.price,
        'calendar.moment': selectedDate.moment,
        'calendar.reserved': selectedDate.reserved
      })
      this.setData({
        currentSelectedDate: selectedDate
      })
      // if (this.checkAfter30Days(selectedDate.moment)) {
      //   return;
      // }
      this.triggerEvent('getdate', { 
        year: selectedDate.year,
        month: selectedDate.month < 10 ? "0" + selectedDate.month : selectedDate.month,
        date: selectedDate.date < 10 ? "0" + selectedDate.date : selectedDate.date, 
        price: selectedDate.price
      })
    },
    /**
     * 时间计算
     */
    getDate(date, AddDayCount, str = 'day') {
      const formatDate = moment(date);
      switch (str) {
        case 'day':
          formatDate.date(formatDate.date() + AddDayCount)// 获取AddDayCount天后的日期
          break;
        case 'month':
          formatDate.month(formatDate.month() + AddDayCount)// 获取AddDayCount天后的日期
          break;
        case 'year':
          formatDate.year(formatDate.year() + AddDayCount)// 获取AddDayCount天后的日期
          break;
      }
      return moment(formatDate).format('YYYY-MM-DD');
    }
  }
})
