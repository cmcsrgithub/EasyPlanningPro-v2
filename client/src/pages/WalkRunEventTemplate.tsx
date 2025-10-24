import TemplateBuilder from "@/components/TemplateBuilder";

interface WalkRunEventTemplateProps {
  isPreview?: boolean;
}

export default function WalkRunEventTemplate({ isPreview = false }: WalkRunEventTemplateProps) {
  return <TemplateBuilder templateId="walk-run-event" isPreview={isPreview} />;
}
