import TemplateBuilder from "@/components/TemplateBuilder";

interface NeighborhoodBbqTemplateProps {
  isPreview?: boolean;
}

export default function NeighborhoodBbqTemplate({ isPreview = false }: NeighborhoodBbqTemplateProps) {
  return <TemplateBuilder templateId="neighborhood-bbq" isPreview={isPreview} />;
}
