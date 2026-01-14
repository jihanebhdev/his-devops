# GitHub Actions Secrets Configuration Guide

## 🔧 Issue Fixed

The pipeline was failing due to incorrect MySQL service configuration. This has been fixed by:
- Removing invalid Docker flags (`--character-set-server`, `--collation-server`)
- Adding proper MySQL readiness check
- Updating connection string with charset parameters

## 🔐 Required Secrets

### **No Secrets Required for Basic CI/CD**

The workflows are configured to work **without any secrets** for basic CI/CD operations:

- ✅ **Frontend CI** - Works without secrets
- ✅ **Backend CI** - Works without secrets  
- ✅ **Docker Build** - Uses `GITHUB_TOKEN` automatically (no setup needed)

### Optional Secrets (For Advanced Configuration)

If you want to customize certain behaviors, you can optionally add these secrets:

#### 1. Frontend Build Configuration

| Secret Name | Description | When to Use | Example |
|------------|-------------|-------------|---------|
| `REACT_APP_API_URL` | API endpoint URL for frontend builds | If you need different API URLs per environment | `https://api.production.com/api` |

**How to set:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `REACT_APP_API_URL`
4. Value: Your API URL
5. Click **Add secret**

**Note:** If not set, defaults to `http://localhost:8080/api`

#### 2. Docker Registry (Alternative to GitHub Container Registry)

If you want to use Docker Hub or a custom registry instead of GitHub Container Registry:

| Secret Name | Description | When to Use |
|------------|-------------|-------------|
| `DOCKER_USERNAME` | Docker registry username | Using Docker Hub or custom registry |
| `DOCKER_PASSWORD` | Docker registry password/token | Using Docker Hub or custom registry |
| `DOCKER_REGISTRY` | Custom registry URL | Using private registry |

**Note:** By default, workflows use GitHub Container Registry (ghcr.io) which requires **no secrets** - it uses `GITHUB_TOKEN` automatically.

#### 3. Code Coverage (Optional)

If you want to upload coverage reports to Codecov:

| Secret Name | Description | When to Use |
|------------|-------------|-------------|
| `CODECOV_TOKEN` | Codecov upload token | If you have a Codecov account |

**Note:** Coverage upload is optional and won't fail if token is missing.

## 📋 Quick Setup Checklist

### ✅ Basic Setup (No Secrets Needed)

- [x] Workflows are in `.github/workflows/` directory
- [x] Push code to trigger workflows
- [x] Check Actions tab for results

### 🔧 Optional Advanced Setup

- [ ] Set `REACT_APP_API_URL` if you need custom API endpoint
- [ ] Set Docker registry secrets if not using GitHub Container Registry
- [ ] Set `CODECOV_TOKEN` if you want coverage reports

## 🚀 How Secrets Work

### Automatic Secrets (No Setup Required)

GitHub Actions automatically provides:
- **`GITHUB_TOKEN`** - Used for GitHub Container Registry authentication
- **`GITHUB_ACTIONS`** - Environment variable set to `true`
- **`CI`** - Environment variable set to `true`

### Using Secrets in Workflows

Secrets are accessed in workflows like this:

```yaml
env:
  REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL || 'http://localhost:8080/api' }}
```

The `|| 'default'` syntax provides a fallback if the secret is not set.

## 🔍 Verifying Secrets

To check if secrets are set:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You'll see a list of all repository secrets (values are hidden for security)
3. Secrets are available to all workflows in your repository

## 🛡️ Security Best Practices

1. **Never commit secrets** to your repository
2. **Use repository secrets** for repository-specific values
3. **Use organization secrets** for shared values across repositories
4. **Rotate secrets regularly** for security
5. **Use least privilege** - only grant necessary permissions

## 🐛 Troubleshooting

### Workflow fails with "Secret not found"

**Solution:** The workflow uses fallback values, so this shouldn't happen. If it does:
- Check that the secret name matches exactly (case-sensitive)
- Verify the secret exists in repository settings
- Check workflow logs for the exact error

### Docker push fails

**Solution:** 
- For GitHub Container Registry: Ensure `packages: write` permission is enabled (it's automatic)
- For other registries: Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` are set correctly

### Frontend build uses wrong API URL

**Solution:**
- Set `REACT_APP_API_URL` secret with your desired URL
- Or modify the workflow file to change the default value

## 📚 Current Workflow Configuration

### Frontend CI
- **Secrets used:** `REACT_APP_API_URL` (optional, has default)
- **Status:** ✅ Works without secrets

### Backend CI  
- **Secrets used:** None
- **Status:** ✅ Works without secrets

### Docker Build
- **Secrets used:** `GITHUB_TOKEN` (automatic)
- **Optional:** `DOCKER_USERNAME`, `DOCKER_PASSWORD` (if using different registry)
- **Status:** ✅ Works without additional secrets

## ✅ Summary

**You don't need to set any secrets to get started!** 

The workflows are designed to work out of the box. Secrets are only needed if you want to:
- Customize API URLs
- Use a different Docker registry
- Upload coverage to external services

Just push your code and the workflows will run automatically! 🎉

