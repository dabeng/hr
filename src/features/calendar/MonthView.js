import React from "react";

import dayjs from 'dayjs';

import styles from "./MonthView.module.scss";

const MonthView = () => {

  const createCards = () => {
    let rows = [];
    rows.push(
      <div className="columns is-mobile">
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
    for (let i = 0; i < 7; i++) {
      let columns = [];
      for (let j = 0; j < 7; j++) {
        columns.push(
          <div className={`column ${styles.column}`} key={j}>
            <div className="card">
              <div className="card-content">
                <div className="content">
                  {7 * i + j + 1}
                </div>
              </div>
            </div>
          </div>
        );
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
            <button className="button is-primary">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="button is-light">
              Today
            </button>
            <button className="button is-primary">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="column is-8">
          <h1 className="title is-2">{dayjs().format('	MMMM YYYY')}</h1>
        </div>
      </div>
      {createCards()}
    </div>
  );
};

export default MonthView;