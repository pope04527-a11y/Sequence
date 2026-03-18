import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
import JewelryHero from "../assets/images/dashboard/Jewery.png";

/* Helper: build a friendly name from the Cloudinary filename */
function friendlyNameFromUrl(url) {
  try {
    const parts = url.split("/");
    let name = parts[parts.length - 1] || url;
    // remove extension
    name = name.replace(/\.[a-zA-Z0-9]+$/, "");
    // remove trailing numeric groups like _93_53 or _142_99 etc.
    name = name.replace(/(_\d+){1,3}$/, "");
    // replace underscores and multiple spaces with single space
    name = name.replace(/[_]+/g, " ").replace(/\s{2,}/g, " ").trim();
    if (name.length > 70) return name.slice(0, 67) + "...";
    return decodeURIComponent(name);
  } catch {
    return url;
  }
}

/* All Jewelry product URLs provided by you */
const productUrls = [
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635462/products/Verona_Jewelers_Mens_925_Sterling_Silver_3MM_5_5MM_Franco_Ch_Verona_Jewelers_Men_s_925_Sterling_Silver_Franco_Chain_Neckl_Verona_Jewelers_Mens_925_Sterling_Silver_3MM_5_5MM_Franco_Ch.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635457/products/VIR_JEWELS_1_cttw_Diamond_Wedding_Anniversary_Band_for_Women_Exquisite_elegant_1_cttw_princess_diamond_wedding_band_in_1_VIR_JEWELS_1_cttw_Diamond_Wedding_Anniversary_Band_for_Women.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635449/products/Urban_Jewelry_Amazing_Stainless_Steel_Men_s_link_Bracelet_Ur_Urban_Jewelry_Amazing_Stainless_Steel_Men_s_link_Bracelet_25_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635372/products/TOUSIATTAR_14K_Yellow_Gold_Rope_Chain_-_Strong_Italian_Neckl_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_TOUSIATTAR_14K_Yellow_Gold_Rope_Chain_-_Strong_Italian_Neckl.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635372/products/THELANDA_14k_White_Gold_2_5mm_Petite_Twisted_Vine_Simulated_Made_of_real_14k_white_gold_-_Accented_with_24_round-cut_cl_THELANDA_14k_White_Gold_2_5mm_Petite_Twisted_Vine_Simulated.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635368/products/TGDJ_10k_Yellow_Gold_Miami_Cuban_Chain_Necklace_5_0_mm_Sol_This_gold_chain_necklace_is_made_with_real_10k_yellow_soli_TGDJ_10k_Yellow_Gold_Miami_Cuban_Chain_Necklace_5_0_mm_Sol.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635356/products/Swarovski_Infinity_Heart_Jewelry_Collection_Link_adoration_i_Swarovski_Infinity_Heart_Jewelry_Collection_10402.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635356/products/Swarovski_Infinity_Heart_Jewelry_Collection_Link_adoration_i_Swarovski_Infinity_Heart_Jewelry_Collection_10402.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635344/products/Stfery_Womens_Ring_Flower_Rose_Gold_Wedding_Ring_18K_Inlaid_Our_rings_are_made_of_real_gold_and_set_with_shiny_gemstones_Stfery_Womens_Ring_Flower_Rose_Gold_Wedding_Ring_18K_Inlaid.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635321/products/Special_Pin_Faberge_Style_Material_Pearl_Clasp_type_Butterfl_Special_Pin_Faberge_Style_3520.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635321/products/Special_Pin_Faberge_Style_Material_Pearl_Clasp_type_Butterfl_Special_Pin_Faberge_Style_3520.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635317/products/Solid_14K118K_Rose_Gold_Real_Diamond_Bangle_Bracelet_For_Wom_Solid_14K118K_Rose_Gold_Real_Diamond_Bangle_Bracelet_For_Wom_4320_41.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635317/products/Solid_14K_Yellow_Gold_Princess_Cut_Real_Natural_Diamond_Halo_Introducing_our_stunning_Solid_14K_Yellow_Gold_Princess_Cut_Solid_14K_Yellow_Gold_Princess_Cut_Real_Natural_Diamond_Halo.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635308/products/Silvadore_246mm_CUBAN_Link_Chain_for_Men_Necklace_-_Silver_Silvadore_246mm_CUBAN_Link_Chain_for_Men_Necklace_-_Silver_29_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635308/products/Set_Of_3_Round_Shape_Black_Color_Mother_Of_Pearl_Riser_Servi_Set_Of_3_Round_Shape_Black_Color_Mother_Of_Pearl_Riser_Servi_132.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635298/products/SZUL_AGS_Certified_1_14_Carat_TW_Diamond_Engagement_Ring_in_SZUL_AGS_Certified_1_14_Carat_TW_Diamond_Engagement_Ring_in_1189.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635298/products/SZUL_AGS_Certified_1_14_Carat_TW_Diamond_Engagement_Ring_in_SZUL_AGS_Certified_1_14_Carat_TW_Diamond_Engagement_Ring_in_1189.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635291/products/SISGEM_Solid_18k_Gold_Anklets_for_Women_Gold_Mesh-Link_Chai_Made_of_75_pure_gold_nickel-free_and_hypoallergenic_Mini_SISGEM_Solid_18k_Gold_Anklets_for_Women_Gold_Mesh-Link_Chai.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635290/products/SISGEM_18k_Yellow_Gold_Bracelet_for_Women_3mm_Width_Real_Go_18_Karat_Gold_Genuine_18k_gold_made_up_of_75_gold_and_25_SISGEM_18k_Yellow_Gold_Bracelet_for_Women_3mm_Width_Real_Go.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635266/products/Round_GIA_Certified_Natural_Diamond_Lab_Grown_Diamond_58_c_All_of_our_jewelry_and_gemstones_are_sourced_are_non-conflic_Round_GIA_Certified_Natural_Diamond_Lab_Grown_Diamond_58_c.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635204/products/RYLOS_Mens_Rings_14K_Yellow_Gold_-_Mens_Diamond_Blue_Onyx_GREAT_GIFT_for_birthday_anniversary_holidays_stocking_stu_RYLOS_Mens_Rings_14K_Yellow_Gold_-_Mens_Diamond_Blue_Onyx.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635204/products/RMC_Martin_Ksohoh_Precious_Stone_Ruby_custom_made_button_set_RMC_Martin_Ksohoh_Precious_Stone_Ruby_custom_made_button_set_6974_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635204/products/RMC_Martin_Ksohoh_Precious_Stone_Ruby_custom_made_button_set_RMC_Martin_Ksohoh_Precious_Stone_Ruby_custom_made_button_set_6974_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635167/products/Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_3102.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635167/products/Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_3102.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772635167/products/Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_Privosa_Fine_Jewelry_1_to_3_Carat_Lab_Grown_Diamond_Classic_3102.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634930/products/Natural_Real_Pave_Diamond_Multi_Tourmaline_Ethiopian_Opal_St_Natural_Real_Pave_Diamond_Multi_Tourmaline_Ethiopian_Opal_St_5174.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634920/products/NOZBO_Jewelry_1_carat_-_4_carats_Emerald_Cut_Lab_Grown_Hpht_NOZBO_Jewelry_1_carat_-_4_carats_Emerald_Cut_Lab_Grown_Hpht_14972_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634917/products/Natural_Black_Diamond_Beads_Necklace_16_Inch_Full_Strand_4_t_Natural_Black_Diamond_Beads_Necklace_16_Inch_Full_Strand_4_t_5445_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634911/products/Myshiwu_Designer_Jewelry_Inspired_Twisted_Cable_Wire_Cross_N_Myshiwu_Designer_Jewelry_Inspired_Twisted_Cable_Wire_Cross_N_23_1.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634911/products/Murtoo_Viking_Bracelets_for_Men_The_Murtoo_Viking_Bracelet_f_Murtoo_Viking_Bracelets_for_Men_24_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634909/products/NONNYL_Real_Tahitian_Black_Pearl_Pendant_Necklaces_for_Women_NONNYL_Real_Tahitian_Black_Pearl_Pendant_Necklaces_for_Women_4298.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634647/products/Ladybug_Flower_Clip-On_Earrings_Brilliantly_bejeweled_and_tr_Ladybug_Flower_Clip-On_Earrings_266.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634647/products/LUXURMAN_Men_s_18K_Gold_Unique_4_Carat_Round_and_Oval_Diamon_LUXURMAN_Men_s_18K_Gold_Unique_4_Carat_Round_and_Oval_Diamon_44500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634646/products/La4ve_Diamonds_12-3_00_Carat_14K_White_Gold_4_Prong_Set_Rou_Stunning_14k_White_Gold_Eye-catching_round_cut_lab-grown_dia_La4ve_Diamonds_12-3_00_Carat_14K_White_Gold_4_Prong_Set_Rou.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634622/products/King_Will_Classic_Tungsten_Carbide_Ring_SilverBlackRedGreen_King_Will_Classic_Tungsten_Carbide_Ring_SilverBlackRedGreen_24.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634621/products/Kobelli_2_38_ct_tw_The_Pear_Hidden_Halo_Diamond_Ring_GIA_Ce_GIA_Certified_Pear_Diamond_Hidden_Halo_Design_Smooth_High-Po_Kobelli_2_38_ct_tw_The_Pear_Hidden_Halo_Diamond_Ring_GIA_Ce.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634617/products/KIBO_Fine_Jewelry_Iced_Out_Gold_Plated_Bracelet_Silver_Bague_KIBO_Fine_Jewelry_Iced_Out_Gold_Plated_Bracelet_Silver_Bague_1485.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634617/products/Jewels_By_Lux_14K_Rose_Gold_Round_Diamond_Solitaire_Bridal_W_Jewels_By_Lux_14K_Rose_Gold_Round_Diamond_Solitaire_Bridal_W_7670_84.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634615/products/Jewels_By_Lux_10K_Yellow_Gold_Mens_Round_Diamond_Franco_Link_Find_the_perfect_jewelry_gifts_for_anyone_in_our_extensive_c_Jewels_By_Lux_10K_Yellow_Gold_Mens_Round_Diamond_Franco_Link.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634614/products/Jewelry_Bliss_18k_White_Gold_Oval_Natural_Diamond_Halo_Engag_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_Jewelry_Bliss_18k_White_Gold_Oval_Natural_Diamond_Halo_Engag.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634613/products/Jewelry_by_ARSA_Solid_14k_Two_Tone_Gold_Pendant_for_Women_Se_This_natural_sapphire_diamond_pendant_handcrafted_in_soli_Jewelry_by_ARSA_Solid_14k_Two_Tone_Gold_Pendant_for_Women_Se.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634613/products/Jewels_By_Lux_10K_Yellow_Or_Rose_Gold_Mens_Baguette_Diamond_Jewels_By_Lux_10K_Yellow_Or_Rose_Gold_Mens_Baguette_Diamond_3719_94.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634613/products/Jewelili_Enchanted_Disney_Fine_Jewelry_14K_White_Gold_and_Ro_Jewelili_Enchanted_Disney_Fine_Jewelry_14K_White_Gold_and_Ro_17121.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634613/products/Jewelplus_Platinum_7_7mm_Solid_Cuban_Curb_Link_Chain_Bracele_Platinum_7_7mm_Solid_Cuban_Curb_Link_Chain_7_75_inch_Bracele_Jewelplus_Platinum_7_7mm_Solid_Cuban_Curb_Link_Chain_Bracele.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634610/products/Jewel_Zone_US_Heart_Cut_Simulated_Birthstone_Cubic_Zirconi_Jewel_Zone_US_Heart_Cut_Simulated_Birthstone_Cubic_Zirconi_45_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634610/products/Jewelili_Enchanted_Disney_Fine_Jewelry_10K_White_Gold_and_Ro_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_3910.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634610/products/Jewelili_3_Pair_Box_Set_Stud_Earrings_with_White_Round_Cubic_Jewelili_3_Pair_Box_Set_Stud_Earrings_with_White_Round_Cubic_1673.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634610/products/Jewel_Zone_US_Round_Cubic_Zirconia_Flip-Flop_Pendant_Necklac_Jewel_Zone_US_Round_Cubic_Zirconia_Flip-Flop_Pendant_Necklac_41_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634606/products/JO_WISDOM_925_Sterling_Silver_Cubic_Zirconia_Rose_Gold_Cladd_At_JO_WISDOM_Jewelry_we_prioritize_quality_and_service_cra_JO_WISDOM_925_Sterling_Silver_Cubic_Zirconia_Rose_Gold_Cladd.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634549/products/IGI_Certified_14-2_Carat_Lab_Grown_Diamond_Stud_Earrings_in_IGI_Certified_14-2_Carat_Lab_Grown_Diamond_Stud_Earrings_in_2420.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634545/products/Iefil_Mothers_Day_Gifts_-_925_Sterling_Silver_Rose_Heart_Bir_Iefil_Mothers_Day_Gifts_-_925_Sterling_Silver_Rose_Heart_Bir_12988.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634539/products/IGI_Certificated_Asscher_Cut_cvd_rough_diamond_Pink_color_VS_IGI_Certificated_Asscher_Cut_cvd_rough_diamond_Pink_color_VS_2546_3.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634518/products/Houston_Diamond_District_1-8_Carat_ctw_White_Gold_Round_Cu_Houston_Diamond_District_1-8_Carat_ctw_White_Gold_Round_Cu_16600.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634518/products/Houston_Diamond_District_1-8_Carat_ctw_White_Gold_Round_Cu_Houston_Diamond_District_1-8_Carat_ctw_White_Gold_Round_Cu_16600.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634269/products/Gin_and_Grace_14K_White_Genuine_Blue_Sapphire_Ring_with_Diam_Gin_and_Grace_14K_White_Genuine_Blue_Sapphire_Ring_with_Diam_1350.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634269/products/Gin_and_Grace_14K_Two_Tone_Gold_Genuine_Morganite_Ring_with_Gin_and_Grace_14K_Two_Tone_Gold_Genuine_Morganite_Ring_with_1595.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634263/products/Gift_for_Mother_s_Day_Infinity_Love_Heart_Pendant_Necklaces_Gift_for_Mother_s_Day_Infinity_Love_Heart_Pendant_Necklaces_45_97.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634228/products/GIA_Certified_Cushion_Modified_Brilliant_Natural_Diamond_6_0_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_GIA_Certified_Cushion_Modified_Brilliant_Natural_Diamond_6_0.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634096/products/FRIENDLY_DIAMONDS_Lab_Grown_Diamond_IGI_Certified_Eternity_R_FRIENDLY_DIAMONDS_Lab_Grown_Diamond_IGI_Certified_Eternity_R_5925.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634096/products/FRIENDLY_DIAMONDS_0_75_Carat_-_6_Carat_IGI_Certified_Lab_Gro_Friendly_Diamonds_Round_Cut_Quartze_Split_Bail_Solitaire_Lab_FRIENDLY_DIAMONDS_0_75_Carat_-_6_Carat_IGI_Certified_Lab_Gro.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634093/products/FANCIME_Birthstone_Necklaces_925_Sterling_Silver_Moon_and_St_FANCIME_Birthstone_Necklaces_925_Sterling_Silver_Moon_and_St_47_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772634087/products/Ewatchparts_2_30CT_DIAMOND_CHANNEL_SET_DIAMOND_BEZEL_Introdu_Introducing_our_brand_new_2_30CT_Round_Diamond_Bezel_for_Rol_Ewatchparts_2_30CT_DIAMOND_CHANNEL_SET_DIAMOND_BEZEL.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633998/products/Diamond_Tennis_Chain_Necklace_Jewelry_Wholesales_18K_5_Carat_Diamond_Tennis_Chain_Necklace_Jewelry_Wholesales_18K_5_Carat_3600.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633998/products/Diamond_Tennis_Chain_Necklace_Jewelry_Wholesales_18K_5_Carat_Diamond_Tennis_Chain_Necklace_Jewelry_Wholesales_18K_5_Carat_3600.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633987/products/Dazzlingrock_Collection_2_50_Carat_ctw_14K_Round_White_Dia_Crafted_in_14K_Yellow-gold_this_engagement_ring_features_di_Dazzlingrock_Collection_2_50_Carat_ctw_14K_Round_White_Dia.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633986/products/Dazzlingrock_Collection_10kt_Yellow_Gold_Mens_Round_Diamond_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_Dazzlingrock_Collection_10kt_Yellow_Gold_Mens_Round_Diamond.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633976/products/Dazzlingrock_Collection_10K_Round_Blue_Sapphire_And_White_Di_Dazzlingrock_Collection_10K_Round_Blue_Sapphire_And_White_Di_3176.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633945/products/Custom_Mens_Women_Watches_Iced_Out_Luxury_Fashion_Bling_Dial_Custom_Mens_Women_Watches_Iced_Out_Luxury_Fashion_Bling_Dial_4125.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633945/products/Custom_Mens_Women_Watches_Iced_Out_Luxury_Fashion_Bling_Dial_Custom_Mens_Women_Watches_Iced_Out_Luxury_Fashion_Bling_Dial_4125.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633940/products/Custom_Fashion_Jewelry_22Inches_DEF_3MM_Round_Moissanite_Ten_Custom_Fashion_Jewelry_22Inches_DEF_3MM_Round_Moissanite_Ten_2287_35.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633940/products/Custom_Fashion_Jewelry_22Inches_DEF_3MM_Round_Moissanite_Ten_Custom_Fashion_Jewelry_22Inches_DEF_3MM_Round_Moissanite_Ten_2287_35.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633903/products/China_Jewelry_Factory_In_Fashion18k_Solid_Gold_Fine_Jewelry_China_Jewelry_Factory_In_Fashion18k_Solid_Gold_Fine_Jewelry_2343.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633847/products/Charming_Bracelet_5mm_18cm_Iced_Out_D_Color_VVS_Round_Cut_Mo_Charming_Bracelet_5mm_18cm_Iced_Out_D_Color_VVS_Round_Cut_Mo_1510_8.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633827/products/COOLSTEELANDBEYOND_Mens_Women_Stainless_Steel_Foxtail_Wheat_COOLSTEELANDBEYOND_Mens_Women_Stainless_Steel_Foxtail_Wheat_21_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633252/products/Bonyak_Jewelry_Lab-Created_Emerald_Platinum_Lab-Grown_Emeral_Bonyak_Jewelry_Lab-Created_Emerald_Platinum_Lab-Grown_Emeral_2080_45.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633194/products/Best_selling_luxury_fashion_6li_GIA_vvs2_i_diamond_stainless_Best_selling_luxury_fashion_6li_GIA_vvs2_i_diamond_stainless_4966.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633194/products/Betsey_Johnson_Butterfly_Necklace_Betsey_Johnson_y-shaped_ne_Betsey_Johnson_Butterfly_Necklace_58.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633187/products/Best_Selling_Fashionable_Animal_Shape_Latest_Fashion_Jewelry_Best_Selling_Fashionable_Animal_Shape_Latest_Fashion_Jewelry_2607_37.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633168/products/Best_Quality_Colombian_Rough_Lot_Green_Emerald_Gemstone_used_Best_Quality_Colombian_Rough_Lot_Green_Emerald_Gemstone_used_39000.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633161/products/Ben_Amun_Jewelry_Gold_Ball_and_Pearl_Timeless_fusion_of_gold_Ben_Amun_Jewelry_Gold_Ball_and_Pearl_1405_29.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633066/products/Auriga_Fine_Jewelry_14k_Yellow_Gold_9_7mm_Hand_Polished_Flat_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_Auriga_Fine_Jewelry_14k_Yellow_Gold_9_7mm_Hand_Polished_Flat.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633064/products/Angara_Natural_Aquamarine_Infinity_Heart_Pendant_Necklace_fo_Angara_Natural_Aquamarine_Infinity_Heart_Pendant_Necklace_fo_5398.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633064/products/Angara_Natural_Aquamarine_Infinity_Heart_Pendant_Necklace_fo_Angara_Natural_Aquamarine_Infinity_Heart_Pendant_Necklace_fo_5398.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633064/products/Angara_Natural_Round_Shape_Faceted-Cut_Loose_Blue_Sapphire_Angara_Natural_Round_Shape_Faceted-Cut_Loose_Blue_Sapphire_61309.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633063/products/Angara_Natural_Diamond_Solitaire_Pendant_Necklace_for_Women_Angara_Natural_Diamond_Solitaire_Pendant_Necklace_for_Women_12890.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633063/products/Angara_Natural_Emerald_Solitaire_Pendant_Necklace_for_Women_Angara_Natural_Emerald_Solitaire_Pendant_Necklace_for_Women_4923.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633061/products/Amethyst_High_Quality_18_K_Gold_Blue_topaz_and_Diamonds_Lady_Amethyst_High_Quality_18_K_Gold_Blue_topaz_and_Diamonds_Lady_3682_9.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633060/products/American_West_Jewelry_Sterling_Silver_Women_s_Pendant_Neckla_American_West_Jewelry_Sterling_Silver_Women_s_Pendant_Neckla_14591.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633061/products/Angara_Classic_Lab-Grown_Diamond_Linear_Tennis_Bracelet_in_S_Angara_Classic_Lab-Grown_Diamond_Linear_Tennis_Bracelet_in_S_22699.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633061/products/Angara_Classic_Round_Shape_Lab-Grown_Emerald_Solitaire_Penda_Angara_Classic_Round_Shape_Lab-Grown_Emerald_Solitaire_Penda_62736.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633057/products/Amazon_Collection_Certified_14k_Gold_Round-Cut_Diamond_Stud_Amazon_Collection_Certified_14k_Gold_Round-Cut_Diamond_Stud_5173_7.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633056/products/Amazon_Essentials_Certified_14k_Gold_Diamond_with_Screw_Back_Amazon_Essentials_Certified_14k_Gold_Diamond_with_Screw_Back_8164_5.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633056/products/Amazon_Collection_IGI_Certified_Platinum_Round-Cut_Diamond_S_Amazon_Collection_IGI_Certified_Platinum_Round-Cut_Diamond_S_66500.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772633053/products/AliveRose_Real_Rose_Gold_Dipped_Necklace_This_pendant_neckla_AliveRose_Real_Rose_Gold_Dipped_Necklace_7502.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632973/products/925_Sterling_Silver_Hoop_Earrings_for_Women_Teen_Girls_Smal_925_Sterling_Silver_Hoop_Earrings_for_Women_Teen_Girls_Smal_4_4.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632963/products/8_Carat_Diamond_Tennis_Bracelet_in_14K_Gold_7_Inch_Make_Her_8_Carat_Diamond_Tennis_Bracelet_in_14K_Gold_7_Inch_3149_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632951/products/6_75_Carat_Total_Weight_14k_White_Gold_U_Shape_Four_Prong_Na_REAL_DIAMOND_This_brand_new_ringwedding_band_consists_of_Nat_6_75_Carat_Total_Weight_14k_White_Gold_U_Shape_Four_Prong_Na.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632818/products/3_ct_Brilliant_Round_Cut_Genuine_Lab_grown_Diamond_Solitaire_3_ct_Brilliant_Round_Cut_Genuine_Lab_grown_Diamond_Solitaire_5829_79.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632814/products/3_4_ct_Brilliant_Emerald_Cut_Natural_Diamond_VS1-VS2_G-H_14K_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_3_4_ct_Brilliant_Emerald_Cut_Natural_Diamond_VS1-VS2_G-H_14K.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632813/products/3-30_Carat_ctw_White_Gold_Pear_Cut_LAB_GROWN_Diamond_Neckl_3-30_Carat_ctw_White_Gold_Pear_Cut_LAB_GROWN_Diamond_Neckl_23838_46.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632813/products/3-30_Carat_ctw_White_Gold_Round_Cut_LAB_GROWN_Diamond_Neck_3-30_Carat_ctw_White_Gold_Round_Cut_LAB_GROWN_Diamond_Neck_21916.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632811/products/2_01_Carat_Total_Weight_-_2_Natural_Loose_Diamond_Side_Stone_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_2_01_Carat_Total_Weight_-_2_Natural_Loose_Diamond_Side_Stone.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632811/products/2_05_ct_t_w_Ladies_Round_and_Baguette_Cut_Diamond_Cross_Pen_This_Diamond_Cross_Pendants_is_one_of_our_most_purchased_ite_2_05_ct_t_w_Ladies_Round_and_Baguette_Cut_Diamond_Cross_Pen.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632810/products/3-30_Carat_ctw_White_Gold_Kite_Cut_LAB_GROWN_Diamond_Cross_3-30_Carat_ctw_White_Gold_Kite_Cut_LAB_GROWN_Diamond_Cross_28700.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632810/products/2_07_Carat_Fancy_Intense_Yellow_Natural_Loose_Diamond_Cushio_A_lovely_Natural_Diamond_Yellow_color_VVS1_clarity_Cushion_s_2_07_Carat_Fancy_Intense_Yellow_Natural_Loose_Diamond_Cushio.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632810/products/2ct_Round_Diamond_Solitaire_White_Gold_Engagement_Ring_Clas_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_2ct_Round_Diamond_Solitaire_White_Gold_Engagement_Ring_Clas.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632776/products/2_00_Cts_Black_Diamond_Jewelry_Set_in_Platinum_This_extraord_This_extraordinary_Black_Diamond_Jewelry_Set_exhibits_a_soli_2_00_Cts_Black_Diamond_Jewelry_Set_in_Platinum.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632179/products/1_11Cts_Mix_of_Fancy_Color_Loose_Diamond_Natural_Color_Heart_Introducing_a_pair_of_1_11_carat_mixed_fancy_color_real_diam_1_11Cts_Mix_of_Fancy_Color_Loose_Diamond_Natural_Color_Heart.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632165/products/18K_YellowWhiteRose_Gold_By_The_Yard_Necklace_With_1_38_TCW_NATURAL_DIAMONDS_All_our_diamonds_and_their_colors_are_compl_18K_YellowWhiteRose_Gold_By_The_Yard_Necklace_With_1_38_TCW.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632160/products/18K_Gold_Heart_Shape_Amethyst_Pendant_For_Women_Jewelry_18K_18K_Gold_Heart_Shape_Amethyst_Pendant_For_Women_Jewelry_1820.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632159/products/1928_Jewelry_3_Sided_Flower_Spinner_Locket_Pendant_Necklace_1928_Jewelry_3_Sided_Flower_Spinner_Locket_Pendant_Necklace_1624.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632159/products/18K_Gold_Necklace_Gold_Chunky_Necklace_Gold_Horseshoe_Neck_18K_Gold_Necklace_Gold_Chunky_Necklace_Gold_Horseshoe_Neck_3750.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632155/products/14k_Yellow_OR_White_Gold_SOLID_Wedding_Engagement_Ring_This_14k_Yellow_OR_White_Gold_SOLID_Wedding_Engagement_Ring_207_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632155/products/14k_Yellow_OR_White_Gold_SOLID_Wedding_Engagement_Ring_This_14k_Yellow_OR_White_Gold_SOLID_Wedding_Engagement_Ring_207_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632141/products/12-16MM_Ethiopian_Opal_90Pcs_Cabochon_AAA_Quality_Ethiopian_12-16MM_Ethiopian_Opal_90Pcs_Cabochon_AAA_Quality_Ethiopian_5680_99.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772365049/products/Zawadee_11mm_14k_Yellow_Gold_Semi_Solid_Miami_Cuban_Bracelet_Zawadee_11mm_14k_Yellow_Gold_Semi_Solid_Miami_Cuban_Bracelet_5001_06_qzqv9v.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772365049/products/Zawadee_11mm_14k_Yellow_Gold_Semi_Solid_Miami_Cuban_Bracelet_Zawadee_11mm_14k_Yellow_Gold_Semi_Solid_Miami_Cuban_Bracelet_5001_06_qzqv9v.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772630912/products/products/0_15_Carat_Fancy_Intense_Pink_Color_Natural_Loose_Diamond_Ro_Discover_our_lovely_Natural_Diamond_Pink_color_VVS2_clarit_0_15_Carat_Fancy_Intense_Pink_Color_Natural_Loose_Diamond_Ro.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772630915/products/products/0_50_Carat_Total_Weight_-_2_Natural_Loose_Diamond_Side_Stone_0_50_Carat_Total_Weight_-_2_Natural_Loose_Diamond_Side_Stone_0_50_Carat_Total_Weight_-_2_Natural_Loose_Diamond_Side_Stone.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772630915/products/products/0_60_Carat_Fancy_Vivid_Yellow_Color_Natural_Loose_Diamond_Ra_This_0_60_ct_natural_diamond_certified_by_GIA_features_a_r_0_60_Carat_Fancy_Vivid_Yellow_Color_Natural_Loose_Diamond_Ra.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772630918/products/products/0_65Cts_Fancy_Intense_Green_Loose_Diamond_Natural_Color_Roun_Our_diamonds_are_genuine_and_their_color_is_not_heated_or_e_0_65Cts_Fancy_Intense_Green_Loose_Diamond_Natural_Color_Roun.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772631602/products/0_91_ct_Ladies_Cuban_Link_Round_Cut_Diamond_Bracelet_in_14kt_SHOES_APPAREL_ELECTRONICS_ACCESSORIES_JEWELRIES_WATCHES_FURN_0_91_ct_Ladies_Cuban_Link_Round_Cut_Diamond_Bracelet_in_14kt.jpg",
  "https://res.cloudinary.com/dycytqdfj/image/upload/v1772632122/products/1-8_Carat_ctw_White_Gold_Round_Cut_LAB_GROWN_Diamond_Heart_1-8_Carat_ctw_White_Gold_Round_Cut_LAB_GROWN_Diamond_Heart_23151_82.jpg"
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

/* Build product objects with name and a short description (jewelry-focused) */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (lower.includes("diamond") || lower.includes("carat") || lower.includes("ct") || lower.includes("gia")) {
        return "Premium diamond jewelry — certified and crafted for timeless elegance.";
      }
      if (lower.includes("gold") || lower.includes("14k") || lower.includes("18k") || lower.includes("platinum")) {
        return "Fine gold & platinum piece — classic craftsmanship and lasting value.";
      }
      if (lower.includes("pearl") || lower.includes("tahiti")) {
        return "Beautiful pearl jewelry — lustrous and elegant.";
      }
      if (lower.includes("necklace") || lower.includes("pendant")) {
        return "Stylish necklace/pendant — perfect for everyday or special occasions.";
      }
      if (lower.includes("bracelet") || lower.includes("bangle") || lower.includes("tennis")) {
        return "Elegant bracelet — a refined finishing touch.";
      }
      if (lower.includes("ring") || lower.includes("band") || lower.includes("engagement")) {
        return "Expertly crafted ring — ideal for proposals and celebrations.";
      }
      if (lower.includes("earring") || lower.includes("hoop") || lower.includes("stud")) {
        return "Beautiful earrings — crafted for comfort and sparkle.";
      }
      return "High quality jewelry with excellent craftsmanship and design.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Jewelry() {
  // Shuffle once on component mount (consistent with other pages)
  const shuffledUrls = useMemo(() => shuffleArray(productUrls), []);
  const products = useMemo(() => productsFromUrls(shuffledUrls), [shuffledUrls]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // exactly 8 products per page (2 columns x 4 rows)
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

        /* Two-column grid that keeps two columns always and ensures equal-height cards */
        .two-column-vertical {
          display: grid;
          grid-template-columns: 1fr 1fr; /* always two columns */
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* On very narrow viewports allow horizontal scrolling to preserve the 2x4 layout */
        @media (max-width: 520px) {
          .two-column-vertical {
            overflow-x: auto;
            padding: 0 12px;
            grid-auto-flow: column;
            grid-auto-columns: minmax(240px, 1fr);
            align-items: start;
          }
        }

        .column-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /*
         FIXED CARD HEIGHT:
         - Keep cards identical height so a single tall image/title can't stretch the row.
        */
        .shoe-card-frame {
          border: 8px solid #071e2f;
          box-sizing: border-box;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          text-decoration: none;
          height: 360px;
          min-height: 360px;
          max-height: 360px;
        }

        /* Info area fixed so text cannot push the image area taller */
        .shoe-info {
          padding: 14px;
          background: #fff;
          flex: 0 0 92px;
          box-sizing: border-box;
        }

        .shoe-image-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          min-height: 0;
          padding: 6px;
        }
        .shoe-image-wrap img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
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

        /* Pagination: constrained and horizontally scrollable on small viewports */
        .pagination-wrap {
          display:flex;
          justify-content:center;
          padding: 22px 12px 44px;
          box-sizing: border-box;
        }
        .pagination-inner {
          display:inline-flex;
          gap:10px;
          align-items:center;
          max-width:1200px;
          width:100%;
          margin:0 auto;
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
          padding:6px;
          box-sizing:border-box;
        }
        .pagination-inner button {
          flex: 0 0 auto;
          margin: 0;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #d6d6d6;
          background: #fff;
          cursor: pointer;
          font-weight: 700;
          color: #111;
        }
        .pagination-inner button.active {
          background: #1e90ff;
          color: #fff;
          border-color: #1e90ff;
        }

        @media (max-width: 520px) {
          .shoe-card-frame { border-width: 4px; height: 320px; min-height: 320px; max-height: 320px; }
          .shoe-info { flex: 0 0 88px; }
          .shoe-name { font-size: 15px; }
          .shoe-desc { font-size: 12px; }
        }
      `}</style>

      <main className="shoes-main">
        {/* Hero */}
        <section
          className="shoes-hero"
          style={{
            backgroundImage: `url(${JewelryHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "320px"
          }}
        >
          <div className="shoes-hero-content" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="shoes-category">Jewelry</h2>
            <h1 className="shoes-title">Explore Our Collection For Jewelry</h1>
            <p className="shoes-subtitle">Updated weekly with new arrivals and curated selections.</p>
          </div>
        </section>

        <div style={{ maxWidth: "1200px", margin: "10px auto 6px", padding: "0 12px", color: "#071e3d", fontWeight: 700 }}>
          {total} products found.
        </div>

        <div className="shoes-grid-outer" aria-hidden="false">
          <div className="two-column-vertical">
            <div className="column-stack" role="list">
              {leftColumn.map((p) => (
                <a key={p.id} href={`/jewelry/${p.id}`} className="shoe-card-frame" role="listitem" title={`${p.name} — ${p.desc}`}>
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

            <div className="column-stack" role="list">
              {rightColumn.map((p) => (
                <a key={p.id} href={`/jewelry/${p.id}`} className="shoe-card-frame" role="listitem" title={`${p.name} — ${p.desc}`}>
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

        {/* Pagination: arrows + page numbers inside a constrained, scrollable inner container */}
        <div className="pagination-wrap" aria-label="Pagination">
          <div className="pagination-inner" role="navigation" aria-label="Page navigation">
            <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
              {"<"}
            </button>

            {pageNumbers[0] > 1 && (
              <>
                <button onClick={() => goTo(1)}>1</button>
                {pageNumbers[0] > 2 && <button aria-hidden="true">…</button>}
              </>
            )}

            {pageNumbers.map((n) => (
              <button key={n} onClick={() => goTo(n)} className={n === currentPage ? "active" : ""} aria-current={n === currentPage ? "page" : undefined}>
                {n}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <button aria-hidden="true">…</button>}
                <button onClick={() => goTo(totalPages)}>{totalPages}</button>
              </>
            )}

            <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
              {">"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
