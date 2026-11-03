# Christ's Heart Ministries – November Blessing Conference 2026
## Personalized Flyer Generator

A lightweight, high-performance, publicly accessible web application built for **Christ's Heart Ministries** to empower members, organizers, and attendees to generate and share personalized promotional flyers for the **November Blessing Conference 2026: Powered Witness (Acts 1:8)**.

---

## 🌟 Key Features

- **Personalized Portrait Positioning**: Automatically centers and crops uploaded portraits into the official circular badge, preserving the decorative purple and gold borders.
- **Fine-Tuning Controls**: Interactive zoom slider (60% to 300%) and directional nudge buttons (Up, Down, Left, Right) to achieve the perfect portrait framing.
- **Dynamic Name Banner**: Replaces the `[FULL NAME]` placeholder with a crisp, centered gold banner rendered in bold uppercase typography, dynamically scaling font size to prevent overflow for any name length (up to 40 characters).
- **Instant Real-Time Preview**: Powered by HTML5 Canvas with instant updates as members type or adjust their photo.
- **High-Resolution PNG Output**: Produces pristine 1280 × 1280 px square PNG flyers suitable for WhatsApp Status, Facebook, Instagram, and printing.
- **Web Share API**: One-click native file sharing to WhatsApp, Instagram Stories, and social apps on mobile and supported desktop browsers.
- **100% Client-Side Privacy**: Photos and personal information never leave the user's device—no databases, no cloud uploads, zero privacy risk.
- **Mobile-First Responsive Design**: Flawlessly optimized across modern Android, iOS, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Angular 19](https://angular.dev/) (Standalone Components, Strict TypeScript) |
| **UI Components** | [Angular Material 19](https://material.angular.io/) (Buttons, Form Fields, Inputs, Icons, Sliders, Spinners, Tooltips, Snackbars) |
| **Layout & Grid** | [Bootstrap 5](https://getbootstrap.com/) & CSS Flexbox/Grid |
| **Graphics Engine** | HTML5 Canvas 2D API |
| **Typography** | Plus Jakarta Sans, Montserrat, Material Symbols |
| **State & Flow** | RxJS & Component Event Driven State |

---

## 📁 Project Structure

Strictly following the modular architecture specified in the PRD:

```text
november-blessing-generator/
│
├── public/
│   └── images/
│       └── november-blessing-template.jpg    # Master 1280x1280 official artwork
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── constants/
│   │   │   │   └── flyer-config.ts          # Calibrated coordinates & brand constants
│   │   │   ├── models/
│   │   │   │   └── flyer.model.ts           # Interfaces & state definitions
│   │   │   └── services/
│   │   │       ├── image-upload.service.ts  # Validation, memory decoding, URL lifecycle
│   │   │       ├── flyer-renderer.service.ts # Canvas composition & high-DPI export
│   │   │       └── download.service.ts      # Sanitized filename generation & Web Share
│   │   │
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── app-header/              # Branding, navigation & conference dates
│   │   │       └── app-footer/              # Venues, schedule, hashtags & privacy notice
│   │   │
│   │   ├── features/
│   │   │   └── flyer-generator/
│   │   │       ├── pages/
│   │   │       │   └── flyer-generator-page/ # Main state coordinator & 2-column layout
│   │   │       └── components/
│   │   │           ├── flyer-intro/         # 3-step guide & conference copy
│   │   │           ├── photo-upload/        # Drag-and-drop zone & validation
│   │   │           ├── photo-editor/        # Zoom slider & directional nudging
│   │   │           ├── name-input/          # MatInput with character counter & validation
│   │   │           ├── flyer-preview/       # Live 1:1 canvas preview with spinner
│   │   │           ├── generation-controls/ # Generate and reset action triggers
│   │   │           └── download-panel/      # Download button, file info & share links
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.config.ts
│   │
│   ├── assets/
│   │   └── fonts/
│   │
│   ├── styles.css                           # Global branding theme & color palette
│   ├── index.html                           # Font imports & meta tags
│   └── main.ts                              # Standalone bootstrap
│
├── angular.json                             # Angular build configuration & budgets
├── package.json
└── tsconfig.json
```

*Every component strictly adheres to independent `.component.ts`, `.component.html`, and `.component.css` files.*

---

## 🎯 Calibrated Flyer Coordinates (1280 × 1280 px)

Measured directly against the authoritative master conference artwork:

| Region | Property | Calibrated Value |
|---|---|---|
| **Canvas** | Dimensions | `1280 × 1280 px` |
| **Circular Portrait** | Center X | `344 px` |
| | Center Y | `498 px` |
| | Clipping Radius | `231 px` (sits flush inside gold border) |
| **Name Banner** | X | `131 px` |
| | Y | `790 px` |
| | Width | `425 px` |
| | Height | `84 px` |
| | Background Fill | `#E3A72B` (exact master gold) |
| | Corner Radius | `12 px` |
| **Typography** | Font Family | `'Montserrat', 'Arial Black', Arial, sans-serif` |
| | Color | `#321447` (Deep Purple) |
| | Font Size Range | `18 px` (min) to `42 px` (max) |
| | Alignment | Centered Horizontally & Vertically |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.19.0+, v20.x, or v22+)
- npm (v9+)

### Installation

```bash
# Clone or navigate to the workspace
cd chflier

# Install dependencies
npm install
```

### Running Locally

```bash
# Start dev server on port 4200
npm start
# or: npx ng serve --open
```

Navigate to `http://localhost:4200/` in your browser.

---

## 📦 Production Build & Deployment

```bash
# Build optimized production bundle
npm run build
```

The compiled static assets will be located in:
```text
dist/november-blessing-generator/browser/
```

### Static Hosting

The build output consists purely of static HTML, CSS, JavaScript, and image assets. It can be hosted on any static hosting platform:
- **Netlify**: Drag-and-drop `dist/november-blessing-generator/browser` or connect to Git repository.
- **Vercel**: Deploy directory `dist/november-blessing-generator/browser`.
- **Firebase Hosting**: Run `firebase deploy --only hosting`.
- **Cloudflare Pages / GitHub Pages / AWS S3 + CloudFront**.

---

## 🛡️ Privacy & Compliance

- **No Remote Processing**: Uploaded images are decoded in-browser using standard Blob/Canvas APIs and never transmitted over the network.
- **Zero Authentication Required**: Open access for all church members, attendees, and social visitors.
- **No Cookies / Tracking**: Fast, clean, and respectful of user privacy.
