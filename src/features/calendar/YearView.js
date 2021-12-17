import React, { useState, useEffect } from "react";

import dayjs from 'dayjs';

import LeaveService from "../core/leave.service";

import styles from "./YearView.module.scss";

const YearView = () => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const [increment, setIncrement] = useState(0);
  // 0代表未请假，1代表已请假
  const [yearMatrix, setYearMatrix] = useState(Array.from({ length: 12 }, () => Array.from({ length: 32 }, () => 0)));

  // 在浏览不同月份的时候，标识出该月份的请假情况
  useEffect(() => {
    // 从localStorage里读出假期数组
    const leave = LeaveService.getLeave();
    // 遍历年历中的所有单元格，落在假期里的，标识出来
    setYearMatrix(Array.from({ length: 12 }, (e, i) => {
      return Array.from({ length: 32 }, (e, j) => {
        const daysInMonth = dayjs().add(increment, 'year').month(i).daysInMonth();
        // 对于月份单元格，占位单元格，要返回无意义的枚举值
        if (j === 0 || j > daysInMonth) {
          return undefined;
        }
        const day = dayjs().add(increment, 'year').month(i).date(j).format('YYYY-MM-DD');
        return leave.some(l => {
          return l.when.some(period => {
            if (period.includes('~')) {
              return day >= period.split('~')[0] && day <= period.split('~')[1];
            } else {
              return day === period;
            }
          });
        }) ? 1 : 0;
      });
    }));
  }, [increment]);
  
  const resetToToday = e => {
    setIncrement(0);
  };

  const previousYear = e => {
    setIncrement(prev => prev - 1);
  };

  const nextYear = e => {
    setIncrement(prev => prev + 1);
  };

  const createCards = () => {
    let rows = [];
    for (let i = 0; i < 12; i++) {
      let columns = [];
      let daysInMonth = dayjs().add(increment, 'year').month(i).daysInMonth();
      for (let j = 0; j < 32; j++) {
        columns.push(<div className={`column ${styles.column}`} key={j}>
          <div className={
            "card"
            + (j === 0 ? " " + styles.month_card : "")
            + (j > daysInMonth ? " " + styles.placeholder : "")
            + (increment === 0 && dayjs().month() === i && dayjs().date() === j ? " " + styles.today_card : "")
          }>
            <div className={`card-content ${styles.card_content}`}>
              <div className={"content " + styles.content}>
                <span className={j === 0 ? styles.month_name : styles.date}>
                  {j === 0 ? monthNames[i] : (j > daysInMonth ? 0 : j)}
                </span>
                <span className={
                  styles.status +
                  (yearMatrix[i][j] === 1 ? " fas fa-check-circle fa-xs" : "")
                }></span>
              </div>
            </div>
          </div>
        </div>);
      }
      rows.push(<div className="columns is-mobile" key={i}>{columns}</div>);
    }
    return rows;
  }

  return (
    <div>
      <div className="columns is-mobile">
        <div className="column is-4">
          <div className="buttons has-addons">
            <button className="button is-primary" onClick={previousYear}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="button is-light" onClick={resetToToday}>
              Today
            </button>
            <button className="button is-primary" onClick={nextYear}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="column is-8">
          <h1 className="title is-2">
            {dayjs().add(increment, 'year').year()}
          </h1>
        </div>
      </div>
      {createCards()}
    </div>
  );
};

export default YearView;