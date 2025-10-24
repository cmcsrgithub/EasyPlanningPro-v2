import TemplateBuilder from "@/components/TemplateBuilder";

interface WeddingTemplateProps {
  isPreview?: boolean;
}

export default function WeddingTemplate({ isPreview = false }: WeddingTemplateProps) {
  return <TemplateBuilder templateId="wedding" isPreview={isPreview} />;
}
