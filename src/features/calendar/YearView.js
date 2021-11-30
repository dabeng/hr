import React from "react";

import dayjs from 'dayjs';

import styles from "./YearView.module.scss";

const YearView = () => {
  const createCards = () => {
    let rows = [];
    for (let i = 0; i < 12; i++) {
      let columns = [];
      let daysInMonth = dayjs().month(i).daysInMonth(); // 获取当前年份每个月的天数
      for (let j = 0; j < 32; j++) {
        columns.push(<div className={`column ${styles.column}`} key={j}>
          <div className={"card" + (j === 0 ? ` ${styles.month_card}` : "") + (j > daysInMonth ? ` ${styles.placeholder_card}` : "")}>
            <div className={`card-content ${styles.card_content}`}>
              <div className="content">
                {j === 0 ? i + 1 :
                  (j > daysInMonth ? 0 : j)
                }
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
      {createCards()}
    </div>
  );
};

export default YearView;