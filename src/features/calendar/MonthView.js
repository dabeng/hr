import React from "react";

import dayjs from 'dayjs';

import styles from "./MonthView.module.scss";

const MonthView = () => {

  const createCards = () => {
    let rows = [];
    for (var i = 0; i < 7; i++) {
      let columns = [];
      for (var j = 0; j < 7; j++) {
        columns.push(<div className={`column ${styles.card}`} key={7 * i + j}>
          <div className="card">
            <div className="card-content">
              <div className="content">
                {7 * i + j + 1}
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

export default MonthView;