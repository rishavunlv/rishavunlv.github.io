# Cyber Risk Suite

An integrated cybersecurity risk analysis suite that turns technical security data
into business-ready insights. It combines financial risk modeling, risk-propagation
visualization, and governance dashboards so security leaders can evaluate exposure,
justify investments, and communicate strategy to executives and boards.

**Live site: [rishavunlv.github.io](https://rishavunlv.github.io)**

## Modules

| Module | Description | Live link |
| --- | --- | --- |
| **About** | Platform overview and the end-to-end decision workflow | [rishavunlv.github.io/index.html](https://rishavunlv.github.io/index.html) |
| **Small Business Reality Check** | Annual Loss Expectancy (ALE) and Return on Security Investment (ROSI) calculator for inherent vs. residual risk | [rishavunlv.github.io/small_business.html](https://rishavunlv.github.io/small_business.html) |
| **CISO Budget Defense** | Cold-site vs. hot-site recovery economics with transparent downtime and cost impact for defensible budget decisions | [rishavunlv.github.io/ciso_budget.html](https://rishavunlv.github.io/ciso_budget.html) |
| **Risk Explorer** | SOC Risk BI: GraphRAG risk-propagation explorer, AIOps/FinOps observability, and AI red-teaming audit views | [rishavunlv.github.io/dashboard.html](https://rishavunlv.github.io/dashboard.html) |
| **Risk Assessment** | Cybersecurity posture, governance indicators, and board-ready strategic recommendations | [rishavunlv.github.io/risk_dashboard.html](https://rishavunlv.github.io/risk_dashboard.html) |

## How teams use it

1. **Baseline financial exposure** — quantify inherent and residual risk with ALE, then measure the value of selected controls (*Small Business Reality Check*).
2. **Validate recovery investment** — compare downtime and recovery options with clear financial impact (*CISO Budget Defense*).
3. **Investigate systemic risk paths** — inspect connected assets and threat pathways to prioritize remediation by likely blast radius (*Risk Explorer*).
4. **Present a board-ready view** — summarize posture trends, governance indicators, and recommendations for executive review (*Risk Assessment*).

## Tech stack

- Static HTML, CSS, and vanilla JavaScript — no build step
- Shared design tokens (`suite-tokens.css`) and icon set (`icons.svg`) across all pages
- Google Fonts (DM Sans, DM Mono)
- Deployed to GitHub Pages via GitHub Actions (`.github/workflows/static.yml`)

## Running locally

```bash
npm install
npm start        # serves the suite with lite-server
```

Or open `index.html` directly in a browser.

## Project structure

```
index.html              About / platform overview
small_business.html      ALE & ROSI calculator
ciso_budget.html         Recovery-site budget comparison
dashboard.html           SOC Risk BI explorer      (dashboard-logic.js, dashboard-styles.css)
risk_dashboard.html      Risk assessment dashboard (risk_logic.js, risk_styles.css)
suite-tokens.css         Shared palette and design tokens
icons.svg                Shared icon sprite
sector-data.js           Sector reference data
```

## Deployment

Pushes to `branch_V2` trigger the **Deploy static content to Pages** workflow, which
publishes the repository root to GitHub Pages at
[rishavunlv.github.io](https://rishavunlv.github.io).
