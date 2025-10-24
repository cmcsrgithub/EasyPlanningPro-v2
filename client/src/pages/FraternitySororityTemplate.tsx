import TemplateBuilder from "@/components/TemplateBuilder";

interface FraternitySororityTemplateProps {
  isPreview?: boolean;
}

export default function FraternitySororityTemplate({ isPreview = false }: FraternitySororityTemplateProps) {
  return <TemplateBuilder templateId="fraternity-sorority" isPreview={isPreview} />;
}
