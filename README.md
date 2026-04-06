# NOR Perfume: Obsidian Luxury

Welcome to the official repository for **NOR Perfume**, a high-performance, headless luxury automotive fragrance brand. This project implements a modern, mobile-first web experience using a custom **"Obsidian Luxury"** design system, integrated with the Shopify Storefront API.

---

## 💎 Design Philosophy: Obsidian Luxury
The NOR experience is built on three core aesthetic pillars:
- **Obsidian Dark Surface**: A sophisticated dark theme using deep grays (`#0a0a0a`) and glassmorphic UI elements.
- **Gold & Cream Accents**: Curated use of gold (`#c4a35a`) and cream tones to signify premium quality.
- **Fluid Motion**: High-end micro-interactions and smooth scroll behavior powered by Lenis and Motion.

---

## ⚡ Technical Stack
- **Frontend**: Vanilla HTML5, Semantic CSS, JavaScript (ES6+).
- **Backend**: Node.js & Express middleware for security (CORS, Rate Limiting).
- **E-commerce**: Headless Shopify Storefront API (GraphQL) for product discovery and cart management.
- **Animations**: [Motion](https://motion.dev/) & [Lenis](https://lenis.studio/).
- **Optimization**: WebP asset pipeline for ultra-fast loading.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (LTS version)
- A Shopify Storefront Access Token (configured in `public/js/shopify.js`)

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/devbynak/NORPERFUME_main.git
cd nor-perfume
```

Install dependencies:
```bash
npm install
```

### 3. Local Development
Start the development server:
```bash
npm run dev
```
The site will be available at `http://localhost:3000`.

---

## 🛡 Security & Audit
The repository follows strict security practices:
- **WCAG Accessibility**: Descriptive `aria-labels` and semantic heading structures.
- **CORS Protection**: Restricted access to authorized domains.
- **Asset Optimization**: Built-in WebP conversion and lazy loading.

---

## 📁 Repository Structure
```text
├── public/                 # Optimized frontend assets
│   ├── assets/             # Brand images and WebP assets
│   ├── css/                # Centralized design system
│   ├── js/                 # Shopify integration & UI logic
│   └── *.html              # Clean semantic page structures
├── server.js               # Security-hardened Express server
├── package.json            # Project dependencies
└── README.md               # You are here
```

---

## 📜 License
© 2026 NOR PERFUME. All rights reserved. Registered trademark of NOR.