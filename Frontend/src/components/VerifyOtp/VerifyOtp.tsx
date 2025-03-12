import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../constants/apiConfig";
import styles from "./VerifyOtp.module.scss";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material"; // Import CircularProgress

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State for modal visibility
  const [successMessage, setSuccessMessage] = useState<string>(""); // State for success message
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator

  const handleOtpVerification = async () => {
    setLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      const res = await fetch(config.user.confirmOTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          OTP: otp,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessMessage(data.message); // Set the success message
        setModalOpen(true); // Open the modal
      } else {
        setError(data.message); // Set the error message
      }
    } catch (err) {
      setError("حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>تحقق من رمز OTP</h2>
      <p className={styles.message}>
        الرجاء إدخال الرمز الذي تم إرساله إلى بريدك الإلكتروني
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="أدخل بريدك الإلكتروني"
        className={styles.input}
      />

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="أدخل رمز OTP"
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button
        onClick={handleOtpVerification}
        disabled={loading} // Disable the button when loading
        className={styles.button}
        sx={{
          backgroundColor: "#28a745", // Green color
          color: "#fff",
          "&:hover": {
            backgroundColor: "#218838", // Darker green on hover
          },
          "&:disabled": {
            backgroundColor: "#28a745", // Keep green color when disabled
            opacity: 0.7, // Reduce opacity when disabled
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} /> // Show spinner when loading
        ) : (
          "تحقق"
        )}
      </Button>

      {/* Success Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="success-modal-title" variant="h6" component="h2">
            تم بنجاح
          </Typography>
          <Typography id="success-modal-description" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#28a745", color: "#fff" }}
          >
            موافق
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default VerifyOtp;
