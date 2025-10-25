import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  HardDrive,
  Info,
  Server,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

export default function SystemMonitoring() {
  const [logLevel, setLogLevel] = useState("all");
  const [logCategory, setLogCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  // Mock system metrics
  const systemMetrics = {
    uptime: "15 days, 3 hours",
    cpu: 45,
    memory: 62,
    disk: 38,
    activeUsers: 127,
    requestsPerMin: 342,
    avgResponseTime: 145,
    errorRate: 0.2,
  };

  // Mock system logs
  const systemLogs = [
    {
      id: 1,
      timestamp: "2025-10-25 05:45:23",
      level: "info",
      category: "auth",
      message: "User login successful",
      details: "User ID: 1234, IP: 192.168.1.1",
    },
    {
      id: 2,
      timestamp: "2025-10-25 05:44:15",
      level: "warning",
      category: "database",
      message: "Slow query detected",
      details: "Query took 2.3s to execute",
    },
    {
      id: 3,
      timestamp: "2025-10-25 05:43:02",
      level: "error",
      category: "api",
      message: "External API timeout",
      details: "Stripe API request timed out after 30s",
    },
    {
      id: 4,
      timestamp: "2025-10-25 05:42:18",
      level: "critical",
      category: "system",
      message: "High memory usage detected",
      details: "Memory usage at 85%",
    },
    {
      id: 5,
      timestamp: "2025-10-25 05:41:05",
      level: "info",
      category: "event",
      message: "New event created",
      details: "Event ID: 5678, Type: Wedding",
    },
  ];

  // Mock activity logs
  const activityLogs = [
    {
      id: 1,
      timestamp: "2025-10-25 05:45:00",
      user: "Carlton Campbell",
      action: "Created Event",
      entityType: "event",
      entityId: "5678",
      ipAddress: "192.168.1.1",
    },
    {
      id: 2,
      timestamp: "2025-10-25 05:40:00",
      user: "John Doe",
      action: "Updated Venue",
      entityType: "venue",
      entityId: "1234",
      ipAddress: "192.168.1.2",
    },
    {
      id: 3,
      timestamp: "2025-10-25 05:35:00",
      user: "Jane Smith",
      action: "Deleted Member",
      entityType: "member",
      entityId: "9012",
      ipAddress: "192.168.1.3",
    },
  ];

  // Mock performance metrics
  const performanceMetrics = [
    { metric: "API Response Time", value: 145, unit: "ms", trend: "+5%" },
    { metric: "Database Query Time", value: 23, unit: "ms", trend: "-12%" },
    { metric: "Page Load Time", value: 1.2, unit: "s", trend: "+3%" },
    { metric: "Error Rate", value: 0.2, unit: "%", trend: "-15%" },
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return <Badge className="bg-blue-500"><Info className="h-3 w-3 mr-1" />Info</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />Warning</Badge>;
      case "error":
        return <Badge className="bg-orange-500"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
      case "critical":
        return <Badge className="bg-red-500"><AlertCircle className="h-3 w-3 mr-1" />Critical</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    if (value < threshold * 0.5) return "text-green-500";
    if (value < threshold * 0.75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">System Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Monitor system health, logs, and performance metrics
          </p>
        </div>

        {/* System Health Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getMetricColor(systemMetrics.cpu, 100)}`}>
                {systemMetrics.cpu}%
              </div>
              <p className="text-xs text-muted-foreground">Normal range</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getMetricColor(systemMetrics.memory, 100)}`}>
                {systemMetrics.memory}%
              </div>
              <p className="text-xs text-muted-foreground">8GB / 16GB used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getMetricColor(systemMetrics.disk, 100)}`}>
                {systemMetrics.disk}%
              </div>
              <p className="text-xs text-muted-foreground">38GB / 100GB used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-500">{systemMetrics.uptime}</div>
              <p className="text-xs text-muted-foreground">Last restart: Oct 10</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">+23 from last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests/Min</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.requestsPerMin}</div>
              <p className="text-xs text-muted-foreground">Normal traffic</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemMetrics.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">+5ms from avg</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{systemMetrics.errorRate}%</div>
              <p className="text-xs text-muted-foreground">Within threshold</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Logs and Metrics */}
        <Tabs defaultValue="system-logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="system-logs">System Logs</TabsTrigger>
            <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>

          {/* System Logs Tab */}
          <TabsContent value="system-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>View and filter system logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={logCategory} onValueChange={setLogCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="event">Events</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Export Logs</Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>{getLevelBadge(log.level)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.category}</Badge>
                          </TableCell>
                          <TableCell>{log.message}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity-logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Track user actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>Entity ID</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.entityType}</TableCell>
                          <TableCell className="font-mono text-sm">{log.entityId}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Metrics Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Monitor application performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{metric.metric}</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.value} {metric.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={metric.trend.startsWith("+") ? "bg-red-500" : "bg-green-500"}>
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

