// components/calendar/calendar.js
/**
 * 日历选择组件
 * author: jorce
 */
const moment = require('moment');
Component({
  /**
   * 组件的属性列表
   * data [Date] 当前现实的月份
   */
  properties: {
    date: {
      type: null,
      value: moment()
    },
    storeData: {
      type: Object,
      value: {
        attributes: {
          prices: {
            default: 20,
            weekend: 35
          }
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
      const currentDate = calendar.weeks[week][index];
      const moreThan30Days = this.checkAfter30Days(currentDate.dateFormate);
      if (moreThan30Days || currentDate.reserved) {
        return;
      }
      this.getWeek(currentDate.dateFormate, this.data.storeData);
      this.checkIsMonthBeforeCurrent();
    },
    // 返回今天
    backtoday() { this.getWeek(moment()); },
    // 前一天|| 后一天
    dataBefore(e) {
      let num = -1;
      let types = e.currentTarget.dataset.type;
      let _date = this.getDate(this.data.calendar.dateFormate, num, types === 'month' ? "month" : "day");
      this.getWeek(_date, this.data.storeData, true);
      this.checkIsMonthBeforeCurrent();
    },
    dataAfter(e) {
      this.setData({
        monthBeforeCurrent: false
      })
      let num = 1;
      let types = e.currentTarget.dataset.type;
      let _date = this.getDate(this.data.calendar.dateFormate, num, types === 'month' ? "month" : "day");
      this.getWeek(_date, this.data.storeData, true);
    },
    // 获取日历内容
    checkAfter30Days(dateFormate) {
      // const { closedDays } = this.data.storeData.attributes;
      const closedDays = ['2020-03-20', '2020-03-21', '2020-03-22'];
      let isClosed = false;
      closedDays.map(close => {
        if (close === dateFormate) {
          isClosed = true;
        }
      })
      return isClosed || moment(dateFormate).startOf('day').isAfter(moment().add(1, 'months').startOf('day'));
    },
    checkIsMonthBeforeCurrent() {
      const { dateFormate } = this.data.calendar;
      if (moment().month() === moment(dateFormate).month() && moment().year() === moment(dateFormate).year()) {
        this.setData({
          monthBeforeCurrent: true
        })
        return;
      }
      this.setData({
        monthBeforeCurrent: false
      })
    },
    getWeek(dateData, storeData, fromArrow) {
      if (!storeData) {
        return;
      }
      const { prices } = storeData.attributes;
      // prices.calendar = [
      //   {
      //     date: '2020-03-18',
      //     price: 50
      //   }
      // ]
      let momentDate = moment(dateData)
      let currentDys= [];
      let selectedDate = {
        year: momentDate.year(),
        month: momentDate.month() + 1,
        date: momentDate.date(),
        day: momentDate.day(),
        price: 45,
        dateFormate: moment(dateData).format('YYYY-MM-DD'),
        reserved: momentDate.month() + 1 === 3 && momentDate.month() === 17
      }
      let dates = {
        firstDay: moment(momentDate).date(1).day(),
        lastMonthDays: [],// 上个月末尾几天
        currentMonthDys: [], // 本月天数
        nextMonthDays: [], // 下个月开始几天
        endDay: moment(momentDate).endOf('month').day(),
        weeks: []
      }
      // 循环上个月末尾几天添加到数组
      for (let i = dates.firstDay - 1; i >= 0; i--) {
        const lastMonthDay = moment(momentDate).month(selectedDate.month - 1).date(-i);
        const moreThan30Days = this.checkAfter30Days(lastMonthDay.format('YYYY-MM-DD'));
        dates.lastMonthDays.push({
          date: lastMonthDay.date(),
          month: selectedDate.month - 1,
          disableReserve: moreThan30Days,
          dateFormate: lastMonthDay.format('YYYY-MM-DD'),
          isWeekend: lastMonthDay.day() === 6 || lastMonthDay.day() === 0 ? true : false
        })
      }
      // 循环本月天数添加到数组
      for (let i = 1; i <= moment(dateData).endOf('month').date(); i++) {
        let reserved = false;
        if (selectedDate.month === 3 && i === 17) {
          reserved = true
        }
        const currentMonthDay = moment(momentDate).month(selectedDate.month - 1).date(i);
        const moreThan30Days = this.checkAfter30Days(currentMonthDay.format('YYYY-MM-DD'));
        dates.currentMonthDys.push({
          date: i + "",
          month: selectedDate.month,
          disableReserve: moreThan30Days,
          reserved,
          dateFormate: currentMonthDay.format('YYYY-MM-DD'),
          isWeekend: currentMonthDay.day() === 6 || currentMonthDay.day() === 0 ? true : false
        })
      }
      // 循环下个月开始几天 添加到数组
      for (let i = 1; i < 7 - dates.endDay; i++) {
        const nextMonthDay = moment(momentDate).month(selectedDate.month).date(i);
        const moreThan30Days = this.checkAfter30Days(nextMonthDay.format('YYYY-MM-DD'));
        dates.nextMonthDays.push({
          date: i + '',
          month: selectedDate.month + 1,
          disableReserve: moreThan30Days,
          dateFormate: nextMonthDay.format('YYYY-MM-DD'),
          isWeekend: nextMonthDay.day() === 6 || nextMonthDay.day() === 0 ? true : false
        })
      }

      currentDys = currentDys.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
      // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
      for (let i = 0; i < currentDys.length; i++) {
        if (i % 7 == 0) {
          dates.weeks[parseInt(i / 7)] = new Array(7);
        }
        dates.weeks[parseInt(i / 7)][i % 7] = currentDys[i]
      }
      if (prices.calendar && prices.calendar.length > 0) {
        selectedDate.price = prices.default
        prices.calendar.map(cal => {
          if (moment(dateData).startOf('day').isSame(moment(cal.date).startOf('day'))) {
            selectedDate.price = cal.price
          }
          dates.weeks.forEach(w => {
            w.forEach(d => {
              if (moment(cal.date).startOf('day').isSame(moment(dateData).month(d.month - 1).date(d.date).format('YYYY-MM-DD'))) {
                d.costs = cal.price;
              } else {
                if (d.isWeekend) {
                  d.costs = prices.weekend;
                }else {
                  d.costs = prices.default;
                }
              }
              if (moment().startOf('day').isAfter(moment(moment(dateData).month(d.month - 1).date(d.date).startOf('day')))) {
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
            
            if (moment().add(-1, 'days').startOf('day') >= moment(dateData).month(d.month - 1).date(d.date).startOf('day')) {
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
        'calendar.reserved': selectedDate.reserved,
        'calendar.dateFormate': selectedDate.dateFormate
      })
      if (fromArrow) {
        return;
      }
      this.setData({
        currentSelectedDate: selectedDate
      })
      if (this.checkAfter30Days(selectedDate.dateFormate)) {
        return;
      }
      this.triggerEvent('getdate', { 
        year: selectedDate.year,
        month: selectedDate.month < 10 ? "0" + selectedDate.month : selectedDate.month,
        date: selectedDate.date < 10 ? "0" + selectedDate.date : selectedDate.date, 
        dateFormate: selectedDate.dateFormate,
        price: selectedDate.price
      })
    },
    /**
     * 时间计算
     */
    getDate(date, AddDayCount, str = 'day') {
      const momentData = moment(date);
      return str === 'month' ? momentData.add(AddDayCount, 'months').format('YYYY-MM-DD') : momentData.add(AddDayCount, 'days').format('YYYY-MM-DD');
    }
  }
})
