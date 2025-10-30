import React from "react";
import styles from "./Hamster.module.css";

const HamsterLoader = () => {
  return (
    <div
      aria-label="Orange and tan hamster running in a metal wheel"
      role="img"
      className={styles.wheelAndHamster}
    >
      <div className={styles.wheel} />
      <div className={styles.hamster}>
        <div className={styles.hamsterBody}>
          <div className={styles.hamsterHead}>
            <div className={styles.hamsterEar} />
            <div className={styles.hamsterEye} />
            <div className={styles.hamsterNose} />
          </div>
          <div className={`${styles.hamsterLimbFr}`} />
          <div className={`${styles.hamsterLimbFl}`} />
          <div className={`${styles.hamsterLimbBr}`} />
          <div className={`${styles.hamsterLimbBl}`} />
          <div className={styles.hamsterTail} />
        </div>
      </div>
      <div className={styles.spoke} />
    </div>
  );
};

export default HamsterLoader;
