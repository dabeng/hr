import React, { useState } from "react";

import dayjs from 'dayjs';

import styles from "./YearView.module.scss";

const YearView = () => {
  const [increment, setIncrement] = useState(0);

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
      <div className="columns is-mobile">
        <div className="column is-4">
          <div className="buttons has-addons">
            <button className="button is-primary" onClick={previousYear}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="button is-light">
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