import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.title}>Skill Exchange Platform</h2>
          <p className={styles.text}>
            Kết nối và chia sẻ kỹ năng với mọi người. Học hỏi và phát triển bản
            thân mỗi ngày!
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Liên kết nhanh</h3>
          <ul className={styles.list}>
            <li>
              <a href="/" className={styles.link}>
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/search" className={styles.link}>
                Tìm kiếm kỹ năng
              </a>
            </li>
            <li>
              <a href="/calendar" className={styles.link}>
                Thời khoá biểu
              </a>
            </li>
            <li>
              <a href="/network" className={styles.link}>
                Bạn bè
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Theo dõi chúng tôi</h3>
          <div className={styles.icons}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.icon}
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copy}>
        <p>
          &copy; {new Date().getFullYear()} Skill Exchange. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
