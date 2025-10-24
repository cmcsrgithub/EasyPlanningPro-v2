import TemplateBuilder from "@/components/TemplateBuilder";

interface AcademicConferenceTemplateProps {
  isPreview?: boolean;
}

export default function AcademicConferenceTemplate({ isPreview = false }: AcademicConferenceTemplateProps) {
  return <TemplateBuilder templateId="academic-conference" isPreview={isPreview} />;
}
