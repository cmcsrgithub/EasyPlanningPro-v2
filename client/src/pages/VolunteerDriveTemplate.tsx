import TemplateBuilder from "@/components/TemplateBuilder";

interface VolunteerDriveTemplateProps {
  isPreview?: boolean;
}

export default function VolunteerDriveTemplate({ isPreview = false }: VolunteerDriveTemplateProps) {
  return <TemplateBuilder templateId="volunteer-drive" isPreview={isPreview} />;
}
