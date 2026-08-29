# Getting Started with OpenOcean

Quick start guide to get the OpenOcean NFT Marketplace running on your local machine.

## ⚡ 5-Minute Quick Start

### 1. Prerequisites Check
```bash
# Verify Node.js version
node --version  # Should be v18.0.0+

# Verify npm version
npm --version   # Should be v9.0.0+

# Verify DFX installation
dfx --version   # Should be installed
```

Not installed? [Download here](https://internetcomputer.org/docs/current/developer-docs/setup/install)

### 2. Clone Repository
```bash
git clone https://github.com/PiyushKhurana17/openOcean.git
cd openOcean
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Local Blockchain
```bash
dfx start --clean
```

This starts an Internet Computer replica on your machine. Keep this terminal open.

### 5. Deploy Smart Contracts (New Terminal)
```bash
dfx deploy
```

This deploys the backend and frontend canisters to your local replica.

### 6. Start Development Server (New Terminal)
```bash
npm start
```

This starts the Vite development server with hot-reload.

### 7. Open in Browser
```
http://localhost:8080
```

You should see the OpenOcean marketplace!

## 🎨 First Steps in the App

### Create Your First NFT

1. **Click "Mint"** button in the header
2. **Enter NFT Name**: e.g., "My Cool NFT"
3. **Select Image**: Choose or drag-drop an image file
4. **Confirm**: Follow the prompts to complete the transaction
5. **Wait**: Your NFT will be minted and appear in your gallery

### List an NFT for Sale

1. **Find Your NFT**: In the gallery, locate the NFT you created
2. **Click "Sell"**: Open the item details
3. **Set Price**: Enter a price in test tokens
4. **Confirm**: Complete the listing transaction
5. **Success**: Your NFT now appears in the marketplace

### Purchase an NFT

1. **Browse Gallery**: Look for NFTs listed for sale
2. **Click NFT**: View the details
3. **Click "Buy"**: Initiate purchase
4. **Confirm**: Approve the transaction
5. **Done**: The NFT is now yours!

## 🛠️ Development Workflow

### Local Development Loop

```bash
# Terminal 1: Start DFX
dfx start --clean

# Terminal 2: Deploy canisters
dfx deploy

# Terminal 3: Start dev server
npm start

# Make changes to files
# Hot reload will refresh automatically
```

### Building Production Assets
```bash
npm run build
```

Creates optimized production build in `openOcean_frontend/dist/`

### Running Tests
```bash
npm test
```

### Viewing Logs
```bash
# Local canister logs
dfx canister logs openOcean_backend

# Check backend status
dfx canister info openOcean_backend
```

## 📂 Key Files to Explore

### Backend (Smart Contracts)
- **[src/openOcean_backend/main.mo](src/openOcean_backend/main.mo)** - Main marketplace logic
- **[src/NFT/nft.mo](src/NFT/nft.mo)** - Individual NFT canister logic

### Frontend (React)
- **[src/openOcean_frontend/src/App.jsx](src/openOcean_frontend/src/App.jsx)** - Main React component
- **[src/openOcean_frontend/src/Gallery.jsx](src/openOcean_frontend/src/Gallery.jsx)** - Marketplace display
- **[src/openOcean_frontend/src/Minter.jsx](src/openOcean_frontend/src/Minter.jsx)** - NFT creation

### Configuration
- **[dfx.json](dfx.json)** - DFX canister configuration
- **[src/openOcean_frontend/vite.config.js](src/openOcean_frontend/vite.config.js)** - Vite configuration

## 🔍 Understanding the Architecture

### How It Works

```
You (Browser)
       ↓
   React App (Frontend)
       ↓
   Internet Computer (Blockchain)
       ↓
  Motoko Smart Contract (Backend)
```

1. **Frontend** - React app running in your browser
2. **Backend** - Motoko smart contracts on Internet Computer
3. **Communication** - Candid protocol (RPC over HTTP)
4. **Storage** - Data persisted on blockchain

### Key Concepts

- **Canister**: A smart contract container on Internet Computer
- **Principal**: Your unique identifier (like an Ethereum address)
- **Cycles**: "Gas" or fees for canister operations
- **Motoko**: Programming language for Internet Computer

## 📚 Next Steps

### Explore the Code
- Read through `src/openOcean_backend/main.mo`
- Understand the `mint()` and `listItem()` functions
- Check how ownership is tracked

### Learn Motoko
- [Motoko Documentation](https://internetcomputer.org/docs/current/developer-docs/build/languages/motoko)
- [Motoko Playground](https://m7sm4-2iaaa-aaaab-qabra-cai.raw.icp0.io/)
- [Language Guide](https://internetcomputer.org/docs/current/developer-docs/build/languages/motoko#toc)

### Learn Internet Computer
- [Official Docs](https://internetcomputer.org/docs/current)
- [Developer Portal](https://internetcomputer.org/docs/current/developer-docs)
- [Community Forum](https://forum.dfinity.org)

### Modify the Project
- Change colors/styling in `src/openOcean_frontend/src/index.css`
- Add new components in `src/openOcean_frontend/src/`
- Extend marketplace functionality in `src/openOcean_backend/main.mo`

## 🐛 Troubleshooting

### "Port 8080 already in use"
```bash
# Stop the other service or use a different port
npm start -- --port 3000
```

### "dfx canister not found"
```bash
# Redeploy canisters
dfx deploy
```

### "Out of cycles"
```bash
# This shouldn't happen in local development
# But when deploying to mainnet, you'll need ICP tokens
```

### "Frontend not updating"
```bash
# Restart the dev server
# Ctrl+C to stop
npm start
```

### "Changes not reflected"
```bash
# If modifying Motoko code:
# 1. Save the file
# 2. Run: dfx deploy openOcean_backend
# 3. Refresh browser

# If modifying React code:
# Hot reload should work automatically
# If not, refresh browser
```

## 💡 Tips & Tricks

### Useful DFX Commands
```bash
# See all canisters
dfx canister list

# Check canister status
dfx canister status openOcean_backend

# Call backend function directly
dfx canister call openOcean_backend getMyNFTs '(principal "xyz")'

# Stop DFX
dfx stop
```

### Development Shortcuts
```bash
# Clean start (remove all state)
dfx start --clean

# Kill and restart DFX
dfx kill && dfx start --clean

# View frontend URL
echo "http://$(dfx canister id openOcean_frontend).localhost:8080"
```

### Browser DevTools
- Open Developer Console (F12)
- Check Network tab for Candid calls
- Look for errors in Console tab
- Inspect React components (install React DevTools extension)

## 📖 Documentation

For more detailed information:
- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [LICENSE](LICENSE) - License information

## 🆘 Getting Help

1. **Check Documentation**: Search [README.md](README.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Search Issues**: Look through [GitHub Issues](https://github.com/PiyushKhurana17/openOcean/issues)
3. **Ask Questions**: [Create a Discussion](https://github.com/PiyushKhurana17/openOcean/discussions)
4. **Report Bugs**: [File an Issue](https://github.com/PiyushKhurana17/openOcean/issues/new)

## 🎉 Ready?

Everything set up? Start minting your first NFT! Head to [http://localhost:8080](http://localhost:8080) and click "Mint".

---

**Stuck?** Check the [Troubleshooting](#-troubleshooting) section or open an issue on GitHub.

**Want to help?** See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to OpenOcean.

**Happy hacking!** 🌊
