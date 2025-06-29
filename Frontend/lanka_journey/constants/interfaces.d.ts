// Define interfaces for the Google Places API response
interface DisplayName {
  text: string;
  languageCode?: string;
}

interface PrimaryTypeDisplayName {
  text: string;
  languageCode?: string;
}

interface EditorialSummary {
  text: string;
  languageCode?: string;
}

interface Photo {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

interface Review {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: {
    text?: string;
    languageCode?: string;
  };
  originalText?: {
    text?: string;
    languageCode?: string;
  };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  publishTime?: string; // ISO 8601 string (optional in case parsing fails)
  flagContentUri?: string;
  googleMapsUri?: string;
}

interface PlaceDetails {
  displayName?: DisplayName;
  shortFormattedAddress?: string;
  photos?: Photo[];
  rating?: number;
  editorialSummary?: EditorialSummary;
  primaryTypeDisplayName?: PrimaryTypeDisplayName;
  reviews?: Review[];
  userRatingCount?: number;
}

interface Trip {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  user_id: string;
}

interface DayData {
  day: number;
  date: Date;
  transport: string | null;
  location?: {
    place_id: string;
    title: string;
    image?: any;
  } | null;
}

interface SlideItem {
  key: string;
  title: string;
  description: string;
  image: any;
}

interface HomePageFlatListProps {
  name?: string;
  data?: Array<{
    id: string;
    image?: any;
    title: string;
    location?: string;
  }>;
}

interface PlaceData {
  id: string;
  image?: any;
  title: string;
  location?: string;
}

interface Photo {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

// Define the Review interface
interface ReviewProps {
  review: {
    name?: string;
    relativePublishTimeDescription?: string;
    rating?: number;
    text?: {
      text?: string;
      languageCode?: string;
    };
    originalText?: {
      text?: string;
      languageCode?: string;
    };
    authorAttribution?: {
      displayName?: string;
      uri?: string;
      photoUri?: string;
    };
    publishTime?: string;
  };
}
