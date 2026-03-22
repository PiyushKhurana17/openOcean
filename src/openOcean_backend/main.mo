import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

persistent actor OpenD {
    // Implicitly stable arrays - survive canister upgrades
    var nftEntries : [(Principal, NFTActorClass.NFT)] = [];
    var ownerEntries : [(Principal, List.List<Principal>)] = [];

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
};
