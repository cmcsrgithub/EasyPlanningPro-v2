import TemplateBuilder from "@/components/TemplateBuilder";

interface ChampionshipEventTemplateProps {
  isPreview?: boolean;
}

export default function ChampionshipEventTemplate({ isPreview = false }: ChampionshipEventTemplateProps) {
  return <TemplateBuilder templateId="championship-event" isPreview={isPreview} />;
}
