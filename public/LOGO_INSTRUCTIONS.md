# IntelliTrade Logo Setup

## Instructions

Please save the IntelliTrade logo image as:

**File path:** `public/intellitrade-logo.png`

The logo has been integrated into:
1. **Auth Page** - Displays centered above the login/signup form
2. **Distributor Dashboard Sidebar** - Shows in the top-left corner next to "Distributor Hub"

## Image Requirements
- Format: PNG (with transparent background preferred)
- Recommended size: 512x512px or similar square dimensions
- The logo will be automatically resized to fit:
  - Auth page: 96x96px (h-24 w-24)
  - Sidebar: 40x40px (h-10 w-10)

## Current Implementation
- Uses `object-contain` to maintain aspect ratio
- Responsive and works in both light and dark modes
- Accessible with proper alt text

Once you save the logo file, it will automatically appear in both locations!
