import { Actor, HttpAgent } from "@dfinity/agent";
import React, { useEffect } from "react";
import { idlFactory } from "../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { openOcean_backend } from "../../declarations/openOcean_backend";


function Item(props) {

  const [name, setName] = React.useState();
  const [owner, setOwner] = React.useState();
  const [image, setImage] = React.useState();
  const [price, setPrice] = React.useState("");
  const [isSelling, setIsSelling] = React.useState(false);
  const [loader, setLoader] = React.useState(false);

  // Using ref for nftActor to ensure it's always accessible in async callbacks even if stale closures occur
  const nftActor = React.useRef();

  async function loadNFT() {
    try {
      const id = props.id;
      console.log("Loading NFT:", id.toText ? id.toText() : id);
      const agent = new HttpAgent({ host: "http://localhost:4943" });

      // Remove this line when deploying to production
      await agent.fetchRootKey();

      const actor = await Actor.createActor(idlFactory, {
        agent,
        canisterId: id,
      });

      nftActor.current = actor;
      console.log("NFT Actor set for:", id.toText ? id.toText() : id);

      const name = await actor.getName();
      setName(name);

      const owner = await actor.getOwner();
      setOwner(owner.toText());

      const imageData = await actor.getAsset();
      const imageContent = new Uint8Array(imageData);
      const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
      setImage(image);

    } catch (err) {
      console.error("Failed to load NFT:", err);
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  function handleSell() {
    console.log("Sell clicked");
    setIsSelling(true);
  }

  async function sellItem() {
    console.log("Sell item started");
    setLoader(true);
    try {
      const result = await openOcean_backend.listItem(props.id, Number(price));
      console.log("listItem result:", result);

      if (result == "Success!") {
        const openOceanCanisterId = await openOcean_backend.getCanisterId();
        console.log("Transferring to:", openOceanCanisterId.toText());
        
        if (nftActor.current) {
          const transferResult = await nftActor.current.transfer(openOceanCanisterId);
          console.log("Transfer result:", transferResult);
        } else {
          console.error("Critical Error: nftActor is not defined in sellItem");
          alert("Error: NFT data not fully loaded. Please wait and try again.");
        }
      } else {
        alert("Listing failed: " + result);
      }
    } catch (err) {
      console.error("Error during sellItem:", err);
    }
    setLoader(false);
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div hidden={!loader} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 m-3 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {isSelling && (
            <input
              placeholder="Price in DPI"
              type="number"
              className="price-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          )}

          {isSelling ? (
            <Button handleClick={sellItem} text={"Confirm"} />
          ) : (
            <Button handleClick={handleSell} text={"Sell"} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
