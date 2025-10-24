import TemplateBuilder from "@/components/TemplateBuilder";

interface TrainingSessionTemplateProps {
  isPreview?: boolean;
}

export default function TrainingSessionTemplate({ isPreview = false }: TrainingSessionTemplateProps) {
  return <TemplateBuilder templateId="training-session" isPreview={isPreview} />;
}
