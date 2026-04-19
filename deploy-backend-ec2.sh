#!/bin/bash
# ============================================================
# AWS EC2 pe Backend Deploy karne ka script
# Ubuntu 22.04 LTS pe run karo
# ============================================================

set -e

echo "=========================================="
echo "  Bookstore Backend - AWS EC2 Setup"
echo "=========================================="

# ---- 1. System Update ----
echo "[1/7] System update..."
sudo apt-get update -y && sudo apt-get upgrade -y

# ---- 2. Java 17 Install ----
echo "[2/7] Java 17 install kar raha hoon..."
sudo apt-get install -y openjdk-17-jdk
java -version

# ---- 3. Maven Install ----
echo "[3/7] Maven install kar raha hoon..."
sudo apt-get install -y maven
mvn -version

# ---- 4. Create app directory ----
echo "[4/7] App directory bana raha hoon..."
sudo mkdir -p /opt/bookstore/uploads
sudo useradd -r -s /bin/false bookstore 2>/dev/null || true
sudo chown -R bookstore:bookstore /opt/bookstore

# ---- 5. Environment variables set karo ----
echo "[5/7] Environment variables configure karo..."
# IMPORTANT: Niche ki values apni AWS RDS ki details se change karo
cat << 'EOF' | sudo tee /opt/bookstore/.env
DB_HOST=YOUR_RDS_ENDPOINT_HERE
DB_PORT=3306
DB_NAME=books
DB_USERNAME=admin
DB_PASSWORD=YOUR_RDS_PASSWORD_HERE
JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY_MIN_256_BITS_CHANGE_THIS
FRONTEND_URL=http://YOUR_FRONTEND_DOMAIN_OR_CLOUDFRONT_URL
UPLOAD_DIR=/opt/bookstore/uploads
PORT=8080
EOF

echo "⚠️  /opt/bookstore/.env mein apni DB details daalo!"

# ---- 6. Build the JAR ----
echo "[6/7] Project build kar raha hoon..."
cd /tmp
if [ -d "bookstore-backend" ]; then rm -rf bookstore-backend; fi
# Yahan apna backend code copy kar (ya git clone karo)
cp -r ~/bookstore/backend /tmp/bookstore-backend
cd /tmp/bookstore-backend
mvn clean package -DskipTests
sudo cp target/bookstore-backend-1.0.0.jar /opt/bookstore/app.jar
sudo chown bookstore:bookstore /opt/bookstore/app.jar

# ---- 7. Systemd service banao (auto-start on reboot) ----
echo "[7/7] Systemd service configure kar raha hoon..."
sudo tee /etc/systemd/system/bookstore.service << 'UNIT'
[Unit]
Description=Bookstore Spring Boot Backend
After=network.target

[Service]
Type=simple
User=bookstore
WorkingDirectory=/opt/bookstore
EnvironmentFile=/opt/bookstore/.env
ExecStart=/usr/bin/java -jar /opt/bookstore/app.jar
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=bookstore

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable bookstore
sudo systemctl start bookstore

echo ""
echo "=========================================="
echo "  ✅ Backend successfully deploy ho gaya!"
echo "  Status check: sudo systemctl status bookstore"
echo "  Logs: sudo journalctl -u bookstore -f"
echo "  API URL: http://$(curl -s ifconfig.me):8080/api"
echo "=========================================="
