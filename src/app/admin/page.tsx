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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  Activity, 
  Thermometer, 
  Bell, 
  Settings, 
  LogOut,
  TrendingUp,
  Shield,
  AlertTriangle,
  Database,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  Monitor,
  User,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Types for admin data
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  deviceSerialNumber?: string;
  deviceStatus: 'ONLINE' | 'OFFLINE' | 'ERROR';
  lastActive: string;
  patient?: {
    name: string;
    age: number;
  };
}

interface DeviceHealth {
  id: string;
  serialNumber: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastHeartbeat: string;
  batteryLevel?: number;
  signalStrength?: number;
  location: string;
  owner: string;
  uptime: number; // hours
}

interface SystemAlert {
  id: string;
  type: 'DEVICE_OFFLINE' | 'BATTERY_LOW' | 'SENSOR_ERROR' | 'CONNECTION_ISSUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  deviceId: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AnalyticsData {
  date: string;
  activeUsers: number;
  alerts: number;
  deviceUptime: number;
  responseTime: number;
}

// Mock data constants removed - now using real API data

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'devices' | 'alerts' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [devices, setDevices] = useState<DeviceHealth[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDevices: 0,
    totalAlerts: 0,
    avgUptime: 98.7,
    avgResponseTime: 1.6
  });

  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, devicesRes, alertsRes, analyticsRes, statsRes] = await Promise.all([
        fetch('/api/admin?endpoint=users'),
        fetch('/api/admin?endpoint=devices'),
        fetch('/api/admin?endpoint=alerts'),
        fetch('/api/admin?endpoint=analytics'),
        fetch('/api/admin?endpoint=stats')
      ]);

      const [usersData, devicesData, alertsData, analyticsData, statsData] = await Promise.all([
        usersRes.json(),
        devicesRes.json(),
        alertsRes.json(),
        analyticsRes.json(),
        statsRes.json()
      ]);

      setUsers(usersData.users || []);
      setDevices(devicesData.devices || []);
      setSystemAlerts(alertsData.alerts || []);
      setAnalytics(analyticsData.analytics || []);
      setStats(statsData.stats || stats);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      if (session?.user.role === 'ADMIN') {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [session]);

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

  const handleRefreshData = () => {
    fetchData();
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.deviceSerialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDevices = devices.filter(device =>
    device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deviceStatusData = [
    { name: 'Active', value: devices.filter(d => d.status === 'ACTIVE').length, color: '#10b981' },
    { name: 'Inactive', value: devices.filter(d => d.status === 'INACTIVE').length, color: '#f59e0b' },
    { name: 'Error', value: devices.filter(d => d.status === 'ERROR').length, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-care-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
                <p className="text-sm text-gray-500">VitaNet Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'devices', label: 'Devices', icon: Monitor },
            { key: 'alerts', label: 'System Alerts', icon: AlertTriangle },
            { key: 'analytics', label: 'Analytics', icon: PieChartIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white text-care-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-care-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-care-600">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Active caregivers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                  <Activity className="h-4 w-4 text-health-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-health-600">{stats.activeDevices}</div>
                  <p className="text-xs text-muted-foreground">Online devices</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.totalAlerts}</div>
                  <p className="text-xs text-muted-foreground">Unacknowledged</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.avgUptime.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.avgResponseTime.toFixed(1)}s</div>
                  <p className="text-xs text-muted-foreground">Average API response</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Device Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Status Distribution</CardTitle>
                  <CardDescription>Current status of all monitoring devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {deviceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {deviceStatusData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>System Performance Trends</CardTitle>
                  <CardDescription>Last 7 days performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="deviceUptime" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Recent System Alerts
                </CardTitle>
                <CardDescription>Latest system alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.severity === 'CRITICAL' ? 'bg-red-600' :
                          alert.severity === 'HIGH' ? 'bg-orange-500' :
                          alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-500">{alert.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.acknowledged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {alert.acknowledged ? 'Acknowledged' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-care-600"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all caregivers and their connected devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Device Serial</th>
                        <th className="text-left py-3 px-4">Patient</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-care-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-care-600" />
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {user.deviceSerialNumber || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {user.patient ? (
                              <div>
                                <p className="font-medium">{user.patient.name}</p>
                                <p className="text-sm text-gray-500">Age: {user.patient.age}</p>
                              </div>
                            ) : (
                              <span className="text-gray-400">No patient assigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`flex items-center space-x-1 ${
                              user.deviceStatus === 'ONLINE' ? 'text-green-600' :
                              user.deviceStatus === 'OFFLINE' ? 'text-gray-500' : 'text-red-600'
                            }`}>
                              {user.deviceStatus === 'ONLINE' ? <Wifi className="h-4 w-4" /> :
                               user.deviceStatus === 'OFFLINE' ? <WifiOff className="h-4 w-4" /> :
                               <XCircle className="h-4 w-4" />}
                              <span className="text-sm">{user.deviceStatus}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.lastActive}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'devices' && (
          <>
            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-care-600"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Devices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device) => (
                <Card key={device.id} className={`border-l-4 ${
                  device.status === 'ACTIVE' ? 'border-l-green-500' :
                  device.status === 'INACTIVE' ? 'border-l-yellow-500' : 'border-l-red-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        device.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        device.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                    <CardDescription className="font-mono">{device.serialNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Owner:</span>
                        <span className="font-medium">{device.owner}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {device.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Heartbeat:</span>
                        <span className="text-sm">{device.lastHeartbeat}</span>
                      </div>
                      {device.batteryLevel && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Battery:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-full rounded-full ${
                                  device.batteryLevel > 50 ? 'bg-green-500' :
                                  device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${device.batteryLevel}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{device.batteryLevel}%</span>
                          </div>
                        </div>
                      )}
                      {device.signalStrength !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Signal:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-full rounded-full ${
                                  device.signalStrength > 70 ? 'bg-green-500' :
                                  device.signalStrength > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${device.signalStrength}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{device.signalStrength}%</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Uptime:</span>
                        <span className="text-sm">{device.uptime.toFixed(1)}h</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                      <Button variant="outline" size="sm" className="flex-1">Diagnostics</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'alerts' && (
          <>
            {/* Alert Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Critical Alerts</p>
                      <p className="text-2xl font-bold text-red-600">
                        {systemAlerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">High Priority</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {systemAlerts.filter(a => a.severity === 'HIGH' && !a.acknowledged).length}
                      </p>
                    </div>
                    <Bell className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Medium Priority</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {systemAlerts.filter(a => a.severity === 'MEDIUM' && !a.acknowledged).length}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Resolved Today</p>
                      <p className="text-2xl font-bold text-green-600">
                        {systemAlerts.filter(a => a.acknowledged).length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts List */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Monitor and manage all system alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${
                      !alert.acknowledged ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            alert.severity === 'CRITICAL' ? 'bg-red-600' :
                            alert.severity === 'HIGH' ? 'bg-orange-500' :
                            alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Type: {alert.type.replace('_', ' ')}</span>
                              <span>Severity: {alert.severity}</span>
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            alert.acknowledged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {alert.acknowledged ? 'Acknowledged' : 'Pending'}
                          </span>
                          {!alert.acknowledged && (
                            <Button size="sm" variant="outline">
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* User Activity Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Trends</CardTitle>
                  <CardDescription>Active users over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="activeUsers" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Alert Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle>Alert Frequency</CardTitle>
                  <CardDescription>Daily alert volume trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="alerts" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* System Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle>System Response Time</CardTitle>
                  <CardDescription>API response time over the last week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="responseTime" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* System Health Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health Summary</CardTitle>
                  <CardDescription>Overall system performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Device Uptime</span>
                        <span className="text-sm text-gray-600">{stats.avgUptime.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${stats.avgUptime}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Alert Resolution Rate</span>
                        <span className="text-sm text-gray-600">85.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85.3%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">User Satisfaction</span>
                        <span className="text-sm text-gray-600">92.7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92.7%' }}></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Key Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-green-600">99.2%</p>
                          <p className="text-xs text-gray-600">Server Uptime</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{stats.avgResponseTime.toFixed(1)}s</p>
                          <p className="text-xs text-gray-600">Avg Response</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                          <p className="text-xs text-gray-600">User Rating</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">24/7</p>
                          <p className="text-xs text-gray-600">Support</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}