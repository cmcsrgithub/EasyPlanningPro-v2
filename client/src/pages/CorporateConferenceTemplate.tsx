import TemplateBuilder from "@/components/TemplateBuilder";

interface CorporateConferenceTemplateProps {
  isPreview?: boolean;
}

export default function CorporateConferenceTemplate({ isPreview = false }: CorporateConferenceTemplateProps) {
  return <TemplateBuilder templateId="corporate-conference" isPreview={isPreview} />;
}
