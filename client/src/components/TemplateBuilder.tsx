import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { getTemplateLayout } from "@/lib/templateLayouts";
import { getTemplateColors } from "@/lib/templateColors";
import {
  HeroSection,
  DateTimeSection,
  LocationSection,
  GuestListSection,
  RSVPSection,
  ActivitiesSection,
  TicketingSection,
  VenueDetailsSection,
  CateringSection,
  EntertainmentSection,
  ChecklistSection,
  BudgetSection,
  PhotoGallerySection,
  SponsorsSection,
  FundraisingSection,
  CTASection,
} from "./TemplateSections";

interface TemplateBuilderProps {
  templateId: string;
  isPreview?: boolean;
}

export default function TemplateBuilder({ templateId, isPreview = false }: TemplateBuilderProps) {
  const [, setLocation] = useLocation();
  const layout = getTemplateLayout(templateId);
  const colors = getTemplateColors(templateId, layout?.category);

  if (!layout) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Template configuration not found</p>
      </div>
    );
  }

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case "hero":
        return (
          <HeroSection
            key="hero"
            title={layout.name}
            description={layout.description}
            icon={layout.icon}
            badges={[
              `${layout.category} Event`,
              "Customizable",
              "Pre-configured",
              "Easy Setup"
            ]}
            color={colors.primary}
            gradient={`${colors.gradient.replace('from-', 'from-').replace('to-', 'to-')} dark:from-${colors.primary}-950 dark:to-${colors.secondary}-950`}
          />
        );

      case "dateTime":
        return <DateTimeSection key="dateTime" color={colors.primary} />;

      case "location":
        return <LocationSection key="location" color={colors.secondary} />;

      case "guestList":
        return <GuestListSection key="guestList" color={colors.primary} />;

      case "rsvp":
        return <RSVPSection key="rsvp" color={colors.secondary} />;

      case "activities":
        return <ActivitiesSection key="activities" color={colors.primary} />;

      case "ticketing":
        return <TicketingSection key="ticketing" color={colors.secondary} />;

      case "venue":
        return <VenueDetailsSection key="venue" color={colors.primary} />;

      case "catering":
        return <CateringSection key="catering" color={colors.secondary} />;

      case "entertainment":
        return <EntertainmentSection key="entertainment" color={colors.primary} />;

      case "checklist":
        return layout.checklist ? (
          <ChecklistSection
            key="checklist"
            title={`${layout.name} Checklist`}
            items={layout.checklist}
            color={colors.primary}
          />
        ) : null;

      case "budget":
        return <BudgetSection key="budget" color={colors.secondary} />;

      case "photoGallery":
        return <PhotoGallerySection key="photoGallery" color={colors.primary} />;

      case "sponsors":
        return <SponsorsSection key="sponsors" color={colors.secondary} />;

      case "fundraising":
        return <FundraisingSection key="fundraising" color={colors.primary} />;

      case "cta":
        return !isPreview ? (
          <CTASection
            key="cta"
            title={`Ready to Plan Your ${layout.name}?`}
            description={`Start using this template to organize every detail of your ${layout.name.toLowerCase()} event with pre-configured sections and workflows.`}
            buttonText={`Create ${layout.name} Event`}
            color={colors.primary}
            gradient={`${colors.gradient.replace('from-', 'from-').replace('to-', 'to-')} dark:from-${colors.primary}-950 dark:to-${colors.secondary}-950`}
            onAction={() => setLocation(`/events/new?template=${templateId}`)}
          />
        ) : null;

      default:
        return null;
    }
  };

  // Render sections in grid or full width based on section type
  const renderSections = () => {
    const sections = layout.sections.map(renderSection).filter((s): s is React.ReactElement => s !== null);
    const gridSections: React.ReactElement[] = [];
    const fullWidthSections: React.ReactElement[] = [];

    sections.forEach((section, index) => {
      const sectionType = layout.sections[index];
      
      // Full-width sections
      if (["hero", "checklist", "cta", "venue", "catering", "entertainment"].includes(sectionType)) {
        // If we have accumulated grid sections, render them first
        if (gridSections.length > 0) {
          fullWidthSections.push(
            <div key={`grid-${fullWidthSections.length}`} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gridSections.splice(0, gridSections.length)}
            </div>
          );
        }
        fullWidthSections.push(section);
      } else {
        // Grid sections (cards)
        gridSections.push(section);
      }
    });

    // Render any remaining grid sections
    if (gridSections.length > 0) {
      fullWidthSections.push(
        <div key={`grid-final`} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gridSections}
        </div>
      );
    }

    return fullWidthSections;
  };

  const content = (
    <div className="space-y-8">
      {renderSections()}
    </div>
  );

  return isPreview ? content : <DashboardLayout>{content}</DashboardLayout>;
}

