import TemplateBuilder from "@/components/TemplateBuilder";

interface InfluencerRetreatTemplateProps {
  isPreview?: boolean;
}

export default function InfluencerRetreatTemplate({ isPreview = false }: InfluencerRetreatTemplateProps) {
  return <TemplateBuilder templateId="influencer-retreat" isPreview={isPreview} />;
}
