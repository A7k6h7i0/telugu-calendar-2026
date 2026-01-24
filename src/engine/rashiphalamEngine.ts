type RashiData = {
  daily: string[];
  weekly: string[];
  monthly: string[];
  yearly: string;
};

type RashiphalamResult = {
  text: string;
  stats: Record<string, number>;
};

const TYPE_MAP: Record<string, keyof RashiData> = {
  dhinaphalalu: "daily",
  daily: "daily",
  varaphalalu: "weekly",
  weekly: "weekly",
  masaphalalu: "monthly",
  monthly: "monthly",
  samvatsaraphalalu: "yearly",
  yearly: "yearly",
};

export function getRashiphalam(
  rasi: RashiData | undefined,
  rawType: string,
  date: Date
): RashiphalamResult {
  if (!rasi) {
    return {
      text: "రాశి సమాచారం లభ్యం కావడం లేదు.",
      stats: {},
    };
  }

  const type = TYPE_MAP[rawType] || "daily";

  // 🔒 SAFE ACCESS
  if (type === "yearly") {
    return {
      text: rasi.yearly,
      stats: {
        ఆరోగ్యం: 80,
        సంపద: 75,
        కుటుంబం: 85,
        వృత్తి: 90,
      },
    };
  }

  const list = rasi[type];

  if (!Array.isArray(list) || list.length === 0) {
    return {
      text: "ఈ విభాగానికి రాశి ఫలితాలు లభ్యం కావడం లేదు.",
      stats: {},
    };
  }

  // ✅ deterministic daily change
  const index =
    type === "daily"
      ? date.getDate() % list.length
      : type === "weekly"
      ? Math.floor(date.getDate() / 7) % list.length
      : date.getMonth() % list.length;

  return {
    text: list[index],
    stats: {
      ఆరోగ్యం: 70 + (index % 30),
      సంపద: 60 + (index % 40),
      కుటుంబం: 65 + (index % 35),
      వృత్తి: 75 + (index % 25),
    },
  };
}
