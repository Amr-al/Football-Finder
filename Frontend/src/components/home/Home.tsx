import React, { useEffect } from "react";
import { FaCalendarAlt, FaFutbol } from "react-icons/fa";
import styles from "./Home.module.scss";
import SearchBar from "../searchbar/Searchbar";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const pitches = [
    {
      id: 1,
      name: "ملعب الزمالك",
      description: "ملعب كرة قدم في قلب الزمالك، مناسب للعب مع الأصدقاء.",
      image: "src/assets/pic1.jpg",
    },
    {
      id: 2,
      name: "ملعب 6 اكتوبر",
      description: "ملعب حديث بمدينة 6 أكتوبر، مجهز بأفضل المرافق.",
      image: "src/assets/pic2.jpg",
    },
    {
      id: 3,
      name: "ملعب المعادي - تنس",
      description: "ملعب تنس في المعادي، مثالي لعشاق التنس.",
      image: "src/assets/pic3.jpg",
    },
  ];

  const handlePitchClick = (id: number) => {
    navigate(`/pitch/${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#services") {
      const servicesSection = document.getElementById("services");

      if (servicesSection) {
        const offset = 30;
        const elementPosition = servicesSection.offsetTop;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else if (hash === "#contact-us") {
      const contactSection = document.getElementById("contact-us");

      if (contactSection) {
        const offset = 0;
        const elementPosition = contactSection.offsetTop;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }, [window.location.hash]);

  return (
    <div className={styles.homeContent}>
      <div className={styles.search}>
        <SearchBar />
      </div>
      <br />

      <h2 id="services" className={styles.title}>
        ابحث .. احجز .. العب
      </h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <FaFutbol className={styles.cardIcon} />
          <h2>ابحث عن الملاعب</h2>
          <p>
            استعرض قائمة الملاعب المتاحة في منطقتك بناءً على الموقع، النوع،
            والخدمات المقدمة.
          </p>
        </div>
        <div className={styles.card}>
          <FaCalendarAlt className={styles.cardIcon} />
          <h2>تحقق من المواعيد</h2>
          <p>
            تصفح المواعيد المتاحة لكل ملعب وتأكد من اختيار الوقت الأنسب لك
            ولأصدقائك.
          </p>
        </div>
        <div className={styles.card}>
          <FaFutbol className={styles.cardIcon} />
          <h2>احجز ملعبك الآن</h2>
          <p>قم بحجز ملعبك مباشرة من خلال منصتنا بسهولة وسرعة.</p>
        </div>
      </div>
      <br />
      <h2 className={styles.title}> أفضل الملاعب </h2>
      <div className={styles.pitches}>
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            className={styles.pitch}
            onClick={() => handlePitchClick(pitch.id)}
          >
            <img
              src={pitch.image}
              alt={pitch.name}
              className={styles.pitchImage}
            />
            <h2>{pitch.name}</h2>
            <p>{pitch.description}</p>
          </div>
        ))}
      </div>
      <br />
      <div className={styles["contact-us"]} id="contact-us">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
