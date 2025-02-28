import styles from './Footer.module.css';
function Footer() {
    return (
        <div className={styles.sidebar}>
            <h2>Sẵn sàng học hỏi kỹ năng mới ?</h2>
            <p>Tham gia ngay và kết nối với hàng nghìn người đang trao đổi kỹ năng</p>
            <a href="#" className={styles.ctaButton}>
                Đăng ký ngay
            </a>
        </div >
    );
}
export default Footer;