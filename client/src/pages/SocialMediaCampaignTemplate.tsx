import TemplateBuilder from "@/components/TemplateBuilder";

interface SocialMediaCampaignTemplateProps {
  isPreview?: boolean;
}

export default function SocialMediaCampaignTemplate({ isPreview = false }: SocialMediaCampaignTemplateProps) {
  return <TemplateBuilder templateId="social-media-campaign" isPreview={isPreview} />;
}
