import sexualHealthBackground from "../../assets/images/png/sexualHealth.png";
import femaleHealthBackground from "../../assets/images/png/femaleHealth.png";
import maleHealthBackground from "../../assets/images/png/maleHealth.png";
import generalHealthBackground from "../../assets/images/png/generalHealth.png";

export const MAIN_API_URL =
  "https://app-dev.personalabs.com/wp-json/personalabs/v1";
export const AUTH_API_URL =
  "https://app-dev.personalabs.com/wp-json/jwt-auth/v1";

export const ADDED_PRODUCT_MODAL_DURATION = 4000; // ms

interface CATEGORY_INTERFACE {
  localizedTitleKey: string;
  name: string;
  image: string;
  color: string;
}

export interface CATEGORY_DATA_INTERFACE {
  [key: string]: CATEGORY_INTERFACE;
}

export const CATEGORY_DATA: CATEGORY_DATA_INTERFACE = {
  "sexual-health": {
    localizedTitleKey: "sexualHealth",
    name: "sexual-health",
    image: sexualHealthBackground,
    color: "#7C5380",
  },
  "womens-health": {
    localizedTitleKey: "femaleHealth",
    name: "womens-health",
    image: femaleHealthBackground,
    color: "#B15477",
  },
  "mens-health": {
    localizedTitleKey: "maleHealth",
    name: "mens-health",
    image: maleHealthBackground,
    color: "#0080B8",
  },
  "general-health": {
    localizedTitleKey: "generalHealth",
    name: "general-health",
    image: generalHealthBackground,
    color: "#C18024",
  },
};
