'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Thermometer, 
  Droplet, 
  Activity, 
  Bell, 
  Camera, 
  Settings, 
  LogOut,
  Fan,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';

interface SensorData {
  temperature: number;
  humidity: number;
  motion: boolean;
  fanActive: boolean;
  lastUpdate: string;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  priority: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 22.5,
    humidity: 45,
    motion: true,
    fanActive: false,
    lastUpdate: new Date().toISOString(),
  });
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'HELP',
      message: 'Help button pressed',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      priority: 'HIGH',
    },
  ]);

  useEffect(() => {
    // Simulate real-time sensor data updates
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
        motion: Math.random() > 0.7,
        fanActive: prev.temperature > 30,
        lastUpdate: new Date().toISOString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-care-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 18) return 'text-blue-600';
    if (temp > 26) return 'text-red-600';
    if (temp < 20 || temp > 24) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-care-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Elder Care Monitor</h1>
                <p className="text-sm text-gray-500">Welcome back, {session.user.name}</p>
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
        {/* Alert Banner */}
        {alerts.length > 0 && (
          <div className="mb-6 bg-alert-50 border border-alert-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-alert-600 mr-2" />
              <div>
                <h3 className="font-medium text-alert-800">Active Alert</h3>
                <p className="text-sm text-alert-700">{alerts[0].message} - {new Date(alerts[0].timestamp).toLocaleTimeString()}</p>
              </div>
              <Button size="sm" variant="alert" className="ml-auto">
                Acknowledge
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className={`h-4 w-4 ${getTemperatureColor(sensorData.temperature)}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTemperatureColor(sensorData.temperature)}`}>
                {sensorData.temperature.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {sensorData.temperature > 26 ? 'Too warm' : sensorData.temperature < 18 ? 'Too cold' : 'Comfortable'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {sensorData.humidity.toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {sensorData.humidity > 60 ? 'High humidity' : sensorData.humidity < 40 ? 'Low humidity' : 'Optimal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Motion</CardTitle>
              <Activity className={`h-4 w-4 ${sensorData.motion ? 'text-green-600' : 'text-gray-400'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${sensorData.motion ? 'text-green-600' : 'text-gray-600'}`}>
                {sensorData.motion ? 'Active' : 'Inactive'}
              </div>
              <p className="text-xs text-muted-foreground">
                Last detected: {new Date(sensorData.lastUpdate).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cooling Fan</CardTitle>
              <Fan className={`h-4 w-4 ${sensorData.fanActive ? 'text-blue-600' : 'text-gray-400'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${sensorData.fanActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {sensorData.fanActive ? 'ON' : 'OFF'}
              </div>
              <p className="text-xs text-muted-foreground">
                {sensorData.fanActive ? 'Auto-activated' : 'Temperature OK'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Live Camera Feed
              </CardTitle>
              <CardDescription>
                Real-time monitoring with motion detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Camera feed placeholder</p>
                  <p className="text-sm text-gray-400">Connect device to view live stream</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Snapshot
                </Button>
                <Button variant="outline" size="sm">
                  View Recordings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Recent Alerts
              </CardTitle>
              <CardDescription>
                Latest notifications and assistance requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No recent alerts</p>
                    <p className="text-sm text-gray-400">All is well!</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        alert.priority === 'HIGH' ? 'bg-alert-100' : 'bg-orange-100'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.priority === 'HIGH' ? 'text-alert-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Medication Reminders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Medication Schedule
            </CardTitle>
            <CardDescription>
              Today's medication reminders and schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-health-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Morning Pills</h4>
                  <span className="text-sm text-green-600">Completed</span>
                </div>
                <p className="text-sm text-gray-600">9:00 AM - Blood pressure medication</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Afternoon Pills</h4>
                  <span className="text-sm text-orange-600">Upcoming</span>
                </div>
                <p className="text-sm text-gray-600">2:00 PM - Vitamin supplements</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Evening Pills</h4>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <p className="text-sm text-gray-600">8:00 PM - Sleep aid</p>
              </div>
            </div>
            <Button className="mt-4" variant="outline">
              Manage Medications
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button className="h-16" variant="care">
            <User className="h-6 w-6 mr-2" />
            Patient Setup
          </Button>
          <Button className="h-16" variant="outline">
            <Activity className="h-6 w-6 mr-2" />
            View Analytics
          </Button>
          <Button className="h-16" variant="outline">
            <Settings className="h-6 w-6 mr-2" />
            Device Settings
          </Button>
        </div>
      </div>
    </div>
  );
}