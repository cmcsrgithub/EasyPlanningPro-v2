import TemplateBuilder from "@/components/TemplateBuilder";

interface SportsCampTemplateProps {
  isPreview?: boolean;
}

export default function SportsCampTemplate({ isPreview = false }: SportsCampTemplateProps) {
  return <TemplateBuilder templateId="sports-camp" isPreview={isPreview} />;
}
