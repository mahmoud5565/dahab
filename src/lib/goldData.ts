import type { GoldPrices, GoldHistoryPoint, ChartPeriod } from "@/types";

// ===== Base prices (real approximate values for Egypt market) =====
const BASE_PRICES = {
  karat24: 3800,
  karat21: 3325,
  karat18: 2850,
  pound: 30400, // الجنيه الذهب = 8 جرام عيار 21
  dollar: 50.85,
};

// ===== Generate realistic price fluctuation =====
function addNoise(base: number, variance: number = 0.02): number {
  const noise = (Math.random() - 0.5) * 2 * variance;
  return Math.round(base * (1 + noise));
}

// ===== Generate mock current gold prices =====
export function generateCurrentPrices(): GoldPrices {
  const now = new Date().toISOString();

  const buy24 = addNoise(BASE_PRICES.karat24, 0.015);
  const buy21 = addNoise(BASE_PRICES.karat21, 0.015);
  const buy18 = addNoise(BASE_PRICES.karat18, 0.015);
  const buyPound = addNoise(BASE_PRICES.pound, 0.015);

  const change24 = addNoise(0, 0.5) - 0;
  const change21 = Math.round(change24 * (21 / 24));
  const change18 = Math.round(change24 * (18 / 24));
  const changePound = Math.round(change24 * 8);

  return {
    karat24: {
      karat: 24,
      buyPrice: buy24,
      sellPrice: Math.round(buy24 * 1.02),
      change: change24,
      changePercent: parseFloat(((change24 / buy24) * 100).toFixed(2)),
    },
    karat21: {
      karat: 21,
      buyPrice: buy21,
      sellPrice: Math.round(buy21 * 1.02),
      change: change21,
      changePercent: parseFloat(((change21 / buy21) * 100).toFixed(2)),
    },
    karat18: {
      karat: 18,
      buyPrice: buy18,
      sellPrice: Math.round(buy18 * 1.02),
      change: change18,
      changePercent: parseFloat(((change18 / buy18) * 100).toFixed(2)),
    },
    pound: {
      karat: "pound",
      buyPrice: buyPound,
      sellPrice: Math.round(buyPound * 1.015),
      change: changePound,
      changePercent: parseFloat(((changePound / buyPound) * 100).toFixed(2)),
    },
    dollar: parseFloat((addNoise(BASE_PRICES.dollar, 0.005)).toFixed(2)),
    lastUpdated: now,
    source: "ذهب مصر",
  };
}

// ===== Generate historical data =====
export function generateHistoricalData(period: ChartPeriod): GoldHistoryPoint[] {
  const now = new Date();
  const points: GoldHistoryPoint[] = [];

  let numPoints: number;
  let intervalHours: number;

  switch (period) {
    case "day":
      numPoints = 24;
      intervalHours = 1;
      break;
    case "week":
      numPoints = 7;
      intervalHours = 24;
      break;
    case "month":
      numPoints = 30;
      intervalHours = 24;
      break;
    case "year":
      numPoints = 12;
      intervalHours = 24 * 30;
      break;
    default:
      numPoints = 30;
      intervalHours = 24;
  }

  let price24 = BASE_PRICES.karat24;
  let price21 = BASE_PRICES.karat21;
  let price18 = BASE_PRICES.karat18;

  // Generate backwards from now
  for (let i = numPoints; i >= 0; i--) {
    const date = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000);

    // Add random walk
    const delta = (Math.random() - 0.48) * 50;
    price24 = Math.max(3000, Math.min(4500, price24 + delta));
    price21 = Math.round(price24 * (21 / 24));
    price18 = Math.round(price24 * (18 / 24));

    points.push({
      date: date.toISOString(),
      price24: Math.round(price24),
      price21: Math.round(price21),
      price18: Math.round(price18),
    });
  }

  return points;
}

// ===== Mock news data =====
export const MOCK_NEWS = [
  {
    id: "1",
    title: "الذهب يرتفع وسط توترات جيوسياسية",
    summary: "ارتفعت أسعار الذهب في السوق المصرية مدفوعةً بزيادة الطلب على الملاذات الآمنة",
    content: `شهدت أسعار الذهب في السوق المصرية ارتفاعاً ملحوظاً خلال الأيام الأخيرة، في ظل تصاعد التوترات الجيوسياسية على المستوى العالمي وزيادة الطلب على الأصول الآمنة.

وأشار خبراء السوق إلى أن هذا الارتفاع يعكس المخاوف المتزايدة من عدم الاستقرار الاقتصادي العالمي، مما دفع المستثمرين نحو الملاذات الآمنة التقليدية كالذهب.

وتوقع المحللون استمرار هذا الاتجاه التصاعدي خلال الفترة القادمة، مع الأخذ بعين الاعتبار تحركات الدولار الأمريكي والسياسات النقدية للبنوك المركزية الكبرى.`,
    category: "gold" as const,
    source: "بوابة المال",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: undefined,
  },
  {
    id: "2",
    title: "الدولار يستقر أمام الجنيه المصري",
    summary: "استقر سعر الدولار الأمريكي في مقابل الجنيه المصري عند مستويات 50 جنيهاً",
    content: `استقر سعر صرف الدولار الأمريكي في مقابل الجنيه المصري خلال تعاملات اليوم، مع ترقب السوق للبيانات الاقتصادية الأمريكية الصادرة هذا الأسبوع.

وتداول الدولار في نطاق ضيق، وسط توازن قوى العرض والطلب في السوق المحلية، فيما تتابع الأسواق عن كثب أي تطورات على صعيد السياسة النقدية للبنك الفيدرالي الأمريكي.

وأشار محللون إلى أن البنك المركزي المصري يواصل جهوده للحفاظ على استقرار سعر الصرف، في إطار سياسته النقدية الهادفة إلى كبح التضخم وتعزيز الاستقرار الاقتصادي.`,
    category: "dollar" as const,
    source: "اقتصاد اليوم",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    imageUrl: undefined,
  },
  {
    id: "3",
    title: "توقعات بارتفاع الذهب خلال الربع القادم",
    summary: "يتوقع المحللون الماليون ارتفاع أسعار الذهب بنسبة تصل إلى 5% خلال الربع القادم",
    content: `رسم محللون ماليون صورة إيجابية لتوقعات أسعار الذهب خلال الأشهر الثلاثة المقبلة، مشيرين إلى جملة من العوامل الداعمة للمعدن النفيس.

وتتصدر هذه العوامل توقعات بتراجع أسعار الفائدة الأمريكية، وزيادة مشتريات البنوك المركزية من الذهب، فضلاً عن استمرار الطلب الاستهلاكي القوي في الأسواق الآسيوية.

وفي السياق المحلي المصري، يُضاف إلى هذه المحركات العالمية ارتفاع الطلب الموسمي المرتبط بمواسم الأعراس، مما يعزز التوقعات بتحقيق مكاسب إضافية للمعدن الأصفر.`,
    category: "gold" as const,
    source: "المال والأعمال",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    imageUrl: undefined,
  },
  {
    id: "4",
    title: "البنك المركزي يثبت أسعار الفائدة",
    summary: "قرر البنك المركزي المصري تثبيت أسعار الفائدة في اجتماع لجنة السياسة النقدية",
    content: `أعلن البنك المركزي المصري تثبيت أسعار الفائدة الأساسية في اجتماع لجنة السياسة النقدية، في إشارة إلى الاستمرار في نهج الحذر وسط ضغوط تضخمية لا تزال قائمة.

وتأتي هذه الخطوة في ضوء قراءة دقيقة للمشهد الاقتصادي الراهن، لا سيما في ظل تراجع معدلات التضخم نسبياً عن مستوياتها المرتفعة السابقة.

ورحّب المحللون بهذا القرار، معتبرين إياه علامةً إيجابية على التوازن في السياسة النقدية، كما توقعوا أن ينعكس تأثيره إيجاباً على أسعار الذهب المحلية خلال المرحلة المقبلة.`,
    category: "economy" as const,
    source: "أخبار البورصة",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    imageUrl: undefined,
  },
  {
    id: "5",
    title: "ارتفاع مبيعات الذهب في السوق المصرية",
    summary: "سجلت مبيعات الذهب ارتفاعاً ملحوظاً مع اقتراب موسم الأعراس",
    content: `شهدت مبيعات الذهب في السوق المصرية ارتفاعاً لافتاً خلال الأسابيع الأخيرة، مدفوعةً باقتراب موسم الأعراس والطلب المتصاعد على الحلي والمجوهرات.

وأفاد تجار الذهب بزيادة ملموسة في الإقبال على الشراء من مختلف العيارات، وفي مقدمتها عيار 21 الأكثر رواجاً في السوق المحلية، إلى جانب ارتفاع الطلب على الجنيه الذهب بوصفه قيمة استثمارية.

وأكد التجار أن هذا النمط الموسمي يتكرر سنوياً، مشيرين إلى أن الطلب على الذهب في مصر يمتاز بتنوعه بين الغرض الاستهلاكي والاستثماري، مما يجعل منه سوقاً نابضاً بالحيوية على مدار العام.`,
    category: "gold" as const,
    source: "صدى البلد الاقتصادي",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    imageUrl: undefined,
  },
  {
    id: "6",
    title: "الفيدرالي الأمريكي يلمح لخفض الفائدة",
    summary: "أشارت تصريحات رئيس الفيدرالي إلى إمكانية خفض الفائدة في الاجتماعات القادمة",
    content: `ألقت تصريحات رئيس الاحتياطي الفيدرالي الأمريكي بظلالها إيجابياً على أسعار الذهب عالمياً، إذ أبدى مرونةً تجاه احتمال خفض أسعار الفائدة، وهو ما يصبّ في مصلحة المعادن الثمينة.

ويُعدّ انخفاض الفائدة عاملاً محفزاً تقليدياً لأسعار الذهب، لما يترتب عليه من تراجع تكلفة الفرصة البديلة لحيازته، مما يزيد من جاذبيته الاستثمارية مقارنةً بالأصول ذات العائد الثابت.

وأوضح المحللون أن هذا التوجه، إن تُرجم إلى قرارات ملموسة، قد يدفع أسعار الذهب العالمية نحو مستويات قياسية جديدة، مما سينعكس بدوره على مؤشرات السوق المصرية.`,
    category: "economy" as const,
    source: "رويترز عربي",
    date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    imageUrl: undefined,
  },
];
