export const config = {
  user: {
    login: "http://localhost:8000/api/users/login",
    signUp: "http://localhost:8000/api/users/create",
    confirmOTP: "http://localhost:8000/api/users/confirm",
    getUser: "http://localhost:8000/api/users/user",
    updateProfile: "http://localhost:8000/api/users/update",
    changePassword: "http://localhost:8000/api/users/changepass",
    getAll: "http://localhost:8000/api/playground/all",
    search: "http://localhost:8000/api/playground/search",
    userBookings: "http://localhost:8000/api/booking/userbookings",
    ownerBookings: "http://localhost:8000/api/booking/ownerbookings",
    adminDashboard: "http://localhost:8000/api/earning",
    updateStatus: "http://localhost:8000/api/booking/update",
    playgroundDetails: "http://localhost:8000/api/playground/single",
  },
  pitch: {
    getPitch: "http://localhost:8000/api/playground/single/",
    addReview: "http://localhost:8000/api/playground/addreview/",
    updatePitch: "http://localhost:8000/api/playground/update/",
  },
  Booking: {
    bookPlayground: "http://localhost:8000/api/booking/create/",
    getAvailableTimes: "http://localhost:8000/api/booking/availabletimes/",
  },
  Admin: {
    dashboard: "http://localhost:8000/api/earning/unpaid",
    ban: "http://localhost:8000/api/users/ban",
    update: "",
    confirmPaid:'http://localhost:8000/api/earning/pay'
  },
};
