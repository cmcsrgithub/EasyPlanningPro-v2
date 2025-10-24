import TemplateBuilder from "@/components/TemplateBuilder";

interface SalesKickoffTemplateProps {
  isPreview?: boolean;
}

export default function SalesKickoffTemplate({ isPreview = false }: SalesKickoffTemplateProps) {
  return <TemplateBuilder templateId="sales-kickoff" isPreview={isPreview} />;
}
