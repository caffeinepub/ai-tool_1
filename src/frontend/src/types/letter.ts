import { LetterType } from "../backend";

export { LetterType };

export interface LocalLetter {
  id: string;
  title: string;
  content: string;
  tone: string;
  letterType: LetterType;
  fontFamily: string;
  createdAt: number;
  updatedAt: number;
}

export const LETTER_TYPE_LABELS: Record<LetterType, string> = {
  [LetterType.officeLetter]: "कार्यालयीन पत्र",
  [LetterType.governmentPressNote]: "शासकीय प्रेस नोट",
  [LetterType.application]: "अर्ज",
  [LetterType.petition]: "निवेदन",
  [LetterType.complaintLetter]: "तक्रार पत्र",
  [LetterType.informationRequestLetter]: "माहितीसाठी पत्र",
  [LetterType.certificateOfAppreciation]: "प्रशस्तिपत्र",
};

export const TONE_OPTIONS = [
  { value: "औपचारिक", label: "औपचारिक" },
  { value: "अनौपचारिक", label: "अनौपचारिक" },
  { value: "संवेदनशील", label: "संवेदनशील" },
  { value: "कठोर", label: "कठोर" },
  { value: "विनम्र", label: "विनम्र" },
];

export const FONT_OPTIONS = [
  { value: "Noto Sans Devanagari", label: "Noto Sans Devanagari" },
  { value: "Anek Devanagari", label: "Anek Devanagari" },
  { value: "Hind", label: "Hind" },
  { value: "Khand", label: "Khand" },
  { value: "Noto Serif Devanagari", label: "Noto Serif Devanagari" },
  { value: "Poppins", label: "Poppins" },
];

export const AI_TIPS = [
  "औपचारिक मराठीत 'आपण' हा आदरार्थी शब्द वापरा.",
  "पत्राच्या सुरुवातीला दिनांक व पत्त्याचा उल्लेख करा.",
  "विषय ओळ संक्षिप्त व स्पष्ट ठेवा.",
  "शेवटी 'आपला विश्वासू' किंवा 'सादर' असा उल्लेख करा.",
  "शासकीय पत्रात क्रमांकाचा उल्लेख अवश्य करा.",
  "पत्राची भाषा साधी, स्पष्ट व मुद्देसूद ठेवा.",
];
