# MedSmart - Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/elder-care-monitoring)

## Manual Deployment Steps

### 1. Prepare Your Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial MedSmart System"
   git push origin main
   ```

### 2. Set Up Database (Supabase)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy the database URL from Settings > Database
3. Note down your database credentials

### 3. Deploy to Vercel

1. Visit [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project" and import your repository
3. Configure environment variables:

#### Required Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# MQTT Broker (use a cloud MQTT service)
MQTT_BROKER_URL="mqtt://your-mqtt-broker.com:1883"
MQTT_USERNAME="your-mqtt-username"
MQTT_PASSWORD="your-mqtt-password"

# Optional: Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### 4. Database Setup

After deployment, run the database migration:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Run migration: `vercel env pull .env.local && npx prisma db push`

### 5. Create Demo Data (Optional)

```sql
-- Create demo admin user
INSERT INTO users (email, name, password, role) VALUES 
('admin@medsmart.com', 'System Admin', '$2a$12$encrypted-password-hash', 'ADMIN');

-- Create demo caregiver
INSERT INTO users (email, name, password, role) VALUES 
('demo@caregiver.com', 'Demo Caregiver', '$2a$12$encrypted-password-hash', 'CAREGIVER');
```

### 6. MQTT Broker Setup

#### Option A: Cloud MQTT Service (Recommended)
- Use services like [HiveMQ Cloud](https://www.hivemq.com/cloud/) or [CloudMQTT](https://www.cloudmqtt.com/)
- Create an account and get connection details
- Update environment variables with broker URL and credentials

#### Option B: Self-hosted on VPS
```bash
# Install Mosquitto on Ubuntu/Debian VPS
sudo apt update
sudo apt install mosquitto mosquitto-clients

# Configure authentication
sudo mosquitto_passwd -c /etc/mosquitto/passwd medsmart
sudo systemctl restart mosquitto
```

### 7. Domain and SSL

1. Add your custom domain in Vercel dashboard
2. Update NEXTAUTH_URL environment variable
3. SSL is automatically handled by Vercel

### 8. Monitoring and Logs

- Use Vercel Dashboard for deployment logs
- Set up Vercel Analytics for usage tracking
- Configure error tracking (Sentry, LogRocket, etc.)

## Environment-Specific Configurations

### Development
```bash
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://username:password@localhost:5432/medsmart_dev"
MQTT_BROKER_URL="mqtt://localhost:1883"
```

### Production
```bash
NEXTAUTH_URL="https://medsmart.vercel.app"
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
MQTT_BROKER_URL="mqtt://broker.hivemq.com:1883"
```

## Security Checklist

- [ ] Secure NEXTAUTH_SECRET generated
- [ ] Database credentials secured
- [ ] MQTT broker authentication enabled
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Environment variables properly set
- [ ] Demo accounts disabled in production

## Performance Optimization

1. **Edge Functions**: Utilize Vercel Edge Functions for real-time features
2. **CDN**: Static assets automatically served via Vercel's global CDN
3. **Database**: Use connection pooling for better performance
4. **Caching**: Implement Redis for session storage and caching

## Backup Strategy

1. **Database**: Set up automated backups in Supabase
2. **Environment Variables**: Keep a secure backup of all environment variables
3. **Code**: Maintain regular Git commits and tags for releases

## Scaling Considerations

### When to Scale:
- More than 1000 concurrent users
- High-frequency sensor data (< 1-second intervals)
- Multiple geographic regions

### Scaling Options:
1. **Database**: Upgrade Supabase plan or migrate to dedicated PostgreSQL
2. **MQTT**: Use managed MQTT services with clustering
3. **Compute**: Upgrade Vercel plan for more serverless function executions
4. **Real-time**: Consider WebSocket alternatives or dedicated real-time infrastructure

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify network connectivity to Supabase
   - Check connection limits

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches deployment URL
   - Ensure password encryption is working

3. **MQTT Connection Problems**
   - Verify broker URL and credentials
   - Check firewall settings
   - Test with MQTT client tools

### Debug Commands:
```bash
# Check deployment logs
vercel logs

# Test database connection
npx prisma db push --preview-feature

# Validate environment variables
vercel env ls
```

## Support and Maintenance

- Monitor error rates and performance metrics
- Regular security updates for dependencies
- Database maintenance and optimization
- MQTT broker health monitoring
- User feedback collection and feature requests

For additional support, refer to the main README.md or contact the development team.