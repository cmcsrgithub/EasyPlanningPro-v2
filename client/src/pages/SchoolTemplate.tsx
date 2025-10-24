import TemplateBuilder from "@/components/TemplateBuilder";

interface SchoolTemplateProps {
  isPreview?: boolean;
}

export default function SchoolTemplate({ isPreview = false }: SchoolTemplateProps) {
  return <TemplateBuilder templateId="school" isPreview={isPreview} />;
}
