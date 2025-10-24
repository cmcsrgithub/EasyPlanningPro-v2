import TemplateBuilder from "@/components/TemplateBuilder";

interface CulturalExchangeTemplateProps {
  isPreview?: boolean;
}

export default function CulturalExchangeTemplate({ isPreview = false }: CulturalExchangeTemplateProps) {
  return <TemplateBuilder templateId="cultural-exchange" isPreview={isPreview} />;
}
