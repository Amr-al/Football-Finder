import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import "./Booking.scss";
import { useNavigate } from "react-router-dom";
import {
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { config } from "../../constants/apiConfig";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  id: string;
  name: string;
}

const Booking: React.FC<ModalProps> = ({ showModal, closeModal, name, id }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availabletimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State for loading spinner

  let times = Array.from({ length: 12 }, (_, i) => {
    return i < 10 ? `0${i}:00 ص` : `${i}:00 ص`;
  });
  Array.from({ length: 12 }, (_, i) => {
    times.push(i < 10 ? `0${i}:00 م` : `${i}:00 م`);
  });

  const handleChange = (event: SelectChangeEvent<string[] | unknown>) => {
    setSelectedTime(event.target.value as string[]);
  };

  const handleChangeDate = async (e: any) => {
    setSelectedDate(e.target.value);
    const res = await fetch(
      `${config.Booking.getAvailableTimes}${id}/${e.target.value}`
    );
    const data = await res.json();
    if (data.status == "success") {
      setAvailableTimes(data.availableTimes);
    } else {
      // setError(data.message)
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, closeModal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("الرجاء اختيار التاريخ والوقت.");
      return;
    }
    setError("");
    setLoading(true); // Start loading

    try {
      const res = await fetch(`${config.Booking.bookPlayground + id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          times: selectedTime,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setShowSuccess(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        {!showSuccess && (
          <div>
            <div className="header">
              <button className="close" onClick={closeModal}>
                <MdClose />
              </button>
              <h2 className="title">حجز {name}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="date">اختار تاريخ:</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={handleChangeDate}
                />
              </div>
              {availabletimes ? (
                <div className="form-group">
                  <label>اختار وقت :</label>

                  <FormControl fullWidth>
                    <Select
                      labelId="time-selector-label"
                      multiple
                      value={selectedTime}
                      onChange={handleChange}
                      MenuProps={{
                        disablePortal: true, // Ensures dropdown stays within the modal
                      }}
                      renderValue={(selected) =>
                        (selected as string[]).join(", ")
                      }
                    >
                      {availabletimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          <Checkbox checked={selectedTime.includes(time)} />
                          <ListItemText primary={time} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              ) : (
                selectedDate && (
                  <p className="no-times-message">
                    لا يوجد مواعيد متاحة في هذا اليوم.
                  </p>
                )
              )}

              {error && (
                <p className="error-message" style={{ textAlign: "center" }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                type="submit"
                className="submit-button"
                disabled={loading} // Disable the button when loading
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} /> // Show spinner when loading
                ) : (
                  "إتمام الحجز"
                )}
              </button>
            </form>
          </div>
        )}
        {showSuccess && (
          <div className="success-dialog">
            <img className="success-img" src="/src/assets/accept.png" />
            <h2>تم الحجز بنجاح</h2>
            <p>سيتواصل معك الملعب عن طريق رقم هاتفك لتفاصيل الدفع</p>
            <div className="btns">
              <button
                className="submit-button"
                onClick={() => {
                  setShowSuccess(false);
                  closeModal();
                  navigate(`/dashboard`);
                }}
              >
                حجوزاتي
              </button>
              <button
                className="grey-button"
                onClick={() => {
                  setShowSuccess(false);
                  closeModal();
                }}
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
