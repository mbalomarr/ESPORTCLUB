import type { Lang } from "@/types";

/** A selectable answer. `value` is what lands in the inbox (always English); labels are per language. */
export type ChoiceOption = { value: string } & Record<Lang, string>;
export type LevelOption = ChoiceOption & { hint: Record<Lang, string> };

/** Registration form choices. */
export const formOptions: {
  years: ChoiceOption[];
  platforms: ChoiceOption[];
  roles: ChoiceOption[];
  levels: LevelOption[];
} = {
  years: [
    { value: "Foundation", en: "Foundation", ar: "السنة التحضيرية" },
    { value: "Freshman", en: "Freshman", ar: "السنة الأولى" },
    { value: "Sophomore", en: "Sophomore", ar: "السنة الثانية" },
    { value: "Junior", en: "Junior", ar: "السنة الثالثة" },
    { value: "Senior", en: "Senior", ar: "السنة الرابعة" },
    { value: "Graduate", en: "Graduate", ar: "دراسات عليا" },
  ],
  platforms: [
    { value: "PC", en: "PC", ar: "الحاسب الشخصي" },
    { value: "PlayStation", en: "PlayStation", ar: "بلايستيشن" },
    { value: "Xbox", en: "Xbox", ar: "إكس بوكس" },
    { value: "Nintendo Switch", en: "Nintendo Switch", ar: "نينتندو سويتش" },
    { value: "Mobile", en: "Mobile", ar: "الجوال" },
  ],
  roles: [
    { value: "Competitive Player", en: "Competitive Player", ar: "لاعب تنافسي" },
    { value: "Casual Player", en: "Casual Player", ar: "لاعب هاوٍ" },
    { value: "Caster / Host", en: "Caster / Host", ar: "معلّق / مقدّم" },
    { value: "Streamer / Media", en: "Streamer / Media", ar: "صانع محتوى / إعلام" },
    { value: "Event Staff", en: "Event Staff", ar: "فريق تنظيم الفعاليات" },
    { value: "Designer / Developer", en: "Designer / Developer", ar: "مصمم / مطوّر" },
  ],
  levels: [
    { value: "Casual", en: "Casual", ar: "هاوٍ", hint: { en: "I play for fun", ar: "ألعب للمتعة" } },
    { value: "Competitive", en: "Competitive", ar: "تنافسي", hint: { en: "I grind ranked", ar: "ألعب المباريات المصنّفة" } },
    { value: "Elite", en: "Elite", ar: "محترف", hint: { en: "Varsity-ready", ar: "جاهز لتمثيل الجامعة" } },
  ],
};
