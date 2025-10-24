import TemplateBuilder from "@/components/TemplateBuilder";

interface BabyShowerTemplateProps {
  isPreview?: boolean;
}

export default function BabyShowerTemplate({ isPreview = false }: BabyShowerTemplateProps) {
  return <TemplateBuilder templateId="baby-shower" isPreview={isPreview} />;
}
