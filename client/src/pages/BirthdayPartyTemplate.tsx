import TemplateBuilder from "@/components/TemplateBuilder";

interface BirthdayPartyTemplateProps {
  isPreview?: boolean;
}

export default function BirthdayPartyTemplate({ isPreview = false }: BirthdayPartyTemplateProps) {
  return <TemplateBuilder templateId="birthday-party" isPreview={isPreview} />;
}
