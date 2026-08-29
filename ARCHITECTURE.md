# Architecture Overview

## High-Level Architecture

OpenOcean is a decentralized NFT marketplace with a client-server architecture where the server is a decentralized smart contract running on the Internet Computer blockchain.

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React + Vite)                    │
│              Running on OpenOcean_frontend canister          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • User Interface Components (Minter, Gallery, Item, etc.)  │
│  • State Management                                          │
│  • Internet Identity Integration                            │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                 Candid Interface (IC)
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Backend (Motoko Smart Contracts)               │
│              Running on Internet Computer                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  OpenD (Main Marketplace Actor)                     │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  • Manages NFT listings                             │   │
│  │  • Handles marketplace operations                   │   │
│  │  • Tracks ownership                                 │   │
│  │  • Processes purchases                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                    Manages and owns                          │
│                           │                                  │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │     Individual NFT Canisters (NFT Actors)            │  │
│  │  ─────────────────────────────────────────────────  │  │
│  │  • One canister per NFT                              │  │
│  │  • Stores metadata and image data                    │  │
│  │  • Manages ownership transfers                       │  │
│  │  • Encapsulated state per NFT                        │  │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                    Persistent Storage
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
          Stable State              Transient State
    (Survives Upgrades)         (Rebuilt from Stable)
```

## Component Architecture

### 1. Frontend (React)

#### File Structure
```
openOcean_frontend/src/
├── App.jsx                 # Root component & main logic
├── Header.jsx             # Navigation & user auth status
├── Gallery.jsx            # NFT marketplace display
├── Minter.jsx             # NFT creation interface
├── Item.jsx               # Individual NFT card
├── PriceLabel.jsx         # Price display component
├── Button.jsx             # Reusable button component
├── Footer.jsx             # Footer section
├── main.jsx               # React entry point
├── index.css              # Global styles
└── constants.js           # Configuration constants
```

#### Key Features
- **App Component**: Manages global state and principal
- **Internet Identity Integration**: User authentication via II
- **Real-time Gallery**: Updates NFT listing and pricing
- **Minter Interface**: Create NFTs with image upload
- **Responsive UI**: Works across different screen sizes

### 2. Backend (Motoko)

#### OpenD Actor (Main Marketplace)
```motoko
persistent actor OpenD {
  // Stable storage - persists across upgrades
  var nftEntries : [(Principal, NFTActorClass.NFT)];
  var ownerEntries : [(Principal, List.List<Principal>)];
  var nftListings : [(Principal, Listing)];
  
  // Transient hashmaps - rebuilt from stable on init
  transient var mapOfNFTs;
  transient var mapOfOwners;
  transient var mapOfListings;
  
  // Public functions
  public shared func mint(imgData: [Nat8], name: Text): async Principal
  public shared func listItem(nftId: Principal, price: Nat): async Text
  public shared func purchaseItem(nftId: Principal): async Text
  public query func getMyNFTs(user: Principal): async [Principal]
  public query func getListing(nftId: Principal): async ?Listing
}
```

#### NFT Actor (Individual NFT Canister)
```motoko
actor NFT {
  let id: Principal;
  var owner: Principal;
  var metadata: Metadata;
  var imgData: [Nat8];
  
  public query func getOwner(): async Principal
  public query func getMetadata(): async Metadata
  public query func getImage(): async [Nat8]
  public shared func transferOwnership(newOwner: Principal, isMarketplace: Bool): async Bool
}
```

#### Key Design Patterns
- **Persistent Storage**: Uses stable arrays for durability
- **Transient HashMaps**: Rebuilt from stable storage on init
- **Preupgrade Hook**: Saves state before canister upgrade
- **Principal-based Ownership**: Uses ICP principals for ownership
- **Cycle Management**: Allocates cycles for new NFT canister creation

### 3. Data Flow

#### Minting Flow
```
User clicks Mint
        ↓
Minter component collects name + image
        ↓
Upload to backend via Candid
        ↓
OpenD.mint() creates new NFT actor
        ↓
System allocates cycles to new NFT canister
        ↓
NFT actor initialized with metadata & image
        ↓
OpenD registers NFT in mapOfNFTs & mapOfOwners
        ↓
NFT appears in user's gallery
```

#### Trading Flow
```
User selects NFT to sell
        ↓
Sets price in Minter
        ↓
OpenD.listItem(nftId, price)
        ↓
Listing added to mapOfListings
        ↓
NFT appears in marketplace gallery
        ↓
Buyer clicks purchase
        ↓
OpenD.purchaseItem(nftId)
        ↓
NFT.transferOwnership() to new owner
        ↓
mapOfListings updated (item delisted)
        ↓
mapOfOwners updated (ownership transferred)
        ↓
NFT appears in buyer's collection
```

## Storage Architecture

### Stable Storage (Persists Across Upgrades)
```motoko
var nftEntries : [(Principal, NFTActorClass.NFT)] = []
var ownerEntries : [(Principal, List.List<Principal>)] = []
var nftListings : [(Principal, Listing)] = []
```

**Advantages:**
- ✅ Data survives canister upgrades
- ✅ No data loss on deployment
- ✅ Automatic serialization

**How it Works:**
1. Before upgrade: `preupgrade()` hook saves transient hashmaps to stable arrays
2. After upgrade: Actor reinitialization rebuilds hashmaps from stable arrays
3. Transparent to users: No data corruption during upgrades

### Transient Storage (Performance)
```motoko
transient var mapOfNFTs = HashMap.fromIter<Principal, NFTActorClass.NFT>(...)
transient var mapOfOwners = HashMap.fromIter<Principal, List.List<Principal>>(...)
transient var mapOfListings = HashMap.fromIter<Principal, Listing>(...)
```

**Advantages:**
- ✅ Fast O(1) lookups via HashMap
- ✅ Efficient insertions and updates
- ✅ Better performance than arrays

## Security Considerations

### Principal-Based Access Control
```motoko
public shared (msg) func listItem(nftId: Principal, price: Nat) {
  let owner: Principal = msg.caller;
  let originalOwner = await item.getOwner();
  
  // Only owner can list their NFT
  if (Principal.equal(originalOwner, owner)) {
    // ... list item
  }
}
```

### Secure Ownership Transfers
- Ownership changes only via `transferOwnership()`
- Requires explicit caller verification
- Marketplace-verified transfers for purchases

### Cycle Management
- New NFT creation requires sufficient cycles
- Prevents resource exhaustion attacks
- Proper cycle allocation in `mint()` function

## Scalability & Performance

### Current Limitations
- Single OpenD canister limits horizontal scaling
- Frontend assets limited to canister storage
- Image data stored on-chain (no IPFS integration)

### Future Improvements
- Multi-shard architecture for higher throughput
- IPFS integration for image storage
- Canister auto-scaling with load balancing
- Caching layer for frequently accessed data

## Deployment Architecture

### Local Development
```bash
dfx start --clean
dfx deploy  # Deploys to local replica
npm start   # Starts dev server
```

### Mainnet Deployment
```bash
dfx deploy --network ic
# Deploys both canisters to Internet Computer mainnet
# Frontend: openOcean_frontend canister
# Backend: openOcean_backend canister
```

## Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Blockchain | Internet Computer (ICP) | Decentralized computation & storage |
| Smart Contracts | Motoko | Backend logic & state management |
| Frontend Framework | React 18+ | UI component library |
| Build Tool | Vite | Fast module bundling |
| RPC Communication | Candid | Frontend-Backend interface |
| Authentication | Internet Identity | Web3 user authentication |
| Data Serialization | Candid | Type-safe serialization |

## Module Dependencies

### Motoko Stdlib
- `Principal`: Principal identity management
- `Cycles`: Canister cycle management
- `HashMap`: Efficient key-value storage
- `List`: Linked list for ownership tracking
- `Iter`: Array/collection iteration

### Frontend Dependencies
See `package.json` in `openOcean_frontend/` for latest versions

## Future Architecture Considerations

1. **Token Integration**: Add DANG token for trading
2. **Royalty System**: Creator royalties on secondary sales
3. **Auctions**: Timed bidding mechanism
4. **Collections**: Grouped NFTs by creator
5. **Notifications**: Event-driven updates
6. **Analytics**: Dashboard with trading metrics

---

For more detailed information, see:
- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [Internet Computer Documentation](https://internetcomputer.org/docs)
