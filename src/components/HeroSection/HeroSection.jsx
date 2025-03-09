// eslint-disable-next-line no-unused-vars
import React from "react";
import styles from "./HeroSection.module.css"; // Import CSS Modules

function HeroSection() {
  return (
    <section
      className={styles.heroSection} // section
    >
      <div className={styles.content}>
        <h1 className={styles.heading}>Học hỏi. Chia sẻ. Kết nối.</h1>{" "}
        <p className={styles.description}>
          Kết nối với những người có kỹ năng bạn muốn học. Không cần tiền, chỉ
          cần trao đổi!
        </p>
        <a href="/profile" className={styles.ctaButton}>
          Cập nhật thông tin ngay
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
