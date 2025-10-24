import TemplateBuilder from "@/components/TemplateBuilder";

interface MusicFestivalTemplateProps {
  isPreview?: boolean;
}

export default function MusicFestivalTemplate({ isPreview = false }: MusicFestivalTemplateProps) {
  return <TemplateBuilder templateId="music-festival" isPreview={isPreview} />;
}
