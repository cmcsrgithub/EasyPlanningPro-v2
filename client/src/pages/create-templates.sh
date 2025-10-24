#!/bin/bash

# Create all event template pages
templates=(
  "AcademicConferenceTemplate:Academic Conference:Professional academic conference template"
  "AdventureTourTemplate:Adventure Tour:Adventure tour and expedition template"
  "ArtExhibitionTemplate:Art Exhibition:Art gallery exhibition template"
  "AuctionEventTemplate:Auction Event:Charity or fundraising auction template"
  "BabyShowerTemplate:Baby Shower:Baby shower celebration template"
  "BenefitConcertTemplate:Benefit Concert:Charity benefit concert template"
  "BirthdayPartyTemplate:Birthday Party:Birthday celebration template"
  "BrandLaunchPartnershipTemplate:Brand Launch:Brand launch partnership event template"
  "ChampionshipEventTemplate:Championship Event:Sports championship event template"
  "CharityGalaTemplate:Charity Gala:Formal charity gala template"
  "ClubTemplate:Club Event:Club gathering template"
  "ComedyShowTemplate:Comedy Show:Comedy show and entertainment template"
  "CommunityTemplate:Community Event:Community gathering template"
  "ContentCreatorMeetupTemplate:Creator Meetup:Content creator meetup template"
  "CorporateConferenceTemplate:Corporate Conference:Corporate business conference template"
  "CrowdfundingCampaignTemplate:Crowdfunding Campaign:Crowdfunding campaign event template"
  "CulturalExchangeTemplate:Cultural Exchange:Cultural exchange program template"
  "DestinationWeddingTemplate:Destination Wedding:Destination wedding template"
  "FamilyTemplate:Family Event:Family gathering template"
  "FamilyVacationTemplate:Family Vacation:Family vacation planning template"
  "FantasyLeagueDraftTemplate:Fantasy League Draft:Fantasy sports draft party template"
  "FilmScreeningTemplate:Film Screening:Movie screening event template"
  "FraternitySororityTemplate:Greek Life Event:Fraternity/sorority event template"
  "FriendsTemplate:Friends Gathering:Friends get-together template"
  "GraduationTemplate:Graduation:Graduation ceremony template"
  "GroupTripTemplate:Group Trip:Group travel planning template"
  "InfluencerRetreatTemplate:Influencer Retreat:Influencer retreat template"
  "MilestoneTemplate:Milestone Event:Milestone celebration template"
  "MilitaryTemplate:Military Event:Military ceremony template"
  "MusicFestivalTemplate:Music Festival:Music festival template"
  "NeighborhoodBBQTemplate:Neighborhood BBQ:Neighborhood barbecue template"
  "NetworkingMixerTemplate:Networking Mixer:Professional networking event template"
  "ProductLaunchTemplate:Product Launch:Product launch event template"
  "ProductReviewEventTemplate:Product Review Event:Product review event template"
  "ProfessionalTemplate:Professional Event:Professional networking template"
  "SalesKickoffTemplate:Sales Kickoff:Sales team kickoff template"
  "SchoolTemplate:School Event:School event template"
  "SeminarTemplate:Seminar:Educational seminar template"
  "SocialMediaCampaignTemplate:Social Media Campaign:Social media campaign template"
  "SocialTemplate:Social Event:Social gathering template"
  "SportsBanquetTemplate:Sports Banquet:Sports team banquet template"
  "SportsCampTemplate:Sports Camp:Sports training camp template"
  "SportsTeamTemplate:Sports Team Event:Sports team event template"
  "SportsTournamentTemplate:Sports Tournament:Sports tournament template"
  "StudyGroupTemplate:Study Group:Study group session template"
  "TalentShowTemplate:Talent Show:Talent show event template"
  "TeamBuildingRetreatTemplate:Team Building Retreat:Corporate team building template"
  "TownHallMeetingTemplate:Town Hall Meeting:Community town hall template"
  "TrainingSessionTemplate:Training Session:Training workshop template"
  "VolunteerDriveTemplate:Volunteer Drive:Volunteer recruitment event template"
  "WalkRunEventTemplate:Walk/Run Event:Charity walk or run template"
  "WeddingTemplate:Wedding:Wedding celebration template"
  "WorkshopTemplate:Workshop:Educational workshop template"
)

for template in "${templates[@]}"; do
  IFS=':' read -r filename title description <<< "$template"
  cat > "${filename}.tsx" << EOF
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ${filename}() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">${title}</h1>
          <p className="text-muted-foreground mt-2">${description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Use This Template</CardTitle>
            <CardDescription>Create a new event using this ${title} template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This template includes pre-configured settings, checklists, and workflows optimized for ${title} events.
            </p>
            <Button onClick={() => navigate("/events/create?template=${filename}")}>
              Create Event from Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
EOF
  echo "Created: ${filename}.tsx"
done

echo "Total templates created: ${#templates[@]}"
