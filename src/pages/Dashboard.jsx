import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/header/logo_black.png";
import menuIcon from "../assets/images/header/menu.svg";
import refreshIcon from "../assets/images/header/logout.svg";
import chatIcon from "../assets/images/header/chat.png";

// Banner images (rotating, seamless, fit container)
import bannerImg1 from "../assets/images/dashboard/banner1.jpg";
import bannerImg2 from "../assets/images/dashboard/banner2.jpg";
import bannerImg3 from "../assets/images/dashboard/banner3.jpg";

// Section images
import shoesImg from "../assets/images/dashboard/Shoes.png";
import apparelImg from "../assets/images/dashboard/Apparel.png";
import electronicsImg from "../assets/images/dashboard/Electronics.png";
import accessoriesImg from "../assets/images/dashboard/Accessories.png";
import jewelryImg from "../assets/images/dashboard/Jewery.png";
import watchesImg from "../assets/images/dashboard/Watches.png";
import furnitureImg from "../assets/images/dashboard/Furniture.png";
import commoditiesImg from "../assets/images/dashboard/Commodities.png";

// Brand logo images
import chanelLogo from "../assets/images/brands/chanel.png";
import nikeLogo from "../assets/images/brands/nike.png";
import crocsLogo from "../assets/images/brands/crocs.png";
import appleLogo from "../assets/images/brands/apple.png";
import supremeLogo from "../assets/images/brands/supreme.png";
import lvLogo from "../assets/images/brands/louisvuitton.png";

import contactIcon from "../assets/images/dashboard/contact.png";
import joinIcon from "../assets/images/dashboard/join.png";
import bonusIcon from "../assets/images/dashboard/bonus.png";
import membershipIcon from "../assets/images/dashboard/membership.png";
import accountIcon from "../assets/images/dashboard/auth.svg";

import "./Dashboard.css";

// Banner data
const bannerSlides = [
  { img: bannerImg1 },
  { img: bannerImg2 },
  { img: bannerImg3 }
];

// SIDEBAR COMPONENT
function Sidebar({ open, onClose }) {
  return (
    <div className={`dashboard-sidebar-overlay${open ? " open" : ""}`}>
      <div className="dashboard-sidebar">
        <button className="dashboard-sidebar-close" onClick={onClose} aria-label="Close sidebar">&times;</button>
        <div className="dashboard-sidebar-title">SS&amp;C Sequence</div>
        <nav className="dashboard-sidebar-nav">
          {/* Sidebar links updated to navigate to the actual routes */}
          <Link to="/shoes" className="dashboard-sidebar-item">SHOES</Link>
          <Link to="/apparel" className="dashboard-sidebar-item">APPAREL</Link>
          <Link to="/electronics" className="dashboard-sidebar-item">ELECTRONICS</Link>
          <Link to="/accessories" className="dashboard-sidebar-item">ACCESSORIES</Link>
          <Link to="/jewelry" className="dashboard-sidebar-item">JEWELRY</Link>
          <Link to="/watches" className="dashboard-sidebar-item">WATCHES</Link>
          <Link to="/furniture" className="dashboard-sidebar-item">FURNITURE</Link>
          <Link to="/commodities" className="dashboard-sidebar-item">COMMODITIES</Link>
          <hr className="dashboard-sidebar-divider" />
          <Link to="/profile" className="dashboard-sidebar-item dashboard-sidebar-account">
            <img src={accountIcon} alt="Account" className="dashboard-sidebar-account-icon" />
            <span className="dashboard-sidebar-account-text">MY ACCOUNT</span>
          </Link>
          <Link to="/dashboards" className="dashboard-sidebar-item">DASHBOARD</Link>
          <Link to="/vip" className="dashboard-sidebar-item">PREMIUM MEMBERSHIP</Link>
        </nav>
      </div>
    </div>
  );
}

// HEADER
function Header({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-bar">
        <img src={menuIcon} alt="Menu" className="header-icon" onClick={onMenuClick} style={{ cursor: "pointer" }} />
        <div className="header-logo-wrap">
          <img src={logo} alt="Sequence Logo" className="header-logo" />
        </div>
        {/* make this icon navigate to the logout route (same behaviour as the header component in components/Header.jsx) */}
        <img
          src={refreshIcon}
          alt="Logout"
          className="header-icon"
          onClick={() => navigate("/logout")}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  );
}

// BRAND LOGO ROW
function BrandLogoRow() {
  return (
    <div className="dashboard-brand-logo-row-scroll">
      <div className="dashboard-brand-logo-inner">
        <img src={chanelLogo} alt="CHANEL" className="dashboard-brand-img" />
        <img src={nikeLogo} alt="Nike" className="dashboard-brand-img" />
        <img src={crocsLogo} alt="crocs" className="dashboard-brand-img" />
        <img src={appleLogo} alt="Apple" className="dashboard-brand-img" />
        <img src={supremeLogo} alt="Supreme" className="dashboard-brand-img" />
        <img src={lvLogo} alt="Louis Vuitton" className="dashboard-brand-img" />
      </div>
      <div className="dashboard-brand-logo-fade"></div>
    </div>
  );
}

// QUICK MENU SECTION
function QuickMenu() {
  return (
    <div className="dashboard-quickmenu-section">
      <div className="dashboard-quickmenu-title">Get Started with SS&amp;C Sequence</div>
      <div className="dashboard-quickmenu-list">
        <Link to="/ContactUs" className="dashboard-quickmenu-item">
          <img src={contactIcon} alt="Contact" />
          <span>Contact Us &gt;</span>
        </Link>

        <Link to="/JoinUs" className="dashboard-quickmenu-item">
          <img src={joinIcon} alt="Join" />
          <span>Join Us &gt;</span>
        </Link>

        <Link to="/events" className="dashboard-quickmenu-item">
          <img src={bonusIcon} alt="Global Bonus" />
          <span>Global Bonus &gt;</span>
        </Link>

        <Link to="/vip" className="dashboard-quickmenu-item">
          <img src={membershipIcon} alt="Membership" />
          <span>Join Membership &gt;</span>
        </Link>
      </div>
    </div>
  );
}

// Main dashboard sections
const dashboardSections = [
  { img: shoesImg, title: "Shoes", desc: "Pages feature designer brands", btn: "Discover", url: "/shoes" },
  { img: apparelImg, title: "Apparel", desc: "There's brand of apparel for everyone", btn: "Discover", url: "/apparel" },
  { img: electronicsImg, title: "Electronics", desc: "A integral part of our daily lives", btn: "Discover", url: "/electronics" },
  { img: accessoriesImg, title: "Accessories", desc: "The perfect accessories to complete a look", btn: "Discover", url: "/accessories" },
  { img: jewelryImg, title: "JEWELRY", desc: "The epitome of beauty and romances", btn: "Discover", url: "/jewelry" },
  { img: watchesImg, title: "Watches", desc: "Powered by a Swiss movement", btn: "Discover", url: "/watches" },
  { img: furnitureImg, title: "FURNITURE", desc: "Thoughtfully crafted furniture that elevates your space with style and function", btn: "Discover", url: "/furniture" },
  { img: commoditiesImg, title: "COMMODITIES", desc: "Thoughtfully crafted furniture that elevates your space with style and function", btn: "Discover", url: "/commodities" },
];

// Banner slider
function BannerSlider() {
  const trackRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let start;
    const pxPerSec = 40;
    let trackWidth = 0;

    function setTrackWidth() {
      if (trackRef.current) {
        // The track contains duplicated slides; use half the scrollWidth so the loop aligns.
        // Use getBoundingClientRect width of the container to compute slide width reliably.
        const container = trackRef.current;
        trackWidth = Math.max(1, container.scrollWidth / 2);
      }
    }

    setTrackWidth();
    window.addEventListener("resize", setTrackWidth);

    function animateBanner(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      const px = (elapsed * pxPerSec) % trackWidth;
      if (trackRef.current) {
        // Move the whole track left; slides are full-container width so each image fully enters the card as it animates.
        trackRef.current.style.transform = `translateX(-${px}px)`;
      }
      animationFrameId = requestAnimationFrame(animateBanner);
    }

    animationFrameId = requestAnimationFrame(animateBanner);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setTrackWidth);
    };
  }, []);

  const allSlides = [...bannerSlides, ...bannerSlides];

  return (
    <section className="dashboard-banner-section banner-slider-container" aria-label="Banner slider">
      <style>{`
        /*
          Banner adjustments to make it full-bleed (no left/right gaps) and ensure
          images always cover the card area and animate seamlessly into each other.

          Key points implemented:
          - Make the banner element full-bleed by using width:100vw and centering technique
            (left:50% translateX(-50%)) so it extends to the viewport edges regardless of page padding.
          - Slides fill the container exactly (no padding/margins) and are placed adjacent with no gaps.
          - Images use object-fit: cover so they completely fill the card area (no top/bottom white gaps).
          - Track transforms with translateX produce a continuous sliding effect; duplicated slides preserved.
        */

        /* full-bleed container: spans viewport width even when inside a centered page container */
        .banner-slider-container {
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          width: 100vw;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 0;
          padding: 0; /* remove any internal spacing */
        }

        /* track: horizontal flex row, no gaps between slides */
        .banner-slider-track-continuous {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          width: 100%;
          will-change: transform;
          gap: 0;
          z-index: 0;
          transition: transform 0.06s linear;
        }

        /* each slide exactly equals the banner viewport width and height (no margins) */
        .banner-slider-slide-continuous {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        /* image: cover whole slide area; center the image.
           Using cover ensures the card has no empty space top/bottom and the visual fills edge-to-edge.
           To match desktop visual on smaller screens, switch the focal point to the left side of images
           so important subjects remain visible on mobile. Desktop keeps center.
        */
        .banner-slider-slide-continuous .banner-slider-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center; /* default for desktop */
          user-select: none;
          pointer-events: none;
        }

        /* Banner heights (kept larger than other sections).
           Use explicit heights for the track so slides are identical and adjacent.
        */
        .dashboard-banner-section { min-height: 320px; height: auto; }
        .banner-slider-track-continuous,
        .banner-slider-slide-continuous { height: 320px; }

        @media (min-width: 900px) {
          .banner-slider-track-continuous,
          .banner-slider-slide-continuous { height: 420px; }
          .dashboard-banner-section { min-height: 420px; }
        }

        /* On narrow screens, favor the left side of banner images so the same subject visible on desktop
           remains visible on mobile (avoids images appearing to "start halfway"). */
        @media (max-width: 900px) {
          .banner-slider-track-continuous,
          .banner-slider-slide-continuous { height: 260px; }
          .dashboard-banner-section { min-height: 260px; }
          .banner-slider-slide-continuous .banner-slider-img {
            object-position: left center; /* favor left focal point on phones/tablets */
          }
        }

        @media (max-width: 700px) {
          .banner-slider-track-continuous,
          .banner-slider-slide-continuous { height: 200px; }
          .dashboard-banner-section { min-height: 200px; }
          .banner-slider-slide-continuous .banner-slider-img {
            object-position: left center; /* ensure subject remains visible on small phones */
          }
        }

        /* Ensure sections render above the track */
        .dashboard-menu-section { z-index: 2; position: relative; }
        .dashboard-menu-overlay { z-index: 3; position: absolute; }
        .dashboard-menu-content { z-index: 4; position: relative; }

        /* small gap so sections are visually separated from banner */
        .dashboard-banner-menu-spacing { height: 12px; }

      `}</style>

      <div className="banner-slider-track-continuous" ref={trackRef}>
        {allSlides.map((slide, i) => (
          <div className="banner-slider-slide-continuous" key={i}>
            <img src={slide.img} alt={`Banner ${i + 1}`} className="banner-slider-img" draggable={false} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="login-bg-hero">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <main className="dashboard-main-content">
        <BannerSlider />
        <div className="dashboard-banner-menu-spacing"></div>
        {dashboardSections.map((section, i) => (
          <section
            className={`dashboard-menu-section${section.title === "COMMODITIES" ? " commodities-section" : ""}`}
            key={section.title || i}
            style={{ backgroundImage: `url(${section.img})` }}
          >
            <div className="dashboard-menu-overlay">
              <div className="dashboard-menu-content dashboard-menu-content-center">
                <div className="dashboard-menu-title">{section.title}</div>
                <div className="dashboard-menu-desc">{section.desc}</div>
                <Link to={section.url} className="dashboard-menu-btn">
                  {section.btn} <span className="dashboard-menu-btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </section>
        ))}
        <BrandLogoRow />
        <QuickMenu />
      </main>
      {/* Removed the local Footer component so the app will use the global footer instead */}
    </div>
  );
}
