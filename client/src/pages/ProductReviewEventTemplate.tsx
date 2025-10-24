import TemplateBuilder from "@/components/TemplateBuilder";

interface ProductReviewEventTemplateProps {
  isPreview?: boolean;
}

export default function ProductReviewEventTemplate({ isPreview = false }: ProductReviewEventTemplateProps) {
  return <TemplateBuilder templateId="product-review-event" isPreview={isPreview} />;
}
