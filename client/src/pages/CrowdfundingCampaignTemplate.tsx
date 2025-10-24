import TemplateBuilder from "@/components/TemplateBuilder";

interface CrowdfundingCampaignTemplateProps {
  isPreview?: boolean;
}

export default function CrowdfundingCampaignTemplate({ isPreview = false }: CrowdfundingCampaignTemplateProps) {
  return <TemplateBuilder templateId="crowdfunding-campaign" isPreview={isPreview} />;
}
