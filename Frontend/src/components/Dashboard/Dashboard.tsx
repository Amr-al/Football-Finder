import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CircularProgress } from "@mui/material";
import { config } from "../../constants/apiConfig";
import { useGlobalState } from "../../context/GlobalStateContext";
import { Booking } from "../../models/models";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard: React.FC = () => {
  const { user } = useGlobalState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    setLoading(true);
    const url =
      user?.role === "owner"
        ? config.user.ownerBookings
        : config.user.userBookings;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setLoading(false);
      } else {
        const data = await res.json();
        setError(data.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleContactPitch = (pitchName: string) => {
    alert(`تواصل مع ${pitchName}`);
  };

  return (
    <div className={styles.userDashboard}>
      <h1>لوحة التحكم</h1>
      <br />

      <div className="loading">{loading && <CircularProgress />}</div>

      {bookings.length > 0 && !loading && (
        <>
          <table className={styles.userDashboardTable}>
            <thead>
              <tr>
                <th>الملعب</th>
                <th>تاريخ الحجز</th>
                <th>الوقت</th>
                <th>حالة الحجز</th>
                <th>المبلغ</th>
                <th>تواصل مع الملعب</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking?._id}>
                  <td>{booking?.playgroundId.name}</td>
                  <td>{booking?.date}</td>
                  <td>{booking?.time}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[
                          booking?.status === "قيد الانتظار"
                            ? "pending"
                            : booking?.status === "تم التأكيد"
                            ? "confirmed"
                            : "cancelled"
                        ]
                      }`}
                    >
                      {booking?.status}
                    </span>
                  </td>
                  <td>{booking?.price} جنية</td>
                  <td>
                    <button
                      className={styles.contactButton}
                      onClick={() =>
                        handleContactPitch(booking?.playgroundId.name)
                      }
                    >
                      تواصل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!loading && bookings.length === 0 && (
        <div className={styles.noResults}>لا توجد حجوزات</div>
      )}
    </div>
  );
};

export default UserDashboard;
