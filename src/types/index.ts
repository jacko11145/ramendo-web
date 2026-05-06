export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
  errors: string[] | null
}

export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface UserSession {
  id: string
  email: string
  name: string
  image: string | null
  role: 'Admin' | 'ShopOwner' | 'VIP' | 'User'
  experiencePoints: number
  level: number
  isVip: boolean
  vipExpiry: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: UserSession
}

// ─── Shops ──────────────────────────────────────────────────────────────────

export interface BusinessHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

export interface DayHours {
  open: string
  close: string
}

export interface NewsItem {
  title: string
  content: string
  startDate: string
  endDate: string
}

export interface OptionValue {
  id: number
  value: string
}

export interface OptionGroup {
  id: number
  name: string
  isRequired: boolean
  isMultiSelect: boolean
  values: OptionValue[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string | null
  category: string | null
  customCategory: string | null
  isHighlight: boolean
  isLimited: boolean
  position: number
  optionGroups: OptionGroup[]
}

export interface ShopListItem {
  id: string
  name: string
  city: string
  district: string
  address: string
  phone: string | null
  coverImage: string | null
  types: string[]
  isVerified: boolean
  isOpen: boolean
  googleRating: number | null
  userRating: number | null
  reviewCount: number
}

export interface ShopDetail extends ShopListItem {
  description: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  images: string[]
  businessHours: BusinessHours | null
  newsItems: NewsItem[]
  menuItems: MenuItem[]
  ownerId: string | null
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export interface MenuItemRatingDto {
  menuItemId: string
  rating: number
  comment: string | null
}

export interface ReviewOption {
  optionTypeId: number
  optionValueId: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  userImage: string | null
  userLevel: number
  rating: number
  visitDate: string
  comment: string | null
  menuItemRatings: MenuItemRatingDto[]
  options: ReviewOption[]
  createdAt: string
}

// ─── Rankings ───────────────────────────────────────────────────────────────

export type RankingType = 'user' | 'google' | 'combined'

export interface RankingItem {
  rank: number
  shopGuid: string
  shopName: string
  city: string
  district: string
  coverImage: string | null
  score: number
  reviewCount: number
}

// ─── Favorites ──────────────────────────────────────────────────────────────

export interface FavoriteShop {
  shopGuid: string
  shopName: string
  city: string
  district: string
  coverImage: string | null
  isOpen: boolean
  favoritedAt: string
}

// ─── Submissions ─────────────────────────────────────────────────────────────

export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected'

export interface ShopSubmission {
  id: string
  shopName: string
  city: string
  district: string
  address: string
  note: string | null
  status: SubmissionStatus
  submittedAt: string
  reviewedAt: string | null
  rejectionReason: string | null
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ShopFilters {
  city: string
  district: string
  types: string[]
  sort: 'rating' | 'reviews' | 'newest'
  page: number
  limit: number
}
