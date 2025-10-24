export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  isPremium?: boolean;
}

export const colorSchemes: ColorScheme[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and professional",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#ec4899",
    background: "#ffffff",
    text: "#1f2937",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated and refined",
    primary: "#6366f1",
    secondary: "#a855f7",
    accent: "#f59e0b",
    background: "#fafafa",
    text: "#374151",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Bold and energetic",
    primary: "#f59e0b",
    secondary: "#f97316",
    accent: "#ec4899",
    background: "#ffffff",
    text: "#1f2937",
  },
  {
    id: "nature",
    name: "Nature",
    description: "Fresh and organic",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#84cc16",
    background: "#f0fdf4",
    text: "#064e3b",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Calm and serene",
    primary: "#0ea5e9",
    secondary: "#06b6d4",
    accent: "#3b82f6",
    background: "#f0f9ff",
    text: "#0c4a6e",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm and inviting",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#fbbf24",
    background: "#fff7ed",
    text: "#7c2d12",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Classic black and white",
    primary: "#1f2937",
    secondary: "#4b5563",
    accent: "#6b7280",
    background: "#ffffff",
    text: "#111827",
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Soft and gentle",
    primary: "#a78bfa",
    secondary: "#c4b5fd",
    accent: "#fbbf24",
    background: "#faf5ff",
    text: "#581c87",
  },
];

export const fontFamilies = [
  {
    id: "inter",
    name: "Inter",
    description: "Modern and clean",
    fontFamily: "'Inter', sans-serif",
    googleFont: "Inter:wght@400;500;600;700",
  },
  {
    id: "roboto",
    name: "Roboto",
    description: "Professional and readable",
    fontFamily: "'Roboto', sans-serif",
    googleFont: "Roboto:wght@400;500;700",
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Friendly and approachable",
    fontFamily: "'Poppins', sans-serif",
    googleFont: "Poppins:wght@400;500;600;700",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    description: "Elegant and sophisticated",
    fontFamily: "'Playfair Display', serif",
    googleFont: "Playfair+Display:wght@400;500;600;700",
  },
];

export function getColorScheme(id: string): ColorScheme | undefined {
  return colorSchemes.find(scheme => scheme.id === id);
}

export function getFontFamily(id: string) {
  return fontFamilies.find(font => font.id === id);
}

