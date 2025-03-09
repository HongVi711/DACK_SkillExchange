import React from "react";
import styles from "./Card.module.css";
function Card({ title, features }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div className={styles.feature} key={index}>
            <span className={styles.featureStep}>{feature.step}</span>
            <h3 className={styles.featureHeading}>{feature.heading}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Card;
