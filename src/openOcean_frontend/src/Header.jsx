import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Gallery from "./Gallery";
import Minter from "./Minter";
import { CURRENT_USER_ID } from "./constants";
import { openOcean_backend } from "../../declarations/openOcean_backend";

function Header() {
  const [userOwnedGallery, setUserOwnedGallery] = useState();
  async function getNFTs() {
    const nfts = await openOcean_backend.getMyNFTs(CURRENT_USER_ID);
    console.log(nfts);
    setUserOwnedGallery(<Gallery title="My NFTs" nfts={nfts} />);
  }

  useEffect(() => {
    getNFTs();
  }, []);


  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src="/logo.png" />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenOcean</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">
                Discover
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">
                Minter
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">
                My NFTs
              </Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route path="/discover" element={<h1>Discover</h1>} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={userOwnedGallery} />
        <Route path="/" element={<img className="bottom-space" src="/home-img.png" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
