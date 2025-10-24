import TemplateBuilder from "@/components/TemplateBuilder";

interface FriendsTemplateProps {
  isPreview?: boolean;
}

export default function FriendsTemplate({ isPreview = false }: FriendsTemplateProps) {
  return <TemplateBuilder templateId="friends" isPreview={isPreview} />;
}
