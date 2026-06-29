// module3.js — Can We Build Fair Genomic AI? study simulator

(function () {

  const TOTAL_BUDGET = 1_000_000;
  const budgetDisplay = document.getElementById('budgetDisplay');
  const simRunBtn     = document.getElementById('simRunBtn');
  const simResults    = document.getElementById('simResults');
  const simFeedback   = document.getElementById('simFeedback');

  const RESULT_ELS = {
    science:         document.getElementById('res-science'),
    privacy:         document.getElementById('res-privacy'),
    representation:  document.getElementById('res-representation'),
    trust:           document.getElementById('res-trust'),
  };

  // Cost map from data attributes
  const COSTS = {
    urban_hospital:   80000,
    community:       120000,
    tribal:          200000,
    rural:           150000,
    international:   300000,
    minimal_consent:       0,
    standard_consent:  50000,
    community_consent: 120000,
    multilingual:     30000,
    transport:        40000,
    community_reps:   60000,
  };

  // Score contributions per choice
  const SCORES = {
    // [science, privacy, representation, trust]
    urban_hospital:   [15,  0,  5,  5],
    community:        [10,  0, 15, 10],
    tribal:           [ 8,  0, 20, 18],
    rural:            [ 8,  0, 10,  8],
    international:    [20,  0, 25, 12],
    minimal_consent:  [ 5,  5,  0,  0],
    standard_consent: [10, 15,  0, 10],
    community_consent:[10, 30,  5, 25],
    multilingual:     [ 5,  0, 10, 10],
    transport:        [ 5,  0, 10,  8],
    community_reps:   [ 5,  0,  5, 15],
  };

  function getSelected() {
    const selected = {};
    document.querySelectorAll('.sim-check:checked').forEach(el => {
      selected[el.dataset.key] = true;
    });
    document.querySelectorAll('.sim-radio:checked').forEach(el => {
      selected[el.dataset.key] = true;
    });
    return selected;
  }

  function calcBudget(selected) {
    let spent = 0;
    Object.keys(selected).forEach(key => { spent += COSTS[key] || 0; });
    return TOTAL_BUDGET - spent;
  }

  function updateBudget() {
    const remaining = calcBudget(getSelected());
    const fmt = '$' + remaining.toLocaleString();
    budgetDisplay.textContent = fmt;
    budgetDisplay.classList.remove('tight', 'over');
    if (remaining < 100000) budgetDisplay.classList.add('tight');
    if (remaining < 0) budgetDisplay.classList.add('over');
  }

  // Listen to all checkboxes and radios
  document.querySelectorAll('.sim-check, .sim-radio').forEach(el => {
    el.addEventListener('change', updateBudget);
  });

  function animateScore(el, target, suffix='%') {
    let cur = 0;
    const duration = 900;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      cur = Math.round(target * eased);
      el.textContent = cur + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  simRunBtn.addEventListener('click', () => {
    const selected = getSelected();
    const remaining = calcBudget(selected);

    if (remaining < 0) {
      alert('You are over budget! Deselect some options first.');
      return;
    }

    if (Object.keys(selected).length === 0) {
      alert('Please make at least one selection to run your study.');
      return;
    }

    // Tally scores
    const totals = { science: 0, privacy: 0, representation: 0, trust: 0 };
    const keys = ['science', 'privacy', 'representation', 'trust'];

    Object.keys(selected).forEach(key => {
      const contrib = SCORES[key];
      if (contrib) {
        keys.forEach((k, i) => { totals[k] += contrib[i]; });
      }
    });

    // Normalize to 0–100 (max possible per category roughly ~100 if you pick everything)
    const MAX = { science: 80, privacy: 50, representation: 90, trust: 93 };
    const pcts = {};
    keys.forEach(k => {
      pcts[k] = Math.min(100, Math.round((totals[k] / MAX[k]) * 100));
    });

    // Apply budget bonus: leftover budget → slight science boost
    const budgetBonus = Math.min(10, Math.round((remaining / TOTAL_BUDGET) * 15));
    pcts.science = Math.min(100, pcts.science + budgetBonus);

    // Show results
    simResults.classList.add('visible');
    simResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      animateScore(RESULT_ELS.science,        pcts.science);
      animateScore(RESULT_ELS.privacy,        pcts.privacy);
      animateScore(RESULT_ELS.representation, pcts.representation);
      animateScore(RESULT_ELS.trust,          pcts.trust);

      const avg = Math.round((pcts.science + pcts.privacy + pcts.representation + pcts.trust) / 4);
      let feedback = '';
      if (avg >= 80) {
        feedback = `Outstanding study design (${avg}% average). By investing in community-led consent, diverse recruitment, and accessibility, you've built a study that could genuinely advance equitable precision medicine. Studies like this — such as the NIH All of Us program — are setting new standards for ethical genomic research.`;
      } else if (avg >= 60) {
        feedback = `Solid foundation (${avg}% average), but there are gaps. Consider adding community representatives or a stronger consent process — underserved populations are more likely to participate when they trust the researchers and see people like themselves involved in the science.`;
      } else if (avg >= 40) {
        feedback = `This study has significant equity gaps (${avg}% average). Focusing only on large hospitals and minimal consent limits both who participates and who benefits. Even modest investment in outreach and community-led consent can dramatically improve representation and trust.`;
      } else {
        feedback = `This study design would reproduce the inequities we're trying to fix (${avg}% average). With minimal investment in diversity and consent, results would likely reflect existing research biases — benefiting well-represented populations while leaving others behind.`;
      }
      simFeedback.textContent = feedback;
    }, 100);
  });

})();
