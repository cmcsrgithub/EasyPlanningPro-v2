import TemplateBuilder from "@/components/TemplateBuilder";

interface CommunityTemplateProps {
  isPreview?: boolean;
}

export default function CommunityTemplate({ isPreview = false }: CommunityTemplateProps) {
  return <TemplateBuilder templateId="community" isPreview={isPreview} />;
}
