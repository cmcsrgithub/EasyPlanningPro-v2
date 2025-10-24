import TemplateBuilder from "@/components/TemplateBuilder";

interface MilestoneTemplateProps {
  isPreview?: boolean;
}

export default function MilestoneTemplate({ isPreview = false }: MilestoneTemplateProps) {
  return <TemplateBuilder templateId="milestone" isPreview={isPreview} />;
}
