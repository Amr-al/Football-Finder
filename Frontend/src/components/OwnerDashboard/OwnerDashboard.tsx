import React, { useEffect, useState } from "react";
import styles from "./OwnerDashboard.module.scss";
import { Line } from "react-chartjs-2";
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
import { CircularProgress, Pagination } from "@mui/material";
import { config } from "../../constants/apiConfig";
import { useGlobalState } from "../../context/GlobalStateContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Booking {
  _id: string;
  playgroundId: {
    _id: string;
    name: string;
    address: string;
    size: string;
    price: number;
    description: string;
    images: string[];
    ownerId: string;
    reviews: any[];
    suspended: boolean;
    availableDays: {
      date: string;
      times: string[];
      _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  date: string;
  time: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const OwnerDashboard: React.FC = () => {
  const { user } = useGlobalState();
  const [error, setError] = useState("");
  const [earnings, setEarings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  ); // Track the selected booking for confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Control modal visibility
  const [meta, setMeta] = useState({ total_pages: 1, page: 1 });
  const [page, setPage] = useState(1);

  const fetchBookings = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${config.user.ownerBookings}/?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setMeta(data.meta);
        setEarings(data.earnings);
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
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    fetchBookings(value);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`${config.user.updateStatus}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bookingId: bookingId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      } else {
        const data = await res.json();
        setError(data.message || "فشل تحديث الحالة. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحديث الحالة. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleContactPlayer = (phoneNumber: string) => {
    const formattedPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    window.open(`https://wa.me/${formattedPhoneNumber}`, "_blank");
  };

  const handleConfirmStatusUpdate = (bookingId: string) => {
    setSelectedBookingId(bookingId); // Set the selected booking ID
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const handleConfirm = () => {
    if (selectedBookingId) {
      updateStatus(selectedBookingId, "تم التأكيد"); // Update the status
      setIsConfirmModalOpen(false); // Close the modal
      setSelectedBookingId(null); // Reset the selected booking ID
    }
  };

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false); // Close the modal
    setSelectedBookingId(null); // Reset the selected booking ID
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
                <th>تواصل مع اللاعب</th>
                <th>المطلوب دفعه</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.playgroundId.name}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>
                    {booking.status !== "تم التأكيد" ? (
                      <button
                        className={styles.confirm}
                        onClick={() => handleConfirmStatusUpdate(booking._id)}
                      >
                        تأكيد
                      </button>
                    ) : (
                      "تم التأكيد"
                    )}
                  </td>
                  <td>{booking.price} جنية</td>
                  <td>
                    <button
                      className={styles.contactButton}
                      onClick={() =>
                        handleContactPlayer(booking.userId.phoneNumber)
                      }
                    >
                      تواصل
                    </button>
                  </td>
                  <td>{booking.price * 0.1} جنية</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            count={meta?.total_pages} // Total number of pages
            page={page} // Current page
            onChange={handlePageChange} // Handle page change
            className={styles.pagination}
          />
        </>
      )}

      {/* Inline Confirm Modal */}
      {isConfirmModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>هل تريد تأكيد الحجز؟</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirmButton} onClick={handleConfirm}>
                تأكيد
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCloseModal}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className={styles.noResults}>لا توجد حجوزات</div>
      )}
    </div>
  );
};

export default OwnerDashboard;
