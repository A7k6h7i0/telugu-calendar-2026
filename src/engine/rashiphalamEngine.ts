type RashiphalamBlock = {
  text: string; // long text (joined)
  colors?: string[];
  stats?: Record<string, number>;
};

type RashiData = {
  daily: RashiphalamBlock;
  weekly: RashiphalamBlock;
  monthly: RashiphalamBlock;
  yearly: RashiphalamBlock;
};

const TYPE_MAP: Record<string, keyof RashiData> = {
  daily: "daily",
  dhinaphalalu: "daily",
  weekly: "weekly",
  varaphalalu: "weekly",
  monthly: "monthly",
  masaphalalu: "monthly",
  yearly: "yearly",
  samvatsaraphalalu: "yearly",
};

export function getRashiphalam(
  rasi: RashiData | undefined,
  rawType: string,
  date: Date = new Date()
): RashiphalamBlock {
  if (!rasi) {
    return {
      text: "రాశి సమాచారం లభ్యం కావడం లేదు.",
      stats: {},
    };
  }

  const type = TYPE_MAP[rawType] || "daily";
  const block = rasi[type];

  if (!block || !block.text) {
    return {
      text: "ఈ విభాగానికి రాశి ఫలాలు లభ్యం కావడం లేదు.",
      stats: {},
    };
  }

  // 🔁 ROTATION LOGIC
  // Split by double newline (same format you used)
  const lines = block.text
    .split("\n\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return block;
  }

  let index = 0;

  if (type === "daily") {
    index = date.getDate() % lines.length;
  } else if (type === "weekly") {
    index = Math.floor(date.getDate() / 7) % lines.length;
  } else if (type === "monthly") {
    index = date.getMonth() % lines.length;
  } else {
    // yearly → full text (NO rotation)
    return block;
  }

  return {
    ...block,
    text: lines[index], // ✅ ONE LINE ONLY
  };
}
