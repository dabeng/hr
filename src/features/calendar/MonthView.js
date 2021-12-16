import React, { useEffect, useMemo, useState } from "react";

import dayjs from 'dayjs';
import { useForm } from "react-hook-form";
import LeaveService from "../core/leave.service";
import DateService from "../core/date.service";

import styles from "./MonthView.module.scss";

const MonthView = () => {
  const [increment, setIncrement] = useState(0);
  // 0代表为未选中，1代表被选中，2代表被占用请假
  const [monthMatrix, setMonthMatrix] = useState(Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => 0)));
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isDeleteLeaveModal, setIsDeleteLeaveModal] = useState(false);
  // 选中的日期数组，我们会基于它来初始化请假对话框
  const [expectedLeave, setExpectedLeave] = useState([]);

  // 在浏览之前月份或之后月份的时候，标示出该月份的请假情况
  useEffect(() => {
    // 当前月份1号是星期几
    const startDay = dayjs().add(increment, 'month').date(1).day();
    // 前一月份一共有多少天
    const previousDays = dayjs().add(increment - 1, 'month').daysInMonth();
    // 月历中第一个单元格是几号
    const firstDate = previousDays - startDay + 1;
    // 从localStorage里读出假期数组
    const leave = LeaveService.getLeave();
    // 遍历月历中的所有单元格，落在假期里的，标识出来
    setMonthMatrix(Array.from({ length: 6 }, (e, i) => {
      return Array.from({ length: 7 }, (e, j) => {
        const day = dayjs().add(increment - 1, 'month').date(firstDate).add(i * 7 + j, 'day').format('YYYY-MM-DD');
        if (leave) {
          let isLeave = leave.some(l => {
            return l.when.some(period => {
              if (period.includes('~')) {
                return day >= period.split('~')[0] && day <= period.split('~')[1];
              } else {
                return day === period;
              }
            });
          });
          if (isLeave) {
            return 2;
          }
        }
        if (expectedLeave.length > 0) {
          let isExpectedLeave = expectedLeave.includes(day);
          if (isExpectedLeave) {
            return 1;
          }
        }
        return 0;
      });
    }));
  }, [increment]);

  const previousMonth = e => {
    setIncrement(prev => prev - 1);
  };

  const resetToToday = e => {
    setIncrement(0);
  };

  const nextMonth = e => {
    setIncrement(prev => prev + 1);
  };

  const openNewLeaveModal = e => {
    setIsLeaveModalOpen(true);
    setIsDeleteLeaveModal(false);
    setValue('when', DateService.findConsecutive(expectedLeave));
  };

  const closeLeaveModal = e => {
    reset();
    setIsLeaveModalOpen(false);
  };

  const getDateFromMonthMatrix = (row, column) => {
    // 当前月份1号是星期几
    const startDay = dayjs().add(increment, 'month').date(1).day();
    // 前一月份一共有多少天
    const previousDays = dayjs().add(increment - 1, 'month').daysInMonth();
    // 月历中第一个单元格是几号
    const firstDate = previousDays - startDay + 1;
    // 基于第一个单元格的日期，算出任意单元格的日期
    return dayjs().add(increment - 1, 'month').date(firstDate).add(row * 7 + column, 'day').format('YYYY-MM-DD');
  };

  const updateExpectedLeave = ({ row, column }, action) => {
    const day = getDateFromMonthMatrix(row, column);
    if (action === 'add') {
      setExpectedLeave([...expectedLeave, day].sort());
    } else {
      setExpectedLeave(expectedLeave.filter(item => item !== day));
    }
  };

  const toggleSelectCell = (row, column) => {
    const copy = [...monthMatrix];
    if (copy[row][column] === 0) {
      copy[row][column] = 1;
      updateExpectedLeave({ row, column }, 'add');
    } else if (copy[row][column] === 1) {
      copy[row][column] = 0;
      updateExpectedLeave({ row, column }, 'delete');
    }
    setMonthMatrix(copy);
  };

  const openDeleteLeaveModal = (row, column) => {
    setIsLeaveModalOpen(true);
    setIsDeleteLeaveModal(true);
    // 从localStorage里读出假期数组，然后找出当前选中的是哪次假期，用来初始化假期对话框
    const leave = LeaveService.getLeave();
    const day = getDateFromMonthMatrix(row, column);
    setValue('when', leave.find(l => {
      return l.when.some(period => {
        if (period.includes('~')) {
          return day >= period.split('~')[0] && day <= period.split('~')[1];
        } else {
          return day === period;
        }
      });
    }).when);
  };

  const clickMonthCell = (row, column) => {
    if (monthMatrix[row][column] === 2) {
      setIsDeleteLeaveModal(true);
      openDeleteLeaveModal(row, column);
    } else {
      toggleSelectCell(row, column);
    }
  };

  const leaveTypes = ['Additional Time Off - Paid', 'Additional Time Off - Unpaid', 'Annual Leave', 'Sick Leave'];
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    formState: { dirtyFields, errors },
  } = useForm({
    defaultValues: {
      when: '',
      leaveType: 'Sick Leave',
      comment: ''
    }
  });
  /* 当新请的假期落在当前月历中时，在当前月历中标识出已请的假 */
  const updateMonthMatrix = () => {
    // 当前月份1号是星期几
    const startDay = dayjs().add(increment, 'month').date(1).day();
    // 前一月份一共有多少天
    const previousDays = dayjs().add(increment - 1, 'month').daysInMonth();
    // 月历中第一个单元格是几号
    const firstDate = previousDays - startDay + 1;
    // 从localStorage里读出假期数组
    const leave = LeaveService.getLeave();
    // 遍历月历中的所有单元格，落在假期里的，标识出来
    setMonthMatrix(Array.from({ length: 6 }, (e, i) => {
      return Array.from({ length: 7 }, (e, j) => {
        const day = dayjs().add(increment - 1, 'month').date(firstDate).add(i * 7 + j, 'day').format('YYYY-MM-DD');
        return leave.some(l => {
          return l.when.some(period => {
            if (period.includes('~')) {
              return day >= period.split('~')[0] && day <= period.split('~')[1];
            } else {
              return day === period;
            }
          });
        }) ? 2 : 0;
      });
    }));
  };

  const updateLeave = (data, e) => {
    if (e.nativeEvent.submitter.id === 'delete_leave_btn') {
      LeaveService.deleteLeave(data);
      updateMonthMatrix();
    } else {
      // 先将请的假保存到localstorage中。在实际项目中，这里应该替换为保存到远程数据库的restful API调用
      LeaveService.addLeave(data);
      // 如果请的假处在当前月历范围内，则需要刷新月历，以体现已申请假期的那些日期
      if (LeaveService.isCurrentMonthLeave(data, increment)) {
        updateMonthMatrix();
      }
      // 清空待请假的日期数组
      setExpectedLeave([]);
    }
    // 关闭请假对话框
    closeLeaveModal();
  }

  const createCards = () => {
    let rows = [];
    rows.push(
      <div className="columns is-mobile" key={0}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((caption, i) =>
          <div className={`column ${styles.column}`} key={i}>
            <div className={`card ${styles.week_card}`}>
              <div className="card-content">
                <div className="content">
                  {caption}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
    for (let i = 0; i < 6; i++) {
      let columns = [];
      // 当前月份第一天是星期几
      let startDay = dayjs().add(increment, 'month').date(1).day();
      // 当前月份一共有多少天
      let days = dayjs().add(increment, 'month').daysInMonth();
      // 前一个月份一共有多少天
      let previousDays = dayjs().add(increment - 1, 'month').daysInMonth();
      for (let j = 0; j < 7; j++) {
        columns.push(
          <div className={`column ${styles.column}`} key={j}>
            <div
              className={
                "card"
                + (i * 7 + j < startDay ? " has-text-grey" : "")
                + ((i * 7 + j >= startDay && i * 7 + j <= startDay + days - 1) ? " has-text-black" : "")
                + (i * 7 + j > startDay + days - 1 ? " has-text-grey" : "")
                + (i * 7 + j === dayjs().date() + startDay - 1 && increment === 0 ? " " + styles.today_card : "")
              }
              onClick={e => clickMonthCell(i, j)}
            >
              <div className="card-content">
                <div className={`content ${styles.content}`}>
                  <span className={
                    styles.date
                  }>
                    {
                      i * 7 + j < startDay ? previousDays - startDay + j + 1 : (
                        i * 7 + j > startDay + days - 1 ? ((i * 7 + j) - (startDay + days - 1)) : i * 7 + j + 1 - startDay
                      )
                    }
                  </span>
                  <span className={
                    monthMatrix[i][j] === 1 ? "far fa-check-circle fa-lg" : (
                      monthMatrix[i][j] === 2 ? "fas fa-check-circle fa-lg" : ""
                    )
                  }></span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      rows.push(<div className="columns is-mobile" key={i + 1}>{columns}</div>);
    }
    return rows;
  }

  return (
    <div>
      <div className="columns is-mobile">
        <div className="column is-4">
          <div className="buttons has-addons">
            <button className="button is-primary" onClick={previousMonth}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="button is-light" onClick={resetToToday}>
              Today
            </button>
            <button className="button is-primary" onClick={nextMonth}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="column is-4">
          <h1 className="title is-2">{dayjs().add(increment, 'month').format('MMMM YYYY')}</h1>
        </div>
        <div className="column is-4">
          <div className="buttons is-right">
            <button className="button" disabled={expectedLeave.length === 0} onClick={openNewLeaveModal}>
              <i className="fas fa-pencil-alt fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
      {createCards()}
      <div className={"modal" + (isLeaveModalOpen ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Request Time Off</p>
            <button className="delete" aria-label="close" onClick={closeLeaveModal}></button>
          </header>
          <section className="modal-card-body">
            <form id="leaveForm" onSubmit={handleSubmit(updateLeave)}>
              <div className="field">
                <label className="label">When</label>
                <div className="control">
                  <ul>{getValues("when") && getValues("when").map((period, index) => (
                    <li key={index}>
                      {period.includes("~")
                        ? dayjs(period.split("~")[0]).format("dddd, MMMM D, YYYY") + "~" + dayjs(period.split("~")[1]).format("dddd, MMMM D, YYYY")
                        : dayjs(period).format("dddd, MMMM D, YYYY")
                      }
                    </li>
                  ))
                  }</ul>
                  <input type="hidden" className="input" {...register("when")} />
                </div>
              </div>
              <div className="field">
                <label className="label">Leave Type</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select disabled={isDeleteLeaveModal} {...register("leaveType")}>
                      {leaveTypes.map(type =>
                        <option key={type} value={type}>{type}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Comment</label>
                <div className="control">
                  <textarea className="textarea" disabled={isDeleteLeaveModal} {...register("comment")} />
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            {!isDeleteLeaveModal &&
              <button className="button is-success submit" form="leaveForm">Submit</button>
            }
            {isDeleteLeaveModal &&
              <button className="button is-danger" form="leaveForm" id="delete_leave_btn">Delete</button>
            }
            <button className="button" onClick={closeLeaveModal}>Cancel</button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MonthView;