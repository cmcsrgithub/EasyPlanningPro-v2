import { useRoute } from "wouter";
import { lazy, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// Map of template IDs to their component files (matching actual filenames)
const templateComponents: Record<string, any> = {
  "wedding": lazy(() => import("./WeddingTemplate")),
  "birthday-party": lazy(() => import("./BirthdayPartyTemplate")),
  "baby-shower": lazy(() => import("./BabyShowerTemplate")),
  "graduation": lazy(() => import("./GraduationTemplate")),
  "destination-wedding": lazy(() => import("./DestinationWeddingTemplate")),
  "neighborhood-bbq": lazy(() => import("./NeighborhoodBbqTemplate")),
  "corporate-conference": lazy(() => import("./CorporateConferenceTemplate")),
  "academic-conference": lazy(() => import("./AcademicConferenceTemplate")),
  "workshop": lazy(() => import("./WorkshopTemplate")),
  "seminar": lazy(() => import("./SeminarTemplate")),
  "training-session": lazy(() => import("./TrainingSessionTemplate")),
  "networking-mixer": lazy(() => import("./NetworkingMixerTemplate")),
  "product-launch": lazy(() => import("./ProductLaunchTemplate")),
  "sales-kickoff": lazy(() => import("./SalesKickoffTemplate")),
  "team-building-retreat": lazy(() => import("./TeamBuildingRetreatTemplate")),
  "brand-launch-partnership": lazy(() => import("./BrandLaunchPartnershipTemplate")),
  "sports-tournament": lazy(() => import("./SportsTournamentTemplate")),
  "championship-event": lazy(() => import("./ChampionshipEventTemplate")),
  "sports-banquet": lazy(() => import("./SportsBanquetTemplate")),
  "sports-camp": lazy(() => import("./SportsCampTemplate")),
  "walk-run-event": lazy(() => import("./WalkRunEventTemplate")),
  "fantasy-league-draft": lazy(() => import("./FantasyLeagueDraftTemplate")),
  "music-festival": lazy(() => import("./MusicFestivalTemplate")),
  "art-exhibition": lazy(() => import("./ArtExhibitionTemplate")),
  "film-screening": lazy(() => import("./FilmScreeningTemplate")),
  "comedy-show": lazy(() => import("./ComedyShowTemplate")),
  "talent-show": lazy(() => import("./TalentShowTemplate")),
  "charity-gala": lazy(() => import("./CharityGalaTemplate")),
  "auction-event": lazy(() => import("./AuctionEventTemplate")),
  "benefit-concert": lazy(() => import("./BenefitConcertTemplate")),
  "volunteer-drive": lazy(() => import("./VolunteerDriveTemplate")),
  "crowdfunding-campaign": lazy(() => import("./CrowdfundingCampaignTemplate")),
  "town-hall-meeting": lazy(() => import("./TownHallMeetingTemplate")),
  "cultural-exchange": lazy(() => import("./CulturalExchangeTemplate")),
  "club": lazy(() => import("./ClubTemplate")),
  "community": lazy(() => import("./CommunityTemplate")),
  "family-vacation": lazy(() => import("./FamilyVacationTemplate")),
  "family-reunion": lazy(() => import("./FamilyTemplate")),
  "group-trip": lazy(() => import("./GroupTripTemplate")),
  "study-group": lazy(() => import("./StudyGroupTemplate")),
  "school": lazy(() => import("./SchoolTemplate")),
  "adventure-tour": lazy(() => import("./AdventureTourTemplate")),
  "content-creator-meetup": lazy(() => import("./ContentCreatorMeetupTemplate")),
  "influencer-retreat": lazy(() => import("./InfluencerRetreatTemplate")),
  "product-review-event": lazy(() => import("./ProductReviewEventTemplate")),
  "social-media-campaign": lazy(() => import("./SocialMediaCampaignTemplate")),
  "fraternity-sorority": lazy(() => import("./FraternitySororityTemplate")),
  "military": lazy(() => import("./MilitaryTemplate")),
  "sports-team": lazy(() => import("./SportsTeamTemplate")),
  "milestone": lazy(() => import("./MilestoneTemplate")),
  // Additional templates that exist
  "friends": lazy(() => import("./FriendsTemplate")),
  "social": lazy(() => import("./SocialTemplate")),
  "professional": lazy(() => import("./ProfessionalTemplate")),
};

export default function TemplateViewer() {
  const [, params] = useRoute("/templates/gallery/:id");
  const templateId = params?.id;

  if (!templateId || !templateComponents[templateId]) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Template Not Found</h3>
              <p className="text-muted-foreground text-center">
                The template you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const TemplateComponent = templateComponents[templateId];

  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground">Loading template...</p>
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <TemplateComponent />
    </Suspense>
  );
}

