import TemplateBuilder from "@/components/TemplateBuilder";

interface AdventureTourTemplateProps {
  isPreview?: boolean;
}

export default function AdventureTourTemplate({ isPreview = false }: AdventureTourTemplateProps) {
  return <TemplateBuilder templateId="adventure-tour" isPreview={isPreview} />;
}
