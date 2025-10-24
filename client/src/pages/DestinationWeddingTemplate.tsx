import TemplateBuilder from "@/components/TemplateBuilder";

interface DestinationWeddingTemplateProps {
  isPreview?: boolean;
}

export default function DestinationWeddingTemplate({ isPreview = false }: DestinationWeddingTemplateProps) {
  return <TemplateBuilder templateId="destination-wedding" isPreview={isPreview} />;
}
