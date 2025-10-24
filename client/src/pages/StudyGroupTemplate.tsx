import TemplateBuilder from "@/components/TemplateBuilder";

interface StudyGroupTemplateProps {
  isPreview?: boolean;
}

export default function StudyGroupTemplate({ isPreview = false }: StudyGroupTemplateProps) {
  return <TemplateBuilder templateId="study-group" isPreview={isPreview} />;
}
