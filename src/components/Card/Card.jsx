/* eslint-disable react/prop-types */

// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Card.module.css';
// eslint-disable-next-line react/prop-types
function Card({ title, features }){
    return (
        <div className={styles.container}>
          <h2 className={styles.heading}>{title}</h2>
          <div className={styles.grid}>
            {features.map((feature, index) => (
              <div className={styles.feature} key={index}>
                {/* <i className={`fas ${feature.icon}`}></i> */}
                <span className={styles.featureStep}>{feature.step}</span>
                <h3 className={styles.featureHeading}>{feature.heading}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    // return(
    //     <div className={styles.container}>   
    //         <h2 className={styles.heading}>Tại sao chọn Skill Exchange?</h2>
    //         <div className={styles.grid}>
    //             <div className={styles.feature}>
    //                 <i className="fas fa-users"></i>
    //                 <h3 className={styles.featureHeading}>Kết nối</h3>
    //                 <p className={styles.featureDescription}>Gặp gỡ những người có cùng đam mê.</p>
    //             </div>
    //             <div className={styles.feature}>
    //                 <i className="fas fa-calendar-check"></i>
    //                 <h3 className={styles.featureHeading}>Lịch học linh hoạt</h3>
    //                 <p className={styles.featureDescription}>Tự do sắp xếp thời gian học phù hợp.</p>
    //             </div>
    //             <div className={styles.feature}>
    //                 <i className="fas fa-star"></i>
    //                 <h3 className={styles.featureHeading}>Đánh giá chất lượng</h3>
    //                 <p className={styles.featureDescription}>Hệ thống nhận xét giúp cải thiện trải nghiệm.</p>
    //             </div>
    //             <div className={styles.feature}>
    //                 <i className="fas fa-brain"></i>
    //                 <h3 className={styles.featureHeading}>Gợi ý thông minh</h3>
    //                 <p className={styles.featureDescription}>Tìm người phù hợp nhanh chóng.</p>
    //             </div>
    //         </div>
    //     </div >      
    // );
}
export default Card;