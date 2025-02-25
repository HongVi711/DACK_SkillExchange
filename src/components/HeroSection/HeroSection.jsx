// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './HeroSection.module.css'; // Import CSS Modules

function HeroSection() {
  return (
    <section
      className={styles.heroSection} // section
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?team,learning')" }}
    >
       
      {/* <div className={styles.overlay}></div> */}
      <div className={styles.content}> {/* div : text-center text-white relative z-10 */}
        <h1 className={styles.heading}>Học hỏi. Chia sẻ. Kết nối.</h1>  {/* h1 : text-5xl font-bold */}
        <p className={styles.description}> {/* p : mt-4 text-lg */}
          Kết nối với những người có kỹ năng bạn muốn học. Không cần tiền, chỉ cần trao đổi!
        </p>
        <a href="#" className={styles.ctaButton}> {/* a: mt-6 inline-block bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-green-600 */}
          Tham gia ngay
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
