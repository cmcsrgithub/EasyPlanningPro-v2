import TemplateBuilder from "@/components/TemplateBuilder";

interface BenefitConcertTemplateProps {
  isPreview?: boolean;
}

export default function BenefitConcertTemplate({ isPreview = false }: BenefitConcertTemplateProps) {
  return <TemplateBuilder templateId="benefit-concert" isPreview={isPreview} />;
}
