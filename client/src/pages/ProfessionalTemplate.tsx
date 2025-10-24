import TemplateBuilder from "@/components/TemplateBuilder";

interface ProfessionalTemplateProps {
  isPreview?: boolean;
}

export default function ProfessionalTemplate({ isPreview = false }: ProfessionalTemplateProps) {
  return <TemplateBuilder templateId="professional" isPreview={isPreview} />;
}
