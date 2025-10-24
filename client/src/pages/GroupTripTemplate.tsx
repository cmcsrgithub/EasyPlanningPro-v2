import TemplateBuilder from "@/components/TemplateBuilder";

interface GroupTripTemplateProps {
  isPreview?: boolean;
}

export default function GroupTripTemplate({ isPreview = false }: GroupTripTemplateProps) {
  return <TemplateBuilder templateId="group-trip" isPreview={isPreview} />;
}
