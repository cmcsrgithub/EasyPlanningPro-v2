import TemplateBuilder from "@/components/TemplateBuilder";

interface ProductLaunchTemplateProps {
  isPreview?: boolean;
}

export default function ProductLaunchTemplate({ isPreview = false }: ProductLaunchTemplateProps) {
  return <TemplateBuilder templateId="product-launch" isPreview={isPreview} />;
}
