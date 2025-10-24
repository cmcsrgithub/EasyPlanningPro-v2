import TemplateBuilder from "@/components/TemplateBuilder";

interface WorkshopTemplateProps {
  isPreview?: boolean;
}

export default function WorkshopTemplate({ isPreview = false }: WorkshopTemplateProps) {
  return <TemplateBuilder templateId="workshop" isPreview={isPreview} />;
}
