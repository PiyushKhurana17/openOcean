import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

persistent actor class NFT(name : Text, owner : Principal, content : [Nat8]) = this {
    Debug.print("It works!");
    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

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

    public shared (msg) func transfer(newOwner : Principal) : async Text {
        let owner : Principal = msg.caller;
        if (Principal.equal(owner, nftOwner)) {
            nftOwner := newOwner;
            return "Success!";
        } else {
            return "You are not the owner of this NFT";
        };
    };

};
