const getLeave = () => {
  return JSON.parse(localStorage.getItem("user"))?.leave;
};

const isDulplicateLeave = (leave) => {
  return !!JSON.parse(localStorage.getItem("user"))?.leave?.some(({beginDate, endDate}) => {
    return (leave.beginDate >= beginDate && leave.beginDate <= endDate)
      || (leave.endDate >= beginDate && leave.endDate <= endDate);
  });
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
  isDulplicateLeave
};

export default LeaveService;