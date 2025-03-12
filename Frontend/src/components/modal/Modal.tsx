import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Modal.scss";
import { config } from "../../constants/apiConfig";
import { useGlobalState } from "../../context/GlobalStateContext";
import { jwtDecode } from "jwt-decode";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  type: "sign-in" | "sign-up" | undefined;
}

const Modal: React.FC<ModalProps> = ({ showModal, closeModal, type }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setFullName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State for loading spinner
  const { setUser } = useGlobalState();

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
      setError("");
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, closeModal]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhoneNumber(value);

      const validPrefixes = ["010", "011", "012", "015"];
      const isPhoneValid =
        value.length === 11 && validPrefixes.includes(value.substring(0, 3));

      if (!isPhoneValid && value.length > 0) {
        setError(
          "رقم الهاتف يجب أن يبدأ بـ 010، 011، 012، أو 015 ويتكون من 11 رقمًا."
        );
      } else {
        setError("");
      }
    }
  };

  const handleSignUp = async () => {
    setLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      const res = await fetch(config.user.signUp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          password,
        }),
      });

      if (res.ok) {
        navigate("/verify-otp");
        closeModal();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      const res = await fetch(config.user.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const curUser = jwtDecode(data.token);
        setUser(curUser);
        localStorage.setItem("token", data.token);

        const decodedToken = jwtDecode(data.token);
        localStorage.setItem("tokenBody", JSON.stringify(decodedToken));

        closeModal();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (type === "sign-up" && !name.match(/^[a-zA-Z]+\s[a-zA-Z]+$/)) {
      setError("الاسم الثنائي يجب أن يتكون من كلمتين فقط.");
      return;
    }

    const validPrefixes = ["010", "011", "012", "015"];
    const isPhoneValid =
      phoneNumber.length === 11 &&
      validPrefixes.includes(phoneNumber.substring(0, 3));

    if (!isPhoneValid && type === "sign-up") {
      setError(
        "رقم الهاتف يجب أن يبدأ بـ 010، 011، 012، أو 015 ويتكون من 11 رقمًا."
      );
      return;
    }

    if (type === "sign-up") {
      await handleSignUp();
    } else {
      await handleLogin();
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="header">
          <button className="close" onClick={closeModal}>
            <MdClose />
          </button>
          <h2>{type === "sign-in" ? "تسجيل الدخول" : "إنشاء حساب"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {type === "sign-up" && (
            <div className="form-field">
              <label>الاسم الثنائي</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          {type === "sign-up" && (
            <div className="form-field">
              <label>رقم الهاتف</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
              />
            </div>
          )}
          <div className="form-field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} /> // Show spinner when loading
            ) : type === "sign-in" ? (
              "تسجيل الدخول"
            ) : (
              "إنشاء حساب"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
