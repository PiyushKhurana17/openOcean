import { Actor, HttpAgent } from "@dfinity/agent";
import React, { useEffect } from "react";
import { idlFactory } from "../../declarations/nft";
import { idlFactory as tokenIDLFactory } from "../../declarations/DPI_backend"
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { openOcean_backend } from "../../declarations/openOcean_backend";
import { CURRENT_USER_ID } from "./constants";
import PriceLabel from "./PriceLabel";


function Item(props) {

  const [name, setName] = React.useState();
  const [owner, setOwner] = React.useState();
  const [image, setImage] = React.useState();
  const [price, setPrice] = React.useState("");
  const [sellPrice, setSellPrice] = React.useState();
  const [isSelling, setIsSelling] = React.useState(false);
  const [isListed, setIsListed] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [originalOwner, setOriginalOwner] = React.useState();
  const [shouldDisplay, setShouldDisplay] = React.useState("inline");


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
      const openOceanCanisterId = await openOcean_backend.getCanisterId();

      if (owner.toText() === openOceanCanisterId.toText()) {
        setOwner("OpenOcean");
        setIsListed(true);

        // Fetch the listed price from backend
        const listedPrice = await openOcean_backend.getListedNFTPrice(id);
        setSellPrice(Number(listedPrice));

        // Fetch the original owner from listings for discover page
        if (props.role === "discover") {
          const origOwnerOpt = await openOcean_backend.getOriginalOwner(id);
          if (origOwnerOpt.length > 0) {
            setOriginalOwner(origOwnerOpt[0].toText());
          }
        }
      } else {
        setOwner(owner.toText());
      }

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

  async function handleBuy() {
    console.log("Buy clicked");
    setLoader(true);
    const agent = new HttpAgent({ host: "http://localhost:4943" });

    await agent.fetchRootKey();

    const tokenActor = await Actor.createActor(tokenIDLFactory, {
      agent,
      canisterId: Principal.fromText("uxrrr-q7777-77774-qaaaq-cai"),
    });

    const result = await tokenActor.transfer(Principal.fromText(originalOwner), sellPrice);
    console.log("Token transfer result:", result);

    if (result == "Success!") {
      const transferResult = await openOcean_backend.completePurchase(props.id, Principal.fromText(originalOwner), CURRENT_USER_ID);
      console.log("Transfer result:", transferResult);
    }

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
          if (transferResult === "Success!") {
            setIsListed(true);
            setOwner("OpenOcean");
          }
        } else {
          console.error("Critical Error: nftActor is not defined in sellItem");
          alert("Error: NFT data not fully loaded. Please wait and try again.");
        }
      } else {
        alert("Listing failed: " + result);
      }
    } catch (err) {
      console.error("Error during sellItem:", err);
      setLoader(false);
    }
  }

  const shouldDisplay = isListed || props.role !== "discover";

  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={isListed && props.role !== "discover" ? { filter: "blur(4px)", opacity: 0.5 } : {}}
        />
        <div hidden={!loader} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {isListed && <PriceLabel sellPrice={sellPrice} />}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 m-3 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {props.role === "discover" ? (
            originalOwner && originalOwner !== CURRENT_USER_ID.toText() ? (
              <>
                <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2" style={{ fontWeight: "bold" }}>
                  <span className="purple-text">{sellPrice} DPI</span>
                </p>
                <Button handleClick={handleBuy} text={"Buy"} />
              </>
            ) : null
          ) : isListed ? (
            <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2" style={{ color: "green", fontWeight: "bold" }}>
              <span className="purple-text">Listed </span>
            </p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
