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
    title: "Little Adam's Peak",
  },

  {
    id: "3",
    title: "Lipton's Seat",
  },
  {
    id: "4",
    title: "World's End",
  },
  {
    id: "5",
    title: "Pidurangala Rock",
  },
  {
    id: "6",
    title: "Sigiriya Rock Fortress",
  },
  {
    id: "7",
    title: "Ambuluwawa Tower",
  },
  {
    id: "8",
    title: "Dondra Head Lighthouse Viewpoint",
  },
  {
    id: "9",
    title: "Knuckles Mountain Range Viewpoint",
  },
  {
    id: "10",
    title: "Kudawa Viewpoint – Sinharaja Forest Edge",
  },
];

const topHotels = [
  {
    id: "1",
    title: "Ceylon Tea Trails",
  },
  {
    id: "2",
    title: "Cape Weligama",
  },
  {
    id: "3",
    title: "Wild Coast Tented Lodge",
  },
  {
    id: "4",
    title: "Amangalla",
  },
  {
    id: "5",
    title: "Heritance Kandalama",
  },
  {
    id: "6",
    title: "Ulagalla by Uga Escapes",
  },
  {
    id: "7",
    title: "Amanwella",
  },
  {
    id: "8",
    title: "The Fortress Resort & Spa",
  },
  {
    id: "9",
    title: "Jetwing Lighthouse",
  },
  {
    id: "10",
    title: "Heritance Tea Factory",
  },
];

const topActivities = [
  {
    id: "1",
    title: "Turtle Watching in Rekawa",
  },
  {
    id: "2",
    title: "Safari at Yala National Park",
  },
  {
    id: "3",
    title: "Whale Watching in Mirissa",
  },
  {
    id: "4",
    title: "Surfing Lessons in Arugam Bay",
  },
  {
    id: "5",
    title: "Train Ride from Kandy to Ella",
  },
  {
    id: "6",
    title: "Scuba Diving in Hikkaduwa",
  },
  {
    id: "7",
    title: "Helping at Dogs of Ella Sanctuary",
  },
  {
    id: "8",
    title: "White Water Rafting in Kitulgala",
  },
  {
    id: "9",
    title: "Hot Air Ballooning in Dambulla",
  },
  {
    id: "10",
    title: "Ayurvedic Spa and Healing Rituals",
  },
];

const topRestaurants = [
  {
    id: "1",
    title: "Ministry of Crab",
  },
  {
    id: "2",
    title: "Nuga Gama",
  },
  {
    id: "3",
    title: "Upali’s by Nawaloka",
  },
  {
    id: "4",
    title: "Mr Kottu",
  },
  {
    id: "5",
    title: "Perera & Sons",
  },
  {
    id: "6",
    title: "The Gallery Café",
  },
  {
    id: "7",
    title: "Ceylon King Kashapa Restaurant",
  },
  {
    id: "8",
    title: "Metta’s Homecooking",
  },
  {
    id: "9",
    title: "Duni’s Hoppers",
  },
  {
    id: "10",
    title: "Luuma",
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
  {
    label: "Reset Onboarding",
    icon: <Ionicons name="refresh-outline" size={20} />,
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
