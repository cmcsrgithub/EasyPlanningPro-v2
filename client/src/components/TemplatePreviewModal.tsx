import { useEffect, useState, Suspense, lazy } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface TemplatePreviewModalProps {
  templateId: string;
  templateName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Map of template IDs to their component files
const templateComponents: Record<string, any> = {
  "wedding": lazy(() => import("../pages/WeddingTemplate")),
  "birthday-party": lazy(() => import("../pages/BirthdayPartyTemplate")),
  "baby-shower": lazy(() => import("../pages/BabyShowerTemplate")),
  "graduation": lazy(() => import("../pages/GraduationTemplate")),
  "destination-wedding": lazy(() => import("../pages/DestinationWeddingTemplate")),
  "neighborhood-bbq": lazy(() => import("../pages/NeighborhoodBbqTemplate")),
  "corporate-conference": lazy(() => import("../pages/CorporateConferenceTemplate")),
  "academic-conference": lazy(() => import("../pages/AcademicConferenceTemplate")),
  "workshop": lazy(() => import("../pages/WorkshopTemplate")),
  "seminar": lazy(() => import("../pages/SeminarTemplate")),
  "training-session": lazy(() => import("../pages/TrainingSessionTemplate")),
  "networking-mixer": lazy(() => import("../pages/NetworkingMixerTemplate")),
  "product-launch": lazy(() => import("../pages/ProductLaunchTemplate")),
  "sales-kickoff": lazy(() => import("../pages/SalesKickoffTemplate")),
  "team-building-retreat": lazy(() => import("../pages/TeamBuildingRetreatTemplate")),
  "brand-launch-partnership": lazy(() => import("../pages/BrandLaunchPartnershipTemplate")),
  "sports-tournament": lazy(() => import("../pages/SportsTournamentTemplate")),
  "championship-event": lazy(() => import("../pages/ChampionshipEventTemplate")),
  "sports-banquet": lazy(() => import("../pages/SportsBanquetTemplate")),
  "sports-camp": lazy(() => import("../pages/SportsCampTemplate")),
  "walk-run-event": lazy(() => import("../pages/WalkRunEventTemplate")),
  "fantasy-league-draft": lazy(() => import("../pages/FantasyLeagueDraftTemplate")),
  "music-festival": lazy(() => import("../pages/MusicFestivalTemplate")),
  "art-exhibition": lazy(() => import("../pages/ArtExhibitionTemplate")),
  "film-screening": lazy(() => import("../pages/FilmScreeningTemplate")),
  "comedy-show": lazy(() => import("../pages/ComedyShowTemplate")),
  "talent-show": lazy(() => import("../pages/TalentShowTemplate")),
  "charity-gala": lazy(() => import("../pages/CharityGalaTemplate")),
  "auction-event": lazy(() => import("../pages/AuctionEventTemplate")),
  "benefit-concert": lazy(() => import("../pages/BenefitConcertTemplate")),
  "volunteer-drive": lazy(() => import("../pages/VolunteerDriveTemplate")),
  "crowdfunding-campaign": lazy(() => import("../pages/CrowdfundingCampaignTemplate")),
  "town-hall-meeting": lazy(() => import("../pages/TownHallMeetingTemplate")),
  "cultural-exchange": lazy(() => import("../pages/CulturalExchangeTemplate")),
  "club": lazy(() => import("../pages/ClubTemplate")),
  "community": lazy(() => import("../pages/CommunityTemplate")),
  "family-vacation": lazy(() => import("../pages/FamilyVacationTemplate")),
  "family-reunion": lazy(() => import("../pages/FamilyTemplate")),
  "group-trip": lazy(() => import("../pages/GroupTripTemplate")),
  "study-group": lazy(() => import("../pages/StudyGroupTemplate")),
  "school": lazy(() => import("../pages/SchoolTemplate")),
  "adventure-tour": lazy(() => import("../pages/AdventureTourTemplate")),
  "content-creator-meetup": lazy(() => import("../pages/ContentCreatorMeetupTemplate")),
  "influencer-retreat": lazy(() => import("../pages/InfluencerRetreatTemplate")),
  "product-review-event": lazy(() => import("../pages/ProductReviewEventTemplate")),
  "social-media-campaign": lazy(() => import("../pages/SocialMediaCampaignTemplate")),
  "fraternity-sorority": lazy(() => import("../pages/FraternitySororityTemplate")),
  "military": lazy(() => import("../pages/MilitaryTemplate")),
  "sports-team": lazy(() => import("../pages/SportsTeamTemplate")),
  "milestone": lazy(() => import("../pages/MilestoneTemplate")),
  "friends": lazy(() => import("../pages/FriendsTemplate")),
  "social": lazy(() => import("../pages/SocialTemplate")),
  "professional": lazy(() => import("../pages/ProfessionalTemplate")),
};

export default function TemplatePreviewModal({
  templateId,
  templateName,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading delay for better UX
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleUseTemplate = () => {
    onClose();
    setLocation(`/templates/gallery/${templateId}`);
  };

  const TemplateComponent = templateComponents[templateId];

  if (!TemplateComponent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl">{templateName} Template Preview</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading template preview...</p>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                }
              >
                <TemplateComponent isPreview={true} />
              </Suspense>
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t bg-muted/30 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hover over sections to see details
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button onClick={handleUseTemplate}>
              <Sparkles className="mr-2 h-4 w-4" />
              Use This Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

