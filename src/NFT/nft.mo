import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

persistent actor class NFT(name : Text, owner : Principal, content : [Nat8]) = this {
    Debug.print("It works!");
    let itemName = name;
    let nftOwner = owner;
    let imageBytes = content;

    public query func getName() : async Text {
        itemName;
    };

    public query func getOwner() : async Principal {
        nftOwner;
    };

    public query func getAsset() : async [Nat8] {
        imageBytes;
    };

    public query func getCanisterId() : async Principal {
        Principal.fromActor(this);
    };

};
