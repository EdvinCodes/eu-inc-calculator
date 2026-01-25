# 🇪🇺 EU Inc. Equity Simulator

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

> **Financial transparency for the modern European startup employee.**

A specialized Fintech SaaS designed to calculate, visualize, and optimize the value of Stock Options (ESOP) and Phantom Shares under complex EU tax jurisdictions.

---

## 🚀 Live Demo

**👉 [View Production Deployment](https://eu-inc-calculator.vercel.app)**

---

## 📸 Interface

![Dashboard Preview](./public/preview.png)

---

## 💡 The Problem

Startup equity in Europe is notoriously complex. Employees often struggle to distinguish between **Gross Equity** (Paper money) and **Net Profit** (Liquid cash).
This project solves the "Financial Illiteracy Gap" by providing:

1.  **Real-time Valuation:** Instant feedback on valuation changes.
2.  **Tax Simulation:** Estimation of net outcomes after exercise costs.
3.  **Visual Data:** Interactive charts to understand ownership percentage vs. dilution.

## 🛠️ Tech Stack

This project was built with a focus on performance, type safety, and modern UX patterns.

- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + CSS Modules for gradients.
- **Data Visualization:** [Recharts](https://recharts.org/) for responsive financial charting.
- **Icons:** [Lucide React](https://lucide.dev/) for lightweight SVG assets.
- **Payments:** [Lemon Squeezy](https://www.lemonsqueezy.com/) integration for digital product delivery.
- **Deployment:** Vercel (CI/CD).

## ✨ Key Features

- **Dynamic Gradient Sliders:** Custom CSS implementation for cross-browser input styling (Chrome/Safari/Firefox).
- **Z-Index Layering Strategy:** Advanced CSS positioning to handle complex tooltip interactions over static elements.
- **Responsive Layout:** Mobile-first grid architecture (`grid-cols-1` to `grid-cols-12`).
- **Performance:** Zero layout shift & optimized font loading (`next/font`).

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**

```bash
git clone https://github.com/EdvinCodes/eu-inc-calculator.git
cd eu-inc-calculator
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Run the development server**

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/EdvinCodes/eu-inc-calculator/issues).

## 📝 License

This project is [MIT](https://www.google.com/search?q=./LICENSE) licensed.

---

Built with ❤️ by [Edvin](https://edvindev.netlify.app/)
