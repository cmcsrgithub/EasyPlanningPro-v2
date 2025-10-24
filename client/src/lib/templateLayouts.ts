import { Heart, Cake, Baby, GraduationCap, Plane, Flame, Briefcase, BookOpen, Wrench, Users, TrendingUp, Rocket, DollarSign, Mountain, Handshake, Trophy, Medal, UtensilsCrossed, Activity, PersonStanding, Gamepad2, Music, Palette, Film, Laugh, Star, HeartHandshake, Gavel, Mic2, HandHeart, PiggyBank, Landmark, Globe, UsersRound, Home as HomeIcon, Palmtree, UserPlus, Bus, BookMarked, School, Compass, Video, Instagram, Package, Share2, Shield, Flag, Users2, PartyPopper } from "lucide-react";

export interface TemplateLayout {
  id: string;
  name: string;
  icon: any;
  category: string;
  description: string;
  sections: string[];
  checklist?: string[];
}

export const templateLayouts: TemplateLayout[] = [
  // Social Events
  {
    id: "wedding",
    name: "Wedding",
    icon: Heart,
    category: "Social",
    description: "Complete wedding planning with ceremony, reception, and guest management",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "venue", "catering", "entertainment", "photoGallery", "checklist", "budget", "cta"],
    checklist: ["Set wedding date", "Book venues", "Send invitations", "Hire vendors", "Plan menu", "Arrange seating"]
  },
  {
    id: "birthday-party",
    name: "Birthday Party",
    icon: Cake,
    category: "Social",
    description: "Birthday celebration with activities, games, and party planning",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "catering", "entertainment", "photoGallery", "checklist", "cta"],
    checklist: ["Choose theme", "Send invitations", "Order cake", "Plan games", "Arrange decorations", "Prepare party favors"]
  },
  {
    id: "baby-shower",
    name: "Baby Shower",
    icon: Baby,
    category: "Social",
    description: "Baby shower planning with games, gifts, and guest coordination",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Choose theme", "Create guest list", "Plan games", "Order decorations", "Arrange food", "Set up gift registry"]
  },
  {
    id: "graduation",
    name: "Graduation",
    icon: GraduationCap,
    category: "Social",
    description: "Graduation ceremony and celebration planning",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Book venue", "Send invitations", "Order announcements", "Plan menu", "Arrange seating", "Prepare speeches"]
  },
  {
    id: "destination-wedding",
    name: "Destination Wedding",
    icon: Plane,
    category: "Social",
    description: "Multi-day destination wedding with travel coordination",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "venue", "activities", "catering", "entertainment", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Choose destination", "Book travel", "Reserve accommodations", "Plan activities", "Coordinate vendors", "Send travel info"]
  },
  {
    id: "neighborhood-bbq",
    name: "Neighborhood BBQ",
    icon: Flame,
    category: "Social",
    description: "Casual neighborhood gathering with food and activities",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "catering", "activities", "checklist", "cta"],
    checklist: ["Set date", "Invite neighbors", "Plan menu", "Arrange seating", "Prepare games", "Set up grill"]
  },

  // Professional Events
  {
    id: "corporate-conference",
    name: "Corporate Conference",
    icon: Briefcase,
    category: "Professional",
    description: "Multi-day corporate conference with sessions and networking",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Book venue", "Confirm speakers", "Set agenda", "Arrange catering", "Promote event", "Manage registrations"]
  },
  {
    id: "academic-conference",
    name: "Academic Conference",
    icon: BookOpen,
    category: "Professional",
    description: "Academic conference with paper presentations and workshops",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "checklist", "cta"],
    checklist: ["Call for papers", "Review submissions", "Schedule sessions", "Book venue", "Arrange accommodations", "Publish program"]
  },
  {
    id: "workshop",
    name: "Workshop",
    icon: Wrench,
    category: "Professional",
    description: "Interactive workshop with hands-on activities",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "checklist", "cta"],
    checklist: ["Define objectives", "Prepare materials", "Book venue", "Promote workshop", "Manage registrations", "Set up space"]
  },
  {
    id: "seminar",
    name: "Seminar",
    icon: Users,
    category: "Professional",
    description: "Educational seminar with expert speakers",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "checklist", "cta"],
    checklist: ["Confirm speakers", "Book venue", "Create agenda", "Promote event", "Manage registrations", "Prepare materials"]
  },
  {
    id: "training-session",
    name: "Training Session",
    icon: TrendingUp,
    category: "Professional",
    description: "Professional training and skill development",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "checklist", "cta"],
    checklist: ["Define learning objectives", "Prepare curriculum", "Book venue", "Arrange materials", "Promote training", "Assess participants"]
  },
  {
    id: "networking-mixer",
    name: "Networking Mixer",
    icon: Users,
    category: "Professional",
    description: "Professional networking event",
    sections: ["hero", "dateTime", "location", "ticketing", "rsvp", "venue", "catering", "sponsors", "checklist", "cta"],
    checklist: ["Book venue", "Promote event", "Arrange catering", "Prepare name tags", "Plan icebreakers", "Follow up with attendees"]
  },
  {
    id: "product-launch",
    name: "Product Launch",
    icon: Rocket,
    category: "Professional",
    description: "Product launch event with demos and presentations",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "catering", "sponsors", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Finalize product", "Book venue", "Invite media", "Prepare demos", "Arrange catering", "Plan presentations"]
  },
  {
    id: "sales-kickoff",
    name: "Sales Kickoff",
    icon: DollarSign,
    category: "Professional",
    description: "Sales team kickoff meeting and training",
    sections: ["hero", "dateTime", "location", "activities", "venue", "catering", "checklist", "cta"],
    checklist: ["Set goals", "Prepare presentations", "Book venue", "Arrange team building", "Plan training sessions", "Motivate team"]
  },
  {
    id: "team-building-retreat",
    name: "Team Building Retreat",
    icon: Mountain,
    category: "Professional",
    description: "Team building activities and retreat",
    sections: ["hero", "dateTime", "location", "activities", "venue", "catering", "budget", "checklist", "cta"],
    checklist: ["Choose location", "Plan activities", "Book accommodations", "Arrange transportation", "Prepare agenda", "Set objectives"]
  },
  {
    id: "brand-launch-partnership",
    name: "Brand Launch Partnership",
    icon: Handshake,
    category: "Professional",
    description: "Brand partnership launch event",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "catering", "sponsors", "photoGallery", "checklist", "cta"],
    checklist: ["Finalize partnership", "Book venue", "Invite stakeholders", "Prepare presentations", "Arrange media coverage", "Plan celebration"]
  },

  // Sports & Recreation
  {
    id: "sports-tournament",
    name: "Sports Tournament",
    icon: Trophy,
    category: "Sports",
    description: "Multi-team sports tournament with brackets and scheduling",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Register teams", "Create brackets", "Book venues", "Arrange officials", "Promote tournament", "Award prizes"]
  },
  {
    id: "championship-event",
    name: "Championship Event",
    icon: Medal,
    category: "Sports",
    description: "Championship game or match event",
    sections: ["hero", "dateTime", "location", "ticketing", "venue", "sponsors", "photoGallery", "checklist", "cta"],
    checklist: ["Book venue", "Sell tickets", "Arrange security", "Coordinate media", "Prepare awards", "Plan celebration"]
  },
  {
    id: "sports-banquet",
    name: "Sports Banquet",
    icon: UtensilsCrossed,
    category: "Sports",
    description: "End-of-season sports awards banquet",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "venue", "catering", "checklist", "cta"],
    checklist: ["Book venue", "Send invitations", "Order awards", "Plan menu", "Prepare speeches", "Arrange seating"]
  },
  {
    id: "sports-camp",
    name: "Sports Camp",
    icon: Activity,
    category: "Sports",
    description: "Multi-day sports training camp",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "catering", "checklist", "cta"],
    checklist: ["Hire coaches", "Register participants", "Book facilities", "Plan curriculum", "Arrange meals", "Prepare equipment"]
  },
  {
    id: "walk-run-event",
    name: "Walk/Run Event",
    icon: PersonStanding,
    category: "Sports",
    description: "Charity walk or run event",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "sponsors", "fundraising", "photoGallery", "checklist", "cta"],
    checklist: ["Plan route", "Register participants", "Arrange permits", "Recruit volunteers", "Promote event", "Set up finish line"]
  },
  {
    id: "fantasy-league-draft",
    name: "Fantasy League Draft",
    icon: Gamepad2,
    category: "Sports",
    description: "Fantasy sports league draft party",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "catering", "checklist", "cta"],
    checklist: ["Set draft order", "Invite league members", "Prepare draft board", "Arrange food", "Set up technology", "Review rules"]
  },

  // Entertainment
  {
    id: "music-festival",
    name: "Music Festival",
    icon: Music,
    category: "Entertainment",
    description: "Multi-day music festival with multiple stages",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Book artists", "Secure venue", "Sell tickets", "Arrange stages", "Coordinate vendors", "Plan logistics"]
  },
  {
    id: "art-exhibition",
    name: "Art Exhibition",
    icon: Palette,
    category: "Entertainment",
    description: "Art gallery exhibition and opening",
    sections: ["hero", "dateTime", "location", "ticketing", "rsvp", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Curate artwork", "Book gallery", "Promote exhibition", "Plan opening reception", "Arrange catering", "Prepare labels"]
  },
  {
    id: "film-screening",
    name: "Film Screening",
    icon: Film,
    category: "Entertainment",
    description: "Movie screening and premiere event",
    sections: ["hero", "dateTime", "location", "ticketing", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Secure film rights", "Book theater", "Sell tickets", "Promote screening", "Arrange Q&A", "Plan reception"]
  },
  {
    id: "comedy-show",
    name: "Comedy Show",
    icon: Laugh,
    category: "Entertainment",
    description: "Stand-up comedy performance",
    sections: ["hero", "dateTime", "location", "ticketing", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Book comedians", "Secure venue", "Sell tickets", "Promote show", "Arrange sound system", "Plan seating"]
  },
  {
    id: "talent-show",
    name: "Talent Show",
    icon: Star,
    category: "Entertainment",
    description: "Community talent showcase",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "photoGallery", "checklist", "cta"],
    checklist: ["Open auditions", "Book venue", "Promote event", "Arrange judges", "Plan program", "Prepare awards"]
  },

  // Charity & Fundraising
  {
    id: "charity-gala",
    name: "Charity Gala",
    icon: HeartHandshake,
    category: "Charity",
    description: "Formal charity fundraising gala",
    sections: ["hero", "dateTime", "location", "ticketing", "venue", "catering", "entertainment", "sponsors", "fundraising", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Set fundraising goal", "Book venue", "Recruit sponsors", "Plan auction", "Arrange entertainment", "Promote event"]
  },
  {
    id: "auction-event",
    name: "Auction Event",
    icon: Gavel,
    category: "Charity",
    description: "Charity auction with silent and live bidding",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "catering", "fundraising", "checklist", "cta"],
    checklist: ["Collect auction items", "Book venue", "Promote event", "Arrange bidding system", "Recruit volunteers", "Plan logistics"]
  },
  {
    id: "benefit-concert",
    name: "Benefit Concert",
    icon: Mic2,
    category: "Charity",
    description: "Fundraising concert event",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "fundraising", "photoGallery", "checklist", "cta"],
    checklist: ["Book artists", "Secure venue", "Sell tickets", "Recruit sponsors", "Promote concert", "Arrange production"]
  },
  {
    id: "volunteer-drive",
    name: "Volunteer Drive",
    icon: HandHeart,
    category: "Charity",
    description: "Community volunteer recruitment event",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "checklist", "cta"],
    checklist: ["Define volunteer needs", "Promote drive", "Register volunteers", "Prepare materials", "Coordinate activities", "Follow up"]
  },
  {
    id: "crowdfunding-campaign",
    name: "Crowdfunding Campaign",
    icon: PiggyBank,
    category: "Charity",
    description: "Online crowdfunding campaign launch",
    sections: ["hero", "dateTime", "activities", "fundraising", "photoGallery", "checklist", "cta"],
    checklist: ["Set goal", "Create campaign page", "Prepare video", "Promote campaign", "Update backers", "Deliver rewards"]
  },

  // Community Events
  {
    id: "town-hall-meeting",
    name: "Town Hall Meeting",
    icon: Landmark,
    category: "Community",
    description: "Community town hall and Q&A",
    sections: ["hero", "dateTime", "location", "rsvp", "venue", "activities", "checklist", "cta"],
    checklist: ["Set agenda", "Book venue", "Promote meeting", "Prepare presentations", "Arrange Q&A", "Follow up on action items"]
  },
  {
    id: "cultural-exchange",
    name: "Cultural Exchange",
    icon: Globe,
    category: "Community",
    description: "Cultural celebration and exchange",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "catering", "entertainment", "photoGallery", "checklist", "cta"],
    checklist: ["Plan activities", "Book venue", "Arrange performances", "Prepare food", "Promote event", "Coordinate volunteers"]
  },
  {
    id: "club",
    name: "Club Event",
    icon: UsersRound,
    category: "Community",
    description: "Club meeting or activity",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "checklist", "cta"],
    checklist: ["Set agenda", "Notify members", "Book venue", "Prepare materials", "Plan activities", "Take minutes"]
  },
  {
    id: "community",
    name: "Community Gathering",
    icon: HomeIcon,
    category: "Community",
    description: "General community event",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Plan activities", "Book venue", "Promote event", "Arrange food", "Recruit volunteers", "Set up space"]
  },

  // Family Events
  {
    id: "family-vacation",
    name: "Family Vacation",
    icon: Palmtree,
    category: "Family",
    description: "Multi-day family vacation planning",
    sections: ["hero", "dateTime", "location", "activities", "venue", "budget", "checklist", "cta"],
    checklist: ["Choose destination", "Book travel", "Reserve accommodations", "Plan activities", "Pack essentials", "Create itinerary"]
  },
  {
    id: "family-reunion",
    name: "Family Reunion",
    icon: UserPlus,
    category: "Family",
    description: "Family reunion with activities and meals",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Create guest list", "Book venue", "Send invitations", "Plan activities", "Arrange meals", "Prepare family tree"]
  },
  {
    id: "group-trip",
    name: "Group Trip",
    icon: Bus,
    category: "Family",
    description: "Group travel and activity planning",
    sections: ["hero", "dateTime", "location", "guestList", "activities", "budget", "checklist", "cta"],
    checklist: ["Choose destination", "Coordinate schedules", "Book transportation", "Reserve accommodations", "Plan activities", "Set budget"]
  },

  // Educational
  {
    id: "study-group",
    name: "Study Group",
    icon: BookMarked,
    category: "Educational",
    description: "Study group session planning",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "checklist", "cta"],
    checklist: ["Set study topics", "Schedule sessions", "Book location", "Prepare materials", "Assign roles", "Review progress"]
  },
  {
    id: "school",
    name: "School Event",
    icon: School,
    category: "Educational",
    description: "School activity or program",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "checklist", "cta"],
    checklist: ["Get approval", "Book venue", "Notify parents", "Plan program", "Recruit volunteers", "Arrange supervision"]
  },

  // Special Interest
  {
    id: "adventure-tour",
    name: "Adventure Tour",
    icon: Compass,
    category: "Special Interest",
    description: "Outdoor adventure and tour planning",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "budget", "checklist", "cta"],
    checklist: ["Plan route", "Check weather", "Book permits", "Prepare equipment", "Arrange transportation", "Brief participants"]
  },
  {
    id: "content-creator-meetup",
    name: "Content Creator Meetup",
    icon: Video,
    category: "Special Interest",
    description: "Content creator networking event",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "sponsors", "photoGallery", "checklist", "cta"],
    checklist: ["Book venue", "Promote event", "Plan activities", "Arrange equipment", "Coordinate sponsors", "Follow up"]
  },
  {
    id: "influencer-retreat",
    name: "Influencer Retreat",
    icon: Instagram,
    category: "Special Interest",
    description: "Influencer collaboration retreat",
    sections: ["hero", "dateTime", "location", "activities", "venue", "catering", "sponsors", "photoGallery", "budget", "checklist", "cta"],
    checklist: ["Invite influencers", "Book venue", "Plan content sessions", "Arrange accommodations", "Coordinate sponsors", "Create schedule"]
  },
  {
    id: "product-review-event",
    name: "Product Review Event",
    icon: Package,
    category: "Special Interest",
    description: "Product testing and review event",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "sponsors", "photoGallery", "checklist", "cta"],
    checklist: ["Select products", "Invite reviewers", "Book venue", "Prepare samples", "Arrange demos", "Collect feedback"]
  },
  {
    id: "social-media-campaign",
    name: "Social Media Campaign",
    icon: Share2,
    category: "Special Interest",
    description: "Social media campaign launch",
    sections: ["hero", "dateTime", "activities", "photoGallery", "checklist", "cta"],
    checklist: ["Define goals", "Create content", "Schedule posts", "Engage audience", "Track metrics", "Optimize strategy"]
  },

  // Organization-Specific
  {
    id: "fraternity-sorority",
    name: "Fraternity/Sorority Event",
    icon: Shield,
    category: "Organization",
    description: "Greek life event planning",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "venue", "budget", "checklist", "cta"],
    checklist: ["Get chapter approval", "Book venue", "Invite members", "Plan activities", "Arrange catering", "Coordinate logistics"]
  },
  {
    id: "military",
    name: "Military Event",
    icon: Flag,
    category: "Organization",
    description: "Military ceremony or gathering",
    sections: ["hero", "dateTime", "location", "rsvp", "venue", "activities", "checklist", "cta"],
    checklist: ["Follow protocol", "Book venue", "Arrange honors", "Coordinate uniforms", "Plan ceremony", "Prepare speeches"]
  },
  {
    id: "sports-team",
    name: "Sports Team Event",
    icon: Users2,
    category: "Organization",
    description: "Team event and activity",
    sections: ["hero", "dateTime", "location", "rsvp", "activities", "venue", "catering", "checklist", "cta"],
    checklist: ["Notify team", "Book venue", "Plan activities", "Arrange food", "Coordinate equipment", "Take photos"]
  },
  {
    id: "milestone",
    name: "Milestone Celebration",
    icon: PartyPopper,
    category: "Organization",
    description: "Anniversary or milestone event",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "venue", "catering", "entertainment", "photoGallery", "checklist", "cta"],
    checklist: ["Set date", "Book venue", "Send invitations", "Plan program", "Arrange catering", "Prepare presentations"]
  },

  // Additional
  {
    id: "friends",
    name: "Friends Gathering",
    icon: Users,
    category: "Social",
    description: "Casual friends get-together",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Set date", "Invite friends", "Plan activities", "Arrange food", "Prepare space", "Have fun"]
  },
  {
    id: "social",
    name: "Social Event",
    icon: Users,
    category: "Social",
    description: "General social gathering",
    sections: ["hero", "dateTime", "location", "guestList", "rsvp", "activities", "venue", "catering", "photoGallery", "checklist", "cta"],
    checklist: ["Plan event", "Invite guests", "Book venue", "Arrange food", "Prepare activities", "Enjoy"]
  },
  {
    id: "professional",
    name: "Professional Event",
    icon: Briefcase,
    category: "Professional",
    description: "General professional gathering",
    sections: ["hero", "dateTime", "location", "ticketing", "activities", "venue", "sponsors", "checklist", "cta"],
    checklist: ["Define objectives", "Book venue", "Promote event", "Manage registrations", "Coordinate logistics", "Follow up"]
  },
];

export function getTemplateLayout(templateId: string): TemplateLayout | undefined {
  return templateLayouts.find(t => t.id === templateId);
}

