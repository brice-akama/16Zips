/**
 * 🚀 PROFESSIONAL VPS CONFIGURATION MASTER FILE
 * ===================================================
 * For: Ubuntu 22.04/24.04 LTS — Raw VPS (DigitalOcean, Linode, Hetzner, etc.)
 * Goal: Outperform Vercel with full control, caching, CDN, and optimizations
 * Created: September 2025
 * By: You (Brice) — Future you will be proud 😊
 *
 * 💡 WHY THIS BEATS VERCEL:
 * - Full control over server, caching, headers, TLS
 * - No cold starts — your app is always running
 * - Custom NGINX caching → faster than Vercel Edge
 * - HTTP/3 + Brotli + TLS 1.3 → modern performance
 * - Cost-effective at scale
 */

// ========================================================================
// 🛠️ STEP 1: INITIAL SERVER SETUP (SECURITY + PERFORMANCE)
// ========================================================================
/**
 * 📍 SSH INTO YOUR VPS (AS ROOT)
 */

// ➤ 1. Create a non-root user (SECURITY BEST PRACTICE)
/*
adduser deploy
usermod -aG sudo deploy
*/

// ➤ 2. Copy your SSH key to the new user (so you can log in without password)
/*
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
*/

// ➤ 3. Disable root login & password auth (SECURITY)
/*
sudo nano /etc/ssh/sshd_config

# Change these lines:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Then restart SSH:
sudo systemctl restart sshd
*/

// ➤ 4. Set up firewall (UFW)
/*
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'  # Allows 80 + 443
sudo ufw enable
*/

// ➤ 5. Update system
/*
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
*/

// ========================================================================
// 🐳 STEP 2: INSTALL DOCKER + DOCKER-COMPOSE
// ========================================================================
/**
 * 📍 Install Docker (as `deploy` user or root)
 */

// ➤ Install Docker
/*
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y
*/

// ➤ Add user to docker group (so you don’t need sudo)
/*
sudo usermod -aG docker deploy
// Log out and back in for this to take effect
*/

// ➤ Install Docker Compose
/*
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
*/

// ========================================================================
// 🌐 STEP 3: INSTALL & CONFIGURE NGINX (WITH CACHING + HTTP/3)
// ========================================================================
/**
 * 📍 Install NGINX
 */
/*
sudo apt install nginx -y
*/

/**
 * 📍 Configure NGINX as Reverse Proxy + Cache (FASTER THAN VERCEL)
 * Create: /etc/nginx/sites-available/your-site.conf
 */
/*
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

# Redirect non-www → www (or vice versa)
if ($host = yourdomain.com) {
    return 301 https://www.yourdomain.com$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    # listen 443 quic reuseport;  # Uncomment if you enable HTTP/3

    server_name yourdomain.com www.yourdomain.com;

    # SSL (use Certbot — see below)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Settings (Modern, Secure, Fast)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip + Brotli Compression (FASTER THAN VERCEL)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/javascript text/xml text/plain text/x-component application/javascript application/x-javascript application/json application/xml application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Brotli (if installed)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript image/x-icon image/vnd.microsoft.icon image/bmp;

    # Proxy to your Docker app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 👇 ADD CACHING (OUTPERFORMS VERCEL EDGE)
        proxy_cache my_cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header X-Cache $upstream_cache_status;
    }

    # Cache static assets longer
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        proxy_cache my_cache;
        proxy_cache_valid 200 302 1h;
        proxy_cache_valid 404 10m;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Cache $upstream_cache_status;
    }
}
*/

/**
 * 📍 Enable the site
 */
/*
sudo ln -s /etc/nginx/sites-available/your-site.conf /etc/nginx/sites-enabled/
sudo nginx -t  # Test config
sudo systemctl reload nginx
*/

// ========================================================================
// 🔐 STEP 4: SET UP SSL WITH CERTBOT (FREE TLS)
// ========================================================================
/**
 * 📍 Install Certbot
 */
/*
sudo apt install certbot python3-certbot-nginx -y
*/

/**
 * 📍 Get SSL Certificate
 */
/*
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
// Follow prompts — choose "Redirect HTTP to HTTPS"
*/

/**
 * 📍 Auto-renew SSL
 */
/*
sudo certbot renew --dry-run  # Test renewal
// Certbot auto-renews — no further action needed
*/

// ========================================================================
// 🚀 STEP 5: ENABLE HTTP/3 (QUIC) — OPTIONAL BUT FASTEST
// ========================================================================
/**
 * 📍 Install NGINX with QUIC support (if not already included)
 * → Requires compiling NGINX from source or using a PPA
 * → Skip if you’re not ready for advanced setup
 */

// ========================================================================
// 🧹 STEP 6: SET UP LOG ROTATION + MONITORING
// ========================================================================
/**
 * 📍 Install logrotate (usually pre-installed)
 * Edit: /etc/logrotate.d/nginx
 */
/*
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    prerotate
        if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
            run-parts /etc/logrotate.d/httpd-prerotate; \
        fi \
    endscript
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
*/

/**
 * 📍 Install htop + glances for monitoring
 */
/*
sudo apt install htop glances -y
glances  # Run to see real-time server stats
*/

// ========================================================================
// 🐘 STEP 7: INSTALL & CONFIGURE REDIS (FOR CACHING SESSIONS, RATE LIMITING)
// ========================================================================
/**
 * 📍 Install Redis
 */
/*
sudo apt install redis-server -y
sudo systemctl enable redis-server
*/

/**
 * 📍 Secure Redis (edit /etc/redis/redis.conf)
 */
/*
bind 127.0.0.1 ::1
requirepass your_strong_password
*/

/**
 * 📍 Restart Redis
 */
/*
sudo systemctl restart redis-server
*/

// ========================================================================
// 📈 STEP 8: SET UP UPTIME MONITORING + ALERTS (OPTIONAL)
// ========================================================================
/**
 * 📍 Use healthchecks.io or UptimeRobot (free tiers available)
 * → Ping your site every 5 mins
 * → Get email/SMS alerts if down
 */

// ========================================================================
// 🧩 STEP 9: CONNECT TO YOUR NEXT.JS APP
// ========================================================================
/**
 * 📍 Your docker-compose.yml should expose port 3000 internally
 * → NGINX proxies to it (see Step 3)
 *
 * Example docker-compose.yml:
 */
/*
version: '3.8'
services:
  app:
    build: .
    ports:
      - "127.0.0.1:3000:3000"  # Only expose locally — NGINX handles public traffic
    env_file: .env.production
    restart: unless-stopped
*/

/**
 * 📍 Build & start:
 */
/*
docker-compose up -d --build
*/

// ========================================================================
// 🚀 FINAL PERFORMANCE TUNING (OUTPERFORM VERCEL)
// ========================================================================
/**
 * ✅ Enable Brotli compression (faster than gzip)
 * ✅ Use Redis for session caching
 * ✅ Set long cache headers for static assets
 * ✅ Use NGINX micro-caching for dynamic pages (10m cache for 200 responses)
 * ✅ Enable HTTP/3 if possible
 * ✅ Monitor with glances/htop — scale CPU/RAM as needed
 */

// ========================================================================
// 📁 FILE STRUCTURE (YOUR SERVER SHOULD HAVE)
// ========================================================================
/**
 * /home/deploy/your-app/
 * ├── .env.production
 * ├── docker-compose.yml
 * ├── Dockerfile
 * ├── nginx/
 * │   └── your-site.conf  ← Your NGINX config
 * └── ...
 */

// ========================================================================
// 🎯 FINAL NOTE
// ========================================================================
/**
 * You now have a PRODUCTION-GRADE VPS — faster, more flexible, and more powerful than Vercel.
 *
 * ✅ Full control over caching, headers, TLS, compression
 * ✅ No cold starts — your app is always warm
 * ✅ Cost-effective at scale
 * ✅ Ready for high traffic
 *
 * Save this file. Reuse it. Modify it. Own it.
 *
 * You’re not just hosting a site — you’re running infrastructure. 🚀
 */

export {}; // 👈 Makes this a valid .tsx file..