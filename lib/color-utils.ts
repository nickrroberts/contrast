interface RGB {
  r: number
  g: number
  b: number
}

// Convert hex color to RGB
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Convert RGB to hex color
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// Calculate relative luminance for WCAG contrast
function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb

  // Convert RGB to sRGB
  const sR = r / 255
  const sG = g / 255
  const sB = b / 255

  // Calculate luminance
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4)
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4)
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

// Calculate contrast ratio between two colors
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 1

  const luminance1 = getLuminance(rgb1)
  const luminance2 = getLuminance(rgb2)

  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)

  return (lighter + 0.05) / (darker + 0.05)
}

// Get a suggested color with better contrast
export function getSuggestedColor(foreground: string, background: string, targetRatio = 4.5): string {
  const fgRgb = hexToRgb(foreground)
  const bgRgb = hexToRgb(background)

  if (!fgRgb || !bgRgb) return foreground

  // Determine if we should darken or lighten the foreground
  const bgLuminance = getLuminance(bgRgb)
  const shouldDarken = bgLuminance > 0.5

  let { r, g, b } = fgRgb
  let currentRatio = calculateContrastRatio(foreground, background)
  let iterations = 0
  const maxIterations = 100

  while (currentRatio < targetRatio && iterations < maxIterations) {
    if (shouldDarken) {
      r = Math.max(0, r - 5)
      g = Math.max(0, g - 5)
      b = Math.max(0, b - 5)
    } else {
      r = Math.min(255, r + 5)
      g = Math.min(255, g + 5)
      b = Math.min(255, b + 5)
    }

    const newColor = rgbToHex(r, g, b)
    currentRatio = calculateContrastRatio(newColor, background)
    iterations++
  }

  return rgbToHex(r, g, b)
}
