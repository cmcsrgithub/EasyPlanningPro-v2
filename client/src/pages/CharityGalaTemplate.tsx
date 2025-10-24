import TemplateBuilder from "@/components/TemplateBuilder";

interface CharityGalaTemplateProps {
  isPreview?: boolean;
}

export default function CharityGalaTemplate({ isPreview = false }: CharityGalaTemplateProps) {
  return <TemplateBuilder templateId="charity-gala" isPreview={isPreview} />;
}
