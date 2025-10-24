import TemplateBuilder from "@/components/TemplateBuilder";

interface TownHallMeetingTemplateProps {
  isPreview?: boolean;
}

export default function TownHallMeetingTemplate({ isPreview = false }: TownHallMeetingTemplateProps) {
  return <TemplateBuilder templateId="town-hall-meeting" isPreview={isPreview} />;
}
