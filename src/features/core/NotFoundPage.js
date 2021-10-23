import React from "react";

import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {

  return (
    <div className={"columns is-mobile is-centered " + styles.error_wrapper}>
      <div className="column is-half">
        <h1 className="title is-1">Page not found</h1>
        <article className="message is-danger">
          <div className="message-body">
            This page may be private. You may be able to view it by logging in.
          </div>
        </article>
      </div>
    </div>
  );
};

export default NotFoundPage;
