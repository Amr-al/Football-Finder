import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pitch } from "../../models/models";
import "./PitchDetails.scss";
import Booking from "../booking/Booking";
import { CircularProgress, Rating } from "@mui/material";
import { config } from "../../constants/apiConfig";
import { useGlobalState } from "../../context/GlobalStateContext";

const PitchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState<Pitch>();
  const { user } = useGlobalState();
  const [newComment, setNewComment] = useState<string>("");
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const toggleBookingModal = () => {
    setIsBookingModalOpen((prev) => !prev);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleRatingChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    setUserRating(newValue);
  };

  const handleSubmitComment = async () => {
    if (newComment.trim() && userRating !== null) {
      const res = await fetch(`${config.pitch.addReview}${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ comment: newComment, rating: userRating }),
      });
      const data = await res.json();
      if (data.status == "success") {
        pitch?.reviews.push(data.review);
      }
      setNewComment("");
      setUserRating(null);
    }
  };

  const handleImageClick = (image: string) => {
    setModalImage(image);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleEditClick: () => void = () => {
    navigate(`/admin-profile/${id}`, { replace: true });
  };
  const fetchPitch = async () => {
    setLoading(true);
    const res = await fetch(`${config.pitch.getPitch}${id}`);
    const data = await res.json();
    if (data.status === "success") {
      setPitch({ ...data.playground, avgRating: data.avgRating });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPitch();
  }, []);

  if (!pitch && !loading) {
    return <p className="noResults">لم يتم العثور على الملعب.</p>;
  }

  return (
    <>
      {loading ? (
        <div className="loading">{loading && <CircularProgress />}</div>
      ) : (
        <div className="container">
          <div className="pitch-header">
            <h1 className="title">{pitch?.name}</h1>
            <div className="btns">
              {user && (
                <button className="button" onClick={() => toggleBookingModal()}>
                  احجز
                </button>
              )}
              {user?.id == pitch?.ownerId && (
                <button
                  className="button edit"
                  onClick={() => handleEditClick()}
                >
                  تعديل
                </button>
              )}
            </div>
          </div>
          <p className="location">
            <b>العنوان</b>: {pitch?.address}
          </p>
          <p className="location">
            <b>الوصف</b>: {pitch?.description}
          </p>

          <p className="rating">
            <b>تقييم الملعب</b>:
            <Rating
              name="read-only"
              value={Number(pitch?.averageRating.toFixed(2))}
              readOnly
            />
          </p>

          <div className="images-section">
            <h2 className="subheading">صور الملعب</h2>
            <div className="slider-container">
              {Array.isArray(pitch?.images) && pitch.images.length > 0 ? (
                pitch?.images.map((img, index) => (
                  <div
                    className="slider-item"
                    key={index}
                    onClick={() => handleImageClick(img)}
                  >
                    <img
                      src={img}
                      alt={`Pitch ${index + 1}`}
                      className="image"
                    />
                  </div>
                ))
              ) : (
                <p className="no-comments">لا توجد صور للملعب.</p>
              )}
            </div>
          </div>

          {modalImage && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div
                className="modal-pic-content"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={modalImage}
                  alt="Full-size pitch"
                  className="modal-image"
                />
                <button className="close-modal" onClick={handleCloseModal}>
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="comments-section">
            <h2 className="subheading">التعليقات</h2>
            {pitch?.reviews?.length && pitch.reviews.length > 0 ? (
              <ul className="comments-list">
                {pitch?.reviews.map((comment) => (
                  <li key={comment.id} className="comment">
                    <div className="comments-header">
                      <strong className="author">{comment.user?.name}</strong>
                      <div className="comment-rating">
                        <Rating
                          name="comment-rating"
                          value={comment.rating}
                          readOnly
                        />
                      </div>
                    </div>
                    <div>{comment.comment}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-comments">لا توجد تعليقات.</p>
            )}

            <div className="write-comment">
              <textarea
                value={newComment}
                onChange={handleCommentChange}
                placeholder="اكتب تعليق..."
                className="comment-input"
              />
              <div className="rating-input">
                <Rating
                  name="user-comment-rating"
                  value={userRating}
                  onChange={handleRatingChange}
                />
              </div>
              <button onClick={handleSubmitComment} className="button">
                إضافة
              </button>
            </div>
          </div>

          <Booking
            showModal={isBookingModalOpen}
            closeModal={toggleBookingModal}
            name={pitch?.name || ""}
            id={pitch?._id || ""}
          />
        </div>
      )}
    </>
  );
};

export default PitchDetails;
