# Hero Section Image Requirements

## Image Placeholder Location
The hero section now has a placeholder that needs to be replaced with an actual image.

**File Location**: `components/Hero.tsx` (line ~20-30)

## Image Specifications

### Recommended Image Type
- **High-quality salon interior photo** OR
- **Professional beauty treatment scene** (woman getting hair/makeup done)
- **Soft, elegant, feminine aesthetic**

### Technical Requirements
- **Dimensions**: 1920x1080px (or larger, maintain 16:9 aspect ratio)
- **Format**: JPG or WebP (optimized for web)
- **File Size**: Under 500KB (compressed)
- **Style**: Soft focus, warm lighting, luxurious feel

### Visual Style Guidelines
- **Color Palette**: Should complement the site's color scheme (rose, blush, soft gold)
- **Mood**: Elegant, welcoming, feminine, premium
- **Lighting**: Soft, warm, natural light preferred
- **Composition**: 
  - Salon chairs, mirrors, beauty products
  - OR: Professional stylist working on client
  - OR: Beautiful woman with styled hair/makeup
  - Avoid: Cluttered backgrounds, harsh lighting, low quality

### Where to Add the Image

1. **Option 1: Use Next.js Image Component** (Recommended)
   - Add image to `/public/hero-image.jpg`
   - Replace the placeholder div with:
   ```tsx
   <Image
     src="/hero-image.jpg"
     alt="Swapna Beauty Parlour - Luxury Salon"
     fill
     className="object-cover"
     priority
   />
   ```

2. **Option 2: Use Background Image**
   - Add image to `/public/hero-bg.jpg`
   - Use CSS background-image with proper styling

### Current Placeholder
The current placeholder shows:
- A gray box with text indicating where the image should go
- This will be visible until you add the actual image

### Animation/GIF Options (Optional)
If you want to add subtle animations:
- **GIF**: Small, looping animation (e.g., hair flowing, gentle sparkles)
- **Video Background**: MP4 format, muted, autoplay, loop
- **CSS Animations**: Already implemented for floating elements

### Recommended Image Sources
1. **Professional Photography**: Hire a photographer for custom salon photos
2. **Stock Photos**: 
   - Unsplash (search: "beauty salon", "hair salon", "luxury salon")
   - Pexels (search: "beauty treatment", "hair styling")
   - Ensure proper licensing for commercial use

### Example Search Terms for Stock Images
- "luxury beauty salon interior"
- "elegant hair salon"
- "professional hair styling"
- "beauty treatment salon"
- "feminine salon decor"

---

**Note**: The hero section is now designed to be visually striking with minimal text, following modern salon landing page trends. The image is the focal point, with text overlaid elegantly.
