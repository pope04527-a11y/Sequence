import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Shoes.png";

/**
 * Shoes page — two vertical columns layout (4 items stacked top->bottom on left,
 * and 4 items stacked top->bottom on right) per page (8 items per page).
 *
 * Changes in this file:
 * - Products are shuffled at runtime (like Apparel.jsx and Accessories.jsx).
 * - Keeps the layout and the image-fit behaviour you liked (image area flexes, object-fit: contain).
 * - Rest of the logic, class names and markup left intact.
 */

/* Helper: build a friendly name from the Cloudinary filename */
function friendlyNameFromUrl(url) {
  try {
    const parts = url.split("/");
    let name = parts[parts.length - 1] || url;
    name = name.replace(/\.[a-zA-Z0-9]+$/, "");
    name = name.replace(/(_\d+){1,3}$/, "");
    name = name.replace(/[_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (name.length > 60) return name.slice(0, 57) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* All Cloudinary product URLs you provided */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090515/products/2021_wholesale_yeezy_450_dark_slate_black_green_shoes_fly_kn_2021_wholesale_yeezy_450_dark_slate_black_green_shoes_fly_kn_102_66.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096676/products/Hot_sale_Fashion_Brand_Nike_SB_Dunk_Low_Panda_Casual_Shoes_O_Hot_sale_Fashion_Brand_Nike_SB_Dunk_Low_Panda_Casual_Shoes_O_93_53.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092747/products/Best_Quality_Men_Boots_Made_in_Italy_Winter_Shoes_Laces_Genu_Best_Quality_Men_Boots_Made_in_Italy_Winter_Shoes_Laces_Genu_136_4.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096290/products/High_Quality_Shoes_Made_in_Italy_Mens_Casual_Boots_Genuine_L_High_Quality_Shoes_Made_in_Italy_Mens_Casual_Boots_Genuine_L_136_4.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119061/products/OG_Travis_X_j6_Retro_Medium_Olive_Men_Basketball_Shoes_Tinke_OG_Travis_X_j6_Retro_Medium_Olive_Men_Basketball_Shoes_Tinke_71_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121546/products/wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_wholesale_2022Famouse_Brand_Shoes_Top_Grade_BB_track3_0_man.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097065/products/Italian_Style_High_Quality_Shoes_For_Buyers_Made_In_Italy_Fa_Italian_Style_High_Quality_Shoes_For_Buyers_Made_In_Italy_Fa_765_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091332/products/318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_318-51_High_End_Oxford_Shoes_Men_One_Piece_Leather_Handmade_49_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118852/products/Newest_Men_s_basketball_shoes_Large_size_AJ_11_Retro_Cherry_Newest_Men_s_basketball_shoes_Large_size_AJ_11_Retro_Cherry_102.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090571/products/2022_Brand_New_Factory_Custom_Logo_Classic_Fashion_Shoes_Whi_2022_Brand_New_Factory_Custom_Logo_Classic_Fashion_Shoes_Whi_339_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119323/products/Paris_Sneakers_For_Luxury_Balanciaga_Triple_S_Shoes_Clear_So_Paris_Sneakers_For_Luxury_Balanciaga_Triple_S_Shoes_Clear_So_142_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118750/products/New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_New_Trend_Product_Luxury_balanciaga_shoes_Men_Chunky_2022_Ai_72_15.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092542/products/Banquet_Botas_2022_New_Fashion_Metallic_Shoes_Women_Mirror_L_Banquet_Botas_2022_New_Fashion_Metallic_Shoes_Women_Mirror_L_49_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090784/products/2022_New_Unisex_Air_Shoes_Fashion_Trend_Sneakers_Flat_Custom_2022_New_Unisex_Air_Shoes_Fashion_Trend_Sneakers_Flat_Custom_77_88.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094816/products/Factory_outlet_Professional_Hand_made_Clap_ice_skate_shoes_i_Factory_outlet_Professional_Hand_made_Clap_ice_skate_shoes_i_276_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093561/products/Cow_Leather_Combat_Boots_Tactical_Shoes_Sale_Black_OEM_Color_Cow_Leather_Combat_Boots_Tactical_Shoes_Sale_Black_OEM_Color_152_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092762/products/Best_Selling_Fashion_Leisure_Men_Shoes_Winter_Warm_Ankle_Sno_Best_Selling_Fashion_Leisure_Men_Shoes_Winter_Warm_Ankle_Sno_190_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120147/products/Trendy_luxury_chunky_heel_office_shoes_women_heels_pump_croc_Trendy_luxury_chunky_heel_office_shoes_women_heels_pump_croc_422_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097161/products/Japanese_bulk_trendy_shoes_custom_made_slippers_loafer_for_s_Japanese_bulk_trendy_shoes_custom_made_slippers_loafer_for_s_196_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117424/products/Luxury_brand_Designer_boots_pink_green_women_shoes_croc_rain_Luxury_brand_Designer_boots_pink_green_women_shoes_croc_rain_49_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118060/products/Mens_Cost_Sale_Fashion_Sport_Shoes_Custom_Sneakers_Couple_Sh_Mens_Cost_Sale_Fashion_Sport_Shoes_Custom_Sneakers_Couple_Sh_42_23.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094267/products/Designer_brands_women_gg_shoes_1977_women_GG_tennis_sneakers_Designer_brands_women_gg_shoes_1977_women_GG_tennis_sneakers_49_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120603/products/Wholesale_high_quality_men_shoes_short_wholesale_boots_for_s_Wholesale_high_quality_men_shoes_short_wholesale_boots_for_s_231.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121123/products/Yeezy_700_V3_Shoes_Wholesale_Original_Sneakers_Tenis_High_Qu_Yeezy_700_V3_Shoes_Wholesale_Original_Sneakers_Tenis_High_Qu_55.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096723/products/Hot_selling_crocodile_leather_pump_women_low_heel_shoes_purp_Hot_selling_crocodile_leather_pump_women_low_heel_shoes_purp_390.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117845/products/Manufacture_Wholesale_price_big_3_wheel_speed_skate_shoes_ca_Manufacture_Wholesale_price_big_3_wheel_speed_skate_shoes_ca_250.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094081/products/Customized_logo_nice_italian_style_crocodile_shoes_men_s_bus_Customized_logo_nice_italian_style_crocodile_shoes_men_s_bus_283_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092756/products/Best_Selling_Big_Size_Men_s_Basketball_Shoes_Secon_Best_Sell_Best_Selling_Big_Size_Men_s_Basketball_Shoes_Secon_420_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097109/products/J-6_WATERPROOF_SHOES_2020_BLACK_MOTORCYCLE_MAN_J-6_WATERPRO_J-6_WATERPROOF_SHOES_2020_BLACK_MOTORCYCLE_MAN_172_13.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090750/products/2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_2022_New_Design_Women_s_Waterproof_Hiking_Boots_Outdoor_Shoe_142_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093379/products/Cie_A209_Fashion_Men_s_Handmade_Office_Formal_Leather_Shoes_Cie_A209_Fashion_Men_s_Handmade_Office_Formal_Leather_Shoes_174_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093358/products/Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_Luxury_Women_s_Formal_Shoes_Party_Genuine_Leather_Snake_Skin_207.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093437/products/Colorful_mixed_real_leather_shoes_girls_causal_fashion_sneak_Colorful_mixed_real_leather_shoes_girls_causal_fashion_sneak_503_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093545/products/Corefoot_Original_Men_Women_270_Breathable_Shoes_Summer_Air_Corefoot_Original_Men_Women_270_Breathable_Shoes_Summer_Air_43_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121530/products/used_football_shoes_custom_high_quality_branded_original_foo_used_football_shoes_custom_high_quality_branded_original_foo_62_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120230/products/Vikeduo_Hand_Made_Durable_Wearing_Coolest_Streetwear_Shoes_C_Vikeduo_Hand_Made_Durable_Wearing_Coolest_Streetwear_Shoes_C_309_54.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120319/products/White_Shoes_Winter_Thick-soled_Heighten_Locomotive_Short_Boo_White_Shoes_Winter_Thick-soled_Heighten_Locomotive_Short_Boo_136_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093384/products/Cie_A221_Customized_Fashion_Style_Black_Shoes_Handmade_Goody_Cie_A221_Customized_Fashion_Style_Black_Shoes_Handmade_Goody_198_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119315/products/PVC_transparent_Point_toe_High_heel_wedding_rhinestones_shoe_PVC_transparent_Point_toe_High_heel_wedding_rhinestones_shoe_144_83.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096355/products/High_quality_OF_white_fashion_Sneakers_designer_Brand_shoes_High_quality_OF_white_fashion_Sneakers_designer_Brand_shoes_102.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117387/products/Luxury_Shoes_Women_Genuine_Crocodile_Leather_Pump_Women_High_Luxury_Shoes_Women_Genuine_Crocodile_Leather_Pump_Women_High_240.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119442/products/Premium_Quality_Handmade_Italian_Men_Double_Buckle_Shoes_Gen_Premium_Quality_Handmade_Italian_Men_Double_Buckle_Shoes_Gen_242.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121623/products/winter_ladies_office_boots_ladies-boots_long_designer_shoes_winter_ladies_office_boots_ladies-boots_long_designer_shoes_138.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119296/products/PGM_XZ204_stylish_golf_shoes_men_genuine_leather_waterproof_PGM_XZ204_stylish_golf_shoes_men_genuine_leather_waterproof_660.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119427/products/Premium_Quality_Handmade_Italian_Men_Chelsea_Boots_Shoes_Gen_Premium_Quality_Handmade_Italian_Men_Chelsea_Boots_Shoes_Gen_286.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119495/products/Professional_full_carbon_fiber_customized_foot_type_shoes_le_Professional_full_carbon_fiber_customized_foot_type_shoes_le_325.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095139/products/Figure_ice_skates_blackCarbon_Fiber_Quad_Roller_Skate_Shoes_Figure_ice_skates_blackCarbon_Fiber_Quad_Roller_Skate_Shoes_242.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119597/products/ROCKROOSTER_Safety_Shoes_Men_Genuine_Leather_Ankle_Boots_Man_ROCKROOSTER_Safety_Shoes_Men_Genuine_Leather_Ankle_BootS_Man_110.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120469/products/Wholesale_High_Quality_women_Shoes_Original_Women_Sneakers_F_Wholesale_High_Quality_women_Shoes_Original_Women_Sneakers_F_340.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119750/products/SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_S_SFI_Approved_Car_Racing_BootsInternational_Auto_Race_Shoes_163_61.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120036/products/Talos_Snowboarding_Waterproof_Shoes_custom_adult_outdoor_col_Talos_SnowboardingWaterproof_Shoes_custom_adult_outdoor_col_189_13.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121404/products/retro_4s_shoes_Men_Women_Casual_Shoes_TOP_Og_University_Blue_retro_4s_shoes_Men_Women_Casual_Shoes_TOP_Og_University_Blue_57_95.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117297/products/Low_Moq_Casual_Running_Shoes_Men_S_Casual_Shoes_Sneaker_Fuji_Low_Moq_Casual_Running_Shoes_Men_S_Casual_Shoes_Sneaker_Fuji_81_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090862/products/2022_Rivet_Men_s_Shoes_High_Top_Leather_Sequin_Casual_Shoes_2022_Rivet_Men_s_Shoes_High_Top_Leather_Sequin_Casual_Shoes_48_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121237/products/men_designer_shoes_and_slippers_man_sandals_leather_shoes_fo_men_designer_shoes_and_slippers_man_sandals_leather_shoes_fo_49_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090893/products/2022_Trendy_Sports_Men_Golden_Shoe_High-top_Luxury_Men_Shoes_2022_Trendy_Sports_Men_Golden_Shoe_High-top_Luxury_Men_Shoes_42_78.jpg"
];

/* Shuffle the URLs at runtime so pages don't show grouped identical products */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Build product objects with name and a short description */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (lower.includes("boot")) return "Durable and stylish — great for outdoor and winter wear.";
      if (lower.includes("sneaker") || lower.includes("sneakers") || lower.includes("nike") || lower.includes("yeezy")) return "Comfortable sneaker for everyday wear and sports.";
      if (lower.includes("slipper") || lower.includes("loafer")) return "Casual and comfortable slip-on — great for home and casual outings.";
      if (lower.includes("oxford") || lower.includes("leather")) return "Premium leather craftsmanship for formal occasions.";
      if (lower.includes("heel") || lower.includes("pump")) return "Elevate your outfit with these stylish heels.";
      if (lower.includes("ice skate") || lower.includes("skate")) return "Specialized skate shoes for performance and style.";
      return "High quality shoes with excellent comfort and design.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Shoes() {
  // Shuffle once on component mount (keeps behavior same as Apparel & Accessories)
  const shuffledUrls = useMemo(() => shuffleArray(productUrls), []);
  const products = useMemo(() => productsFromUrls(shuffledUrls), [shuffledUrls]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // exactly 8 products per page (4 up-down left, 4 up-down right)
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage, products]);

  // split into two vertical columns: left (items 0-3) and right (items 4-7)
  const leftColumn = pageProducts.slice(0, 4);
  const rightColumn = pageProducts.slice(4, 8);

  const goTo = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    const maxButtons = 7;
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="shoes-bg">
      <style>{`
        /* Navy strip behind the product grid */
        .shoes-grid-outer {
          background: #08223a;
          padding: 18px 10px;
        }

        /* Two columns layout: left and right columns stacked vertically
           IMPORTANT: keep two columns ALWAYS (never collapse to single column).
           This ensures a 2x4 layout even on narrow screens as requested.
        */
        .two-column-vertical {
          display: grid;
          grid-template-columns: 1fr 1fr; /* always two columns */
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Allow horizontal scrolling if the viewport gets so narrow the two columns don't fit.
           This preserves the two-column requirement and avoids collapsing to 1 column.
        */
        @media (max-width: 520px) {
          .two-column-vertical {
            overflow-x: auto;
            padding: 0 12px;
            grid-auto-flow: column;
            grid-auto-columns: minmax(240px, 1fr);
            align-items: start;
          }
        }

        /* Column container holds 4 stacked cards */
        .column-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Frame around each card to match screenshot look */
        .shoe-card-frame {
          border: 8px solid #071e2f;
          box-sizing: border-box;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          text-decoration: none;
          min-height: 280px;
          height: 100%;
        }

        /* Image wrapper now flexes to take remaining vertical space after the info (name/desc).
           The info block is non-flexing to allow the image to adapt to leftover space.
           This makes the image always fit inside the card's remaining area after the text.
        */
        .shoe-image-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto; /* <-- image area expands to fill remaining vertical space */
          padding: 0; /* remove fixed aspect padding to allow flexible height */
        }
        /* Ensure image always fits inside its frame regardless of original size */
        .shoe-image-wrap img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain; /* don't crop, fit within available space */
          display: block;
        }

        .shoe-info {
          padding: 14px;
          background: #fff;
          flex: 0 0 auto; /* <-- info won't flex; it takes only the space it needs */
        }

        .shoe-name {
          font-size: 18px;
          font-weight: 700;
          color: #0b2b4a;
          margin: 0;
          line-height: 1.15;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shoe-desc {
          margin-top: 8px;
          margin-bottom: 0;
          color: #6b6f76;
          font-size: 13px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Pagination style */
        .pagination-wrap {
          display:flex;
          justify-content:center;
          padding: 22px 0 44px;
        }
        .pagination-wrap button {
          margin: 0 6px;
          padding: 8px 12px;
          border-radius: 4px;
          border: 1px solid #d6d6d6;
          background: #fff;
          cursor: pointer;
          font-weight: 700;
          color: #111;
        }
        .pagination-wrap button.active {
          background: #1e90ff;
          color: #fff;
          border-color: #1e90ff;
        }

        /* Extra small screens: reduce frame thickness and font sizes */
        @media (max-width: 520px) {
          .shoe-card-frame { border-width: 4px; min-height: 220px; }
          .shoe-name { font-size: 15px; }
          .shoe-desc { font-size: 12px; }
        }
      `}</style>

      <main className="shoes-main">
        {/* Hero Section: background now uses the imported Shoes.png asset (bundler-resolved)
            Increased minHeight so the hero "card" is larger than product cards. */}
        <section
          className="shoes-hero"
          style={{
            backgroundImage: `url(${ShoesHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "320px" // <-- increased height so hero is larger than product cards
          }}
        >
          <div className="shoes-hero-content" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="shoes-category">Shoes</h2>
            <h1 className="shoes-title">Explore Our Collection For Shoes</h1>
            <p className="shoes-subtitle">
              Updated weekly with new flash sales from some of the world's best
              brands.
            </p>
          </div>
        </section>

        {/* Products found row */}
        <div style={{ maxWidth: "1200px", margin: "10px auto 6px", padding: "0 12px", color: "#071e3d", fontWeight: 700 }}>
          {total} products found.
        </div>

        {/* Navy background strip with two vertical columns */}
        <div className="shoes-grid-outer" aria-hidden="false">
          <div className="two-column-vertical">
            {/* Left column: top-to-bottom (4 items) */}
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/shoes/${p.id}`}
                  className="shoe-card-frame"
                  role="listitem"
                  title={`${p.name} — ${p.desc}`}
                >
                  <div className="shoe-image-wrap">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="shoe-info">
                    <h3 className="shoe-name">{p.name}</h3>
                    <p className="shoe-desc">{p.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Right column: top-to-bottom (4 items) */}
            <div className="column-stack" role="list">
              {rightColumn.map((p) => (
                <a
                  key={p.id}
                  href={`/shoes/${p.id}`}
                  className="shoe-card-frame"
                  role="listitem"
                  title={`${p.name} — ${p.desc}`}
                >
                  <div className="shoe-image-wrap">
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="shoe-info">
                    <h3 className="shoe-name">{p.name}</h3>
                    <p className="shoe-desc">{p.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination-wrap" aria-label="Pagination">
          <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
            {"<"}
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button onClick={() => goTo(1)}>1</button>
              {pageNumbers[0] > 2 && <span style={{ alignSelf: "center", margin: "0 6px", color: "#fff" }}>…</span>}
            </>
          )}

          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => goTo(n)}
              className={n === currentPage ? "active" : ""}
              aria-current={n === currentPage ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span style={{ alignSelf: "center", margin: "0 6px", color: "#fff" }}>…</span>}
              <button onClick={() => goTo(totalPages)}>{totalPages}</button>
            </>
          )}

          <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
            {">"}
          </button>
        </div>
      </main>
    </div>
  );
}