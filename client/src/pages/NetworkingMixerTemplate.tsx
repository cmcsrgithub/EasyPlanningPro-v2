import TemplateBuilder from "@/components/TemplateBuilder";

interface NetworkingMixerTemplateProps {
  isPreview?: boolean;
}

export default function NetworkingMixerTemplate({ isPreview = false }: NetworkingMixerTemplateProps) {
  return <TemplateBuilder templateId="networking-mixer" isPreview={isPreview} />;
}
