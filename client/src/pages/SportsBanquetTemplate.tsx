import TemplateBuilder from "@/components/TemplateBuilder";

interface SportsBanquetTemplateProps {
  isPreview?: boolean;
}

export default function SportsBanquetTemplate({ isPreview = false }: SportsBanquetTemplateProps) {
  return <TemplateBuilder templateId="sports-banquet" isPreview={isPreview} />;
}
