import React from "react";
import { FaEnvelope, FaWhatsapp, FaFacebook } from "react-icons/fa";
import styles from "./Footer.module.scss"; // Create a new SCSS module for the footer

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <p>© 2025 Football Finder. جميع الحقوق محفوظة.</p>
      <div className={styles.footerLinks}>
        <a href="/home">الرئيسية</a>
        <a href="/pitches">الملاعب </a>
        <a href="/home#services">خدماتنا</a>
      </div>
      <div className={styles.contactIcons}>
        <a href="mailto:example@example.com" className={styles.iconLink}>
          <FaEnvelope className={styles.contactIcon} />
        </a>
        <a href="https://wa.me/1024792084" className={styles.iconLink}>
          <FaWhatsapp className={styles.contactIcon} />
        </a>
        <a href="https://www.facebook.com" className={styles.iconLink}>
          <FaFacebook className={styles.contactIcon} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
