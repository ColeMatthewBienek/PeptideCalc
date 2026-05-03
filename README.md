# PeptideCalc
A private, static, browser-only peptide reconstitution math calculator.

No backend. No accounts. No API calls. No tracking. No build step. Open the file and calculate.

## What It Does

PeptideCalc converts user-provided values into clean, readable reconstitution math:

- vial amount in `mg` or `mcg`
- water added in `mL`
- desired dose in `mcg` or `mg`
- syringe scale, including U-100, U-40, or custom units per mL

It outputs:

- concentration in `mcg/mL` and `mg/mL`
- draw volume in `mL`
- syringe units
- approximate doses per vial
- remaining vial volume and amount after one dose

## Why It Is Different

Most peptide calculators look like abandoned forms from 2007. This one is built like a serious tool:

- instant recalculation
- mobile-first responsive layout
- unit-aware validation
- dose percentage visualization
- vial fill visualization
- quick presets for common water and dose values
- strong safety warnings without pretending to be a doctor
- fully offline-capable static files

## Run It Locally

Open this file in a browser:

```text
index.html
```

That is it.

## Host It Free

Any static host works:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- any plain web server

There is no server-side code to deploy.

## Formula

```text
total mcg = vial amount x 1000
concentration mcg/mL = total mcg / water mL
dose mL = desired dose mcg / concentration mcg/mL
syringe units = dose mL x units per mL
```

Example:

```text
10 mg vial
2 mL water
250 mcg desired dose
```

Result:

```text
10 mg = 10,000 mcg
10,000 mcg / 2 mL = 5,000 mcg/mL
250 mcg / 5,000 mcg/mL = 0.05 mL
0.05 mL x 100 = 5 U-100 units
```

## Safety

This is a math tool only.

It does not recommend:

- compounds
- doses
- schedules
- protocols
- routes
- medical decisions

Reconstitution mistakes can be serious. Always verify:

- mg vs. mcg
- mL entered
- syringe type
- decimal placement
- concentration
- draw volume

If the result looks surprising, stop and calculate it again from first principles.

## Project Shape

```text
index.html
styles.css
app.js
README.md
```

No dependencies. No framework. No package manager required.
