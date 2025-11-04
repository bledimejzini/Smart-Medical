import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Shield, 
  Activity, 
  Users, 
  Clock, 
  Camera,
  Thermometer,
  Bell
} from 'lucide-react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-care-50 to-health-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-care-600" />
            <h1 className="text-2xl font-bold text-gray-900">VitaNet</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="care">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Peace of Mind for 
            <span className="text-care-600"> Your Loved Ones</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced Raspberry Pi-powered monitoring system that keeps you connected 
            to your elderly family members' health and safety, 24/7.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" variant="care" className="text-lg px-8">
                Start Monitoring Today
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Care Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover">
              <CardHeader className="text-center">
                <Thermometer className="h-12 w-12 text-care-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Environment Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Real-time temperature and humidity tracking with automatic fan control
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <Activity className="h-12 w-12 text-health-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Motion Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  PIR sensor monitoring for daily activity tracking and fall detection
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <Bell className="h-12 w-12 text-alert-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Smart Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Instant notifications for help requests and medication reminders
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <Camera className="h-12 w-12 text-care-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Video Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Live camera feed with motion-triggered recording and playback
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-care-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-care-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Setup Device</h4>
              <p className="text-gray-600">
                Connect the Raspberry Pi device with sensors in your loved one's home
              </p>
            </div>
            <div className="text-center">
              <div className="bg-health-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-health-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Monitor Remotely</h4>
              <p className="text-gray-600">
                Access real-time data and receive alerts through your dashboard
              </p>
            </div>
            <div className="text-center">
              <div className="bg-alert-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-alert-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Stay Connected</h4>
              <p className="text-gray-600">
                Respond to alerts and maintain peace of mind knowing they're safe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-care-600 mb-2">24/7</div>
              <div className="text-gray-600">Continuous Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-health-600 mb-2">5s</div>
              <div className="text-gray-600">Real-time Updates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-alert-600 mb-2">99%</div>
              <div className="text-gray-600">Uptime Reliability</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-care-600 mb-2">0</div>
              <div className="text-gray-600">Setup Complexity</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-care-600 to-health-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start Caring Better?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families who trust VitaNet for their loved ones' safety
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="h-6 w-6" />
            <span className="text-lg font-semibold">VitaNet</span>
          </div>
          <p className="text-gray-400 mb-4">
            Providing peace of mind through smart monitoring technology
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}