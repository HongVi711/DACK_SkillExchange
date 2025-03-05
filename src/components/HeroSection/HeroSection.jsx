// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './HeroSection.module.css';
import backgroundImage from "../../assets/banner.jpg";
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section
      className={styles.heroSection}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >


      {/* <div className={styles.overlay}></div> */}
      <div className={styles.content}> {/* div : text-center text-white relative z-10 */}
        <h1 className={styles.heading}>Học hỏi - Chia sẻ - Kết nối</h1>  {/* h1 : text-5xl font-bold */}
        <p className={styles.description}> {/* p : mt-4 text-lg */}
          Kết nối với những người có kỹ năng bạn muốn học. Không cần tiền, chỉ cần trao đổi!
        </p>
        <Link to="/login" className={styles.ctaButton}>
          Tham gia ngay
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
