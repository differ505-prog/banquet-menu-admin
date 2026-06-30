import type { CookingGuide } from "@/types/menu";

export const cookingGuides: CookingGuide[] = [
  {
    key: "fry",
    label: "油炸火候表",
    summary: "先熟化再逼油，是宴客炸物最穩定的酥脆邏輯。",
    entries: [
      {
        label: "帶骨禽肉 / 厚切肉塊",
        temperature: "初炸 160°C｜二炸 190°C",
        duration: "初炸 3 至 4 分鐘，靜置 3 分鐘，二炸 40 至 60 秒",
        note: "適合唐揚雞、排骨。先低溫熟化再高溫逼油，外酥內嫩最穩。",
        score: 9.5,
      },
      {
        label: "海鮮類",
        temperature: "170°C 至 180°C",
        duration: "1.5 至 2 分鐘",
        note: "適合炸蝦、魚片、軟絲。麵衣微金黃就起鍋，靠餘溫收熟。",
        score: 9.1,
      },
      {
        label: "根莖與瓜果蔬菜",
        temperature: "根莖 150°C｜瓜果 180°C",
        duration: "根莖 5 至 8 分鐘｜茄子青椒 30 至 45 秒",
        note: "根莖低溫慢炸，茄子青椒高溫短炸，口感與顏色都會更穩。",
        score: 8.9,
      },
      {
        label: "冷凍半成品",
        temperature: "170°C 起鍋｜190°C 逼油",
        duration: "170°C 炸 4 至 5 分鐘，最後 190°C 30 秒",
        note: "春捲、花枝丸、薯條不必退冰，直接下鍋最不易破皮。",
        score: 8.8,
      },
    ],
  },
  {
    key: "steam",
    label: "清蒸火候表",
    summary: "所有清蒸都以水大滾、蒸氣足之後再下鍋，才不會出現蒸老或出水。",
    entries: [
      {
        label: "全魚 600g 至 800g",
        temperature: "大火蒸",
        duration: "8 至 10 分鐘，關火虛蒸 2 分鐘",
        note: "適合鱸魚、石斑。蒸好先悶再開蓋，魚肉最嫩且不易破皮。",
        score: 10,
      },
      {
        label: "白蝦 / 蟹 / 龍蝦",
        temperature: "大火蒸",
        duration: "白蝦 3 至 4 分鐘｜螃蟹 10 至 12 分鐘｜剖半龍蝦 8 至 10 分鐘",
        note: "甲殼海鮮只求剛熟，時間一過就會老掉，建議分批處理。",
        score: 9.2,
      },
      {
        label: "絞肉 / 粉蒸肉 / 獅子頭",
        temperature: "中大火蒸",
        duration: "30 至 45 分鐘",
        note: "這類食材怕不夠軟，不怕時間略長，重點是蒸透入味。",
        score: 9,
      },
      {
        label: "蛋類 / 茶碗蒸 / 甜湯回蒸",
        temperature: "中微火蒸",
        duration: "10 至 12 分鐘",
        note: "鍋蓋留縫或鋪布吸蒸氣，可避免蜂窩與表面粗糙。",
        score: 8.9,
      },
    ],
  },
];

export const cookingGuideMap = Object.fromEntries(
  cookingGuides.map((guide) => [guide.key, guide]),
) as Record<CookingGuide["key"], CookingGuide>;
