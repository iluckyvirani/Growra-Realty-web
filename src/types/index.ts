export type PropertyType =
  | "apartment"
  | "villa"
  | "plot"
  | "penthouse"
  | "studio"
  | "farmhouse"
  | "commercial"
  | "office"
  | "shop"
  | "pg";

export type ListingType = "buy" | "rent" | "commercial" | "pg" | "plot" | "luxury" | "project";

export type ConstructionStatus = "ready" | "under-construction" | "new-launch";

export type PossessionStatus = "immediate" | "within-3-months" | "within-6-months" | "within-1-year" | "after-1-year";

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: "lifestyle" | "security" | "sports" | "convenience" | "eco";
}

export interface NearbyPlace {
  name: string;
  type: "school" | "hospital" | "metro" | "restaurant" | "mall" | "park";
  distance: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  bhk: number;
  area: number;
  price: number;
  image: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  pricePerSqft?: number;
  listingType: ListingType;
  propertyType: PropertyType;
  bhk: number;
  bathrooms: number;
  balconies?: number;
  area: number;
  carpetArea?: number;
  city: string;
  locality: string;
  address: string;
  state: string;
  pincode: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  videoUrl?: string;
  tour360Url?: string;
  amenities: string[];
  specifications: Record<string, string>;
  floorPlans: FloorPlan[];
  nearby: NearbyPlace[];
  builderId: string;
  builderName: string;
  reraId?: string;
  possession: string;
  constructionStatus: ConstructionStatus;
  furnished: "furnished" | "semi-furnished" | "unfurnished";
  facing?: string;
  parking?: number;
  floors?: number;
  age?: string;
  verified: boolean;
  featured: boolean;
  luxury: boolean;
  views: number;
  postedAt: string;
  tags: string[];
}

export interface Builder {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  established: number;
  totalProjects: number;
  ongoingProjects: number;
  cities: string[];
  rating: number;
  reviews: number;
  website?: string;
  verified: boolean;
}

export interface City {
  id: string;
  slug: string;
  name: string;
  state: string;
  image: string;
  propertyCount: number;
  avgPrice: number;
  trending: boolean;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  location: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  listingType?: ListingType;
  propertyType?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bhk?: number[];
  bathrooms?: number[];
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  constructionStatus?: ConstructionStatus[];
  furnished?: string[];
  verified?: boolean;
  rera?: boolean;
  builderId?: string;
  sortBy?: "relevance" | "price-asc" | "price-desc" | "newest" | "area-desc";
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}
