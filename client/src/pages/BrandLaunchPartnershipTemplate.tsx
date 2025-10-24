import TemplateBuilder from "@/components/TemplateBuilder";

interface BrandLaunchPartnershipTemplateProps {
  isPreview?: boolean;
}

export default function BrandLaunchPartnershipTemplate({ isPreview = false }: BrandLaunchPartnershipTemplateProps) {
  return <TemplateBuilder templateId="brand-launch-partnership" isPreview={isPreview} />;
}
