import TemplateBuilder from "@/components/TemplateBuilder";

interface FamilyVacationTemplateProps {
  isPreview?: boolean;
}

export default function FamilyVacationTemplate({ isPreview = false }: FamilyVacationTemplateProps) {
  return <TemplateBuilder templateId="family-vacation" isPreview={isPreview} />;
}
