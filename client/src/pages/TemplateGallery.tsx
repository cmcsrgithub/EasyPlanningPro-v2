import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import TemplatePreviewModal from "@/components/TemplatePreviewModal";

const templates = [
  // Social Events
  { id: "wedding", name: "Wedding", category: "Social", description: "Complete wedding planning template with ceremony, reception, and guest management", icon: "💒" },
  { id: "birthday-party", name: "Birthday Party", category: "Social", description: "Birthday celebration with invitations, activities, and party planning", icon: "🎂" },
  { id: "baby-shower", name: "Baby Shower", category: "Social", description: "Baby shower planning with games, gifts, and guest coordination", icon: "👶" },
  { id: "graduation", name: "Graduation", category: "Social", description: "Graduation ceremony and celebration planning", icon: "🎓" },
  { id: "destination-wedding", name: "Destination Wedding", category: "Social", description: "Multi-day destination wedding with travel coordination", icon: "✈️" },
  { id: "neighborhood-bbq", name: "Neighborhood BBQ", category: "Social", description: "Casual neighborhood gathering with food and activities", icon: "🍔" },
  
  // Professional Events
  { id: "corporate-conference", name: "Corporate Conference", category: "Professional", description: "Multi-day corporate conference with sessions, speakers, and networking", icon: "💼" },
  { id: "academic-conference", name: "Academic Conference", category: "Professional", description: "Academic conference with paper presentations and workshops", icon: "🎓" },
  { id: "workshop", name: "Workshop", category: "Professional", description: "Interactive workshop with hands-on activities", icon: "🛠️" },
  { id: "seminar", name: "Seminar", category: "Professional", description: "Educational seminar with expert speakers", icon: "📚" },
  { id: "training-session", name: "Training Session", category: "Professional", description: "Professional training and skill development", icon: "📖" },
  { id: "networking-mixer", name: "Networking Mixer", category: "Professional", description: "Professional networking event", icon: "🤝" },
  { id: "product-launch", name: "Product Launch", category: "Professional", description: "Product launch event with demos and presentations", icon: "🚀" },
  { id: "sales-kickoff", name: "Sales Kickoff", category: "Professional", description: "Sales team kickoff meeting and training", icon: "📊" },
  { id: "team-building-retreat", name: "Team Building Retreat", category: "Professional", description: "Team building activities and retreat", icon: "🏕️" },
  { id: "brand-launch-partnership", name: "Brand Launch Partnership", category: "Professional", description: "Brand partnership launch event", icon: "🤝" },
  
  // Sports & Recreation
  { id: "sports-tournament", name: "Sports Tournament", category: "Sports", description: "Multi-team sports tournament with brackets and scheduling", icon: "🏆" },
  { id: "championship-event", name: "Championship Event", category: "Sports", description: "Championship game or match event", icon: "🥇" },
  { id: "sports-banquet", name: "Sports Banquet", category: "Sports", description: "End-of-season sports awards banquet", icon: "🏅" },
  { id: "sports-camp", name: "Sports Camp", category: "Sports", description: "Multi-day sports training camp", icon: "⚽" },
  { id: "walk-run-event", name: "Walk/Run Event", category: "Sports", description: "Charity walk or run event", icon: "🏃" },
  { id: "fantasy-league-draft", name: "Fantasy League Draft", category: "Sports", description: "Fantasy sports league draft party", icon: "🎮" },
  
  // Entertainment
  { id: "music-festival", name: "Music Festival", category: "Entertainment", description: "Multi-day music festival with multiple stages", icon: "🎵" },
  { id: "art-exhibition", name: "Art Exhibition", category: "Entertainment", description: "Art gallery exhibition and opening", icon: "🎨" },
  { id: "film-screening", name: "Film Screening", category: "Entertainment", description: "Movie screening and premiere event", icon: "🎬" },
  { id: "comedy-show", name: "Comedy Show", category: "Entertainment", description: "Stand-up comedy performance", icon: "😂" },
  { id: "talent-show", name: "Talent Show", category: "Entertainment", description: "Community talent showcase", icon: "🌟" },
  
  // Charity & Fundraising
  { id: "charity-gala", name: "Charity Gala", category: "Charity", description: "Formal charity fundraising gala", icon: "🎭" },
  { id: "auction-event", name: "Auction Event", category: "Charity", description: "Charity auction with silent and live bidding", icon: "🔨" },
  { id: "benefit-concert", name: "Benefit Concert", category: "Charity", description: "Fundraising concert event", icon: "🎤" },
  { id: "volunteer-drive", name: "Volunteer Drive", category: "Charity", description: "Community volunteer recruitment event", icon: "🙋" },
  { id: "crowdfunding-campaign", name: "Crowdfunding Campaign", category: "Charity", description: "Online crowdfunding campaign launch", icon: "💰" },
  
  // Community Events
  { id: "town-hall-meeting", name: "Town Hall Meeting", category: "Community", description: "Community town hall and Q&A", icon: "🏛️" },
  { id: "cultural-exchange", name: "Cultural Exchange", category: "Community", description: "Cultural celebration and exchange", icon: "🌍" },
  { id: "club", name: "Club Event", category: "Community", description: "Club meeting or activity", icon: "👥" },
  { id: "community", name: "Community Gathering", category: "Community", description: "General community event", icon: "🏘️" },
  
  // Family Events
  { id: "family-vacation", name: "Family Vacation", category: "Family", description: "Multi-day family vacation planning", icon: "🏖️" },
  { id: "family-reunion", name: "Family Reunion", category: "Family", description: "Family reunion with activities and meals", icon: "👨‍👩‍👧‍👦" },
  { id: "group-trip", name: "Group Trip", category: "Family", description: "Group travel and activity planning", icon: "🚌" },
  
  // Educational
  { id: "study-group", name: "Study Group", category: "Educational", description: "Study group session planning", icon: "📝" },
  { id: "school", name: "School Event", category: "Educational", description: "School activity or program", icon: "🏫" },
  
  // Special Interest
  { id: "adventure-tour", name: "Adventure Tour", category: "Special Interest", description: "Outdoor adventure and tour planning", icon: "🏔️" },
  { id: "content-creator-meetup", name: "Content Creator Meetup", category: "Special Interest", description: "Content creator networking event", icon: "📹" },
  { id: "influencer-retreat", name: "Influencer Retreat", category: "Special Interest", description: "Influencer collaboration retreat", icon: "📱" },
  { id: "product-review-event", name: "Product Review Event", category: "Special Interest", description: "Product testing and review event", icon: "⭐" },
  { id: "social-media-campaign", name: "Social Media Campaign", category: "Special Interest", description: "Social media campaign launch", icon: "📲" },
  
  // Organization-Specific
  { id: "fraternity-sorority", name: "Fraternity/Sorority Event", category: "Organization", description: "Greek life event planning", icon: "🏛️" },
  { id: "military", name: "Military Event", category: "Organization", description: "Military ceremony or gathering", icon: "🎖️" },
  { id: "sports-team", name: "Sports Team Event", category: "Organization", description: "Team event and activity", icon: "⚾" },
  { id: "milestone", name: "Milestone Celebration", category: "Organization", description: "Anniversary or milestone event", icon: "🎊" },
];

export default function TemplateGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<{ id: string; name: string } | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMouseEnter = (templateId: string, templateName: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Set a delay before showing preview (500ms)
    const timeout = setTimeout(() => {
      setPreviewTemplate({ id: templateId, name: templateName });
    }, 500);
    
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear the timeout if user moves away before preview shows
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Template Gallery</h1>
            <p className="text-muted-foreground mt-2">
              Choose from 53 pre-built event templates • Hover to preview
            </p>
          </div>
          <Link href="/templates">
            <Button variant="outline">
              My Templates
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All ({templates.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({templates.filter(t => t.category === category).length})
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onMouseEnter={() => handleMouseEnter(template.id, template.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={`/templates/gallery/${template.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-4xl">{template.icon}</div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.description}
                    </p>
                    <Button className="w-full mt-4" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search or filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          templateId={previewTemplate.id}
          templateName={previewTemplate.name}
          isOpen={true}
          onClose={handleClosePreview}
        />
      )}
    </DashboardLayout>
  );
}

