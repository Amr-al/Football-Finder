import { Pitch } from "../models/models";

export const fakePitches: Pitch[] = [
  {
    id: 1,
    name: "ملعب كرة القدم في الزمالك",
    location: "الزمالك",
    imgs: [
      "/src/assets/pic1.jpg",
      "/src/assets/pic2.jpg",
      "/src/assets/pic2.jpg",
      "/src/assets/pic2.jpg",
    ],
    rating: 5,
    description:
      "ملعب عالي الجودة مع إضاءة ليلية ممتازة وأرضية عشبية صناعية. مثالي لمباريات كرة القدم مع الأصدقاء أو الفرق المحترفة.",
    comments: [
      {
        id: 1,
        author: { id: 1, first_name: "Nourhan", last_name: "Nourhan" },
        content: "Great!",
        rating: 5,
      },
      {
        id: 2,
        author: { id: 1, first_name: "anon", last_name: "user" },
        content: "bad",
        rating: 2,
      },
    ],
  },
  {
    id: 2,
    name: "ملعب كرة السلة في المعادي",
    location: "المعادي",
    imgs: [],
    rating: 3,
    description:
      "ملعب كرة سلة بأسعار معقولة مع شبكات جديدة وأرضية آمنة. مناسب للعب العائلي أو التدريبات.",
    comments: [],
  },
  {
    id: 3,
    name: "ملعب التنس في القاهرة",
    location: "القاهرة",
    imgs: [],
    rating: 5,
    description:
      "ملعب تنس فاخر مع خدمات متكاملة مثل مدربين محترفين ومقاعد استراحة مريحة. مثالي للمحترفين والمبتدئين.",
    comments: [],
  },
  {
    id: 4,
    name: "ملعب كرة القدم في الجيزة",
    location: "الجيزة",
    imgs: [],
    rating: 4,
    description:
      "ملعب واسع مع إمكانية استضافة مباريات كبيرة. يتوفر موقف سيارات ومرافق نظيفة.",
    comments: [],
  },
  {
    id: 5,
    name: "ملعب كرة السلة في 6 أكتوبر",
    location: "6 أكتوبر",
    imgs: [],
    rating: 2,
    description:
      "ملعب بسيط مع إضاءة ليلية محدودة. يحتاج إلى بعض التحسينات في المرافق.",
    comments: [],
  },
  {
    id: 6,
    name: "ملعب كرة القدم في مدينة نصر",
    location: "مدينة نصر",
    imgs: [],
    rating: 4,
    description:
      "ملعب حديث مع عشب صناعي عالي الجودة وإضاءة قوية. يتوفر خدمة تأجير معدات رياضية.",
    comments: [],
  },
  {
    id: 7,
    name: "ملعب كرة اليد في الإسكندرية",
    location: "الإسكندرية",
    imgs: [],
    rating: 3,
    description:
      "ملعب متعدد الأغراض يمكن استخدامه لكرة اليد أو كرة القدم. يتوفر مكان لتغيير الملابس.",
    comments: [],
  },
  {
    id: 8,
    name: "ملعب كرة الطائرة في شرم الشيخ",
    location: "شرم الشيخ",
    imgs: [],
    rating: 5,
    description:
      "ملعب على الشاطئ مع إطلالة رائعة على البحر. مثالي للعب في الهواء الطلق مع الأصدقاء.",
    comments: [],
  },
  {
    id: 9,
    name: "ملعب كرة القدم في المنصورة",
    location: "المنصورة",
    imgs: [],
    rating: 4,
    description:
      "ملعب كبير مع عشب طبيعي وإضاءة ليلية. يتوفر كافيتيريا لتقديم المشروبات والوجبات الخفيفة.",
    comments: [],
  },
  {
    id: 10,
    name: "ملعب كرة السلة في أسيوط",
    location: "أسيوط",
    imgs: [],
    rating: 3,
    description:
      "ملعب بسيط مع شبكات جيدة وأرضية آمنة. مناسب للعب العائلي أو التدريبات.",
    comments: [],
  },
];
