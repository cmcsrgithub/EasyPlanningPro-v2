import TemplateBuilder from "@/components/TemplateBuilder";

interface SeminarTemplateProps {
  isPreview?: boolean;
}

export default function SeminarTemplate({ isPreview = false }: SeminarTemplateProps) {
  return <TemplateBuilder templateId="seminar" isPreview={isPreview} />;
}
