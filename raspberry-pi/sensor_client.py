#!/usr/bin/env python3
"""
MedSmart - Raspberry Pi Sensor Client
This script runs on the Raspberry Pi and sends sensor data to the Next.js application
"""

import time
import json
import random
import paho.mqtt.client as mqtt
from datetime import datetime
import RPi.GPIO as GPIO
import adafruit_dht
import board

# Configuration
MQTT_BROKER = "localhost"  # Change to your MQTT broker IP
MQTT_PORT = 1883
DEVICE_ID = "EDC_RPI_001"  # Unique device identifier
MQTT_USERNAME = ""
MQTT_PASSWORD = ""

# GPIO Pin Configuration
DHT_PIN = board.D4          # DHT22 sensor pin
PIR_PIN = 18                # PIR motion sensor pin
FAN_PIN = 22                # Cooling fan relay pin
BUZZER_PIN = 23             # Piezo buzzer pin
BUTTON_HELP_PIN = 24        # Help button pin
BUTTON_WATER_PIN = 25       # Water button pin
BUTTON_OTHER_PIN = 26       # Other request button pin

# Initialize sensors and GPIO
dht = adafruit_dht.DHT22(DHT_PIN)
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_PIN, GPIO.IN)
GPIO.setup(FAN_PIN, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(BUZZER_PIN, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(BUTTON_HELP_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_WATER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(BUTTON_OTHER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Global variables
fan_active = False
last_motion_time = datetime.now()
button_states = {
    'help': True,
    'water': True,
    'other': True
}

def on_connect(client, userdata, flags, rc):
    """Callback for when the client receives a CONNACK response from the server"""
    if rc == 0:
        print(f"Connected to MQTT broker with result code {rc}")
        # Subscribe to command topics
        client.subscribe(f"device/{DEVICE_ID}/commands")
        print(f"Subscribed to device/{DEVICE_ID}/commands")
    else:
        print(f"Failed to connect to MQTT broker with result code {rc}")

def on_message(client, userdata, msg):
    """Callback for when a PUBLISH message is received from the server"""
    try:
        topic = msg.topic
        payload = json.loads(msg.payload.decode())
        print(f"Received message on {topic}: {payload}")
        
        if topic == f"device/{DEVICE_ID}/commands":
            handle_command(payload)
    except Exception as e:
        print(f"Error processing message: {e}")

def handle_command(command):
    """Handle commands received from the server"""
    global fan_active
    
    cmd_type = command.get('type')
    
    if cmd_type == 'fan_control':
        state = command.get('state', False)
        GPIO.output(FAN_PIN, GPIO.HIGH if state else GPIO.LOW)
        fan_active = state
        print(f"Fan {'activated' if state else 'deactivated'}")
    
    elif cmd_type == 'buzzer_test':
        activate_buzzer(duration=2)
        print("Buzzer test activated")
    
    elif cmd_type == 'medication_reminder':
        medication = command.get('medication', 'Unknown')
        activate_buzzer(pattern='reminder')
        print(f"Medication reminder: {medication}")

def activate_buzzer(duration=1, pattern='single'):
    """Activate the piezo buzzer with different patterns"""
    if pattern == 'single':
        GPIO.output(BUZZER_PIN, GPIO.HIGH)
        time.sleep(duration)
        GPIO.output(BUZZER_PIN, GPIO.LOW)
    
    elif pattern == 'reminder':
        # Three short beeps for medication reminder
        for _ in range(3):
            GPIO.output(BUZZER_PIN, GPIO.HIGH)
            time.sleep(0.5)
            GPIO.output(BUZZER_PIN, GPIO.LOW)
            time.sleep(0.5)

def read_sensors():
    """Read all sensor data"""
    global fan_active, last_motion_time
    
    try:
        # Read temperature and humidity
        temperature = dht.temperature
        humidity = dht.humidity
        
        # Simulate reading if sensor fails
        if temperature is None or humidity is None:
            temperature = 20 + random.uniform(-5, 15)  # 15-35°C
            humidity = 40 + random.uniform(0, 30)      # 40-70%
        
        # Read motion sensor
        motion_detected = GPIO.input(PIR_PIN)
        if motion_detected:
            last_motion_time = datetime.now()
        
        # Auto fan control based on temperature
        if temperature > 30 and not fan_active:
            GPIO.output(FAN_PIN, GPIO.HIGH)
            fan_active = True
            print(f"Fan auto-activated due to high temperature: {temperature}°C")
        elif temperature <= 28 and fan_active:
            GPIO.output(FAN_PIN, GPIO.LOW)
            fan_active = False
            print(f"Fan auto-deactivated, temperature normal: {temperature}°C")
        
        return {
            'temperature': round(temperature, 1),
            'humidity': round(humidity, 1),
            'motion': motion_detected,
            'fanActive': fan_active,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error reading sensors: {e}")
        return None

def check_buttons():
    """Check for button presses and send alerts"""
    global button_states
    
    # Check help button
    help_pressed = not GPIO.input(BUTTON_HELP_PIN)
    if help_pressed and button_states['help']:
        send_alert('HELP', 'Emergency help button pressed', 'CRITICAL')
        button_states['help'] = False
    elif not help_pressed:
        button_states['help'] = True
    
    # Check water button
    water_pressed = not GPIO.input(BUTTON_WATER_PIN)
    if water_pressed and button_states['water']:
        send_alert('WATER', 'Water assistance requested', 'MEDIUM')
        button_states['water'] = False
    elif not water_pressed:
        button_states['water'] = True
    
    # Check other button
    other_pressed = not GPIO.input(BUTTON_OTHER_PIN)
    if other_pressed and button_states['other']:
        send_alert('OTHER', 'General assistance requested', 'MEDIUM')
        button_states['other'] = False
    elif not other_pressed:
        button_states['other'] = True

def send_sensor_data(client, data):
    """Send sensor data to MQTT broker"""
    if data:
        topic = f"device/{DEVICE_ID}/sensors"
        payload = json.dumps(data)
        client.publish(topic, payload)
        print(f"Sent sensor data: {data}")

def send_alert(alert_type, message, priority='MEDIUM'):
    """Send alert to MQTT broker"""
    alert_data = {
        'type': alert_type,
        'message': message,
        'priority': priority,
        'timestamp': datetime.now().isoformat()
    }
    topic = f"device/{DEVICE_ID}/alerts"
    payload = json.dumps(alert_data)
    client.publish(topic, payload)
    print(f"Sent alert: {alert_data}")

def send_heartbeat(client):
    """Send device heartbeat"""
    heartbeat_data = {
        'status': 'online',
        'timestamp': datetime.now().isoformat(),
        'uptime': time.time()
    }
    topic = f"device/{DEVICE_ID}/status"
    payload = json.dumps(heartbeat_data)
    client.publish(topic, payload)

def cleanup():
    """Cleanup GPIO pins"""
    GPIO.output(FAN_PIN, GPIO.LOW)
    GPIO.output(BUZZER_PIN, GPIO.LOW)
    GPIO.cleanup()
    print("GPIO cleanup completed")

def main():
    """Main application loop"""
    global client
    
    # Initialize MQTT client
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    
    if MQTT_USERNAME and MQTT_PASSWORD:
        client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    
    try:
        # Connect to MQTT broker
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        
        print(f"MedSmart Client Started - Device ID: {DEVICE_ID}")
        print("Press Ctrl+C to stop")
        
        last_heartbeat = time.time()
        
        while True:
            # Read and send sensor data every 5 seconds
            sensor_data = read_sensors()
            if sensor_data:
                send_sensor_data(client, sensor_data)
            
            # Check for button presses
            check_buttons()
            
            # Send heartbeat every 30 seconds
            if time.time() - last_heartbeat > 30:
                send_heartbeat(client)
                last_heartbeat = time.time()
            
            time.sleep(5)  # Main loop delay
            
    except KeyboardInterrupt:
        print("\nShutting down...")
    except Exception as e:
        print(f"Error in main loop: {e}")
    finally:
        cleanup()
        client.loop_stop()
        client.disconnect()
        print("Application stopped")

if __name__ == "__main__":
    main()