import TemplateBuilder from "@/components/TemplateBuilder";

interface GraduationTemplateProps {
  isPreview?: boolean;
}

export default function GraduationTemplate({ isPreview = false }: GraduationTemplateProps) {
  return <TemplateBuilder templateId="graduation" isPreview={isPreview} />;
}
