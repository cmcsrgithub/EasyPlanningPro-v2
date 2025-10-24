import TemplateBuilder from "@/components/TemplateBuilder";

interface SportsTournamentTemplateProps {
  isPreview?: boolean;
}

export default function SportsTournamentTemplate({ isPreview = false }: SportsTournamentTemplateProps) {
  return <TemplateBuilder templateId="sports-tournament" isPreview={isPreview} />;
}
