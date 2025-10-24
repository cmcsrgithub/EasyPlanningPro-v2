import TemplateBuilder from "@/components/TemplateBuilder";

interface SportsTeamTemplateProps {
  isPreview?: boolean;
}

export default function SportsTeamTemplate({ isPreview = false }: SportsTeamTemplateProps) {
  return <TemplateBuilder templateId="sports-team" isPreview={isPreview} />;
}
