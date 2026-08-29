import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Gallery from "./Gallery";
import Minter from "./Minter";
import { CURRENT_USER_ID } from "./constants";
import { openOcean_backend } from "../../declarations/openOcean_backend";

function UserGallery() {
  const [nfts, setNfts] = useState([]);


  async function fetchUserNFTs() {
    try {
      const nftIds = await openOcean_backend.getMyNFTs(CURRENT_USER_ID);
      console.log("Fetched User NFTs:", nftIds);
      setNfts(nftIds);
    } catch (err) {
      console.error("Failed to fetch user NFTs:", err);
    }
  }

  useEffect(() => {
    fetchUserNFTs();
  }, []);

  return <Gallery title="My NFTs" nfts={nfts} role="collection" />;
}

function ListedGallery() {
  const [nfts, setNfts] = useState([]);

  async function fetchListedNFTs() {
    try {
      const nftIds = await openOcean_backend.getAllListings();
      console.log("Fetched Listed NFTs:", nftIds);
      setNfts(nftIds);
    } catch (err) {
      console.error("Failed to fetch listed NFTs:", err);
    }
  }

  useEffect(() => {
    fetchListedNFTs();
  }, []);

  return <Gallery title="Listed NFTs" nfts={nfts} role="discover" />;
}

function Header() {
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
        <Route path="/discover" element={<ListedGallery />} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={<UserGallery />} />
        <Route path="/" element={<img className="bottom-space" src="/home-img.png" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
