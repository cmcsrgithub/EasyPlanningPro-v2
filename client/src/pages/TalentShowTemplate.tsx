import TemplateBuilder from "@/components/TemplateBuilder";

interface TalentShowTemplateProps {
  isPreview?: boolean;
}

export default function TalentShowTemplate({ isPreview = false }: TalentShowTemplateProps) {
  return <TemplateBuilder templateId="talent-show" isPreview={isPreview} />;
}
