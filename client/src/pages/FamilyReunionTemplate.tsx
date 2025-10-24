import TemplateBuilder from "@/components/TemplateBuilder";

interface FamilyReunionTemplateProps {
  isPreview?: boolean;
}

export default function FamilyReunionTemplate({ isPreview = false }: FamilyReunionTemplateProps) {
  return <TemplateBuilder templateId="family-reunion" isPreview={isPreview} />;
}
