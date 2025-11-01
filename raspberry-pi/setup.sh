#!/bin/bash

# MedSmart - Raspberry Pi Setup Script
# This script sets up the Raspberry Pi for the MedSmart System

echo "MedSmart - Raspberry Pi Setup"
echo "=============================="

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Python dependencies
echo "Installing Python dependencies..."
sudo apt install -y python3-pip python3-venv git

# Install required Python packages
echo "Installing Python packages..."
pip3 install --user paho-mqtt RPi.GPIO adafruit-circuitpython-dht adafruit-blinka

# Install MQTT broker (Mosquitto)
echo "Installing MQTT broker..."
sudo apt install -y mosquitto mosquitto-clients

# Enable and start Mosquitto service
sudo systemctl enable mosquitto
sudo systemctl start mosquitto

# Create application directory
echo "Setting up application directory..."
sudo mkdir -p /opt/medsmart
sudo chown $USER:$USER /opt/medsmart

# Copy sensor client
cp sensor_client.py /opt/medsmart/

# Create systemd service file
cat << 'EOF' | sudo tee /etc/systemd/system/medsmart-monitor.service
[Unit]
Description=MedSmart Monitoring Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/opt/medsmart
ExecStart=/usr/bin/python3 /opt/medsmart/sensor_client.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl enable medsmart-monitor.service

# Configure GPIO permissions
sudo usermod -a -G gpio $USER

echo ""
echo "Setup completed successfully!"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Configure your WiFi connection"
echo "2. Update MQTT broker IP in sensor_client.py"
echo "3. Connect your sensors to the GPIO pins:"
echo "   - DHT22 Temperature/Humidity: GPIO 4"
echo "   - PIR Motion Sensor: GPIO 18"
echo "   - Cooling Fan Relay: GPIO 22"
echo "   - Piezo Buzzer: GPIO 23"
echo "   - Help Button: GPIO 24"
echo "   - Water Button: GPIO 25"
echo "   - Other Button: GPIO 26"
echo "4. Start the service: sudo systemctl start medsmart-monitor"
echo "5. Check logs: sudo journalctl -u medsmart-monitor -f"
echo ""
echo "Reboot recommended to ensure all changes take effect."