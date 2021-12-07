import React, { useState } from "react";

import dayjs from 'dayjs';
import { useForm } from "react-hook-form";
import LeaveService from "../core/leave.service";

import styles from "./MonthView.module.scss";

const MonthView = () => {
  const [increment, setIncrement] = useState(0);
  // 0代表为未选中，1代表被选中，2代表被占用请假，3代表被占用请假的日期的被选中状态
  const [monthMatrix, setMonthMatrix] = useState(Array.from({length: 6},() => Array.from({length: 7}, () => 0)));
  const [isNewLeaveModalOpen, setIsNewLeaveModalOpen] = useState(false);

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
    setIsNewLeaveModalOpen(true);
  };

  const closeNewLeaveModal = e => {
    setIsNewLeaveModalOpen(false);
  };

  const toggleDay = (row, column) => {
    const copy = [...monthMatrix];
    if (copy[row][column] === 0) {
      copy[row][column] = 1;
    } else if (copy[row][column] === 1) {
      copy[row][column] = 0;
    } else if (copy[row][column] === 2) {
      copy[row][column] = 3;
    } else {
      copy[row][column] = 2;
    }
    setMonthMatrix(copy);
  };

  const leaveTypes = ['Additional Time Off - Paid', 'Additional Time Off - Unpaid', 'Annual Leave', 'Sick Leave'];
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      beginDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      leaveType: 'Sick Leave',
      comment: ''
    }
  });

  const addLeave = (data) => {
    LeaveService.addLeave(data);
    setIsNewLeaveModalOpen(false);
  }

  const createCards = () => {
    let rows = [];
    rows.push(
      <div className="columns is-mobile" key={0}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((caption, i) =>
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
      let startDay = dayjs(dayjs().format(`YYYY-MM`)).day(); // 当前月份第一天是星期几
      let days = dayjs().add(increment, 'month').daysInMonth(); // 当前月份一共有多少天
      let previousDays = dayjs().add(increment-1, 'month').daysInMonth(); // 前一个月份一共有多少天
      for (let j = 0; j < 7; j++) {
        columns.push(
          <div className={`column ${styles.column}`} key={j}>
            <div
              className={
                "card"
                + (i * 7 + j < startDay ? " has-text-grey" : "")
                + ((i * 7 + j >= startDay && i * 7 + j <= startDay + days -1) ? " has-text-black" : "")
                + (i * 7 + j > startDay + days - 1 ? " has-text-grey" : "")
                + (i * 7 + j === dayjs().date() + startDay - 1 && increment === 0 ? " " + styles.today_card: "")
              }
              onClick={e => toggleDay(i, j)}
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
                      monthMatrix[i][j] === 2 ? "fas fa-check-circle" : ""
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
            <button className="button" onClick={openNewLeaveModal}>
              <i className="fas fa-pencil-alt fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
      {createCards()}
      <div className={"modal" + (isNewLeaveModalOpen ? " is-active" : "")}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Request Time Off</p>
            <button className="delete" aria-label="close" onClick={closeNewLeaveModal}></button>
          </header>
          <section className="modal-card-body">
            <form id="leaveForm" onSubmit={handleSubmit(addLeave)}>
              <div className="field">
                <label className="label">Begin Date</label>
                <div className="control">
                  <input type="date" className="input" {...register("beginDate", { required: true })}/>
                </div>
              </div>
              <div className="field">
                <label className="label">End Date</label>
                <div className="control">
                  <input type="date" className="input" {...register("endDate", { required: true })}/>
                </div>
              </div>
              <div className="field">
                <label className="label">Leave Type</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select {...register("leaveType")}>
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
                  <textarea className="textarea" {...register("comment")}/>
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success submit" form="leaveForm">Submit</button>
            <button className="button" onClick={closeNewLeaveModal}>Cancel</button>
          </footer>
       </div>
      </div>
    </div>
  );
};

export default MonthView;