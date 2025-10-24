import TemplateBuilder from "@/components/TemplateBuilder";

interface ComedyShowTemplateProps {
  isPreview?: boolean;
}

export default function ComedyShowTemplate({ isPreview = false }: ComedyShowTemplateProps) {
  return <TemplateBuilder templateId="comedy-show" isPreview={isPreview} />;
}
