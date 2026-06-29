# Genome Justice
### Privacy, Bias & Equity in Genomic Research

An interactive research exhibit exploring how representation, privacy, and data ownership shape the future of precision medicine.

**Live site:** [your-username.github.io/GenomeJustice](https://your-username.github.io/GenomeJustice)

---

## Modules

| Module | Topic | Interaction |
|--------|-------|-------------|
| 01 | Who Owns Your DNA? | Choose a data policy, see privacy/trust tradeoffs |
| 02 | Who Is Missing From the Dataset? | Drag sliders to adjust representation, train an AI model |
| 03 | Can We Build Fair Genomic AI? | Allocate a $1M research budget, run your study |

---

## Tech Stack

- HTML / CSS / JavaScript (vanilla)
- [Chart.js](https://www.chartjs.org/) for visualizations
- Google Fonts (Space Grotesk, Space Mono, Inter)
- GitHub Pages for hosting

No frameworks. No build step. Open `index.html` in a browser and it works.

---

## Project Structure

```
GenomeJustice/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── dna-canvas.js   # animated hero background
│   ├── module1.js      # DNA ownership choices
│   ├── module2.js      # bias simulator
│   ├── module3.js      # fair AI study simulator
│   └── main.js         # scroll progress + reveal animations
└── assets/
    └── icons/
```

---

## How to Deploy on GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your site will be live at `https://your-username.github.io/GenomeJustice`

---

## References

- Sirugo, G., Williams, S. M., & Tishkoff, S. A. (2019). *The missing diversity in human genetic studies.* Cell, 177(1), 26–31.
- Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). *Dissecting racial bias in an algorithm used to manage the health of populations.* Science, 366(6464), 447–453.
- Erlich, Y., & Narayanan, A. (2014). *Routes for breaching and protecting genetic privacy.* Nature Reviews Genetics, 15(6), 409–421.

---

Built for the Ujima Lab. Connecting molecular biology, data ethics, and computing to address fairness in precision medicine.
