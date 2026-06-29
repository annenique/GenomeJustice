// module2.js — Who Is Missing From the Dataset? bias simulator

(function () {

  const pops = ['european', 'african', 'latino', 'asian'];
  const sliders = {};
  const pctLabels = {};

  pops.forEach(p => {
    sliders[p]   = document.getElementById('sl-' + p);
    pctLabels[p] = document.getElementById('pct-' + p);
  });

  const totalDisplay  = document.getElementById('totalDisplay');
  const trainBtn      = document.getElementById('trainBtn');
  const loadingEl     = document.getElementById('accuracyLoading');
  const resultsEl     = document.getElementById('accuracyResults');
  const biasNote      = document.getElementById('biasNote');
  const fairnessScore = document.getElementById('fairnessScore');
  const loadSteps     = document.querySelectorAll('.load-step');

  // Accuracy model: higher representation → higher accuracy (non-linear)
  // Base accuracy floor + contribution from share
  function computeAccuracy(share, total) {
    const frac = share / total;
    // asymptotic formula: saturates near 97%, low reps give ~55-65%
    const acc = 55 + 42 * (1 - Math.exp(-4.5 * frac));
    return Math.round(Math.min(97, Math.max(52, acc)));
  }

  function getValues() {
    const vals = {};
    let total = 0;
    pops.forEach(p => {
      vals[p] = parseInt(sliders[p].value, 10);
      total += vals[p];
    });
    return { vals, total };
  }

  function updateLabels() {
    const { vals, total } = getValues();
    pops.forEach(p => {
      // proportional display
      const pct = Math.round((vals[p] / total) * 100);
      pctLabels[p].textContent = pct + '%';
    });
    if (total > 300) {
      totalDisplay.textContent = 'Total: ' + total + '% — Adjust sliders';
      totalDisplay.classList.add('over');
    } else {
      totalDisplay.textContent = 'Ratio locked — press Train AI Model';
      totalDisplay.classList.remove('over');
    }
  }

  pops.forEach(p => {
    sliders[p].addEventListener('input', updateLabels);
  });

  // Loading animation
  function runLoadingSequence(callback) {
    loadingEl.classList.add('active');
    resultsEl.style.display = 'none';
    loadSteps.forEach(s => s.classList.remove('visible'));

    let i = 0;
    const interval = setInterval(() => {
      if (i < loadSteps.length) {
        loadSteps[i].classList.add('visible');
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          loadingEl.classList.remove('active');
          callback();
        }, 300);
      }
    }, 500);
  }

  function showResults() {
    const { vals, total } = getValues();
    resultsEl.style.display = 'flex';
    resultsEl.style.flexDirection = 'column';

    const accuracies = {};
    pops.forEach(p => {
      accuracies[p] = computeAccuracy(vals[p], total);
    });

    // animate bars
    setTimeout(() => {
      pops.forEach(p => {
        const fillEl = document.getElementById('acc-' + p);
        const pctEl  = document.getElementById('accpct-' + p);
        const acc = accuracies[p];

        let cur = 0;
        const duration = 800;
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          cur = Math.round(acc * eased);
          fillEl.style.width = cur + '%';
          pctEl.textContent = cur + '%';
          // color by accuracy
          if (acc >= 85) fillEl.style.background = 'linear-gradient(90deg, #06d6a0, #00e5ff)';
          else if (acc >= 70) fillEl.style.background = 'linear-gradient(90deg, #ffd166, #06d6a0)';
          else fillEl.style.background = 'linear-gradient(90deg, #ff4d6d, #ffd166)';
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });

      // fairness score (standard deviation of accuracy — lower = fairer)
      const accVals = pops.map(p => accuracies[p]);
      const mean = accVals.reduce((a, b) => a + b, 0) / accVals.length;
      const variance = accVals.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / accVals.length;
      const stdDev = Math.sqrt(variance);
      const fairness = Math.max(0, Math.round(100 - stdDev * 3));

      let rating = '', emoji = '';
      if (fairness >= 90) { rating = 'Excellent'; emoji = '✅'; }
      else if (fairness >= 75) { rating = 'Good'; emoji = '🟡'; }
      else if (fairness >= 55) { rating = 'Poor'; emoji = '⚠️'; }
      else { rating = 'Very Poor'; emoji = '🚨'; }

      fairnessScore.innerHTML = `
        ${emoji} <strong>Fairness Score: ${fairness}%</strong> — ${rating}<br>
        <span style="font-size:0.8rem; color: var(--text-muted);">
          Mean accuracy across groups: ${Math.round(mean)}%.
          Standard deviation: ±${stdDev.toFixed(1)} pp — lower means more equitable predictions.
        </span>`;

      biasNote.textContent = fairness < 75
        ? 'Notice how underrepresented groups receive significantly less accurate predictions. This is not a technical limitation — it\'s a consequence of the data collected. The model learned from people who look like the majority, so it performs best on people who look like the majority.'
        : 'A more balanced dataset leads to more equitable predictions across all groups. This is the core argument for diverse genomic databases like the All of Us Research Program and H3Africa.';

    }, 100);
  }

  trainBtn.addEventListener('click', () => {
    runLoadingSequence(showResults);
  });

  // Initialize labels
  updateLabels();

})();
