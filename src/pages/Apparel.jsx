import React, { useMemo, useState } from "react";
import "./Shoes.css";
// IMPORT the hero image from your src tree so the bundler resolves it correctly.
// Adjust the path if your image is in a different folder under src.
import ShoesHero from "../assets/images/dashboard/Apparel.png";

/**
 * Apparel page (kept layout & CSS identical to Shoes.jsx)
 * - Uses the same Shoes.css styles and the same two-column, 8-per-page layout.
 * - Product URLs replaced with the Apparel URLs you provided and shuffled at runtime.
 * - Images are set to fit within the image frame regardless of original size.
 * - Layout changed so the page always displays 2x4 (two columns of four stacked cards).
 * - Only CSS related to layout and image sizing was adjusted; rest of the file left intact.
 *
 * Key changes to satisfy your request:
 * - Keep the grid as two columns at all viewport sizes (never collapse to single column).
 * - Let the image area take the remaining vertical space in the card after the name/description.
 * - Use object-fit: contain so each product image always fits within the remaining space without cropping.
 * - Allow horizontal scrolling on extremely narrow screens instead of collapsing to 1 column.
 */

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

/* Apparel product URLs you provided (will be shuffled at runtime) */
const productUrls = [
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118646/products/New_Fashion_Wholesale_Mens_Tuxedo_Suit_Wedding_Clothes_white_New_Fashion_Wholesale_Mens_Tuxedo_Suit_Wedding_Clothes_white_198.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090972/products/2022_china_design_splice_street_cool_fashion_men_women_cloth_2022_china_design_splice_street_cool_fashion_men_women_cloth_152_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094799/products/Factory_manufacture_women_winter_autumn_long_clothes_ladies_Factory_manufacture_women_winter_autumn_long_clothes_ladies_121.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120577/products/Wholesale_good_quality_women_winter_clothes_ladies_luxury_fa_Wholesale_good_quality_women_winter_clothes_ladies_luxury_fa_132.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118545/products/New_Design_Reversible_Jacket_Fashion_Warm_Clothes_Women_Wint_New_Design_Reversible_Jacket_Fashion_Warm_Clothes_Women_Wint_385.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094820/products/Factory_sale_cheap_high_quality_baby_clothes_baby_clothes_se_Factory_sale_cheap_high_quality_baby_clothes_baby_clothes_se_173_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120515/products/Wholesale_Tuxedo_Wedding_clothes_3_Piece_Mens_Slim_Fit_Suits_Wholesale_Tuxedo_Wedding_clothes_3_Piece_Mens_Slim_Fit_Suits_235.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120814/products/Winter_Women_Clothes_Double_Breasted_Big_Fur_Collar_Cashmere_Winter_Women_Clothes_Double_Breasted_Big_Fur_Collar_Cashmere_173_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096646/products/Hot_Wholesale_Winter_Female_Clothes_Coat_Ladies_Luxury_Racco_Hot_Wholesale_Winter_Female_Clothes_Coat_Ladies_Luxury_Racco_425_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120267/products/Wedding_Wear_New_Fashion_Women_Party_Clothes_Boutique_Dress_Wedding_Wear_New_Fashion_Women_Party_Clothes_Boutique_Dress_134_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120400/products/Wholesale_Fashion_Custom_Women_Winter_Wool_Jacket_Clothes_La_Wholesale_Fashion_Custom_Women_Winter_Wool_Jacket_Clothes_La_163_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094554/products/FIVE_OCEANS_2022_canada_coats_hooded_warm_clothes_bomber_duc_FIVE_OCEANS_2022_canada_coats_hooded_warm_clothes_bomber_duc_220.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093082/products/Casual_Style_Korean_Traditional_Clothes_Men_s_Long_Sleeve_S_Casual_Style_Korean_Traditional_Clothes_Men_s_Long_Sleeve_S_148_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120870/products/Women_Clothes_Fashion_winter_coat_Knitted_Lamb_Fur_Coat_with_Women_Clothes_Fashion_winter_coat_Knitted_Lamb_Fur_Coat_with_170_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096595/products/Hot_Sale_Plus_Size_Coat_Winter_Clothes_For_Men_Faux_Fur_Park_Hot_Sale_Plus_Size_Coat_Winter_Clothes_For_Men_Faux_Fur_Park_286.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089908/products/100_Genuine_Leather_Coats_Men_Autumn_Winter_Clothes_2021_Ge_100_Genuine_Leather_Coats_Men_Autumn_Winter_Clothes_2021_Ge_258_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117985/products/Men_S_Fur_Hoodies_Coats_Winter_Warm_Long_Coat_Cotton_Clothe_Men_S_Fur_Hoodies_Coats_Winter_Warm_Long_Coat_Cotton_Clothe_459_81.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095287/products/Fox_fur_Large_fur_collar_Women_s_winter_clothes_keep_warm_Sh_Fox_fur_Large_fur_collar_Women_s_winter_clothes_keep_warm_Sh_220.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092290/products/BA2211_2023_Fashion_Women_Luxury_Handmade_Gorgeous_Rhineston_BA2211_2023_Fashion_Women_Luxury_Handmade_Gorgeous_Rhineston_140_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095059/products/Fashion_faux_fur_top_cropped_bubble_women_coat_plus_size_jac_Fashion_faux_fur_top_cropped_bubble_women_coat_plus_size_jac_347_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095001/products/Fashion_Style_Women_Full_Fur_Coat_Ladies_Long_Sleeve_Natural_Fashion_Style_Women_Full_Fur_Coat_Ladies_Long_Sleeve_Natural_287_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095072/products/Fashion_raccoon_hair_splicing_hooded_women_s_turkey_faux_fur_Fashion_raccoon_hair_splicing_hooded_women_s_turkey_faux_fur_446_44.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095027/products/Fashion_Winter_Women_s_Fur_Clothing_Jacket_Bomber_Luxury_Cro_Fashion_Winter_Women_s_Fur_Clothing_Jacket_Bomber_Luxury_Cro_887_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095083/products/Fashion_winter_fox_fur_collar_trimming_real_mink_fur_women_Fashion_winter_fox_fur_collar_trimming_real_mink_fur_women_748_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094885/products/Fashion_Classic_High_Quality_Business_Men_Clothing_Mid-lengt_Fashion_Classic_High_Quality_Business_Men_Clothing_Mid-lengt_302_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094883/products/Fashion_Brautkleid_Sleeveless_Puffy_Skirt_Two_Piece_Red_And_Fashion_Brautkleid_Sleeveless_Puffy_Skirt_Two_Piece_Red_And_150.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095005/products/Fashion_Trend_Winter_Warm_Fluffy_Jacket_Real_Crop_Fox_Fur_Co_Fashion_Trend_Winter_Warm_Fluffy_Jacket_Real_Crop_Fox_Fur_Co_345.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094920/products/Fashion_High_Quality_Women_Wholesale_Fox_Fur_Jacket_Silver_B_Fashion_High_Quality_Women_Wholesale_Fox_Fur_Jacket_Silver_B_432_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094889/products/Fashion_Custom_Long_Sleeves_Fluffy_Hooded_Fur_Jacket_Winter_Fashion_Custom_Long_Sleeves_Fluffy_Hooded_Fur_Jacket_Winter_450.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091249/products/2023_new_fashion_dresses_for_women_2023_new_fashion_dresses_We_are_a_leading_marketing_agency_that_utilizes_over_10_year_2023_new_fashion_dresses_for_women.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120091/products/Top_Quality_Black_Men_Fashion_Leather_Jacket_Top_Quality_Bla_Top_Quality_Black_Men_Fashion_Leather_Jacket_247_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096392/products/High_quality_fashion_factory_made_korean_girls_winter_women_High_quality_fashion_factory_made_korean_girls_winter_women_276.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118528/products/New_Design_Custom_Business_Blazer_Formal_Suit_Fashion_Weddin_New_Design_Custom_Business_Blazer_Formal_Suit_Fashion_Weddin_118_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119456/products/Pretty_Steps_2020_Elegant_Fashion_Winter_Warm_Ladies_Clothes_Pretty_Steps_2020_Elegant_Fashion_Winter_Warm_Ladies_Clothes_160_38.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118370/products/NC143_Fall_Winter_Fashion_Elegant_long_Evening_Office_Casual_NC143_Fall_Winter_Fashion_Elegant_long_Evening_Office_Casual_206_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094613/products/Factory_Direct_Supply_Fashion_off_Shoulder_Mini_Pink_Ostrich_Factory_Direct_Supply_Fashion_off_Shoulder_Mini_Pink_Ostrich_302_5.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093034/products/Cashmere_Knitted_Pullover_Sweater_2022_7GG_Top_Fashion_Custo_Cashmere_Knitted_Pullover_Sweater_2022_7GG_Top_Fashion_Custo_115_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120267/products/Wedding_Wear_New_Fashion_Women_Party_Clothes_Boutique_Dress_Wedding_Wear_New_Fashion_Women_Party_Clothes_Boutique_Dress_134_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120511/products/Wholesale_Super_Fashion_Autumn_Winter_Suede_Faux_Leather_Wom_Wholesale_Super_Fashion_Autumn_Winter_Suede_Faux_Leather_Wom_257_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091246/products/2023_Spring_Summer_Women_s_blouse_Fashion_Classic_Style_bead_2023_Spring_Summer_Women_s_blouse_Fashion_Classic_Style_bead_3250.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118991/products/OEM_High_Quality_Women_Fashion_Leather_Jackets_Original_Shee_OEM_High_Quality_Women_Fashion_Leather_Jackets_Original_Shee_294_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094496/products/Europe_Fashion_Chinchilla_Rex_Rabbit_Fur_Women_Long_Coat_Eur_Europe_Fashion_Chinchilla_Rex_Rabbit_Fur_Women_Long_Coat_360.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094499/products/European_And_American_Women_s_Casual_Fashion_High_Waist_Cord_European_And_American_Women_s_Casual_Fashion_High_Waist_Cord_10_56.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118886/products/Nice_quality_fashion_design_red_man_leather_motor_biker_clot_Nice_quality_fashion_design_red_man_leather_motor_biker_clot_110.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120851/products/Women_s_Casual_Harem_Pants_Spring_Fashion_Loose_Ankle-length_Women_s_Casual_Harem_Pants_Spring_Fashion_Loose_Ankle-length_12_86.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120571/products/Wholesale_fashion_design_women_s_elegant_faux_fur_warm_coat_Wholesale_fashion_design_women_s_elegant_faux_fur_warm_coat_346_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096315/products/High_Quality_fashion_women_lining_fabric_fox_fur_collar_coat_High_Quality_fashion_women_lining_fabric_fox_fur_collar_coat_308.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750097166/products/Jindou_2022_Woman_s_Long_Coat_Brown_Overcoat_Modern_Fashion_Jindou_2022_Woman_s_Long_Coat_Brown_Overcoat_Modern_Fashion_783_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093931/products/Custom_new_design_autumn_winter_long_fashion_100_camel-hair_Custom_new_design_autumn_winter_long_fashion_100_camel-hair_385.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090538/products/2022_Autumn_And_Winter_Lapel_New_Fashion_Women_Gradient_Coat_2022_Autumn_And_Winter_Lapel_New_Fashion_Women_Gradient_Coat_120.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119921/products/Star_fashion_design_popular_women_Real_Mongolian_lamb_fur_co_Star_fashion_design_popular_women_Real_Mongolian_lamb_fur_co_410.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090609/products/2022_Fashion_High_Quality_Popular_Women_Winter_Coat_Women_Ca_2022_Fashion_High_Quality_Popular_Women_Winter_Coat_Women_Ca_459.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090967/products/2022_black_cool_Denim_tassels_fashion_sexy_long_jacket_camou_2022_black_cool_Denim_tassels_fashion_sexy_long_jacket_camou_119_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093771/products/Custom_Long_Sleeves_Fashion_Women_Fluffy_Fur_Jacket_Winter_R_Custom_Long_Sleeves_Fashion_Women_Fluffy_Fur_Jacket_Winter_R_448_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118374/products/NH08_Fall_Fashion_Elegant_Girls_Women_summer_clothes_for_wom_NH08_Fall_Fashion_Elegant_Girls_Women_summer_clothes_for_wom_169_8.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091140/products/2022_hot_sell_lasted_china_factory_Denim_fashion_jacket_camo_2022_hot_sell_lasted_china_factory_Denim_fashion_jacket_camo_163_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117613/products/MWFur_Fashion_Coat_Women_Clothing_Large_size_Genuine_Pure_Na_MWFur_Fashion_Coat_Women_Clothing_Large_size_Genuine_Pure_Na_611_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118738/products/New_Style_Fashion_Women_Fox_Fur_Tote_Bag_Women_Luxury_Hand_B_New_Style_Fashion_Women_Fox_Fur_Tote_Bag_Women_Luxury_Hand_B_162_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300749/products/Rado_Integral_Diamonds_Ladies_22_7mm_The_iconic_Integral_has_The_iconic_Integral_has_been_redesigned_to_suit_the_needs_an_Rado_Integral_Diamonds_Ladies_22_7mm.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750089956/products/100_wool_Italian_fabric_Business_Men_Suits_2_Pieces_OEM_Sui_100_wool_Italian_fabric_Business_Men_Suits_2_Pieces_OEM_Sui_287_1.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096274/products/High_Quality_Mens_Green_Wedding_Suits_Made_To_Measure_Evenin_High_Quality_Mens_Green_Wedding_Suits_Made_To_Measure_Evenin_141_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117390/products/Luxury_Stylish_Royal_New_Men_s_Collection_Suits_And_Blazers_Luxury_Stylish_Royal_New_Men_s_Collection_Suits_And_Blazers_187_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120734/products/Winter_2022_Women_s_Down_Coats_Fox_Fur_Jacket_Fur_Suit_Fur_J_Winter_2022_Women_s_Down_Coats_Fox_Fur_Jacket_Fur_Suit_Fur_J_268_95.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118480/products/New_Arrival_Two_Piece_Coat_Pant_Women_Office_Suit_Set_For_Bu_New_Arrival_Two_Piece_Coat_Pant_Women_Office_Suit_Set_For_Bu_156.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095102/products/Fastening_Style_Men_s_Designer_Wear_Suit_Tuxedo_For_Men_s_Pa_Fastening_Style_Men_s_Designer_Wear_Suit_Tuxedo_For_Men_s_Pa_273_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091233/products/2023_One-Piece_Ski_Suit_Wome_Overalls_Slim_Fitting_Outdoor_D_2023_One-Piece_Ski_Suit_Wome_Overalls_Slim_Fitting_Outdoor_D_181_87.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090745/products/2022_New_Design_High_Quality_Woolen_Suit_Men_s_Business_Form_2022_New_Design_High_Quality_Woolen_Suit_Men_s_Business_Form_202_39.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120189/products/Unique_Design_Popular_custom_men_suit_Size_can_be_customized_Unique_Design_Popular_custom_men_suit_Size_can_be_customized_379_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090790/products/2022_New_Winter_Ski_Suit_Women_Outdoor_Snowboard_Jacket_Men_2022_New_Winter_Ski_Suit_Women_Outdoor_Snowboard_Jacket_Men_170_92.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119139/products/Orange_Woolen_Fashion_Men_Suit_Jacket_Slim_FitFormal_Daily_M_Orange_Woolen_Fashion_Men_Suit_Jacket_Slim_FitFormal_Daily_M_174_24.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096388/products/High_quality_cashmere_shorts_suit_long_sleeve_tops_shorts_an_High_quality_cashmere_shorts_suit_long_sleeve_tops_shorts_an_309_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117458/products/Luxury_made_in_Italy_genuine_leather_double-breasted_reversi_Luxury_made_in_Italy_genuine_leather_double-breasted_reversi_1737_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117308/products/Luxuriously_tailored_my_leather_jacket_wool_panels_real_cowh_Luxuriously_tailored_my_leather_jacket_wool_panels_real_cowh_166_32.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096309/products/High_Quality_custom_design_OEM_service_man_s_leather_jacket_High_Quality_custom_design_OEM_service_man_s_leather_jacket_132.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096607/products/Hot_Selling_2023_Evel_Knievel_Tribute_Royal_Blue_Leather_Jac_Hot_Selling_2023_Evel_Knievel_Tribute_Royal_Blue_Leather_Jac_234.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090550/products/2022_Autumn_New_Raccon_Fur_Sleeve_Collar_Real_Leather_Jacket_2022_Autumn_New_Raccon_Fur_Sleeve_Collar_Real_Leather_Jacket_220.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090399/products/2021_New_Style_Wholesale_Product_Man_Leather_Jacket_Luxury_2_2021_New_Style_Wholesale_Product_Man_Leather_Jacket_Luxury_778_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117752/products/Made_in_Italy_Shearling_Aviator_Leather_Jacket_Men_100_Ital_Made_in_Italy_Shearling_Aviator_Leather_Jacket_Men_100_Ital_539.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092716/products/Best_Made_In_Italy_women_black_leather_double-breasted_coat_Best_Made_In_Italy_women_black_leather_double-breasted_coat_462_5.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095491/products/Genuine_Leather_Men_s_Goatskin_Mink_Liner_Whole_Mink_Pie_Ove_Genuine_Leather_Men_s_Goatskin_Mink_Liner_Whole_Mink_Pie_Ove_610_87.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119286/products/PDEP_2021_plus_size_4XL_black_genuine_leather_jacket_for_men_PDEP_2021_plus_size_4XL_black_genuine_leather_jacket_for_men_154.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092637/products/Best_Made_In_Italy_blue_leather_jacket_OEM_services_high_qua_Best_Made_In_Italy_blue_leather_jacket_OEM_services_high_qua_193_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117780/products/Made_in_Italy_black_leather_coat_for_men_OEM_service_high_qu_Made_in_Italy_black_leather_coat_for_men_OEM_service_high_qu_264.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117786/products/Made_in_Italy_brown_leather_coat_for_men_OEM_services_high_q_Made_in_Italy_brown_leather_coat_for_men_OEM_services_high_q_264.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120474/products/Wholesale_High_quality_Women_s_Beaded_Cascade_Big_skirt_Cond_Wholesale_High_quality_Women_s_Beaded_Cascade_Big_skirt_Cond_150.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096730/products/Hot_selling_sheepskin_patchwork_wool_skirt_leather_skirt_lea_Hot_selling_sheepskin_patchwork_wool_skirt_leather_skirt_lea_250.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094155/products/Dec_Manufacturer_Women_Sweat_Pant_Custom_Casual_Winter_100_Dec_Manufacturer_Women_Sweat_Pant_Custom_Casual_Winter_100_16.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117760/products/Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_2600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117372/products/Luxury_Mink_Coat_Women_s_Slim_Fit_Short_Thermal_Fur_Coats_At_Luxury_Mink_Coat_Women_s_Slim_Fit_Short_Thermal_Fur_Coats_At_1007_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117188/products/Leather_coat_men_s_short_lapel_suede_jacket_Mink_liner_fur_c_Leather_coat_men_s_short_lapel_suede_jacket_Mink_liner_fur_c_378.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118769/products/New_Winter_Coat_Jacket_Women_Fur_Coat_Short_Style_Genuine_Fo_New_Winter_Coat_Jacket_Women_Fur_Coat_Short_Style_Genuine_Fo_218_9.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117291/products/Low_MOQ_hot_selling_spring_short_style_5_sections_ladies_fur_Low_MOQ_hot_selling_spring_short_style_5_sections_ladies_fur_251_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750121621/products/winter_double-faced_woolen_goods_water_ripple_short_women_s_winter_double-faced_woolen_goods_water_ripple_short_women_s_498.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120753/products/Winter_Mink_Coat_Women_Short_Section_Imported_Silver_Cross_F_Winter_Mink_Coat_Women_Short_Section_Imported_Silver_Cross_F_1175.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119393/products/Popular_short_length_100_real_mink_coats_for_woman_genuine_Popular_short_length_100_real_mink_coats_for_woman_genuine_648_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117999/products/Men_Sport_Grey_Jacket_100_Wool_Short_SKUDOMADE_-_NFC_Button_Men_Sport_Grey_Jacket_100_Wool_Short_SKUDOMADE_-_NFC_Button_550.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120040/products/Texture_good_soft_sheepskin_leather_garment_women_s_short_se_Texture_good_soft_sheepskin_leather_garment_women_s_short_se_258_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118001/products/Men_Sport_Jacket_100_Grey_Cashmere_Short_-_SKUDOMADE_-_Lumb_Men_Sport_Jacket_100_Grey_Cashmere_Short_-_SKUDOMADE_-_Lumb_770.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117191/products/Leather_down_jacket_women_s_medium_and_long_sheep_skin_down_Leather_down_jacket_women_s_medium_and_long_sheep_skin_down_312.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119907/products/Spring_Summer_Leather_Jacket_for_Woman_Custom_Leather_Jacket_Spring_Summer_Leather_Jacket_for_Woman_Custom_Leather_Jacket_186_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118811/products/New_colorful_custom_women_genuine_leather_coat_long_leather_New_colorful_custom_women_genuine_leather_coat_long_leather_313_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117720/products/Made_In_Italy_-_Women_s_Leather_Jacket_in_Genuine_Leather_-_Made_In_Italy_-_Women_s_Leather_Jacket_in_Genuine_Leather_-_207_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095518/products/Genuine_Leather_Mustard_Women_s_Leather_Coat_2101_New_Season_Genuine_Leather_Mustard_Women_s_Leather_Coat_2101_New_Season_531_25.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093565/products/Cow_Leather_Men_Biker_Jacket_Cow_leather_biker_jacket_Cow_Le_Cow_Leather_Men_Biker_Jacket_Cow_leather_biker_jacket_164_99.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095480/products/Genuine_Leather_Black_Women_s_Suede_Leather_Coat_811_New_Sea_Genuine_Leather_Black_Women_s_Suede_Leather_Coat_811_New_Sea_379_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095523/products/Genuine_Leather_Navy_Blue_Women_s_Suede_Leather_Coat_973-1_N_Genuine_Leather_Navy_Blue_Women_s_Suede_Leather_Coat_973-1_N_363.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118666/products/New_Pockets_Cow_Leather_Natural_Leather_Jacket_Men_Genuine_L_New_Pockets_Cow_Leather_Natural_Leather_Jacket_Men_Genuine_L_145_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117832/products/Manufactory_Wholesale_Women_Leather_Jacket_Wholesale_Real_Le_Manufactory_Wholesale_Women_Leather_Jacket_Wholesale_Real_Le_286.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120091/products/Top_Quality_Black_Men_Fashion_Leather_Jacket_Top_Quality_Bla_Top_Quality_Black_Men_Fashion_Leather_Jacket_247_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117959/products/Men_s_Designer_Sheepskin_Shearling_Leather_Fur_Coat_Men_s_De_Men_s_Designer_Sheepskin_Shearling_Leather_Fur_Coat_455.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096730/products/Hot_selling_sheepskin_patchwork_wool_skirt_leather_skirt_lea_Hot_selling_sheepskin_patchwork_wool_skirt_leather_skirt_lea_250.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119024/products/OEM_Services_Handmade_100_Italian_Real_Leather_Jacket_Made_OEM_Services_Handmade_100_Italian_Real_Leather_Jacket_Made_287_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117396/products/Luxury_Sweetheart_Quinceanera_Dress_Party_Dress_Classic_Tull_Luxury_Sweetheart_Quinceanera_Dress_Party_Dress_Classic_Tull_260.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118222/products/Modest_wedding_dress_muslim_wedding_gown_wedding_dress_brida_Modest_wedding_dress_muslim_wedding_gown_wedding_dress_brida_947_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119675/products/Red_wedding_evening_dress_prom_dress_ball_gown_sweetheart_qu_Red_wedding_evening_dress_prom_dress_ball_gown_sweetheart_qu_165.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119985/products/Summer_ladies_fringed_luxury_noble_dresses_temperament_fisht_Summer_ladies_fringed_luxury_noble_dresses_temperament_fisht_352.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090153/products/126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_126339_Quanu_luxury_modern_white_dresser_bedroom_furniture_f_258_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091249/products/2023_new_fashion_dresses_for_women_2023_new_fashion_dresses_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_2023_new_fashion_dresses_for_women.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093988/products/Customized_Handmade_Kuchi_Tribal_Afghan_Dress_Customized_Han_Customized_Handmade_Kuchi_Tribal_Afghan_Dress_330.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095290/products/Frameless_Stand_dressing_mirror_with_led_bulbs_amazon_prime_Frameless_Stand_dressing_mirror_with_led_bulbs_amazon_prime_188_74.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117698/products/Maddy_Dress_Maddy_Dress_We_are_a_leading_marketing_agency_that_utilIZES_over_10_year_187_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119725/products/Royal_Blue_Mirror_High_Split_Prom_Dresses_2022_Vestido_De_Ga_Royal_Blue_Mirror_High_Split_Prom_Dresses_2022_Vestido_De_Ga_186_86.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119991/products/Super_September_Shiny_Chainmail_Fabric_Metal_Sequin_Dress_Su_Super_September_Shiny_Chainmail_Fabric_Metal_Sequin_Dress_230.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090870/products/2022_Silver_Rhinestones_Spandex_Dress_Women_s_Birthday_Celeb_2022_Silver_Rhinestones_Spandex_Dress_Women_s_Birthday_Celeb_144.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117956/products/Men_s_Business_Casual_Dress_Double_Breasted_Summer_Clothing_Men_s_Business_Casual_Dress_Double_Breasted_Summer_Clothing_442_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120981/products/Wool_Suit_Men_s_Business_Professional_Formal_Dress_Bridegroo_Wool_Suit_Men_s_Business_Professional_Formal_Dress_Bridegroo_317_9.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117235/products/Long_Jacket_Plazo_Classy_heavy_Beautiful_Dress_with_heavy_Long_Jacket_Plazo_Classy_heavy_Beautiful_Dress_with_heavy_528.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120448/products/Wholesale_Hand_Make_Feather_Mini_Dress_Clubwear_Rhinestone_N_Wholesale_Hand_Make_Feather_Mini_Dress_Clubwear_Rhinestone_N_166_14.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093159/products/Champagne_evening_dress_graduation_light_luxury_niche_high-e_Champagne_evening_dress_graduation_light_luxury_niche_high-e_195_8.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750300748/products/Rado_Florence_Swiss_Quartz_Dress_Watch_with_Stainless_Steel_Rado_Florence_Swiss_Quartz_Dress_Watch_with_Stainless_Steel_1000.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090488/products/2021_spring_new_men_s_wedding_dress_performance_MC_presides_2021_spring_new_men_s_wedding_dress_performance_MC_presides_161_48.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117183/products/Latest_Model_Best_Boutique_Dress_For_Ladies_Wholesale_100_Latest_Model_Best_Boutique_Dress_For_Ladies_Wholesale_100_770_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094460/products/Embroidery_Muslim_Kaftan_Hijab_Dress_Women_Butterfly_Abaya_D_Embroidery_Muslim_Kaftan_Hijab_Dress_Women_Butterfly_Abaya_D_534_38.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750095577/products/Glowing_led_light_up_fiber_optical_fabric_wedding_dress_Glow_Glowing_led_light_up_fiber_optical_fabric_wedding_dress_908_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119667/products/Red_elegant_Sheer_back_Long_Satin_perspective_Prom_Dress_202_Red_elegant_Sheer_back_Long_Satin_perspective_Prom_Dress_202_153_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117170/products/Latest_Crocodile_Skin_Penny_Loafers_Casual_Slip_On_Dress_Sho_Latest_Crocodile_Skin_Penny_Loafers_Casual_Slip_On_Dress_Sho_291_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119661/products/Red_Lace_Dress_Women_Patchwork_Slash_Neck_Short_Sleeve_Sashe_Red_Lace_Dress_Women_Patchwork_Slash_Neck_Short_Sleeve_Sashe_1400.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090650/products/2022_Hot_Sale_White_Summer_Wedding_Dress_Strapless_Women_ele_2022_Hot_Sale_White_Summer_Wedding_Dress_Strapless_Women_ele_120.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120262/products/Wedding_Dress_Fashion_Women_White_Red_Luxury_Sequin_Lace_Sle_Wedding_Dress_Fashion_Women_White_Red_Luxury_Sequin_Lace_Sle_371_22.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117170/products/Latest_Crocodile_Skin_Penny_Loafers_Casual_Slip_On_Dress_Sho_Latest_Crocodile_Skin_Penny_Loafers_Casual_Slip_On_Dress_Sho_291_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119667/products/Red_elegant_Sheer_back_Long_Satin_perspective_Prom_Dress_202_Red_elegant_Sheer_back_Long_Satin_perspective_Prom_Dress_202_153_75.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117756/products/Made_in_Italy_Top_Quality_Long_Nature_Fancy_Dress_for_woman_Made_in_Italy_Top_Quality_Long_Nature_Fancy_Dress_for_woman_2600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120964/products/Women_Summer_Dress_With_Belt_Short_Sleeve_V_neck_Retro_Rocka_Women_Summer_Dress_With_Belt_Short_Sleeve_V_neck_Retro_Rocka_1232.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118402/products/NOVANCE_2022_new_arrivals_Sparkly_Diamond_Pearl_Dress_Long_S_NOVANCE_2022_new_arrivals_Sparkly_Diamond_Pearl_Dress_Long_S_158_72.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117202/products/Letter_Jacquard_Polo_Neck_Knitted_Short_Sleeve_Women_Dress_V_Letter_Jacquard_Polo_Neck_Knitted_Short_Sleeve_Women_Dress_V_135_28.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094538/products/FARAH_NAZ_New_York_Women_s_Self_Tie_Dress_Vision_In_Black_Fi_FARAH_NAZ_New_York_Women_s_Self_Tie_Dress_Vision_In_Black_Fi_269_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117760/products/Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_2600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750091266/products/2205_Golden_high-end_host_evening_dress_fish_tail_long_annua_2205_Golden_high-end_host_evening_dress_fish_tail_long_annua_255_18.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750094161/products/Deep_V-neck_slim_fishtail_toast_dress_2022_new_birthday_banq_Deep_V-neck_slim_fishtail_toast_dress_2022_new_birthday_banq_147_2.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090716/products/2022_Natural_Real_Fox_Fur_Coat_Women_Long_Sleeve_Wear_With_P_2022_Natural_Real_Fox_Fur_Coat_Women_Long_Sleeve_Wear_With_P_467_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750119102/products/Occasion_Wear_New_Indian_Collection_For_Women_Short_Sleeve_F_Occasion_Wear_New_Indian_Collection_For_Women_Short_Sleeve_F_520.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118734/products/New_Style_Double-sided_Wear_100_Slik_Lining_Reversible_Jack_New_Style_Double-sided_Wear_100_Slik_Lining_Reversible_Jack_287_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750118881/products/Nice_Quality_Winter_Women_Warm_Thickened_Outer_Wear_Windproo_Nice_Quality_Winter_Women_Warm_Thickened_Outer_Wear_Windproo_231_25.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120267/products/Wedding_Wear_New_Fashion_Women_Party_Clothes_Boutique_Dress_Wedding_Wear_New_Fashion_Women_Party_Clothes_Boutique_Dress_134_4.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750093947/products/Customization_Unisex_Winter_Outdoor_Mountain_Wear_2_Pieces_S_Customization_Unisex_Winter_Outdoor_Mountain_Wear_2_Pieces_S_225.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750092230/products/Autumn_Cross-border_WOOLEN_casual_lapel_cardigan_shirt_fashi_Autumn_Cross-border_WOOLEN_casual_lapel_cardigan_shirt_fashi_639_6.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750120032/products/T_shirt_For_Men_Customized_Design_Stand_Collar_Long_Sleeve_1_T_shirt_For_Men_Customized_Design_Stand_Collar_Long_Sleeve_1_9100.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117760/products/Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_Made_in_Italy_Top_Quality_Long_Pink_Shirt_for_woman_dress_fo_2600.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117372/products/Luxury_Mink_Coat_Women_s_Slim_Fit_Short_Thermal_Fur_Coats_At_Luxury_Mink_Coat_Women_s_Slim_Fit_Short_Thermal_Fur_Coats_At_1007_5.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750096607/products/Hot_Selling_2023_Evel_Knievel_Tribute_Royal_Blue_Leather_Jac_Hot_Selling_2023_Evel_Knievel_Tribute_Royal_Blue_Leather_Jac_234.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090550/products/2022_Autumn_New_Raccon_Fur_Sleeve_Collar_Real_Leather_Jacket_2022_Autumn_New_Raccon_Fur_Sleeve_Collar_Real_Leather_Jacket_220.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117752/products/Made_in_Italy_Shearling_Aviator_Leather_Jacket_Men_100_Ital_Made_in_Italy_Shearling_Aviator_Leather_Jacket_Men_100_Ital_539.png",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750090399/products/2021_New_Style_Wholesale_Product_Man_Leather_Jacket_Luxury_2_2021_New_Style_Wholesale_Product_Man_Leather_Jacket_Luxury_778_7.jpg",
  "https://res.cloudinary.com/dhubpqnss/image/upload/v1750117967/products/Men_s_Jacket_Ripped_Washed_Old_Denim_Jacket_Jean_Jacket_Fash_Men_s_Jacket_Ripped_Washed_Old_Denim_Jacket_Jean_Jacket_Fash_396.jpg"
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

/* Build product objects with name and a short description (furniture-focused descriptions retained) */
const productsFromUrls = (urls) =>
  urls.map((url, idx) => {
    const name = friendlyNameFromUrl(url);
    const lower = name.toLowerCase();
    const desc = (() => {
      if (lower.includes("sofa") || lower.includes("couch") || lower.includes("sectional") || lower.includes("divan")) {
        return "Comfortable sofas & sectionals — premium upholstery and lasting comfort.";
      }
      if (lower.includes("bed") || lower.includes("mattress") || lower.includes("loft") || lower.includes("bunk")) {
        return "Beds & bedroom furniture — solid construction and elegant designs.";
      }
      if (lower.includes("table") || lower.includes("coffee") || lower.includes("dining") || lower.includes("desk")) {
        return "Tables & desks — functional, stylish surfaces for every room.";
      }
      if (lower.includes("chair") || lower.includes("armrest") || lower.includes("stool") || lower.includes("high") ) {
        return "Chairs & seating — ergonomics and style combined.";
      }
      if (lower.includes("lamp") || lower.includes("lighting") || lower.includes("bedside") || lower.includes("mirror")) {
        return "Lighting & decor — accent pieces to brighten your home.";
      }
      if (lower.includes("wardrobe") || lower.includes("dresser") || lower.includes("cabinet") || lower.includes("storage")) {
        return "Storage & wardrobes — keep your space organized with style.";
      }
      if (lower.includes("outdoor") || lower.includes("patio") || lower.includes("garden") || lower.includes("party")) {
        return "Outdoor & patio furniture — durable and weather-resistant.";
      }
      if (lower.includes("hospital") || lower.includes("medical") || lower.includes("surgical") || lower.includes("wheelchair") || lower.includes("patient")) {
        return "Professional-grade medical furniture & equipment.";
      }
      return "Quality furniture and home decor — crafted for comfort and style.";
    })();

    return {
      id: idx + 1,
      name,
      desc,
      img: url
    };
  });

export default function Furniture() {
  // Shuffle once on component mount
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
           This preserves the 2x4 grid even on small screens.
        */
        .two-column-vertical {
          display: grid;
          grid-template-columns: 1fr 1fr; /* always two columns */
          gap: 18px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Allow horizontal scrolling if the viewport gets very narrow so we never collapse to 1 column */
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
           The info block is non-flexing so it occupies only the height it needs.
           This ensures images always fit within the leftover space of the card.
        */
        .shoe-image-wrap {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto; /* image area expands to fill remaining vertical space */
        }
        /* Ensure image always fits inside its frame regardless of original size */
        .shoe-image-wrap img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .shoe-info {
          padding: 14px;
          background: #fff;
          flex: 0 0 auto; /* info won't flex; it takes only the space it needs */
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
        {/* Hero Section: background uses the imported Apparel.png asset */}
        <section
          className="shoes-hero"
          style={{
            backgroundImage: `url(${ShoesHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "320px"
          }}
        >
          <div className="shoes-hero-content" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="shoes-category">Apparel</h2>
            <h1 className="shoes-title">Explore Our Collection For Apparel</h1>
            <p className="shoes-subtitle">
              Updated weekly with new arrivals and curated selections for your home.
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
                  href={`/furniture/${p.id}`}
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
                  href={`/furniture/${p.id}`}
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