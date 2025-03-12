import jwt from "jsonwebtoken";

export const generateToken = (data: Object): string => {
  const token: string = jwt.sign(data, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const generateOTP = (): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const generateMsg = (otp: string) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>رمز التحقق</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          direction: rtl;
          text-align: center;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(45deg, #4caf50, #8bc34a);
          padding: 20px;
          color: white;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #4caf50;
          margin: 20px 0;
        }
        .footer {
          background: #f1f1f1;
          padding: 10px;
          font-size: 14px;
          color: #555;
        }
        .footer a {
          color: #4caf50;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          مرحباً بك في <strong>[ Play Finder ]</strong>
        </div>
        <div class="content">
          <p>لقد طلبت رمز تحقق لتأكيد حسابك.</p>
          <p>رمز التحقق الخاص بك هو:</p>
          <div class="otp-code">${otp}</div>
          <p>يرجى إدخال هذا الرمز لإكمال عملية التحقق.</p>
        </div>
        <div class="footer">
          إذا كنت بحاجة إلى أي مساعدة، يمكنك <a href="https://wa.me/201024792084" target="_blank">التواصل معنا عبر واتساب</a>.
          <br>
          &copy; 2025 [ Play Finder ]. جميع الحقوق محفوظة.
        </div>
      </div>
    </body>
    </html>
    `;
  return htmlTemplate;
};

export const arabicToEnglishDays = (arabicDay: string): string | null => {
  const dayMapping: { [key: string]: string } = {
    "الأحد": "sunday",
    "الاثنين": "monday",
    "الثلاثاء": "tuesday",
    "الأربعاء": "wednesday",
    "الخميس": "thursday",
    "الجمعة": "friday",
    "السبت": "saturday",
  };

  return dayMapping[arabicDay] || null; // Return null if the day is not found
};
