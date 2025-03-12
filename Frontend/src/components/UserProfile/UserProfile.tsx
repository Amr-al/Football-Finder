import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.scss";
import { useGlobalState } from "../../context/GlobalStateContext";
import { jwtDecode } from "jwt-decode";
import { config } from "../../constants/apiConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material"; // Import CircularProgress

interface User {
  name: string;
  phoneNumber: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const { user, setUser } = useGlobalState();
  const [formData, setFormData] = useState<User>({
    name: user?.name,
    phoneNumber: user?.phoneNumber,
    email: user?.email,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [changeSuccess, setChangeSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false); // Loading state for saving profile
  const [loadingPassword, setLoadingPassword] = useState(false); // Loading state for changing password

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSave(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      const res = await fetch(config.user.updateProfile, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setChangeSuccess("تم تعديل الملف الشخصي بنجاح");
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setUser(jwtDecode(data.token));
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تعديل الملف الشخصي. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingSave(false); // Stop loading
      setIsEditing(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      const res = await fetch(config.user.changePassword, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (res.ok) {
        setChangeSuccess("تم تغيير كلمة المرور بنجاح");
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoadingPassword(false); // Stop loading
    }
  };

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem("token") as string));
  }, []);

  if (!user) {
    return <div className={styles.notFound}>المستخدم غير موجود!</div>;
  }

  return (
    <div className={styles.userProfile}>
      <h1 className={styles.title}>ملف المستخدم</h1>

      <div className={styles.card}>
        {isEditing ? (
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">الاسم </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData?.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">رقم الهاتف</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData?.phoneNumber || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loadingSave} // Disable the button when loading
            >
              {loadingSave ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} /> // Show spinner when loading
              ) : (
                "حفظ التغييرات"
              )}
            </button>
          </form>
        ) : isChangingPassword ? (
          <form onSubmit={handlePasswordSave} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">كلمة المرور الحالية</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">كلمة المرور الجديدة</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.editButton}
              disabled={loadingPassword} // Disable the button when loading
            >
              {loadingPassword ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} /> // Show spinner when loading
              ) : (
                "تغيير كلمة المرور"
              )}
            </button>
          </form>
        ) : (
          <div className={styles.profileView}>
            <h2 className={styles.sectionTitle}>البيانات الشخصية</h2>
            <p>
              <strong>الاسم :</strong> {user?.name}
            </p>
            <p>
              <strong>رقم الهاتف:</strong> {user?.phoneNumber}
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> {user?.email}
            </p>

            <div className={styles.buttonGroup}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                تعديل
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className={styles.changePasswordSmallButton}
              >
                تغيير كلمة المرور
              </button>
            </div>
            {changeSuccess && <p className={styles.success}>{changeSuccess}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
