import { Actor, HttpAgent } from "@dfinity/agent";
import React, { useEffect } from "react";
import { idlFactory } from "../../declarations/nft";
import { Principal } from "@dfinity/principal";

function Item(props) {

  const [name, setName] = React.useState();
  const [owner, setOwner] = React.useState();
  const [image, setImage] = React.useState();

  async function loadNFT() {
    try {
      const id = props.id;
      const agent = new HttpAgent({ host: "http://localhost:4943" });

      // Remove this line when deploying to production
      await agent.fetchRootKey();

      const nftActor = await Actor.createActor(idlFactory, {
        agent,
        canisterId: id,
      });

      const name = await nftActor.getName();
      setName(name);

      const owner = await nftActor.getOwner();
      setOwner(owner.toText());

      const imageData = await nftActor.getAsset();
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

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
