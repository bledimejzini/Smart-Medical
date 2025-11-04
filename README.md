# VitaNet - Smart Medical Monitoring System

A comprehensive Next.js application for monitoring elderly patients using Raspberry Pi IoT devices. This system provides real-time health monitoring, medication reminders, emergency alerts, and camera surveillance for elderly care.

## 🏥 Features

### Caregiver Portal
- **Live Monitoring Dashboard**: Real-time temperature, humidity, and motion detection
- **Medication Management**: Schedule reminders and track adherence
- **Emergency Alerts**: Instant notifications for help requests
- **Camera Feed**: Live video monitoring with motion-triggered recording
- **Historical Analytics**: View trends and patterns in health data

### Admin Portal
- **System Analytics**: Comprehensive dashboard with charts and metrics
- **User Management**: Monitor all users and device status
- **System Health**: Performance monitoring and maintenance tools
- **Alert Management**: System-wide alert configuration and tracking

### Hardware Integration (Raspberry Pi)
- **Sensors**: Temperature, humidity, PIR motion sensor
- **Actuators**: Piezo buzzer, cooling fan (auto-activates >30°C)
- **Input**: Keypad for assistance requests (Help, Water, Other)
- **Camera**: Live streaming with motion detection recording
- **Communication**: MQTT for real-time device communication

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase/Vercel Postgres)
- **Authentication**: NextAuth.js with credentials provider
- **Real-time**: Socket.io for live updates
- **Charts**: Recharts for analytics visualization
- **IoT**: MQTT.js for Raspberry Pi communication
- **Styling**: Tailwind CSS with custom medical theme

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- MQTT broker (Mosquitto)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/elder-care-monitoring.git
   cd elder-care-monitoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.local` and configure:
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/vitanet"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # MQTT Broker
   MQTT_BROKER_URL="mqtt://localhost:1883"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📱 Demo Accounts

For testing purposes, use these demo accounts:

- **Caregiver**: `demo@caregiver.com` / `password123`
- **Admin**: `admin@vitanet.com` / `admin123`

## 🎯 User Roles

### Caregiver
- Monitor assigned patients
- Receive real-time alerts
- Manage medication schedules
- View camera feeds and recordings
- Access historical health data

### Admin
- System-wide analytics and reporting
- User and device management
- System health monitoring
- Alert configuration and management

## 🏗 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Caregiver dashboard
│   ├── admin/             # Admin portal
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

## 🔧 Raspberry Pi Setup

### Hardware Requirements
- Raspberry Pi 4B (recommended)
- DHT22 temperature/humidity sensor
- PIR motion sensor
- Camera module v2
- Piezo buzzer
- 5V cooling fan
- 4x4 matrix keypad
- Breadboard and jumper wires

### Software Setup
1. Install Raspberry Pi OS Lite
2. Install Python dependencies:
   ```bash
   pip install paho-mqtt RPi.GPIO adafruit-circuitpython-dht
   ```
3. Configure MQTT client to connect to your broker
4. Run the sensor monitoring script

### MQTT Topics
- `device/{deviceId}/sensors` - Temperature, humidity, motion data
- `device/{deviceId}/alerts` - Button press alerts
- `device/{deviceId}/commands` - Fan control, buzzer triggers
- `device/{deviceId}/status` - Device heartbeat

## 📊 Database Schema

The system uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and role management
- **Patient**: Patient information and relationship to caregiver
- **Device**: Raspberry Pi device registration and status
- **SensorReading**: Temperature, humidity, motion data
- **Alert**: Emergency and assistance alerts
- **Reminder**: Medication schedules and confirmations
- **CameraClip**: Video recording metadata

## 🔒 Security Features

- **Authentication**: Secure credential-based login with NextAuth.js
- **Authorization**: Role-based access control (Caregiver/Admin)
- **Data Protection**: Encrypted passwords with bcrypt
- **Session Management**: JWT-based sessions
- **Input Validation**: Server-side validation for all inputs

## 📈 Monitoring Features

### Real-time Metrics
- Temperature and humidity tracking (5-second updates)
- Motion detection with timestamps
- Device connectivity status
- Automatic fan control based on temperature

### Alert System
- Emergency help button (critical priority)
- Water request button (medium priority)
- Temperature threshold alerts
- Motion timeout alerts (no movement detected)
- Device offline notifications

### Analytics
- Historical temperature and humidity trends
- Motion activity patterns
- Medication adherence rates
- Alert frequency and response times

## 🎨 Design System

### Color Palette
- **Care Blue**: Primary brand color (#0ea5e9)
- **Health Green**: Success states (#22c55e)
- **Alert Red**: Error/emergency states (#ef4444)
- **Warm Grays**: Neutral backgrounds and text

### Components
- Responsive design (mobile-first)
- Accessible UI (WCAG 2.1 AA)
- Dark mode support
- Loading states and skeleton screens
- Toast notifications for real-time feedback

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Setup
- **Database**: Use Vercel Postgres or Supabase
- **MQTT**: Deploy Mosquitto broker on VPS
- **File Storage**: Configure for camera recordings

## 🔮 Future Enhancements

- **Mobile App**: React Native companion app
- **AI Integration**: Fall detection using computer vision
- **Voice Commands**: Alexa/Google integration
- **Wearable Devices**: Heart rate and activity monitoring
- **Telemedicine**: Video calling with healthcare providers
- **Multi-language**: Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@vitanet.com
- 📱 Phone: +1-800-VITANET
- 💬 Discord: [Join our community](https://discord.gg/vitanet)
- 📚 Documentation: [Full docs](https://docs.vitanet.com)

## 🙏 Acknowledgments

- Thanks to all beta testers and families using the system
- Raspberry Pi Foundation for excellent IoT hardware
- Next.js team for the amazing framework
- Healthcare professionals who provided guidance

---

**VitaNet** - Providing peace of mind through technology 💙