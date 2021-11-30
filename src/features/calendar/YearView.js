import React from "react";

import dayjs from 'dayjs';

import styles from "./YearView.module.scss";

const YearView = () => {
  const createCards = () => {
    let rows = [];
    for (var i = 0; i < 12; i++) {
      let columns = [];
      for (var j = 0; j < 32; j++) {
        if (j===0) {
          columns.push(<div className={`column ${styles.column}`} key={j}>
          <div className="card">
            <div className={`card-content ${styles.card_content}`}>
              <div className="content">
                {i + 1}
              </div>
            </div>
          </div>
        </div>);
        } else if (j > dayjs().month(i).daysInMonth()) {
          columns.push(<div className={`column ${styles.column}`} key={j}>
          <div className="card">
            <div className={`card-content ${styles.card_content}`}>
              <div className="content">
                {"0"}
              </div>
            </div>
          </div>
        </div>);
        } else {
          columns.push(<div className={`column ${styles.column}`} key={j}>
          <div className="card">
            <div className={`card-content ${styles.card_content}`}>
              <div className="content">
                {j}
              </div>
            </div>
          </div>
        </div>);
        }

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