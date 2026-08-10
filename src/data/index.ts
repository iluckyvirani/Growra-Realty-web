import type { Builder, City, BlogPost, Testimonial, FaqItem, Review } from "@/types";

export const builders: Builder[] = [
  {
    id: "b1",
    slug: "oberoi-legacy",
    name: "Oberoi Legacy",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    description:
      "Oberoi Legacy crafts landmark residences and commercial destinations across India's financial capitals, known for meticulous detailing and enduring value.",
    established: 1983,
    totalProjects: 48,
    ongoingProjects: 6,
    cities: ["Mumbai", "Bengaluru", "Pune"],
    rating: 4.8,
    reviews: 1240,
    verified: true,
  },
  {
    id: "b2",
    slug: "prestige-estates",
    name: "Prestige Estates",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    description:
      "Prestige Estates delivers thoughtfully planned communities with a focus on green living, connectivity, and lifestyle amenities across South India.",
    established: 1986,
    totalProjects: 250,
    ongoingProjects: 18,
    cities: ["Bengaluru", "Chennai", "Hyderabad", "Kochi"],
    rating: 4.6,
    reviews: 3180,
    verified: true,
  },
  {
    id: "b3",
    slug: "lodha-signature",
    name: "Lodha Signature",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    description:
      "Lodha Signature is synonymous with ultra-luxury living — iconic towers, curated amenities, and architecture that defines city skylines.",
    established: 1980,
    totalProjects: 85,
    ongoingProjects: 12,
    cities: ["Mumbai", "Pune", "Hyderabad", "London"],
    rating: 4.7,
    reviews: 2100,
    verified: true,
  },
  {
    id: "b4",
    slug: "dlf-crest",
    name: "DLF Crest",
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    description:
      "DLF Crest pioneers master-planned townships and premium high-rises across North India with unmatched scale and urban design expertise.",
    established: 1946,
    totalProjects: 320,
    ongoingProjects: 22,
    cities: ["Delhi NCR", "Chandigarh", "Chennai"],
    rating: 4.5,
    reviews: 4520,
    verified: true,
  },
  {
    id: "b5",
    slug: "godrej-properties",
    name: "Godrej Properties",
    logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&q=80",
    description:
      "Godrej Properties blends sustainability with contemporary design, creating homes that prioritize wellbeing, community, and environmental stewardship.",
    established: 1990,
    totalProjects: 110,
    ongoingProjects: 15,
    cities: ["Mumbai", "Pune", "Bengaluru", "Delhi NCR", "Ahmedabad"],
    rating: 4.6,
    reviews: 2890,
    verified: true,
  },
];

export const cities: City[] = [
  {
    id: "c1",
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80",
    propertyCount: 218000,
    avgPrice: 28000,
    trending: true,
    description: "India's financial capital offering waterfront luxury and iconic skyline living.",
  },
  {
    id: "c2",
    slug: "delhi-ncr",
    name: "Delhi / NCR",
    state: "Delhi / Haryana / UP",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    propertyCount: 247000,
    avgPrice: 12000,
    trending: true,
    description: "A vast metropolitan region spanning premium golf-course corridors and emerging townships.",
  },
  {
    id: "c3",
    slug: "bengaluru",
    name: "Bangalore",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
    propertyCount: 203000,
    avgPrice: 9500,
    trending: true,
    description: "The Silicon Valley of India with verdant suburbs and tech-corridor residences.",
  },
  {
    id: "c4",
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    propertyCount: 176000,
    avgPrice: 7800,
    trending: true,
    description: "A booming IT hub with luxurious villa estates and modern gated communities.",
  },
  {
    id: "c5",
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
    propertyCount: 154000,
    avgPrice: 8200,
    trending: false,
    description: "A cultural and educational hub offering serene residential neighbourhoods.",
  },
  {
    id: "c6",
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
    propertyCount: 128000,
    avgPrice: 8800,
    trending: false,
    description: "Coastal metropolitan living with strong civic infrastructure and heritage charm.",
  },
  {
    id: "c7",
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    propertyCount: 112000,
    avgPrice: 6500,
    trending: false,
    description: "Heritage-rich metro with affordable housing and growing suburban corridors.",
  },
  {
    id: "c8",
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
    propertyCount: 139000,
    avgPrice: 7200,
    trending: true,
    description: "A fast-growing commercial hub with strong infrastructure and gated townships.",
  },
  {
    id: "c9",
    slug: "noida",
    name: "Noida",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
    propertyCount: 86000,
    avgPrice: 8500,
    trending: true,
    description: "Delhi NCR's planned township hub with metro connectivity, IT parks, and premium high-rises.",
  },
  {
    id: "c10",
    slug: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    propertyCount: 24000,
    avgPrice: 4200,
    trending: true,
    description: "Heritage city with growing residential corridors, villa communities, and investment-ready plots.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog1",
    slug: "guide-to-buying-luxury-home-2026",
    title: "The Definitive Guide to Buying a Luxury Home in 2026",
    excerpt:
      "From due diligence to interior curation — everything discerning buyers need to know before investing in ultra-premium real estate.",
    content: `
## Understanding the luxury market

The luxury real estate landscape in 2026 continues to reward informed buyers who prioritize location, builder reputation, and long-term livability over fleeting trends.

## Key considerations

1. **Title clarity & RERA** — Always verify RERA registration and clear titles.
2. **Micro-location** — Proximity to schools, transit, and lifestyle destinations compounds value.
3. **Builder track record** — Delivery timelines and construction quality matter more than marketing.
4. **Resale liquidity** — Ultra-niche properties may appreciate slower than well-located mid-luxury.

## Financing tips

Compare bank rates, consider pre-approved loans, and evaluate EMI vs. rental yield carefully. A 10–20% down payment with a competitive floating rate remains the most common structure for premium purchases.

## Closing thoughts

Work with a trusted advisor, visit properties multiple times at different hours, and never rush the paperwork. Luxury living begins with a confident, well-researched decision.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    author: "Ananya Mehta",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    category: "Buying Guide",
    tags: ["Luxury", "Buying", "Guide"],
    publishedAt: "2026-07-10",
    readTime: 8,
  },
  {
    id: "blog2",
    slug: "top-investment-localities-india",
    title: "Top 8 Investment Localities Across India This Year",
    excerpt:
      "Data-backed insights into neighbourhoods showing strong rental yields and capital appreciation potential.",
    content: `
## Why locality matters

In Indian real estate, micro-markets often outperform cities as a whole. Infrastructure announcements, employment hubs, and lifestyle upgrades drive differential growth.

## Featured localities

- **Bandra West, Mumbai** — Scarcity-driven luxury demand
- **Golf Course Road, Gurgaon** — Corporate corridor premium
- **Whitefield, Bengaluru** — Sustained IT-led demand
- **Jubilee Hills, Hyderabad** — Villa market strength
- **Noida Sector 150** — Emerging township play
- **Koregaon Park, Pune** — Lifestyle rental demand
- **Anna Nagar, Chennai** — Stable mid-premium
- **Electronic City Plots** — Long-horizon land plays

## How to evaluate

Look at 5-year price trends, upcoming metro lines, and inventory overhang before committing capital.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    author: "Rohan Kapoor",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    category: "Investment",
    tags: ["Investment", "Localities", "Market"],
    publishedAt: "2026-06-28",
    readTime: 6,
  },
  {
    id: "blog3",
    slug: "home-loan-emi-strategies",
    title: "Smart EMI Strategies for First-Time Home Buyers",
    excerpt:
      "Practical frameworks to structure your home loan without compromising lifestyle or emergency reserves.",
    content: `
## Rule of thumb

Keep total EMIs under 40% of take-home income. Maintain a 6-month emergency fund separate from your down payment.

## Strategies that work

- Make a higher down payment to reduce interest outgo
- Choose a slightly longer tenure, then prepay annually
- Use balance transfer when rates drop by 0.5%+ 
- Claim Section 80C and 24(b) benefits diligently

## Common mistakes

Underestimating registration costs, ignoring society maintenance, and stretching for a home that strains monthly cash flow.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    author: "Priya Nair",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    category: "Finance",
    tags: ["Home Loan", "EMI", "Finance"],
    publishedAt: "2026-06-15",
    readTime: 5,
  },
  {
    id: "blog4",
    slug: "sustainable-luxury-homes",
    title: "Sustainable Luxury: The New Standard in Premium Homes",
    excerpt:
      "How green certifications, smart energy systems, and wellness design are reshaping high-end real estate.",
    content: `
## Beyond aesthetics

Today's luxury buyers expect LEED/IGBC certifications, EV charging, rainwater harvesting, and biophilic interiors as standard — not optional upgrades.

## What to look for

- Solar-ready rooftops
- High-performance glazing
- Water recycling systems
- Non-toxic materials
- Wellness amenities (spa, meditation decks, air filtration)

## The ROI of green

Energy-efficient homes command stronger rentals and faster resale in premium micro-markets.
    `.trim(),
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    author: "Vikram Shah",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    category: "Lifestyle",
    tags: ["Sustainability", "Luxury", "Design"],
    publishedAt: "2026-05-30",
    readTime: 7,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Rajesh Kumar",
    role: "Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    content:
      "Sold my 3BHK in Hyderabad within 45 days. The verified listing and dedicated manager made the whole process smooth.",
    location: "Hyderabad",
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "Buyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    content:
      "Found our dream apartment in Noida through Growra. Transparent pricing and on-site verification gave us full confidence.",
    location: "Delhi / NCR",
  },
  {
    id: "t3",
    name: "Amit Patel",
    role: "Tenant",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    rating: 5,
    content:
      "Rented a furnished flat in Pune in under a week. Great filters, real photos, and quick responses from owners.",
    location: "Pune",
  },
  {
    id: "t4",
    name: "Sneha Reddy",
    role: "Dealer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    content:
      "As a dealer, Growra helps me reach serious buyers faster. The lead quality and dashboard tools are excellent.",
    location: "Bangalore",
  },
  {
    id: "t5",
    name: "Vikram Singh",
    role: "Owner",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    rating: 5,
    content:
      "Listed my property for rent and got verified tenants within days. The team handled documentation end to end.",
    location: "Mumbai",
  },
];

export const faqs: FaqItem[] = [
  {
    id: "f1",
    question: "How does Growra Realty verify property listings?",
    answer:
      "Every featured listing undergoes document verification, RERA checks where applicable, and on-ground validation by our local partners before receiving a Verified badge.",
    category: "General",
  },
  {
    id: "f2",
    question: "Is there a fee to browse or shortlist properties?",
    answer:
      "Browsing, shortlisting, and comparing properties on Growra Realty is completely free for home seekers. Premium advisory services are optional.",
    category: "General",
  },
  {
    id: "f3",
    question: "Can I schedule site visits through the platform?",
    answer:
      "Yes. On any property detail page, use Schedule Visit to pick a preferred slot. Our concierge team coordinates with the seller or builder and confirms within 24 hours.",
    category: "Buying",
  },
  {
    id: "f4",
    question: "How accurate are the EMI estimates?",
    answer:
      "Our calculator uses standard reducing-balance formulas. Actual bank offers may vary based on credit profile, tenure, and prevailing interest rates.",
    category: "Finance",
  },
  {
    id: "f5",
    question: "What cities does Growra Realty currently cover?",
    answer:
      "We currently feature premium inventory across Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, and Chennai, with more cities launching soon.",
    category: "General",
  },
  {
    id: "f6",
    question: "How do I list my property on Growra?",
    answer:
      "Create an account, go to Dashboard → List Property, and submit details with photos. Our team reviews submissions within 48 hours for quality and compliance.",
    category: "Sellers",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    propertyId: "p1",
    userName: "Aisha Khan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    rating: 5,
    title: "Breathtaking sea views",
    content: "The penthouse exceeded expectations. Finishes are world-class and the concierge team is exceptional.",
    date: "2026-06-20",
  },
  {
    id: "r2",
    propertyId: "p2",
    userName: "Karthik Menon",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 4,
    title: "Great family community",
    content: "Well-planned amenities and close to ITPL. Construction quality looks solid so far.",
    date: "2026-07-02",
  },
  {
    id: "r3",
    propertyId: "p3",
    userName: "Neha Reddy",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    rating: 5,
    title: "Private oasis in the city",
    content: "The villa feels like a resort. Privacy, pool, and gardens are immaculate.",
    date: "2026-05-28",
  },
];
