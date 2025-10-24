import TemplateBuilder from "@/components/TemplateBuilder";

interface SocialTemplateProps {
  isPreview?: boolean;
}

export default function SocialTemplate({ isPreview = false }: SocialTemplateProps) {
  return <TemplateBuilder templateId="social" isPreview={isPreview} />;
}
