import dayjs from 'dayjs';

const getLeave = () => {
  return JSON.parse(localStorage.getItem("user"))?.leave;
};

const isDulplicateLeave = (leave) => {
  return !!JSON.parse(localStorage.getItem("user"))?.leave?.some(({beginDate, endDate}) => {
    return (leave.beginDate >= beginDate && leave.beginDate <= endDate)
      || (leave.endDate >= beginDate && leave.endDate <= endDate);
  });
};

const isCurrentMonthLeave = (leave, increment) => {
    // 当前月份1号是星期几
    const startDay = dayjs().add(increment, 'month').date(1).day();
    // 前一月份一共有多少天
    const previousDays = dayjs().add(increment - 1, 'month').daysInMonth();
    // 月历中第一个单元格是几号
    const firstDate = previousDays - startDay + 1;
    const firstCellDate = dayjs().add(increment-1, 'month').date(firstDate).add(0, 'day').format('YYYY-MM-DD');
    const lastCellDate = dayjs().add(increment-1, 'month').date(firstDate).add(41, 'day').format('YYYY-MM-DD');
    return leave.beginDate >= firstCellDate && leave.endDate <= lastCellDate;
};

const addLeave = (leave) => {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.leave) {
    user.leave.push(leave);
  } else {
    user.leave = [leave];
  }
  
  localStorage.setItem("user", JSON.stringify(user));
};

const deleteLeave = (leave) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.leave.push(leave);
  localStorage.setItem("user", JSON.stringify(user));
};

const LeaveService = {
  getLeave,
  addLeave,
  deleteLeave,
  isDulplicateLeave,
  isCurrentMonthLeave
};

export default LeaveService;