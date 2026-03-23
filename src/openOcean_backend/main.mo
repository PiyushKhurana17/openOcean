import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

persistent actor OpenD {

    private type Listing = {
        itemPrice : Nat;
        itemOwner : Principal;
    };

    // Implicitly stable arrays - survive canister upgrades
    var nftEntries : [(Principal, NFTActorClass.NFT)] = [];
    var ownerEntries : [(Principal, List.List<Principal>)] = [];
    var nftListings : [(Principal, Listing)] = [];

    // Hashmap for listing - rebuilding from stable arrays on init
    transient var mapOfListings = HashMap.fromIter<Principal, Listing>(
        nftListings.vals(),
        nftListings.size(),
        Principal.equal,
        Principal.hash,
    );

    // Transient HashMaps - rebuilt from stable arrays on init
    transient var mapOfNFTs = HashMap.fromIter<Principal, NFTActorClass.NFT>(
        nftEntries.vals(),
        nftEntries.size(),
        Principal.equal,
        Principal.hash,
    );
    transient var mapOfOwners = HashMap.fromIter<Principal, List.List<Principal>>(
        ownerEntries.vals(),
        ownerEntries.size(),
        Principal.equal,
        Principal.hash,
    );

    // Save HashMaps back to stable arrays before upgrade
    system func preupgrade() {
        nftEntries := Iter.toArray(mapOfNFTs.entries());
        ownerEntries := Iter.toArray(mapOfOwners.entries());
        nftListings := Iter.toArray(mapOfListings.entries());
    };

    public shared (msg) func mint(imgData : [Nat8], name : Text) : async Principal {
        let owner : Principal = msg.caller;

        Cycles.add<system>(2_000_000_000_000);
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);

        let newNFTId = await newNFT.getCanisterId();
        addToOwnership(owner, newNFTId);
        mapOfNFTs.put(newNFTId, newNFT);
        return newNFTId;
    };

    private func addToOwnership(owner : Principal, nftId : Principal) {
        var currentOwned : List.List<Principal> = switch (mapOfOwners.get(owner)) {
            case (null) {
                List.nil<Principal>();
            };
            case (?result) result;
        };

        currentOwned := List.push(nftId, currentOwned);
        mapOfOwners.put(owner, currentOwned);
    };

    public query func getMyNFTs(user : Principal) : async [Principal] {
        let ownedNFTList : List.List<Principal> = switch (mapOfOwners.get(user)) {
            case (null) {
                List.nil<Principal>();
            };
            case (?result) {
                result;
            };
        };
        return List.toArray(ownedNFTList);
    };

    public shared (msg) func listItem(nftId : Principal, price : Nat) : async Text {
        var item : NFTActorClass.NFT = switch (mapOfNFTs.get(nftId)) {
            case (null) {
                return "NFT not found";
            };
            case (?result) {
                result;
            };
        };

        let originalOwner = await item.getOwner();
        let owner : Principal = msg.caller;
        if (Principal.equal(originalOwner, owner)) {
            let newListing : Listing = { itemPrice = price; itemOwner = owner };
            mapOfListings.put(nftId, newListing);
            return "Success!";
        } else {
            return "You are not the owner of this NFT";
        };
    };

    public query func getAllListings() : async [(Principal, Listing)] {
        return Iter.toArray(mapOfListings.entries());
    };

    public query func getCanisterId() : async Principal {
        Principal.fromActor(OpenD);
    };
};
