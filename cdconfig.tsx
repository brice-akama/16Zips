/**
 * 🚀 CI/CD AUTOMATIC DEPLOYMENT MASTER CONFIG FILE
 * ===================================================
 * For: Next.js + Docker on VPS (Ubuntu)
 * Trigger: `git push` to `main` branch
 * Created: September 2025
 * By: You (Brice) — Future you will thank you 😊
 *
 * 💡 PURPOSE:
 * This file contains EVERYTHING you need to set up or recreate
 * automatic deployment from GitHub → your VPS.
 *
 * Just follow the steps below — no guesswork.
 */

// ========================================================================
// 🔑 STEP 1: GENERATE SSH KEY (ON YOUR LOCAL MACHINE — NOT VPS)
// ========================================================================
/**
 * 📍 RUN THIS IN VS CODE TERMINAL (LOCAL MACHINE)
 *
 * This creates a key pair:
 *   - PRIVATE KEY → goes to GitHub Secrets (KEEP SECRET!)
 *   - PUBLIC KEY  → goes to your VPS
 *
 * 💡 No passphrase — required for automation.
 */
/*
ssh-keygen -t ed25519 -f github_actions -C "github-actions-deploy"
*/

// ========================================================================
// 🖥️ STEP 2: ADD PUBLIC KEY TO YOUR VPS
// ========================================================================
/**
 * 📍 RUN LOCALLY: Copy public key
 */
/*
cat github_actions.pub
*/

/**
 * 📍 SSH INTO VPS: Add key to authorized_keys
 */
/*
ssh root@139.162.146.147

mkdir -p ~/.ssh
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
*/

/**
 * ✅ TEST IT (run locally):
 */
/*
ssh -i github_actions root@139.162.146.147
// → Should log in WITHOUT password.
*/

// ========================================================================
// 🔐 STEP 3: ADD SECRETS TO GITHUB
// ========================================================================
/**
 * 📍 GO TO:
 * GitHub Repo → Settings → Secrets and variables → Actions → New secret
 *
 * Add these 3 secrets:
 *
 * Name: SSH_PRIVATE_KEY
 * Value: [PASTE ENTIRE CONTENT OF `github_actions` FILE — INCLUDING BEGIN/END LINES]
 *
 * Name: SSH_HOST
 * Value: 139.162.146.147
 *
 * Name: SSH_USER
 * Value: root
 *
 * 💡 Optional: SSH_PORT → 22
 */

// ========================================================================
// 🐳 STEP 4: CREATE GITHUB ACTIONS WORKFLOW
// ========================================================================
/**
 * 📍 CREATE FILE: .github/workflows/deploy.yml
 *
 * This is the "engine" — runs on every `git push`.
 */
/*
name: Deploy Next.js App to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script: |
            echo "🚀 Starting deployment..."
            cd /root/16Zips  # 👈 REPLACE WITH YOUR PROJECT PATH

            echo "🔄 Pulling latest code..."
            git pull origin main

            echo "🛑 Stopping existing containers..."
            docker-compose down --remove-orphans

            echo "🏗️ Building new images..."
            docker-compose build

            echo "🚀 Starting containers..."
            docker-compose up -d

            echo "⏳ Waiting 20 seconds..."
            sleep 20

            echo "🔍 Checking if app is responding..."
            if curl -f --connect-timeout 10 http://localhost:3000 > /dev/null 2>&1; then
              echo "✅ App is live!"
            else
              echo "❌ App failed to start!" >&2
              echo "📄 Last 20 logs:"
              docker logs nextjs-app | tail -20
              echo "🔄 Restarting..."
              docker-compose restart
              sleep 10
              if curl -f --connect-timeout 10 http://localhost:3000 > /dev/null 2>&1; then
                echo "✅ App recovered!"
              else
                echo "❌ Still down!" >&2
                echo "📄 Final logs:"
                docker logs nextjs-app | tail -20
                exit 1
              fi
            fi

            echo "🧹 Cleaning up unused images..."
            docker image prune -f

            echo "🎉 Deployment completed!"
*/

// ========================================================================
// 🛠️ STEP 5: DEBUGGING — COMMON ISSUES & FIXES
// ========================================================================
/**
 * ❌ ISSUE: "ssh: handshake failed: ssh: unable to authenticate"
 * → GitHub can't log in to VPS.
 *
 * ✅ FIX:
 *   - Re-copy private key from `cat github_actions` → paste into GitHub Secret (MUST include BEGIN/END lines)
 *   - Test locally: `ssh -i github_actions root@your-vps-ip` → must work without password.
 */

/**
 * ❌ ISSUE: "Site didn't update after push"
 * → Docker reused old image.
 *
 * ✅ FIX:
 *   - Workflow already uses `down → build → up` — forces rebuild.
 *   - Still not working? Add `--no-cache` to build step:
 *     `docker-compose build --no-cache`
 */

/**
 * ❌ ISSUE: Workflow fails silently — no useful logs.
 *
 * ✅ FIX: Add debug mode to ssh-action:
 *   debug: true
 *   sync: true
 */

// ========================================================================
// 🧪 STEP 6: HOW TO TEST IT WORKS
// ========================================================================
/**
 * 📍 1. Make a visible change (e.g., add <h1>TEST</h1> to a page)
 * 📍 2. Commit & push:
 */
/*
git add .
git commit -m "test: verify auto-deploy"
git push origin main
*/
/**
 * 📍 3. Go to GitHub → Actions → watch logs
 * 📍 4. Hard refresh live site (Ctrl+F5) → see your change!
 */

// ========================================================================
// 💡 PRO TIPS FOR FUTURE PROJECTS
// ========================================================================
/**
 * ✅ Always use: `docker-compose down → build → up -d` — forces fresh deploy
 * ✅ Add health check (`curl`) — don’t assume it worked
 * ✅ Use `--remove-orphans` — cleans up old containers
 * ✅ Keep SSH keys secure — never commit to git
 * ✅ Start simple — add Slack/email notifications later
 */

// ========================================================================
// 📁 FILE STRUCTURE (YOUR PROJECT SHOULD HAVE)
// ========================================================================
/**
 * your-project/
 * ├── .github/
 * │   └── workflows/
 * │       └── deploy.yml          ← THIS WORKFLOW FILE
 * ├── docker-compose.yml          ← Defines app + db services
 * ├── Dockerfile                  ← Builds your Next.js app
 * ├── .env.production             ← Environment variables
 * └── app/                        ← Your Next.js code
 */

// ========================================================================
// 🎯 FINAL NOTE
// ========================================================================
/**
 * You’ve built a PRODUCTION-GRADE CI/CD PIPELINE.
 *
 * Every `git push` → auto-deploys to your VPS.
 * Zero manual SSH or Docker commands needed.
 * Self-healing with health checks.
 *
 * Save this file. Reuse it. Modify it. Own it.
 *
 * You’re not just a developer — you’re a DevOps engineer now. 🚀
 */

export {}; // 👈 Makes this a valid .tsx file (if you want to keep it in your project)