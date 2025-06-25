import { icons } from "./icons";
import { images } from "./images";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { label: "Hotels", icon: icons.hotels },
  { label: "Restaurant", icon: icons.restaurant },
  { label: "Places", icon: icons.places },
  { label: "Activities", icon: icons.activities },
];

const topPlaces = [
  {
    id: "1",
    image: images.littleAdamsViewPoint,
    title: "Little Adams View Point",
    location: "Ella, Sri Lanka",
  },
  {
    id: "2",
    image: images.kudaRavana,
    title: "Kuda Ravana Waterfall",
    location: "Ella, Sri Lanka",
  },
  {
    id: "3",
    image: images.ellaRockViewPoint,
    title: "Ella Rock View Point",
    location: "Ella, Sri Lanka",
  },
];

const topHotels = [
  {
    id: "1",
    image: images.acresHotel,
    title: "Acres Hotel",
    location: "Bandarawela, Sri Lanka",
  },
  {
    id: "2",
    image: images.hideElla,
    title: "Hide Ella Hotel",
    location: "Ella, Sri Lanka",
  },
  {
    id: "3",
    image: images.ravanaHeights,
    title: "Ravana Heights",
    location: "Ella, Sri Lanka",
  },
];

const topActivities = [
  {
    id: "1",
    image: images.tuktukAdventures,
    title: "Tuktuk Adventures",
    location: "Ella, Sri Lanka",
  },
  {
    id: "2",
    image: images.flyingRavana,
    title: "Flying Ravana Zipline",
    location: "Ella, Sri Lanka",
  },
];

const topRestaurants = [
  {
    id: "1",
    image: images.greenDoorCafe,
    title: "Green Door Cafe",
    location: "Ella, Sri Lanka",
  },
  {
    id: "2",
    image: images.gardenView,
    title: "Garden View Restaurant",
    location: "Ella, Sri Lanka",
  },
  {
    id: "3",
    image: images.mateyHut,
    title: "Matey Hut",
    location: "Ella, Sri Lanka",
  },
];

const settingsOptions = [
  {
    label: "Notifications",
    icon: <Ionicons name="notifications-outline" size={20} />,
  },
  {
    label: "Language",
    icon: <Ionicons name="globe-outline" size={20} />,
  },
  {
    label: "Currency",
    icon: <Ionicons name="cash-outline" size={20} />,
  },
];

const legalLinks = ["Privacy Policy", "Terms and conditions"];

export {
  topPlaces,
  categories,
  topHotels,
  topActivities,
  topRestaurants,
  settingsOptions,
  legalLinks,
};
