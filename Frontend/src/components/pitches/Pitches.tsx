import React, { useState, useEffect } from "react";
import { CircularProgress, Pagination, Rating } from "@mui/material";
import { FaFutbol } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import styles from "./Pitches.module.scss";
import Footer from "../Footer/Footer";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { config } from "../../constants/apiConfig";

interface Pitch {
  _id: number;
  name: string;
  location: string;
  averageRating: number;
}

const Pitches: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [meta, setMeta] = useState({ total_pages: 1, page: 1 });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const itemsPerPage = 5;

  const fetchPitches = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${config.user.getAll}?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPitches(data.playgrounds);
        setMeta(data.meta);
        setLoading(false);
        setError("");
      } else {
        const data = await res.json();
        setError(data.message);
        setLoading(false);
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) handleSearch(1);
    else fetchPitches(1);
  }, []);

  const handleSearch = async (page: number) => {
    setLoading(true);

    if (!searchQuery) {
      fetchPitches(1);
      return;
    }

    try {
      const res = await fetch(
        `${config.user.search}?page=${page}&query=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPitches(data.playgrounds);
        setMeta(data.meta);
        setError("");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(meta?.page);
  }, []);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    if (searchQuery) {
      handleSearch(value);
    } else {
      fetchPitches(value);
    }
  };

  const handleClick = (id: number) => {
    navigate(`/pitch/${id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>الملاعب</h1>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <IoSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="ابحث عن ملعب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <CircularProgress />
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : pitches.length === 0 ? (
          <div className={styles.noPitchesFound}>
            <p>لا توجد ملاعب مطابقة للبحث.</p>
          </div>
        ) : (
          <>
            <ul className={styles.pitchList}>
              {pitches.map((pitch) => (
                <li
                  key={pitch._id}
                  className={styles.pitchItem}
                  onClick={() => handleClick(pitch._id)}
                >
                  <div className={styles.pitchContent}>
                    <FaFutbol className={styles.pitchIcon} />
                    <div className={styles.pitchDetails}>
                      <p className={styles.pitchName}>{pitch.name}</p>
                      <p className={styles.pitchLocation}>{pitch.location}</p>
                    </div>
                  </div>
                  <Rating
                    name="read-only"
                    className={styles.rating}
                    value={pitch.averageRating}
                    precision={0.5}
                    readOnly
                  />
                </li>
              ))}
            </ul>

            <Pagination
              count={meta?.total_pages} // Total number of pages
              page={page} // Current page
              onChange={handlePageChange} // Handle page change
              className={styles.pagination}
            />
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Pitches;
