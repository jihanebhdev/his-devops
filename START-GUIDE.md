# 🚀 Start Guide - From Zero to Deploy

Complete setup guide for someone who just installed Docker and created a GitHub account.

---

## 📋 What You Need

- ✅ Docker Desktop installed and running
- ✅ GitHub account (fresh/new is fine)
- ✅ Git installed
- ⏱️ **Total Time:** ~30 minutes

---

## 🎯 STEP 1: Install Required Tools (5 minutes)

### 1.1 Verify Docker Installation

```bash
# Open terminal/PowerShell and run:
docker --version
docker-compose --version

# Start Docker Desktop if not running
# Windows: Start Docker Desktop from Start Menu
# Mac: Start Docker from Applications
```

**Expected output:**
```
Docker version 24.0.0 or higher
Docker Compose version 2.20.0 or higher
```

### 1.2 Install Git (if not installed) !

**Windows:**
```bash
# Download from: https://git-scm.com/download/win
# Run installer with default options
```



### 1.3 Verify Git Installation

```bash
git --version
# Expected: git version 2.30.0 or higher
```

### 1.4 Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

---

## 🐙 STEP 2: Clone GitHub Repository (5 minutes)

### 2.1 Clone New Repository on GitHub

1. Go to https://github.com 
or git clone https://github.com/jihanebhdev/his-devops.git

## 💻 STEP 3: Prepare Your Local Project (2 minutes)

### 3.1 Navigate to Your Project

```bash
# Open terminal/PowerShell
# Navigate to your project directory clones 
cd /devops

# Or on Mac/Linux:
cd /devops
```

### 3.2 Verify Project Structure

```bash
# List files to verify structure
dir  # Windows

# You should see:
# - hub/
# - front/
# - k8s/
# - .github/
# - docker-compose.yml
# - README.md
```

---

## 📤 STEP 4: Push to GitHub (5 minutes)

### 4.3 Create First Commit

```bash
# Commit all files
git commit -m "feat: initial DevOps implementation with complete CI/CD pipeline"
```

### 4.4 Connect to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/his-devops.git

# Verify remote
git remote -v
```

### 4.5 Push to GitHub

```bash
# Push to main branch
git push -u origin main
```
**If prompted for credentials:**
- **Username:** Your GitHub username
- **Password:** Use **Personal Access Token** (not password)
---


## 🐳 STEP 6: Deploy Locally with Docker (5 minutes)

### 6.1 Create Environment File

### 6.3 Start All Services

```bash
# Make sure Docker Desktop is running!

# Start all services
docker-compose up -d

# This will:
# 1. Pull MySQL image (~2 minutes)
# 2. Build Hub backend (~3 minutes)
# 3. Build React frontend (~2 minutes)
# 4. Start monitoring stack
```

### 6.4 Check Service Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Expected output: All services "Up" and "healthy"
```

### 6.5 Wait for Services (2-3 minutes)

```bash
# Watch logs until you see:
# MySQL: "ready for connections"
# Hub: "Started HubApplication"
# Front: "Server listening on port 80"
```

---

## ✅ STEP 7: Verify Deployment (2 minutes)

### 7.1 Test Backend API

Open browser or terminal:

```bash
# Health check
curl http://localhost:8080/actuator/health

# Or open in browser:
# http://localhost:8080/actuator/health
```

**Expected response:**
```json
{
  "status": "UP"
}
```

### 7.2 Test Frontend

Open browser:
```
http://localhost:3000
```

**Expected:** React application loads

### 7.3 Test Monitoring

**Grafana:**
```
http://localhost:3001
Login: admin / admin
```

**Prometheus:**
```
http://localhost:9090
```

---

## 🎉 STEP 8: Enable GitHub Actions (3 minutes)

### 8.1 Enable Actions

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click **"I understand my workflows, go ahead and enable them"**

### 8.2 Trigger First Workflow

```bash
# Create develop branch
git checkout -b develop

# Make a small change (optional)
echo "# Development Branch" >> README.md
git add README.md
git commit -m "docs: add development branch marker"

# Push to GitHub
git push origin develop
```

### 8.3 Watch Workflows Run

1. Go to GitHub → Actions tab
2. You should see workflows running:
   - ✅ Hub CI
   - ✅ Front CI
   - ⚠️ SonarQube (will fail if not configured - OK for now!)
   - ✅ Docker Build

---

## 🚀 STEP 9: Deploy to Development (Optional)

### 9.1 Automatic Deployment

When you push to `develop` branch:
```bash
git push origin develop
```

GitHub Actions will automatically:
1. ✅ Build and test
2. ✅ Build Docker images
3. ✅ Push to GitHub Container Registry
4. ✅ Deploy to DEV (if configured)

### 9.2 Manual Local Deployment

```bash
# Deploy with deployment script
chmod +x scripts/deploy-local.sh  # Mac/Linux only
./scripts/deploy-local.sh

# Or simply:
docker-compose up -d
```

---

## 📊 STEP 10: Verify Everything Works

### 10.1 Service Checklist

| Service | URL | Status | Credentials |
|---------|-----|--------|-------------|
| Frontend | http://localhost:3000 | ✅ | - |
| Backend API | http://localhost:8080 | ✅ | - |
| API Health | http://localhost:8080/actuator/health | ✅ | - |
| Grafana | http://localhost:3001 | ✅ | admin/admin |
| Prometheus | http://localhost:9090 | ✅ | - |

### 10.2 Quick Tests

**Test 1: Backend Health**
```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}
```

**Test 2: Frontend**
```bash
curl http://localhost:3000/health
# Expected: healthy
```

**Test 3: Database**
```bash
docker-compose exec mysql mysql -u root -proot -e "SHOW DATABASES;"
# Expected: his_db listed
```

---

## 🎓 What You Have Now

✅ **Local Environment:**
- MySQL database running
- Spring Boot backend running
- React frontend running
- Prometheus monitoring
- Grafana dashboards

✅ **GitHub Repository:**
- Complete source code
- CI/CD workflows ready
- Docker configurations
- Kubernetes manifests

✅ **Automated Pipelines:**
- Build and test on every push
- Code quality checks
- Security scanning
- Docker image building

---

## 🔄 Common Commands

### Starting/Stopping Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart hub

# View logs
docker-compose logs -f hub

# Rebuild and start
docker-compose up -d --build
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, then:
git add .
git commit -m "feat: description of changes"
git push origin feature/my-feature

# Create Pull Request on GitHub
# After merge:
git checkout main
git pull origin main
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (database data)
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

```bash
# Find what's using port 8080
# Windows:
netstat -ano | findstr :8080

# Mac/Linux:
lsof -i :8080

# Solution: Either:
# 1. Kill the process
# 2. Change port in .env file
```

### Problem: Docker Not Running

```bash
# Windows: Start Docker Desktop from Start Menu
# Mac: Start Docker from Applications
# Linux: 
sudo systemctl start docker
```

### Problem: Permission Denied (Linux/Mac)

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or:
newgrp docker
```

### Problem: MySQL Won't Start

```bash
# Check logs
docker-compose logs mysql

# Remove old volume and try again
docker-compose down -v
docker-compose up -d
```

### Problem: Hub Backend Won't Start

```bash
# Check logs
docker-compose logs hub

# Common issues:
# 1. MySQL not ready → Wait 30 seconds and check again
# 2. Port 8080 in use → Change HUB_PORT in .env
# 3. Build failed → Run: docker-compose build --no-cache hub
```

### Problem: GitHub Push Asks for Password

**Solution: Use Personal Access Token**

1. Go to GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Select scopes: `repo`, `workflow`, `write:packages`
5. Copy token
6. Use token as password when pushing

Or configure credential helper:
```bash
# Windows:
git config --global credential.helper wincred

# Mac:
git config --global credential.helper osxkeychain

# Linux:
git config --global credential.helper store
```

---

## 📚 Next Steps

### Level 1: Basic Usage (You're here! ✅)
- ✅ Local development environment running
- ✅ Code pushed to GitHub
- ✅ CI/CD workflows enabled

### Level 2: Kubernetes Deployment
```bash
# Install kubectl
# Install Minikube or use cloud K8s

# Deploy to K8s
./scripts/deploy-k8s.sh dev
```

### Level 3: Full Production Setup
- [ ] Configure actual domains
- [ ] Set up SSL certificates
- [ ] Configure production database
- [ ] Set up monitoring alerts
- [ ] Configure backup procedures

---

## 🎯 Quick Reference

### Access URLs
```
Frontend:     http://localhost:3000
Backend:      http://localhost:8080
API Health:   http://localhost:8080/actuator/health
API Metrics:  http://localhost:8080/actuator/metrics
Grafana:      http://localhost:3001 (admin/admin)
Prometheus:   http://localhost:9090
```

### Essential Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Status
docker-compose ps
```

### Git Commands
```bash
# Push changes
git add .
git commit -m "message"
git push

# Create branch
git checkout -b feature/name

# Switch branch
git checkout main
```

---

## 💡 Tips for Success

1. **Always start Docker Desktop first** before running docker-compose
2. **Wait for MySQL to be ready** (~30 seconds) before backend starts
3. **Check logs** if something doesn't work: `docker-compose logs -f`
4. **Use branches** for development, not main directly
5. **Commit often** with clear messages
6. **Test locally** before pushing to GitHub

---

## ✅ Success Checklist

- [ ] Docker Desktop installed and running
- [ ] Git installed and configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] `.env` file created
- [ ] Docker Compose services running
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:8080
- [ ] Grafana accessible at http://localhost:3001
- [ ] GitHub Actions enabled
- [ ] First workflow completed successfully

---

## 🎉 Congratulations!

You now have a complete DevOps environment running:

✅ **Development:** Local Docker environment  
✅ **CI/CD:** Automated workflows on GitHub  
✅ **Monitoring:** Prometheus + Grafana  
✅ **Deployment:** Ready for Kubernetes  

**You're ready to start developing! 🚀**

---

## 📞 Need Help?

- **Documentation:** Check `README.md`, `DEPLOYMENT.md`
- **Issues:** Common problems listed in Troubleshooting section
- **Questions:** Open GitHub issue in your repository

---

**Last Updated:** January 2026  
**Estimated Setup Time:** 30 minutes  
**Difficulty Level:** Beginner-friendly  

**Happy Coding! 🎨**

