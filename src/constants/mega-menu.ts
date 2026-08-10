export type MegaSidebarItem = {
  id: string;
  label: string;
  badge?: "NEW";
};

export type MegaLink = {
  label: string;
  href: string;
  badge?: "FREE" | "NEW";
  bold?: boolean;
};

export type MegaPanel = {
  heading: string;
  links: MegaLink[];
  footerLink?: MegaLink;
};

export type MegaMenuConfig = {
  id: string;
  label: string;
  href: string;
  badge?: "NEW";
  sidebar: MegaSidebarItem[];
  defaultPanel: string;
  panels: Record<string, MegaPanel>;
  promo: "insights" | "post-property" | null;
  sidebarFooter: "contact" | "builder" | null;
};

const TOP_CITIES_BUY: MegaLink[] = [
  { label: "Property in Delhi / NCR", href: "/buy?city=Delhi%20%2F%20NCR" },
  { label: "Property in Mumbai", href: "/buy?city=Mumbai" },
  { label: "Property in Bangalore", href: "/buy?city=Bangalore" },
  { label: "Property in Hyderabad Metropolitan Region", href: "/buy?city=Hyderabad" },
  { label: "Property in Pune", href: "/buy?city=Pune" },
  { label: "Property in Kolkata", href: "/buy?city=Kolkata" },
  { label: "Property in Chennai", href: "/buy?city=Chennai" },
  { label: "Property in Ahmedabad", href: "/buy?city=Ahmedabad" },
];

const TOP_CITIES_RENT: MegaLink[] = TOP_CITIES_BUY.map((l) => ({
  ...l,
  label: l.label.replace("Property in", "Property for rent in"),
  href: l.href.replace("/buy", "/rent"),
}));

const TOP_CITIES_PLOT: MegaLink[] = TOP_CITIES_BUY.map((l) => ({
  ...l,
  label: l.label.replace("Property in", "Plots in"),
  href: l.href.replace("/buy", "/plots"),
}));

const TOP_CITIES_COMMERCIAL: MegaLink[] = TOP_CITIES_BUY.map((l) => ({
  ...l,
  label: l.label.replace("Property in", "Commercial property in"),
  href: l.href.replace("/buy", "/commercial"),
}));

const INSIGHTS_FEATURES = [
  "Understand localities",
  "Read Resident Reviews",
  "Check Price Trends",
  "Tools, Utilities & more",
] as const;

export const MEGA_INSIGHTS_FEATURES = INSIGHTS_FEATURES;

export const AUDIENCE_MEGA_MENUS: MegaMenuConfig[] = [
  {
    id: "buyers",
    label: "For Buyers",
    href: "/buy",
    sidebar: [
      { id: "home", label: "Buy a Home" },
      { id: "plot", label: "Land/Plot" },
      { id: "commercial", label: "Commercial" },
      { id: "insights", label: "Insights", badge: "NEW" },
      { id: "articles", label: "Articles & News" },
    ],
    defaultPanel: "home",
    panels: {
      home: { heading: "Top Cities", links: TOP_CITIES_BUY },
      plot: { heading: "Top Cities", links: TOP_CITIES_PLOT },
      commercial: { heading: "Top Cities", links: TOP_CITIES_COMMERCIAL },
      insights: {
        heading: "Check Overview of Top Cities",
        links: [
          { label: "Mumbai Overview", href: "/city/mumbai" },
          { label: "Delhi Overview", href: "/city/delhi-ncr" },
          { label: "Bangalore Overview", href: "/city/bengaluru" },
          { label: "Hyderabad Overview", href: "/city/hyderabad" },
          { label: "Pune Overview", href: "/city/pune" },
          { label: "Chennai Overview", href: "/city/chennai" },
          { label: "Gurgaon Overview", href: "/city/delhi-ncr" },
          { label: "Noida Overview", href: "/city/noida" },
        ],
        footerLink: { label: "View All Insights", href: "/blog" },
      },
      articles: {
        heading: "Latest Articles",
        links: [
          { label: "Guide to buying a luxury home", href: "/blog/guide-to-buying-luxury-home-2026" },
          { label: "Top investment localities", href: "/blog/top-investment-localities-india" },
          { label: "Home loan EMI strategies", href: "/blog/home-loan-emi-strategies" },
          { label: "Sustainable luxury homes", href: "/blog/sustainable-luxury-homes" },
        ],
        footerLink: { label: "View all articles", href: "/blog" },
      },
    },
    promo: "insights",
    sidebarFooter: "contact",
  },
  {
    id: "tenants",
    label: "For Tenants",
    href: "/rent",
    sidebar: [
      { id: "rent", label: "Rent a Home" },
      { id: "pg", label: "PG/Co-living" },
      { id: "commercial", label: "Commercial" },
      { id: "insights", label: "Insights", badge: "NEW" },
      { id: "articles", label: "Articles & News" },
    ],
    defaultPanel: "rent",
    panels: {
      rent: { heading: "Top Cities", links: TOP_CITIES_RENT },
      pg: {
        heading: "Top Cities",
        links: TOP_CITIES_BUY.map((l) => ({
          ...l,
          label: l.label.replace("Property in", "PG in"),
          href: l.href.replace("/buy", "/pg"),
        })),
      },
      commercial: { heading: "Top Cities", links: TOP_CITIES_COMMERCIAL },
      insights: {
        heading: "Check Overview of Top Cities",
        links: [
          { label: "Mumbai Overview", href: "/city/mumbai" },
          { label: "Delhi Overview", href: "/city/delhi-ncr" },
          { label: "Bangalore Overview", href: "/city/bengaluru" },
          { label: "Pune Overview", href: "/city/pune" },
          { label: "Hyderabad Overview", href: "/city/hyderabad" },
          { label: "Chennai Overview", href: "/city/chennai" },
        ],
        footerLink: { label: "View All Insights", href: "/blog" },
      },
      articles: {
        heading: "Latest Articles",
        links: [
          { label: "Guide to buying a luxury home", href: "/blog/guide-to-buying-luxury-home-2026" },
          { label: "Top investment localities", href: "/blog/top-investment-localities-india" },
        ],
        footerLink: { label: "View all articles", href: "/blog" },
      },
    },
    promo: "insights",
    sidebarFooter: "contact",
  },
  {
    id: "owners",
    label: "For Owners",
    href: "/portal",
    sidebar: [
      { id: "offerings", label: "Owner Offerings" },
      { id: "insights", label: "Insights", badge: "NEW" },
      { id: "articles", label: "Articles & News" },
    ],
    defaultPanel: "offerings",
    panels: {
      offerings: {
        heading: "Owner Offerings",
        links: [
          { label: "Post Property", href: "/postproperty", badge: "FREE", bold: true },
          { label: "Owner Services", href: "/contact" },
          { label: "My Growra", href: "/portal" },
          { label: "View Responses", href: "/portal" },
        ],
      },
      insights: {
        heading: "Check Overview of Top Cities",
        links: [
          { label: "Mumbai Overview", href: "/city/mumbai" },
          { label: "Delhi Overview", href: "/city/delhi-ncr" },
          { label: "Bangalore Overview", href: "/city/bengaluru" },
          { label: "Pune Overview", href: "/city/pune" },
        ],
        footerLink: { label: "View All Insights", href: "/blog" },
      },
      articles: {
        heading: "Latest Articles",
        links: [
          { label: "Guide to buying a luxury home", href: "/blog/guide-to-buying-luxury-home-2026" },
          { label: "Top investment localities", href: "/blog/top-investment-localities-india" },
        ],
        footerLink: { label: "View all articles", href: "/blog" },
      },
    },
    promo: "post-property",
    sidebarFooter: "contact",
  },
  {
    id: "dealers",
    label: "For Dealers / Builders",
    href: "/projects",
    sidebar: [
      { id: "offerings", label: "Dealer Offerings" },
      { id: "research", label: "Research and Advice" },
    ],
    defaultPanel: "offerings",
    panels: {
      offerings: {
        heading: "Property Services",
        links: [
          { label: "Post Property", href: "/postproperty" },
          { label: "Dealer Services", href: "/contact" },
          { label: "My Growra", href: "/portal" },
          { label: "View Responses", href: "/portal" },
        ],
      },
      research: {
        heading: "Research & Advice",
        links: [
          { label: "Market Trends", href: "/blog" },
          { label: "Price Guides", href: "/blog" },
          { label: "Builder Directory", href: "/projects" },
          { label: "Investment Insights", href: "/blog/top-investment-localities-india" },
        ],
      },
    },
    promo: "post-property",
    sidebarFooter: "builder",
  },
  {
    id: "insights",
    label: "Insights",
    href: "/blog",
    badge: "NEW",
    sidebar: [
      { id: "overview", label: "City Overview" },
      { id: "trends", label: "Price Trends" },
    ],
    defaultPanel: "overview",
    panels: {
      overview: {
        heading: "Check Overview of Top Cities",
        links: [
          { label: "Secunderabad Overview", href: "/city/hyderabad" },
          { label: "Pune Overview", href: "/city/pune" },
          { label: "Noida Overview", href: "/city/noida" },
          { label: "Mumbai Overview", href: "/city/mumbai" },
          { label: "Hyderabad Overview", href: "/city/hyderabad" },
          { label: "Gurgaon Overview", href: "/city/delhi-ncr" },
          { label: "Delhi Overview", href: "/city/delhi-ncr" },
          { label: "Chennai Overview", href: "/city/chennai" },
        ],
        footerLink: { label: "View All Insights", href: "/blog" },
      },
      trends: {
        heading: "Price Trends by City",
        links: [
          { label: "Mumbai Price Trends", href: "/city/mumbai" },
          { label: "Delhi / NCR Price Trends", href: "/city/delhi-ncr" },
          { label: "Bangalore Price Trends", href: "/city/bengaluru" },
          { label: "Hyderabad Price Trends", href: "/city/hyderabad" },
          { label: "Pune Price Trends", href: "/city/pune" },
          { label: "Chennai Price Trends", href: "/city/chennai" },
        ],
        footerLink: { label: "View All Insights", href: "/blog" },
      },
    },
    promo: "insights",
    sidebarFooter: null,
  },
];
