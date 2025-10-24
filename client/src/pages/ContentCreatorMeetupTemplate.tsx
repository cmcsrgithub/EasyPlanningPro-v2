import TemplateBuilder from "@/components/TemplateBuilder";

interface ContentCreatorMeetupTemplateProps {
  isPreview?: boolean;
}

export default function ContentCreatorMeetupTemplate({ isPreview = false }: ContentCreatorMeetupTemplateProps) {
  return <TemplateBuilder templateId="content-creator-meetup" isPreview={isPreview} />;
}
