# Deployment Guide

Complete guide to deploying OpenOcean to the Internet Computer mainnet.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Testing](#local-testing)
- [Mainnet Deployment](#mainnet-deployment)
- [Verification](#verification)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- **DFX**: [Latest version](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Internet Computer Account**: With ICP tokens for cycles

### ICP Tokens & Cycles
- Need ICP tokens to convert to cycles for deployment
- ~10-20 ICP recommended for initial deployment
- Get ICP from: [Coinbase](https://www.coinbase.com), [Kraken](https://www.kraken.com), or other exchanges

### Internet Identity
- Set up Internet Identity: https://identity.ic0.app
- Save your seed phrase securely
- This is your Ledger for the mainnet

## Local Testing

### 1. Start Local Replica
```bash
dfx start --clean
```

This starts a local Internet Computer replica on your machine.

### 2. Create Local Identity
```bash
dfx identity new local-dev
dfx identity use local-dev
```

### 3. Deploy to Local Network
```bash
npm install
dfx deploy
```

### 4. Get Local Canister URLs
```bash
# Frontend canister URL
echo "http://$(dfx canister id openOcean_frontend).localhost:8080"

# Backend canister ID
dfx canister id openOcean_backend
```

### 5. Test Locally
```bash
npm start
# Open http://localhost:8080 in your browser
```

### 6. Stop Local Network
```bash
dfx stop
```

## Mainnet Deployment

### Step 1: Set Up Mainnet Configuration

Add mainnet to `dfx.json`:
```json
{
  "networks": {
    "ic": {
      "provider": "https://icp0.io"
    }
  }
}
```

Most recent DFX versions include this by default.

### Step 2: Create Mainnet Identity

```bash
# Create a new identity for mainnet (recommended)
dfx identity new mainnet-production
dfx identity use mainnet-production
```

Get your principal:
```bash
dfx identity get-principal
# Output: abcde-xyz123-...
```

### Step 3: Fund Your Account

Convert ICP to cycles:

```bash
# First, identify your account
dfx ledger account-id

# Top up your account with ICP (via exchange or NNS)
# Then convert to cycles
dfx ledger top-up $(dfx canister id --ic openOcean_backend) --amount 10

# Check cycles balance
dfx wallet balance --ic
```

Alternative: Use NNS (Network Nervous System) dapp:
1. Go to https://nns.ic0.app
2. Use Internet Identity to authenticate
3. Navigate to "Canister" section
4. Add a canister and top up with cycles

### Step 4: Build Optimized Frontend

```bash
npm run build
```

This creates an optimized build for production.

### Step 5: Deploy to Mainnet

**WARNING**: This will incur costs in ICP/cycles. Make sure your wallet is funded.

```bash
# Deploy both canisters
dfx deploy --network ic

# Or deploy individual canisters
dfx deploy openOcean_backend --network ic
dfx deploy openOcean_frontend --network ic
```

### Step 6: Get Mainnet URLs

```bash
# Get frontend canister ID
FRONTEND_ID=$(dfx canister id openOcean_frontend --network ic)
echo "Frontend: https://$FRONTEND_ID.icp0.io"

# Get backend canister ID
BACKEND_ID=$(dfx canister id openOcean_backend --network ic)
echo "Backend: $BACKEND_ID"
```

### Step 7: Custom Domain (Optional)

To use a custom domain:

1. Update DNS records to point to Internet Computer
2. Register domain with Canister Name Service (CNS)
3. Configure in canister settings

```bash
# Example with Registrar
dfx canister update-settings openOcean_frontend --network ic \
  --add-controller $(dfx identity get-principal)
```

## Verification

### Check Deployment Status

```bash
# Check canister info
dfx canister info openOcean_backend --network ic
dfx canister info openOcean_frontend --network ic

# Check canister status
dfx canister status openOcean_backend --network ic
dfx canister status openOcean_frontend --network ic

# View cycles balance
dfx wallet balance --network ic
```

### Test Frontend Access

1. Visit `https://FRONTEND_ID.icp0.io` in browser
2. Verify page loads correctly
3. Test Internet Identity authentication
4. Mint a test NFT
5. Verify transaction on-chain

### Test Backend Calls

```bash
# Call backend function
dfx canister call openOcean_backend getMyNFTs '(principal "2chl6-4hpzw-4hpzw-4hpzw-4hpzw-4hpzw-4hpzw-4hpzw-4hpzw-4hpzw-4hpzw-cai")' --network ic

# Get canister metrics
dfx canister info openOcean_backend --network ic
```

## Post-Deployment

### 1. Update Documentation

Update any hardcoded references:
```bash
# In README.md
- Change localhost:8080 to mainnet URL
- Update any configuration examples
- Add mainnet canister IDs
```

### 2. Set Up Monitoring

```bash
# Check cycles regularly
dfx wallet balance --network ic

# Monitor in NNS dapp
# https://nns.ic0.app
```

### 3. Backup Configuration

Save important information:
```bash
# Create backup
mkdir -p ~/openOcean-mainnet-backup

# Save canister IDs
dfx canister id openOcean_backend --network ic > ~/openOcean-mainnet-backup/backend_id.txt
dfx canister id openOcean_frontend --network ic > ~/openOcean-mainnet-backup/frontend_id.txt

# Save identity
cp ~/.config/dfx/identity/mainnet-production/identity.pem ~/openOcean-mainnet-backup/

# Store in secure location
```

### 4. Set Controller Permissions

Protect your canisters:
```bash
# Add trusted controllers only
dfx canister update-settings openOcean_backend --network ic \
  --add-controller TRUSTED_PRINCIPAL
  
dfx canister update-settings openOcean_frontend --network ic \
  --add-controller TRUSTED_PRINCIPAL
```

### 5. Enable Freezing Threshold

Prevent accidental deletion:
```bash
# Set freezing threshold (in seconds)
# 2592000 seconds = 30 days
dfx canister update-settings openOcean_backend --network ic \
  --set-freezing-threshold 2592000

dfx canister update-settings openOcean_frontend --network ic \
  --set-freezing-threshold 2592000
```

## Upgrading Deployed Canisters

### Safe Upgrade Process

```bash
# 1. Stop new operations (optional announcement)
# 2. Build new version
npm run build

# 3. Deploy with upgrade flag
dfx deploy --network ic

# 4. Verify deployment
dfx canister status openOcean_backend --network ic
dfx canister status openOcean_frontend --network ic

# 5. Test core functionality
# ... manual testing ...

# 6. Announce update
```

### Rollback Plan

If deployment fails:
```bash
# Redeploy previous working version
git checkout <previous-commit>
npm run build
dfx deploy --network ic
```

## Monitoring & Maintenance

### Cycle Consumption Tracking
```bash
# Check daily
dfx wallet balance --network ic

# Current rates (approximate)
# - 1 GB storage per year: ~4 ICP
# - 1 billion instructions: ~1 ICP
```

### Scaling Considerations
- Monitor memory usage: `dfx canister info openOcean_backend --network ic`
- Plan for cycle top-ups: Set reminders to check balance
- Consider cycle limits: Max 20T cycles per canister

### Logs & Debugging
```bash
# Check canister logs (limited)
# Logs persist for ~24 hours on mainnet
# Use application-level logging for longer retention
```

## Troubleshooting

### Insufficient Cycles
**Error**: `Out of cycles`
```bash
# Solution: Top up cycles
dfx wallet top-up <CANISTER_ID> --amount 10 --network ic
```

### Identity Issues
**Error**: `Principal doesn't have permission`
```bash
# Verify identity
dfx identity use mainnet-production
dfx identity get-principal

# Use correct identity for canister
```

### Deployment Fails
**Error**: `Failed to deploy`
```bash
# Check error logs
dfx deploy --network ic --verbose

# Common causes:
# 1. Insufficient cycles
# 2. Wasm size too large
# 3. Network connectivity
```

### Frontend Not Loading
**Error**: `Cannot reach frontend`
```bash
# Verify canister is running
dfx canister status openOcean_frontend --network ic

# Check canister ID is correct
dfx canister id openOcean_frontend --network ic

# Clear browser cache and retry
```

### Slow Response Times
**Causes**:
- High network latency
- Canister memory pressure
- Network congestion

**Solutions**:
- Check cycles balance
- Review code for inefficiencies
- Monitor canister performance

## Cost Estimates

Approximate costs for OpenOcean deployment and operation:

| Item | Cost | Notes |
|------|------|-------|
| Initial Deployment | 0.5 ICP | One-time |
| Monthly Storage | 0.1 ICP | ~1GB |
| Monthly Compute | 0.2 ICP | Estimated |
| Total Monthly | ~0.3 ICP | Approximately $10-15 USD |

**Note**: Prices subject to change. See [ICP Pricing](https://internetcomputer.org/docs/current/developer-docs/cost-optimization) for current rates.

## Support & Resources

- [Internet Computer Docs](https://internetcomputer.org/docs)
- [DFX Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [NNS Dapp](https://nns.ic0.app)
- [Forum](https://forum.dfinity.org)

---

**Ready to deploy?** Start with [Local Testing](#local-testing) first!
