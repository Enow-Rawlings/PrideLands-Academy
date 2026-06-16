
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely, resolving conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with comma separators
 */
export function formatNumber(n) {
  return new Intl.NumberFormat('en').format(n)
}

/**
 * Format currency (XAF / FCFA)
 */
export function formatCurrency(amount, currency = 'XAF') {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

/**
 * Truncate text
 */
export function truncate(str, length = 120) {
  if (!str) return ''
  return str.length > length ? str.slice(0, length) + '...' : str
}

/**
 * Get initials from name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

/**
 * Unsplash image URL builder
 */
export function unsplashUrl(query, width = 1200, height = 800) {
  return `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=${width}&h=${height}&fit=crop&q=80`
}

/**
 * Specific Unsplash photo IDs for consistent images
 */
export const UNSPLASH_PHOTOS = {
  hero:       'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=900&fit=crop&q=85',
  hero2:      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=900&fit=crop&q=85',
  campus:     'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=700&fit=crop&q=80',
  students:   'https://images.unsplash.com/photo-1581362716668-5efa8d0e3af7?w=1200&h=700&fit=crop&q=80',
  library:    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=700&fit=crop&q=80',
  graduation: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&h=700&fit=crop&q=80',
  classroom:  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=700&fit=crop&q=80',
  engineering:'https://images.unsplash.com/photo-1581092921461-eab10380ed66?w=800&h=500&fit=crop&q=80',
  architecture:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop&q=80',
  business:   'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=800&h=500&fit=crop&q=80',
  tech:       'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&q=80',
  health:     'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop&q=80',
  news1:      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&q=80',
  news2:      'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&h=500&fit=crop&q=80',
  news3:      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop&q=80',
  about:      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=700&fit=crop&q=80',
  team1:      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&q=80',
  team2:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&q=80',
  team3:      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
}
