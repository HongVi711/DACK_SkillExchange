// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './HeroSection.module.css'; // Import CSS Modules

function HeroSection() {
  return (
    <section
      className={styles.heroSection} // section
      style={{ backgroundImage: "url('https://s3-alpha-sig.figma.com/img/c416/60aa/3567969fab1471db54ed8e30b7430eeb?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Q3uArJ75B4OTt~1PKC6U2hkPKkCPB4P0lBzHKO0upWKgD8a05toWETo4OQKyj4ftsDmF2eOExPcJ2lEiiQfOgUyzuW3AVpDo13YgjjObwCIqQhP9YB2XVw7UTgSwO9myqo~2s6EoIJvtRt95skIAnMraRL3f-T2w0lS4pr1Qp1EK4sAFork81hbniiws4P2ZZB5AQ~NZQ~Y2xvaOBcapKee2bRqhSz1wYdKVsGbmXhihxx2bSSGtHKfrhZu50-v1sDRLB3a1TTCXCj75NhNy14IK03b3nleE54otVmWbSCdod5~Q6lM8znEBOdH~chqWPYTOJpppXlGM25p2ZU2p4w__')" }}
    >
       
      {/* <div className={styles.overlay}></div> */}
      <div className={styles.content}> {/* div : text-center text-white relative z-10 */}
        <h1 className={styles.heading}>Học hỏi - Chia sẻ - Kết nối</h1>  {/* h1 : text-5xl font-bold */}
        <p className={styles.description}> {/* p : mt-4 text-lg */}
          Kết nối với những người có kỹ năng bạn muốn học. Không cần tiền, chỉ cần trao đổi!
        </p>
        <a href="#" className={styles.ctaButton}>
          Tham gia ngay
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
