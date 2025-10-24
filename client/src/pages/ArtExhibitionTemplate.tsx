import TemplateBuilder from "@/components/TemplateBuilder";

interface ArtExhibitionTemplateProps {
  isPreview?: boolean;
}

export default function ArtExhibitionTemplate({ isPreview = false }: ArtExhibitionTemplateProps) {
  return <TemplateBuilder templateId="art-exhibition" isPreview={isPreview} />;
}
