# 🌊 OpenOcean - NFT Marketplace

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Built on](https://img.shields.io/badge/Built%20with-Internet%20Computer-blue?logo=internet-computer)](https://internetcomputer.org)
[![Motoko](https://img.shields.io/badge/Backend-Motoko-green)](https://internetcomputer.org/docs/current/developer-docs/build/languages/motoko)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://reactjs.org)

A decentralized NFT marketplace built on the **Internet Computer (ICP)** blockchain. OpenOcean enables users to mint, list, purchase, and manage NFTs in a fully decentralized environment with seamless Web3 integration.

## 🎯 Key Features

- **🎨 NFT Minting**: Create unique NFTs with custom metadata and image data
- **💰 Marketplace Listing**: List NFTs for sale with dynamic pricing
- **🛒 NFT Trading**: Buy and sell NFTs directly from other users
- **👤 User Dashboard**: View your owned NFTs and transaction history
- **🔐 Secure Ownership**: Blockchain-verified ownership and transfers
- **💾 Persistent Storage**: Data survives canister upgrades with stable storage
- **⚡ High Performance**: Built on the Internet Computer for instant transactions

## 🏗️ Project Architecture

### Backend (Motoko)
- **Smart Contracts**: Implemented in Motoko for the Internet Computer
- **NFT Actor Class**: Each NFT is its own independent canister with encapsulated state
- **Marketplace Actor**: Central hub managing listings, ownership, and trades
- **Stable Storage**: Uses stable arrays to persist data across canister upgrades

### Frontend (React + Vite)
- **Modern UI**: Built with React for dynamic, responsive user experience
- **Real-time Updates**: Live gallery and pricing information
- **Web3 Integration**: Seamless Internet Identity authentication
- **Asset Management**: Efficient image handling and storage

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Internet Computer (ICP) |
| **Smart Contracts** | Motoko |
| **Frontend Framework** | React 18+ |
| **Build Tool** | Vite |
| **Styling** | SCSS/CSS |
| **Authentication** | Internet Identity |
| **Package Manager** | npm/yarn |
| **Node Version** | 18+ |

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **DFX SDK**: [Install dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- **Git**: For version control

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/PiyushKhurana17/openOcean.git
cd openOcean
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Internet Computer Local Replica
```bash
dfx start --clean
```

### 4. Deploy Canisters
```bash
dfx deploy
```

### 5. Start Development Server
```bash
npm start
```

### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:8080/
```

## 📁 Project Structure

```
openOcean/
├── src/
│   ├── openOcean_backend/          # Motoko smart contracts
│   │   └── main.mo                 # Main marketplace actor
│   ├── NFT/                         # NFT actor class
│   │   └── nft.mo                  # Individual NFT canister logic
│   ├── openOcean_frontend/         # React frontend application
│   │   ├── src/
│   │   │   ├── App.jsx             # Main application component
│   │   │   ├── Header.jsx          # Navigation and user info
│   │   │   ├── Gallery.jsx         # NFT gallery display
│   │   │   ├── Minter.jsx          # NFT minting interface
│   │   │   ├── Item.jsx            # Individual NFT item component
│   │   │   ├── PriceLabel.jsx      # Price display component
│   │   │   ├── Button.jsx          # Reusable button component
│   │   │   ├── Footer.jsx          # Footer component
│   │   │   ├── main.jsx            # React entry point
│   │   │   ├── index.css           # Global styles
│   │   │   └── constants.js        # Configuration constants
│   │   ├── vite.config.js          # Vite build configuration
│   │   └── package.json            # Frontend dependencies
│   └── declarations/               # Generated Candid bindings
│       └── openOcean_backend/      # Backend type definitions
├── dfx.json                        # DFX configuration
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## 💻 Usage

### Minting an NFT
1. Click the "Mint" button in the navigation
2. Enter the NFT name and upload an image
3. Confirm the transaction via Internet Identity
4. Your NFT will appear in your gallery

### Listing an NFT for Sale
1. Navigate to your collection
2. Select an NFT you own
3. Set a price and confirm listing
4. The NFT now appears in the marketplace for other users to purchase

### Purchasing an NFT
1. Browse the marketplace gallery
2. Select an NFT you're interested in
3. Click "Purchase" and confirm the transaction
4. The NFT is transferred to your collection

## 🔧 Development

### Build Frontend
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Deploy to IC Mainnet
```bash
# Set DFX network to mainnet
dfx deploy --network ic
```

### View Canister Information
```bash
dfx canister info openOcean_backend
dfx canister info openOcean_frontend
```

## 🔐 Smart Contract Features

### Minting
- Dynamically creates new NFT canisters for each mint
- Associates NFT with owner principal
- Manages cycle allocation for canister creation

### Marketplace Operations
- **List Item**: Set price and make NFT available for purchase
- **Purchase Item**: Transfer ownership and handle payment
- **Get My NFTs**: Query all NFTs owned by a user
- **Get Listing**: Retrieve price and owner information

### Stable Storage
```motoko
// Implicit stable storage - data survives upgrades
var nftEntries : [(Principal, NFTActorClass.NFT)] = [];
var ownerEntries : [(Principal, List.List<Principal>)] = [];
var nftListings : [(Principal, Listing)] = [];
```

## 📊 Marketplace Operations Flow

```
User creates NFT
        ↓
New NFT Actor created
        ↓
NFT registered in marketplace
        ↓
User lists NFT for sale
        ↓
Marketplace updates listing
        ↓
Buyer purchases NFT
        ↓
Ownership transferred
        ↓
NFT appears in buyer's collection
```

## 🎓 Learning Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs/current)
- [Motoko Documentation](https://internetcomputer.org/docs/current/developer-docs/build/languages/motoko)
- [Candid Interface Definition Language](https://github.com/dfinity/candid)
- [DFX Developer Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)

## 🚀 Future Enhancements

- [ ] Advanced filtering and search in marketplace
- [ ] Auction functionality for NFT sales
- [ ] Royalty support for creators
- [ ] Bulk minting capabilities
- [ ] NFT collection management
- [ ] Transaction history and analytics
- [ ] Social features (likes, follows, comments)
- [ ] Multi-chain compatibility
- [ ] DAO governance features
- [ ] Mobile-responsive UI improvements

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Write clean, well-documented code
- Follow Motoko and JavaScript best practices
- Test your changes locally before submitting
- Update README if adding new features
- Ensure no console errors or warnings

## 📝 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

Portions of this project are based on the Internet Computer tutorial by London App Brewery.

## 👤 Author

**Piyush Khurana**
- GitHub: [@PiyushKhurana17](https://github.com/PiyushKhurana17)
- Portfolio: [Your Website/Portfolio]

## 🙏 Acknowledgments

- [DFINITY](https://dfinity.org) - Internet Computer blockchain
- [London App Brewery](https://www.appbrewery.com) - Original tutorial inspiration
- [Internet Computer Community](https://forum.dfinity.org) - Support and resources

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Internet Computer Documentation](https://internetcomputer.org/docs)
2. Search [Existing Issues](https://github.com/PiyushKhurana17/openOcean/issues)
3. [Create a New Issue](https://github.com/PiyushKhurana17/openOcean/issues/new)

---

**Built with ❤️ on the Internet Computer**

Star ⭐ this repository if you found it helpful!
