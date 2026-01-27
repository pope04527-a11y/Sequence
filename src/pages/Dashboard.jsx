import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  return (
    <header className="header">
      <div className="header-bar">
        <img src={menuIcon} alt="Menu" className="header-icon" onClick={onMenuClick} style={{ cursor: "pointer" }} />
        <div className="header-logo-wrap">
          <img src={logo} alt="Sequence Logo" className="header-logo" />
        </div>
        <img src={refreshIcon} alt="Refresh" className="header-icon" />
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
    let pxPerSec = 40;
    let trackWidth = 0;

    function setTrackWidth() {
      if (trackRef.current) {
        // compute half width for continuous sliding (we duplicate slides)
        trackWidth = trackRef.current.scrollWidth / 2 || 0;
      }
    }

    setTrackWidth();
    window.addEventListener("resize", setTrackWidth);

    function animateBanner(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      const px = trackWidth ? (elapsed * pxPerSec) % trackWidth : 0;
      if (trackRef.current) {
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

  // Make banner card visually larger than other sections while remaining responsive.
  // Use clamp so it scales on mobile/desktop: at least 280px, prefers 36vh, max 520px.
  const bannerContainerStyle = {
    minHeight: "clamp(280px, 36vh, 520px)",
    height: "auto",
    overflow: "hidden",
    position: "relative",
    margin: "0 auto",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "18px 0", // add spacing same as other sections but larger visual area
  };

  const trackStyle = {
    display: "flex",
    alignItems: "stretch",
    height: "100%",
    willChange: "transform",
  };

  const slideStyle = {
    flex: "0 0 100%",
    height: "100%",
    boxSizing: "border-box",
    position: "relative",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover", // fill the increased banner area responsively
    display: "block",
  };

  return (
    <section className="dashboard-banner-section banner-slider-container" style={bannerContainerStyle}>
      <div className="banner-slider-track-continuous" ref={trackRef} style={trackStyle}>
        {allSlides.map((slide, i) => (
          <div className="banner-slider-slide-continuous" key={i} style={slideStyle}>
            <img src={slide.img} alt={`Banner ${i + 1}`} className="banner-slider-img" draggable={false} style={imgStyle} />
          </div>
        ))}
      </div>
    </section>
  );
}

/*
  RotatingSection
  - Renders a section whose background is an absolutely positioned <img> that cycles through a provided images array.
  - Uses objectFit 'cover' so the image fills the section and remains responsive across devices.
  - The first section is intentionally taller than the others; content is centered and padded so nothing is cut on small screens.
*/
function RotatingSection({ images, title, desc, btn, url, height = 420, minHeightMobile = 260, interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const id = setInterval(() => {
      if (!mounted.current) return;
      setIndex((s) => (s + 1) % images.length);
    }, interval);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [images.length, interval]);

  // Inline styles to ensure content doesn't get cut on small devices.
  const sectionStyle = {
    position: "relative",
    overflow: "visible",
    // allow the first card to be larger on all devices
    minHeight: `${minHeightMobile}px`,
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "28px 0",
    boxSizing: "border-box",
  };

  const imageWrapperStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 0,
    border: "8px solid rgba(7,30,47,1)",
    boxSizing: "border-box",
    borderRadius: 4,
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover", // cover so it fills without squishing; center crop keeps visual consistent
    display: "block",
    transition: "opacity 600ms ease",
    opacity: 1,
  };

  const overlayStyle = {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 1100,
    padding: "32px 18px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const contentStyle = {
    textAlign: "center",
    color: "#fff",
    // ensure content stays visible and spaced from edges on very small screens
    padding: "10px 8px",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: 800,
    marginBottom: 8,
    textShadow: "0 4px 14px rgba(0,0,0,0.45)",
  };

  const descStyle = {
    fontSize: "16px",
    opacity: 0.95,
    marginBottom: 16,
    textShadow: "0 3px 10px rgba(0,0,0,0.35)",
  };

  const btnStyle = {
    display: "inline-block",
    background: "#158a93",
    color: "#fff",
    padding: "14px 26px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 800,
    boxShadow: "0 8px 20px rgba(21,138,147,0.18)",
  };

  return (
    <section
      className="dashboard-menu-section rotating-section"
      aria-label={title}
      style={{ ...sectionStyle }}
    >
      {/* Image wrapper: show current image as full-bleed background */}
      <div style={imageWrapperStyle} aria-hidden>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} ${i + 1}`}
            style={{
              ...imgStyle,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: i === index ? 1 : 0,
            }}
            draggable={false}
          />
        ))}
      </div>

      {/* overlay with content centered */}
      <div style={overlayStyle}>
        <div style={contentStyle}>
          <div style={titleStyle}>{title}</div>
          <div style={descStyle}>{desc}</div>
          <Link to={url} className="dashboard-menu-btn" style={btnStyle}>
            {btn} <span className="dashboard-menu-btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  // Choose a set of images for the first card to rotate.
  // Using the section image (shoes) plus two banner images provides visual variety
  // while keeping the first card clearly associated with the Shoes section.
  const firstSectionImages = [shoesImg, bannerImg1, bannerImg2];

  return (
    <div className="login-bg-hero">
      <Header onMenuClick={handleMenuClick} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <main className="dashboard-main-content">
        <BannerSlider />
        <div className="dashboard-banner-menu-spacing"></div>

        {/* First section as a rotating, taller, fully-responsive card */}
        <RotatingSection
          images={firstSectionImages}
          title={dashboardSections[0].title}
          desc={dashboardSections[0].desc}
          btn={dashboardSections[0].btn}
          url={dashboardSections[0].url}
          height={420}
          minHeightMobile={300}
          interval={3500}
        />

        {/* Render the rest of the sections as before but ensure content overlay is centered and images fit */}
        {dashboardSections.slice(1).map((section, i) => (
          <section
            className={`dashboard-menu-section${section.title === "COMMODITIES" ? " commodities-section" : ""}`}
            key={section.title || i}
            // keep background-image for compatibility but also ensure overlay content won't be cut on small devices
            style={{
              backgroundImage: `url(${section.img})`,
              // ensure each non-first section has a consistent height and spacing
              minHeight: "220px",
              padding: "28px 0",
              boxSizing: "border-box",
            }}
          >
            <div className="dashboard-menu-overlay">
              <div className="dashboard-menu-content dashboard-menu-content-center" style={{ padding: "18px 12px" }}>
                <div className="dashboard-menu-title" style={{ marginBottom: 8 }}>{section.title}</div>
                <div className="dashboard-menu-desc" style={{ marginBottom: 16 }}>{section.desc}</div>
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
