'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Activity, 
  Thermometer, 
  Bell, 
  Heart, 
  Settings, 
  LogOut,
  TrendingUp,
  Shield,
  AlertTriangle
} from 'lucide-react';

const temperatureData = [
  { name: 'Mon', value: 22.5 },
  { name: 'Tue', value: 23.1 },
  { name: 'Wed', value: 21.8 },
  { name: 'Thu', value: 24.2 },
  { name: 'Fri', value: 22.9 },
  { name: 'Sat', value: 23.6 },
  { name: 'Sun', value: 22.3 },
];

const alertData = [
  { name: 'Help Requests', value: 45, color: '#ef4444' },
  { name: 'Water Requests', value: 32, color: '#3b82f6' },
  { name: 'Temperature Alerts', value: 18, color: '#f59e0b' },
  { name: 'Motion Alerts', value: 12, color: '#10b981' },
];

const userActivityData = [
  { name: 'Jan', active: 120, total: 150 },
  { name: 'Feb', active: 135, total: 160 },
  { name: 'Mar', active: 148, total: 170 },
  { name: 'Apr', active: 142, total: 165 },
  { name: 'May', active: 156, total: 180 },
  { name: 'Jun', active: 163, total: 185 },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeDevices: 892,
    totalAlerts: 107,
    avgResponseTime: '2.3',
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAlerts: prev.totalAlerts + Math.floor(Math.random() * 3),
        activeDevices: 890 + Math.floor(Math.random() * 10),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-care-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-care-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">System overview and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-care-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-care-600">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
              <Activity className="h-4 w-4 text-health-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-health-600">{stats.activeDevices}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeDevices / stats.totalUsers) * 100).toFixed(1)}% online rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-alert-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-alert-600">{stats.totalAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}m</div>
              <p className="text-xs text-muted-foreground">
                Caregiver response time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Temperature Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="h-5 w-5 mr-2" />
                Average Temperature Trends
              </CardTitle>
              <CardDescription>
                Weekly temperature averages across all devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alert Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alert Distribution
              </CardTitle>
              <CardDescription>
                Types of alerts received this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alertData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {alertData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Activity Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Activity Overview
            </CardTitle>
            <CardDescription>
              Active vs total users over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#e2e8f0" name="Total Users" />
                <Bar dataKey="active" fill="#0ea5e9" name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Health
              </CardTitle>
              <CardDescription>
                Current system status and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-green-600">142ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database Performance</span>
                  <span className="text-sm text-green-600">98.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Device Connectivity</span>
                  <span className="text-sm text-green-600">96.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alert Processing</span>
                  <span className="text-sm text-orange-600">1.2s avg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent System Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent System Events
              </CardTitle>
              <CardDescription>
                Latest system activities and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-gray-500">sarah.johnson@email.com - 2 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Device connectivity issue</p>
                    <p className="text-xs text-gray-500">Device EDC_789 went offline - 15 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">System maintenance completed</p>
                    <p className="text-xs text-gray-500">Database optimization finished - 1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">High priority alert processed</p>
                    <p className="text-xs text-gray-500">Emergency button pressed - 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Backup completed successfully</p>
                    <p className="text-xs text-gray-500">Daily data backup - 3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="h-12" variant="care">
            <Users className="h-5 w-5 mr-2" />
            Manage Users
          </Button>
          <Button className="h-12" variant="outline">
            <Activity className="h-5 w-5 mr-2" />
            System Reports
          </Button>
          <Button className="h-12" variant="outline">
            <Bell className="h-5 w-5 mr-2" />
            Alert Settings
          </Button>
          <Button className="h-12" variant="outline">
            <Settings className="h-5 w-5 mr-2" />
            System Config
          </Button>
        </div>
      </div>
    </div>
  );
}