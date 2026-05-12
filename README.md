# Client Project 2026 Website

A portfolio project featuring two interactive tools: a **Salesforce Prompt Generator** and a **CISO Budget Defense Risk Calculator**.

---

## 📋 Overview

This project contains two main applications:

1. **Salesforce Prompt Generator** (`index.html`) - A tool for Salesforce developers to generate structured prompts for Flow XML, validation rules, and deployment instructions
2. **CISO Budget Defense Risk Calculator** (`ciso_budget.html`) - An enterprise risk management tool for calculating Annual Loss Expectancy (ALE), Return on Security Investment (ROSI), and disaster recovery strategy costs

---

## 🗂️ Project Structure

```
Client Project 2026 Website/
├── index.html                    # Salesforce Prompt Generator page
├── ciso_budget.html              # CISO Budget Defense Risk Calculator page
├── script.js                     # Core logic for Prompt Generator
├── styles.css                    # Styling for Prompt Generator
├── package.json                  # Project dependencies
├── assets/
│   ├── css/
│   │   └── styles.css            # Additional CSS stylesheets
│   └── js/
│       ├── calculator.js         # Risk Calculator computation logic
│       └── sector-data.js        # Risk data and calculation helpers
└── README.md                     # This file
```

---

## 🚀 Features

### Salesforce Prompt Generator

A form-based tool that helps developers quickly generate AI-ready prompts for Salesforce Flow development:

- **Input Collection**: Captures flow requirements including type, screen count, desired actions, constraints, and target objects
- **Template-Based Generation**: Converts form inputs into structured, reusable prompts for LLMs
- **Copy-to-Clipboard**: One-click copying of generated prompts
- **Example Loader**: Pre-populates form with sample data for quick testing
- **Real-time Status**: Badge display showing generation and copy status

**Key Fields:**
- Flow Type, Number of Screens
- Desired Action, Constraints/Error Handling
- Target Salesforce Object
- Output Fields & Style (XML, JSON, etc.)
- Optional Notes

### CISO Budget Defense Risk Calculator

A comprehensive enterprise security investment calculator for quantifying risk mitigation value:

- **Sector Selection**: Healthcare, Finance, Retail, Manufacturing with industry-specific breach costs and downtime rates
- **ALE Calculation**: Computes Annual Loss Expectancy pre and post control implementation
- **Disaster Recovery Costing**: Models Cold Site, Warm Site, and Hot Site recovery strategies
- **Security Controls**: MFA, Phishing Training, and Succession Planning impact modeling
- **ROSI Analysis**: Returns on Security Investment calculations with visual charts
- **Data Visualization**: Bar charts comparing ALE before/after mitigation
- **Export Functionality**: Generate reports in text format for presentations

**Key Metrics:**
- Annual Loss Expectancy (ALE) - Pre and Post mitigation
- Return on Security Investment (ROSI)
- Annualized Rate of Occurrence (ARO)
- Downtime Loss Prevention
- Control & DR Strategy Costs

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with CSS Variables for theming
- **Charting**: Chart.js 4.4.1 for data visualization
- **Fonts**: Google Fonts (Inter, DM Sans, DM Mono)
- **Development Server**: lite-server 2.6.1

**Dependencies** (see `package.json`):
- Bootstrap 5.3.3
- jQuery 3.7.1
- Popper.js 1.16.1
- lite-server 2.6.1

---

## 📦 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The server will automatically open `http://localhost:3000` in your browser with live reload enabled.

3. **Access the Tools**
   - Prompt Generator: `http://localhost:3000/index.html`
   - Risk Calculator: `http://localhost:3000/ciso_budget.html`

---

## 📄 File Descriptions

### `index.html`
Main page for the Salesforce Prompt Generator. Contains form interface and output preview panel.

**Structure:**
- Hero section with value proposition
- Two-column layout with form inputs and live preview
- Template text area (hidden from user view)
- Button controls (Generate, Copy, Load Example, Clear)

### `ciso_budget.html`
Full-featured CISO Budget Defense Risk Calculator with comprehensive styling and interactive UI.

**Structure:**
- Sticky navigation bar with logo and search
- Sidebar with chart visualization
- Main content area with form controls and results display
- Multi-section risk calculation interface

### `script.js`
Core JavaScript logic for the Prompt Generator:
- Template management and string interpolation
- Form data collection and validation
- Clipboard operations
- Event listeners for buttons (Generate, Copy, Clear, Load Example)
- Status badge updates

**Key Functions:**
- `generatePrompt()` - Processes form data and generates output
- `copyPrompt()` - Copies prompt to clipboard
- `clearForm()` - Resets all form fields
- `loadExample()` - Populates example data

### `styles.css`
Styling for the Prompt Generator page:
- CSS custom properties (variables) for consistent theming
- Responsive grid layouts
- Dark theme with blue accent colors
- Panel-based card design system
- Form input styling

### `assets/js/calculator.js`
Main calculation engine for the Risk Calculator:
- DOM element management
- Sector/strategy selection population
- Form input handling
- ALE computation and display
- Chart rendering with Chart.js
- Report generation and export
- ROSI calculation and formatting

**Key Functions:**
- `populateSelects()` - Populates dropdown options from sector data
- `computeAll()` - Main computation function orchestrating all calculations
- `renderChart()` - Creates/updates bar chart visualization
- Navigation and accessibility features

### `assets/js/sector-data.js`
Risk data and calculation helpers:
- Industry sector data (Healthcare, Finance, Retail, Manufacturing)
- Annual Rates of Occurrence (ARO) by sector
- Average breach costs and downtime costs
- Disaster recovery strategies and costs
- Security control costs (MFA, Phishing Training, Succession Planning)

**Key Calculation Functions:**
- `computeSLE()` - Single Loss Expectancy
- `computeALE()` - Annual Loss Expectancy
- `computeALEPre()` / `computeALEPost()` - Pre/post mitigation ALE
- `computeDowntimeLoss()` - Recovery time cost calculation
- `computeROSI()` - Return on Security Investment
- `formatCurrency()` - Currency formatting utility

### `assets/css/styles.css`
Additional CSS styling for the overall layout and components.

---

## 🎨 Design Patterns

### Color Scheme
- **Prompt Generator**: Dark blue background (#0b0f19) with blue accents (#5b8cff)
- **Risk Calculator**: Navy theme with teal accents (#00c6a2), danger red (#ff5b5b), amber warnings (#f5a623)

### Layout Patterns
- **Hero Section**: Large headline with value proposition and feature list
- **Two-Panel Layout**: Form inputs on left, results/preview on right
- **Card System**: Panel-based design with borders and subtle shadows
- **Grid System**: Responsive two-column layouts for form fields

### Interactive Elements
- Status badges for feedback (Ready, Generated, Copied, Cleared, Example loaded)
- Real-time EF slider with value display
- Dynamic chart updates on calculation
- Hover states and focus management

---

## 🧮 Risk Calculation Methodology

### Annual Loss Expectancy (ALE)
```
ALE = Asset Value × Exposure Factor × Annualized Rate of Occurrence
```

### Return on Security Investment (ROSI)
```
ROSI = ((ALE_Pre - ALE_Post) + Avoided_Downtime_Loss - Cost_Of_Controls) / Cost_Of_Controls
```

### Control Effectiveness
- **MFA**: Reduces ARO by 50%
- **Phishing Training**: Reduces ARO by 20%
- **Succession Planning**: Reduces downtime impact by 10%

### Disaster Recovery Strategies
- **Cold Site**: 336-hour recovery, $10,000/year
- **Warm Site**: 48-hour recovery, $50,000/year
- **Hot Site**: 4-hour recovery, $150,000/year

---

## 📊 Industry Data (Source: sector-data.js)

| Sector | ARO | Avg Breach Cost | Downtime Cost/Hour |
|--------|-----|-----------------|-------------------|
| Healthcare | 0.59 | $9,770,000 | $300,000 |
| Finance | 0.20 | $6,080,000 | $5,600,000 |
| Retail | 0.14 | $2,500,000 | $200,000 |
| Manufacturing | 0.62 | $4,800,000 | $2,300,000 |

---

## 🔄 Workflow Examples

### Using the Prompt Generator

1. Fill in Salesforce flow details (type, screens, actions)
2. Describe constraints and error handling requirements
3. Specify target Salesforce objects and output fields
4. Click "Generate prompt" to create structured prompt
5. Click "Copy prompt" to send to clipboard
6. Paste into ChatGPT or your preferred LLM

### Using the Risk Calculator

1. Select industry sector from dropdown
2. Enter company revenue (optional) or use sector average
3. Set Exposure Factor slider (0-100%)
4. Choose Disaster Recovery strategy
5. Select security controls to implement (MFA, Phishing, Succession)
6. Toggle DR cost inclusion in ROSI calculation
7. Click "Compute" to run risk calculations
8. Review ALE, ROSI, and visualizations
9. Export report for executive presentation

---

## 🌐 Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers with ES6 JavaScript support.

---

## 📝 Notes

- **Python CLI Equivalent**: The risk calculator logic is ported from a Python CLI tool (`tools/calc.py`)
- **Data Sources**: Sector ARO, breach costs, and downtime rates based on industry benchmarks
- **Live Server**: Uses lite-server for development with automatic hot reload
- **Repository**: Maintained at [GitHub - rishavunlv/Risk-Calculator](https://github.com/rishavunlv/Risk-Calculator)
- **Branch**: Currently on `branch_V2`

---

## 🔐 Privacy & Security

- All calculations are performed client-side (no data transmission)
- Form data is not persisted or stored
- Export reports are generated locally

---

## 📧 Support

For issues, questions, or feature requests, refer to the [GitHub repository issues](https://github.com/rishavunlv/Risk-Calculator/issues).

---

## 📄 License

ISC License - See repository for details.

---

**Last Updated**: May 2026  
**Version**: 1.0.0
