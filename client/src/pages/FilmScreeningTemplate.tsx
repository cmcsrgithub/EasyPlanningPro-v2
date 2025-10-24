import TemplateBuilder from "@/components/TemplateBuilder";

interface FilmScreeningTemplateProps {
  isPreview?: boolean;
}

export default function FilmScreeningTemplate({ isPreview = false }: FilmScreeningTemplateProps) {
  return <TemplateBuilder templateId="film-screening" isPreview={isPreview} />;
}
