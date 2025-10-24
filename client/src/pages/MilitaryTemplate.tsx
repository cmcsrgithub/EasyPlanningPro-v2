import TemplateBuilder from "@/components/TemplateBuilder";

interface MilitaryTemplateProps {
  isPreview?: boolean;
}

export default function MilitaryTemplate({ isPreview = false }: MilitaryTemplateProps) {
  return <TemplateBuilder templateId="military" isPreview={isPreview} />;
}
