import TemplateBuilder from "@/components/TemplateBuilder";

interface TeamBuildingRetreatTemplateProps {
  isPreview?: boolean;
}

export default function TeamBuildingRetreatTemplate({ isPreview = false }: TeamBuildingRetreatTemplateProps) {
  return <TemplateBuilder templateId="team-building-retreat" isPreview={isPreview} />;
}
