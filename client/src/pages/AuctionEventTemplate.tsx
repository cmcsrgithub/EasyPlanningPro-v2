import TemplateBuilder from "@/components/TemplateBuilder";

interface AuctionEventTemplateProps {
  isPreview?: boolean;
}

export default function AuctionEventTemplate({ isPreview = false }: AuctionEventTemplateProps) {
  return <TemplateBuilder templateId="auction-event" isPreview={isPreview} />;
}
