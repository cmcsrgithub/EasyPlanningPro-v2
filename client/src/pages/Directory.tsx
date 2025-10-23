import { trpc } from "@/lib/trpc";
import { Users, Plus, Mail, Phone, UserCircle } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

export default function Directory() {
  const { data: members, isLoading } = trpc.members.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Directory</h1>
            <p className="text-muted-foreground mt-2">
              Manage your member directory and contacts
            </p>
          </div>
          <Link href="/directory/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Member
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <Link key={member.id} href={`/directory/${member.id}`}>
                <Card className="hover:shadow-lg transition-apple cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircle className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-1">{member.name}</CardTitle>
                        {member.branch && (
                          <CardDescription className="line-clamp-1">
                            {member.branch}
                          </CardDescription>
                        )}
                        {member.isAdmin && (
                          <Badge variant="secondary" className="mt-1">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {member.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{member.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No members yet</h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Start building your directory by adding members and contacts.
              </p>
              <Link href="/directory/new">
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Member
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

