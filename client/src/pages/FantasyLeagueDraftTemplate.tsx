import TemplateBuilder from "@/components/TemplateBuilder";

interface FantasyLeagueDraftTemplateProps {
  isPreview?: boolean;
}

export default function FantasyLeagueDraftTemplate({ isPreview = false }: FantasyLeagueDraftTemplateProps) {
  return <TemplateBuilder templateId="fantasy-league-draft" isPreview={isPreview} />;
}
