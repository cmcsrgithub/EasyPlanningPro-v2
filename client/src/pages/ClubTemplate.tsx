import TemplateBuilder from "@/components/TemplateBuilder";

interface ClubTemplateProps {
  isPreview?: boolean;
}

export default function ClubTemplate({ isPreview = false }: ClubTemplateProps) {
  return <TemplateBuilder templateId="club" isPreview={isPreview} />;
}
