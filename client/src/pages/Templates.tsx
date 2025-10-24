import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, TrendingUp, User } from "lucide-react";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: publicTemplates, isLoading: loadingPublic } = trpc.templates.listPublic.useQuery();
  const { data: myTemplates, isLoading: loadingMy } = trpc.templates.listMy.useQuery();

  const filteredPublic = publicTemplates?.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMy = myTemplates?.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TemplateCard = ({ template }: any) => (
    <Link href={`/templates/${template.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {template.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={template.imageUrl}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            {template.category && (
              <Badge variant="secondary">{template.category}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {template.description || "No description"}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{template.usageCount || 0} uses</span>
            </div>
            {template.eventType && (
              <Badge variant="outline" className="text-xs">
                {template.eventType}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Event Templates</h1>
            <p className="text-muted-foreground mt-2">
              Create events faster with pre-configured templates
            </p>
          </div>
          <Link href="/templates/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
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

        {/* Tabs */}
        <Tabs defaultValue="public" className="space-y-6">
          <TabsList>
            <TabsTrigger value="public">
              Public Templates ({publicTemplates?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="my">
              <User className="mr-2 h-4 w-4" />
              My Templates ({myTemplates?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-4">
            {loadingPublic ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredPublic && filteredPublic.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPublic.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Search className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "No public templates available yet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my" className="space-y-4">
            {loadingMy ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredMy && filteredMy.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMy.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <User className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Create your first template to reuse event configurations
                  </p>
                  <Link href="/templates/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

