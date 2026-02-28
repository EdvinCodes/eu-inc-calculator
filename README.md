# 🇪🇺 EU Inc. Equity Simulator

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

> **Financial transparency for the modern European startup employee. No regalé ni un euro a mi startup.**

A specialized Fintech SaaS designed to calculate, visualize, and optimize the true liquid value of Stock Options (ESOP) and Phantom Shares under complex EU tax jurisdictions.

---

## 🚀 Live Demo

**👉 [View Production Deployment](https://eu-inc-calculator.vercel.app)**

---

## 📸 Interface

![Dashboard Preview](./public/preview.png)

---

## 💡 The Problem

Startup equity in Europe is notoriously complex. Employees often struggle to distinguish between **Gross Equity** (Paper money) and **Net Profit** (Liquid cash). When a founder promises "10,000 shares", they rarely explain the fine print.

This project solves the "Financial Illiteracy Gap" by exposing the hidden traps of startup compensation:

1. **The Dilution Trap:** How future VC rounds (Series A/B) shrink your ownership slice.
2. **The Golden Handcuffs (Vesting):** Understanding how much money you actually lose if you resign before your cliff or vesting period ends.
3. **The Tax Reality:** Moving beyond flat taxes to calculate real progressive brackets and startup exemptions.

## ✨ Key Features

- **Dynamic Vesting Schedule:** Automatically calculates Vested vs. Unvested profit based on Grant Date, Vesting Months, and Cliff periods.
- **VC Dilution Projection:** Simulates the impact of future funding rounds to give a realistic view of final ownership percentage.
- **Advanced Tax Engine:** Features progressive tax brackets (e.g., Spain's new Startup Law with a €50k exemption) and allows toggling between taxing the Total Profit vs. Vested Liquid Profit.
- **Multi-Currency Support:** Seamlessly toggle the entire application between EUR (€), USD ($), and GBP (£).
- **URL State Synchronization:** Instantly share specific scenarios with colleagues or founders via auto-updating URL parameters.
- **Local Persistence:** Your scenarios and comparator table automatically save to `localStorage`.

## 🛠️ Tech Stack

This project was built with a focus on performance, strict type safety, and modern UX patterns.

- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server/Client Component optimization)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Glassmorphism UI design.
- **Data Visualization:** [Recharts](https://recharts.org/) (Dynamically imported for zero hydration mismatches).
- **Icons:** [Lucide React](https://lucide.dev/) for lightweight SVG assets.
- **Payments:** [Lemon Squeezy](https://www.lemonsqueezy.com/) integration for digital product delivery.
- **Deployment:** Vercel (CI/CD).

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
