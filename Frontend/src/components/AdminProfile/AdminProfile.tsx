import React, { useEffect, useState } from "react";
import styles from "./AdminProfile.module.scss";
import { useParams } from "react-router-dom";
import { config } from "../../constants/apiConfig";
import { PitchDetails } from "../../models/models";
import { CircularProgress } from "@mui/material";

const AdminProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pitchDetails, setPitchDetails] = useState<PitchDetails>(
    {} as PitchDetails
  );
  const [submitting, setSubmitting] = useState(false); // State for loading spinner
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const daysOfWeek = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPitchDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // Ensure files are selected

    // Clean up previously created URLs to avoid memory leaks
    selectedImages.forEach((url) => URL.revokeObjectURL(url));

    // Update the state with newly selected images
    const newImageURLs = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );

    setSelectedImages(newImageURLs); // Update the preview URLs in state
    setPitchDetails((prevDetails) => ({
      ...prevDetails,
      images: e.target.files ? Array.from(e.target.files) : [], // Store the File objects for form submission
    }));
  };

  const handleDayToggle = (day: string) => {
    if (pitchDetails.availableDays.length > 0) {
      setPitchDetails((prev) => {
        const updatedDays = prev.availableDays.some((d) => d.date === day)
          ? prev.availableDays.filter((d) => d.date !== day)
          : [...prev.availableDays, { date: day, times: [] }];
        return { ...prev, availableDays: updatedDays };
      });
      return;
    }
    setPitchDetails((prev) => {
      return { ...prev, availableDays: [{ date: day, times: [] }] };
    });
  };

  const handleTimeChange = (day: string, time: string) => {
    setPitchDetails((prev) => {
      const updatedDays = prev.availableDays.map((d) => {
        if (d.date === day) {
          const updatedTimes = d.times.includes(time)
            ? d.times.filter((t) => t !== time)
            : [...d.times, time];
          return { ...d, times: updatedTimes };
        }
        return d;
      });
      return { ...prev, availableDays: updatedDays };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", pitchDetails.name);
    formData.append("description", pitchDetails.description);
    formData.append("address", pitchDetails.address);
    formData.append("size", pitchDetails.size);
    formData.append("price", pitchDetails.price);

    // Append each file to FormData
    if (pitchDetails.images && pitchDetails.images.length > 0) {
      for (const file of pitchDetails.images) {
        formData.append("images", file);
      }
    }

    formData.append(
      "availableDays",
      JSON.stringify(pitchDetails.availableDays)
    );

    const response = await fetch(`${config.pitch.updatePitch}${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    const data = await response.json();

    if (data.status == "success") {
      setPitchDetails(data.playground);
      window.location.reload();
    } else {
      console.error("Failed to update pitch:", data.message);
    }
  };

  const getPitch = async () => {
    setLoading(true);
    const res = await fetch(`${config.pitch.getPitch}${id}`);
    const data = await res.json();
    if (data.status === "success") {
      setPitchDetails(data.playground);
      setSelectedImages(data.playground.images);
      setFetched(true);
      setLoading(false);
    } else {
      setFetched(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    getPitch();
  }, []);
  if (!fetched && loading)
    return <div className="loading">{loading && <CircularProgress />}</div>;
  else if (!fetched && !loading)
    return <div className="noResults">{<p>الملعب غير موجود!</p>}</div>;

  return (
    <div className={styles.adminProfile}>
      <h1 className={styles.title}>تحديث تفاصيل الملعب</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name */}
        <div className={styles.formGroup}>
          <label htmlFor="name">اسم الملعب:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={pitchDetails.name}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="description">وصف الملعب:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={pitchDetails.description}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="address">المكان:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={pitchDetails?.address}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="size">الحجم:</label>
          <input
            type="text"
            id="size"
            name="size"
            value={pitchDetails?.size}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="price">السعر:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={pitchDetails?.price}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="images">رفع الصور:</label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={handleImageUpload}
            accept="image/*"
          />
          <div className={styles.imagePreview}>
            {selectedImages?.map((image: string, index: number) => (
              <img key={index} src={image} alt={`Uploaded ${index}`} />
            ))}
          </div>
          <label>الأيام المتاحة:</label>
          <div className={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                className={`${styles.dayButton} ${
                  pitchDetails.availableDays?.some((d) => d.date === day)
                    ? styles.active
                    : ""
                }`}
                onClick={() => handleDayToggle(day)}
              >
                {day}
              </button>
            ))}
          </div>
          <label>الأوقات المتاحة:</label>
          {pitchDetails.availableDays?.map((day) => (
            <div key={day.date} className={styles.timeSection}>
              <h3>{day.date}</h3>
              <div className={styles.timesGrid}>
                {/* First Column: 12 AM to 11 AM */}
                <div className={styles.timeColumn}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i < 10 ? `0${i}:00 am` : `${i}:00 am`;
                    return (
                      <button
                        key={hour}
                        type="button"
                        className={`${styles.timeButton} ${
                          day.times.includes(hour) ? styles.active : ""
                        }`}
                        onClick={() => handleTimeChange(day.date, hour)}
                      >
                        {hour}
                      </button>
                    );
                  })}
                </div>

                {/* Second Column: 12 PM to 11 PM */}
                <div className={styles.timeColumn}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour =
                      i + 12 < 10 ? `0${i + 12}:00 pm` : `${i + 12}:00 pm`;
                    return (
                      <button
                        key={hour}
                        type="button"
                        className={`${styles.timeButton} ${
                          day.times.includes(hour) ? styles.active : ""
                        }`}
                        onClick={() => handleTimeChange(day.date, hour)}
                      >
                        {hour}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <br />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting} // Disable the button when loading
        >
          {submitting ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} /> // Show spinner when loading
          ) : (
            "حفظ التغييرات"
          )}
        </button>{" "}
      </form>
    </div>
  );
};

export default AdminProfile;
