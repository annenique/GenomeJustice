// module1.js — Who Owns Your DNA? interactive choices

(function () {

  const CHOICE_DATA = {
    store: {
      privacy: 20, research: 85, commercial: 90, trust: 30,
      insight: "Storing data indefinitely maximizes research potential but raises serious long-term privacy risks. Participants can't know how future laws or company policies might change — or who might eventually access their data."
    },
    delete: {
      privacy: 95, research: 30, commercial: 5, trust: 85,
      insight: "Deletion maximizes privacy and protects participants from future data misuse. However, longitudinal studies become impossible and valuable health insights may be lost to science."
    },
    anonymous: {
      privacy: 65, research: 70, commercial: 40, trust: 60,
      insight: "Anonymization sounds reassuring, but genomic data is inherently identifiable. Studies show as few as 30–80 SNPs can re-identify a person. 'Anonymous' genomic data is not truly anonymous."
    },
    sell: {
      privacy: 15, research: 55, commercial: 100, trust: 10,
      insight: "Selling genomic data to pharmaceutical companies is profitable and may fund future research — but participants rarely see a share of those profits, and most did not consent to commercial use when they took the test."
    },
    research: {
      privacy: 75, research: 90, commercial: 10, trust: 80,
      insight: "Limiting data to verified research maximizes both scientific benefit and participant trust. This model — practiced by the UK Biobank — is considered a gold standard for ethical genomic data governance."
    }
  };

  const choiceBtns = document.querySelectorAll('.choice-btn');
  const scorePanel = document.getElementById('scorePanel');

  const bars = {
    privacy:    { bar: document.getElementById('privacyBar'),    val: document.getElementById('privacyVal') },
    research:   { bar: document.getElementById('researchBar'),   val: document.getElementById('researchVal') },
    commercial: { bar: document.getElementById('commercialBar'), val: document.getElementById('commercialVal') },
    trust:      { bar: document.getElementById('trustBar'),      val: document.getElementById('trustVal') },
  };
  const insightEl = document.getElementById('scoreInsight');

  // Journey animation
  const steps = [
    document.getElementById('step0'),
    document.getElementById('step1'),
    document.getElementById('step2'),
  ];

  function activateJourney(choice) {
    let i = 0;
    steps.forEach(s => s.classList.remove('active'));
    steps[0].classList.add('active');
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        steps[i].classList.add('active');
      } else {
        clearInterval(interval);
      }
    }, 400);
  }

  function animateBar(barEl, valEl, target) {
    let current = 0;
    const duration = 700;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(target * eased);
      barEl.style.width = current + '%';
      valEl.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function applyChoice(choiceKey) {
    const data = CHOICE_DATA[choiceKey];
    if (!data) return;

    // show panel
    scorePanel.classList.add('visible');

    // animate bars
    setTimeout(() => {
      animateBar(bars.privacy.bar,    bars.privacy.val,    data.privacy);
      animateBar(bars.research.bar,   bars.research.val,   data.research);
      animateBar(bars.commercial.bar, bars.commercial.val, data.commercial);
      animateBar(bars.trust.bar,      bars.trust.val,      data.trust);
      insightEl.textContent = data.insight;
    }, 100);
  }

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      choiceBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const choice = btn.dataset.choice;
      activateJourney(choice);
      applyChoice(choice);
    });
  });

})();
