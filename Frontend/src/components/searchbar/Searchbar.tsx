import React, { useState } from "react";
import styles from "./Searchbar.module.scss";
import { Link, useNavigate } from "react-router-dom";

interface Field {
  id: number;
  name: string;
  location: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Field[]>([]);
  const navigate = useNavigate();
  const fields: Field[] = [
    { id: 1, name: "ملعب كرة القدم في الزمالك", location: "الزمالك" },
    { id: 2, name: "ملعب كرة السلة في المعادي", location: "المعادي" },
    { id: 3, name: "ملعب التنس في القاهرة", location: "القاهرة" },
    { id: 4, name: "ملعب كرة القدم في الجيزة", location: "الجيزة" },
    { id: 5, name: "ملعب كرة السلة في 6 أكتوبر", location: "6 أكتوبر" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      setFilteredData(
        fields.filter(
          (item) =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.location.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredData([]);
    }
  };

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = () => {
    if (query) navigate(`/pitches?query=${encodeURIComponent(query)}`);
    else navigate("/pitches");
  };

  return (
    <div className={styles.searchContainer}>
      <img
        src="src/assets/pic3.jpg"
        alt="Background"
        className={styles.backgroundImage}
      />
      <div className={styles.overlay}>
        <div className={styles.backgroundText}>
          اعرض الملاعب، تحقق من المواعيد المتاحة، واحجز فورًا عبر موقعنا
        </div>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="ابحث باسم الملعب أو المكان"
              onClick={handleClick}
              className={styles.searchInput}
            />
            <button
              className={styles.searchButton}
              onClick={() => handleSearch()}
            >
              بحث
            </button>
          </div>
          <button
            className={styles.searchButtonMobile}
            onClick={() => handleSearch()}
          >
            بحث
          </button>
        </div>

        <h4 className={styles.subscribe}>
          لتسجيل ملعبك تواصل معنا{" "}
          <a
            href="https://wa.me/01024792084"
            target="_blank"
            style={{ color: "#28A745" }}
          >
            عبر واتساب
          </a>
        </h4>
      </div>
    </div>
  );
};

export default SearchBar;
