// script.js — Genome Justice interactive modules

// =====================
// DNA Canvas Animation
// =====================
(function () {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId, t = 0;
    const particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function buildParticles() {
        particles.length = 0;
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * W, y: Math.random() * H,
                r: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                a: Math.random() * 0.4 + 0.1
            });
        }
    }

    function drawHelix(cx, amp, speed, alpha) {
        const wl = H * 0.6;
        const steps = 100;
        const sh = H / steps;
        const s1 = [], s2 = [], sy = [];
        for (let i = 0; i <= steps; i++) {
            const y = i * sh;
            const ph = (y / wl) * Math.PI * 2 + t * speed;
            s1.push(cx + Math.sin(ph) * amp);
            s2.push(cx + Math.sin(ph + Math.PI) * amp);
            sy.push(y);
        }
        ctx.beginPath();
        ctx.moveTo(s1[0], sy[0]);
        for (let i = 1; i <= steps; i++) ctx.lineTo(s1[i], sy[i]);
        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(s2[0], sy[0]);
        for (let i = 1; i <= steps; i++) ctx.lineTo(s2[i], sy[i]);
        ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let i = 0; i <= 16; i++) {
            const idx = Math.floor((i / 16) * steps);
            const y = sy[idx], x1 = s1[idx], x2 = s2[idx];
            const ph = (y / wl) * Math.PI * 2 + t * speed;
            const cos = Math.cos(ph);
            if (cos > 0) {
                ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y);
                ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.5 * cos})`;
                ctx.lineWidth = 1; ctx.stroke();
                ctx.beginPath(); ctx.arc(x1, y, 3 * cos, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`; ctx.fill();
                ctx.beginPath(); ctx.arc(x2, y, 3 * cos, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`; ctx.fill();
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${p.a})`; ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        });
        drawHelix(W * 0.2, 60, 1.0, 0.5);
        drawHelix(W * 0.5, 80, 0.8, 0.35);
        drawHelix(W * 0.8, 55, 1.2, 0.45);
        t += 0.008;
        animId = requestAnimationFrame(draw);
    }

    function init() { resize(); buildParticles(); draw(); }
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId); resize(); buildParticles(); draw();
    });
    init();
})();


// =====================
// MODULE 1 — DNA Ownership
// =====================
(function () {
    const DATA = {
        store:    { privacy: 20, research: 85, commercial: 90, trust: 30, insight: "Storing data indefinitely maximizes research potential but raises serious long-term privacy risks. Participants can't know how future laws or company policies might change — or who might eventually access their data." },
        delete:   { privacy: 95, research: 30, commercial: 5,  trust: 85, insight: "Deletion maximizes privacy and protects participants from future misuse. However, longitudinal studies become impossible and valuable health insights may be lost to science." },
        anonymous:{ privacy: 65, research: 70, commercial: 40, trust: 60, insight: "Anonymization sounds reassuring, but genomic data is inherently identifiable. Studies show as few as 30–80 SNPs can re-identify a person. 'Anonymous' genomic data is not truly anonymous." },
        sell:     { privacy: 15, research: 55, commercial: 100,trust: 10, insight: "Selling genomic data to pharmaceutical companies is profitable and may fund future research — but participants rarely share in those profits, and most did not consent to commercial use when they took the test." },
        research: { privacy: 75, research: 90, commercial: 10, trust: 80, insight: "Limiting data to verified research maximizes both scientific benefit and participant trust. This model — practiced by the UK Biobank — is considered a gold standard for ethical genomic data governance." }
    };

    const steps = ['step0','step1','step2'].map(id => document.getElementById(id));
    const scorePanel = document.getElementById('scorePanel');

    function animBar(barId, valId, target) {
        const bar = document.getElementById(barId);
        const val = document.getElementById(valId);
        let cur = 0;
        const start = performance.now();
        (function step(now) {
            const p = Math.min((now - start) / 700, 1);
            const e = 1 - Math.pow(1 - p, 3);
            cur = Math.round(target * e);
            bar.style.width = cur + '%';
            val.textContent = cur + '%';
            if (p < 1) requestAnimationFrame(step);
        })(performance.now());
    }

    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const d = DATA[btn.dataset.choice];
            if (!d) return;

            // Journey animation
            steps.forEach(s => s.classList.remove('active'));
            steps[0].classList.add('active');
            let i = 1;
            const iv = setInterval(() => {
                if (i < steps.length) { steps[i].classList.add('active'); i++; }
                else clearInterval(iv);
            }, 400);

            scorePanel.classList.add('visible');
            setTimeout(() => {
                animBar('privacyBar',    'privacyVal',    d.privacy);
                animBar('researchBar',   'researchVal',   d.research);
                animBar('commercialBar', 'commercialVal', d.commercial);
                animBar('trustBar',      'trustVal',      d.trust);
                document.getElementById('scoreInsight').textContent = d.insight;
            }, 100);
        });
    });
})();


// =====================
// MODULE 2 — Bias Simulator
// =====================
(function () {
    const pops = ['european', 'african', 'latino', 'asian'];

    function getVals() {
        let total = 0;
        const vals = {};
        pops.forEach(p => {
            vals[p] = parseInt(document.getElementById('sl-' + p).value);
            total += vals[p];
        });
        return { vals, total };
    }

    function updatePcts() {
        const { vals, total } = getVals();
        pops.forEach(p => {
            document.getElementById('pct-' + p).textContent = Math.round((vals[p] / total) * 100) + '%';
        });
    }

    pops.forEach(p => {
        document.getElementById('sl-' + p).addEventListener('input', updatePcts);
    });

    function calcAcc(share, total) {
        const frac = share / total;
        return Math.min(97, Math.max(52, Math.round(55 + 42 * (1 - Math.exp(-4.5 * frac)))));
    }

    document.getElementById('trainBtn').addEventListener('click', () => {
        const loadEl = document.getElementById('loadingSteps');
        const resEl  = document.getElementById('accuracyResults');
        const steps  = loadEl.querySelectorAll('p');

        loadEl.style.display = 'block';
        resEl.style.visibility = 'hidden';
        steps.forEach(s => s.classList.remove('active'));

        let i = 0;
        const iv = setInterval(() => {
            if (i < steps.length) { steps[i].classList.add('active'); i++; }
            else {
                clearInterval(iv);
                setTimeout(() => {
                    loadEl.style.display = 'none';
                    resEl.style.visibility = 'visible';
                    const { vals, total } = getVals();
                    const accs = {};
                    pops.forEach(p => accs[p] = calcAcc(vals[p], total));

                    pops.forEach(p => {
                        const fill = document.getElementById('acc-' + p);
                        const pctEl = document.getElementById('accpct-' + p);
                        const acc = accs[p];
                        let cur = 0;
                        const start = performance.now();
                        (function step(now) {
                            const prog = Math.min((now - start) / 900, 1);
                            cur = Math.round(acc * (1 - Math.pow(1 - prog, 3)));
                            fill.style.width = cur + '%';
                            pctEl.textContent = cur + '%';
                            if (acc >= 85) fill.style.background = 'linear-gradient(90deg, #059669, #34d399)';
                            else if (acc >= 70) fill.style.background = 'linear-gradient(90deg, #d97706, #fbbf24)';
                            else fill.style.background = 'linear-gradient(90deg, #dc2626, #f87171)';
                            if (prog < 1) requestAnimationFrame(step);
                        })(performance.now());
                    });

                    const accVals = pops.map(p => accs[p]);
                    const mean = accVals.reduce((a, b) => a + b) / 4;
                    const stdDev = Math.sqrt(accVals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / 4);
                    const fairness = Math.max(0, Math.round(100 - stdDev * 3));
                    let rating = fairness >= 90 ? '✅ Excellent' : fairness >= 75 ? '🟡 Good' : fairness >= 55 ? '⚠️ Poor' : '🚨 Very Poor';
                    document.getElementById('fairnessNote').textContent =
                        rating + ' — Fairness Score: ' + fairness + '%. Mean accuracy: ' + Math.round(mean) + '%. ' +
                        (fairness < 75
                            ? 'Underrepresented groups receive significantly less accurate predictions. This is not a technical limitation — it\'s a consequence of who was included in the training data.'
                            : 'A balanced dataset leads to more equitable predictions. This is the argument for diverse genomic databases like the NIH All of Us Research Program.');
                }, 200);
            }
        }, 500);
    });

    updatePcts();
})();


// =====================
// MODULE 3 — Study Simulator
// =====================
(function () {
    const TOTAL = 1_000_000;
    const SCORES = {
        urban:            [15, 0, 5,  5],
        community:        [10, 0, 15, 10],
        tribal:           [8,  0, 20, 18],
        rural:            [8,  0, 10, 8],
        international:    [20, 0, 25, 12],
        minimal:          [5,  5, 0,  0],
        standard:         [10, 15,0,  10],
        community_consent:[10, 30,5,  25],
        multilingual:     [5,  0, 10, 10],
        transport:        [5,  0, 10, 8],
        reps:             [5,  0, 5,  15],
    };

    function getSelected() {
        const sel = {};
        document.querySelectorAll('.sim-check:checked, .sim-radio:checked').forEach(el => {
            sel[el.dataset.key] = parseInt(el.dataset.cost) || 0;
        });
        return sel;
    }

    function calcBudget(sel) {
        return TOTAL - Object.values(sel).reduce((a, b) => a + b, 0);
    }

    function updateBudget() {
        const rem = calcBudget(getSelected());
        const el = document.getElementById('budgetDisplay');
        el.textContent = '$' + rem.toLocaleString();
        el.classList.remove('tight', 'over');
        if (rem < 100000) el.classList.add('tight');
        if (rem < 0) el.classList.add('over');
    }

    document.querySelectorAll('.sim-check, .sim-radio').forEach(el => {
        el.addEventListener('change', updateBudget);
    });

    function animScore(id, target) {
        const el = document.getElementById(id);
        let cur = 0;
        const start = performance.now();
        (function step(now) {
            const prog = Math.min((now - start) / 900, 1);
            cur = Math.round(target * (1 - Math.pow(1 - prog, 3)));
            el.textContent = cur + '%';
            if (prog < 1) requestAnimationFrame(step);
        })(performance.now());
    }

    document.getElementById('simRunBtn').addEventListener('click', () => {
        const sel = getSelected();
        const rem = calcBudget(sel);

        if (rem < 0) { alert('You are over budget! Deselect some options first.'); return; }
        if (Object.keys(sel).length === 0) { alert('Please make at least one selection.'); return; }

        const totals = [0, 0, 0, 0];
        Object.keys(sel).forEach(k => {
            (SCORES[k] || [0,0,0,0]).forEach((v, i) => totals[i] += v);
        });

        const MAX = [80, 50, 90, 93];
        const pcts = totals.map((v, i) => Math.min(100, Math.round((v / MAX[i]) * 100)));
        pcts[0] = Math.min(100, pcts[0] + Math.min(10, Math.round((rem / TOTAL) * 15)));

        const results = document.getElementById('simResults');
        results.classList.add('visible');
        results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
            animScore('res-science', pcts[0]);
            animScore('res-privacy', pcts[1]);
            animScore('res-representation', pcts[2]);
            animScore('res-trust', pcts[3]);

            const avg = Math.round(pcts.reduce((a, b) => a + b) / 4);
            let feedback;
            if (avg >= 80) feedback = `Outstanding study design (${avg}% average). By investing in community-led consent, diverse recruitment, and accessibility, you've built a study that could genuinely advance equitable precision medicine — similar in spirit to the NIH All of Us Research Program.`;
            else if (avg >= 60) feedback = `Solid foundation (${avg}% average), but there are gaps. Consider adding community representatives or a stronger consent process — underserved populations are more likely to participate when they trust the researchers.`;
            else if (avg >= 40) feedback = `Significant equity gaps (${avg}% average). Focusing only on large hospitals and minimal consent limits who participates and who benefits. Even modest investment in outreach dramatically improves representation.`;
            else feedback = `This design would reproduce the inequities we're trying to fix (${avg}% average). With minimal investment in diversity and consent, results would reflect existing research biases.`;
            document.getElementById('simFeedback').textContent = feedback;
        }, 100);
    });
})();


// =====================
// MODULE 4 — Stress Biology + Epigenetics
// =====================
(function () {

    const GENES = [
        { name: 'IL-6',    type: 'inflammatory' },
        { name: 'TNF-α',   type: 'inflammatory' },
        { name: 'FKBP5',   type: 'stress'       },
        { name: 'NR3C1',   type: 'stress'       },
        { name: 'BDNF',    type: 'protective'   },
        { name: 'SLC6A4',  type: 'protective'   },
        { name: 'OXTR',    type: 'social'       },
        { name: 'NF-κB',   type: 'inflammatory' },
        { name: 'COMT',    type: 'stress'       },
        { name: 'p53',     type: 'protective'   },
        { name: 'SIRT1',   type: 'protective'   },
        { name: 'CRH',     type: 'stress'       },
        { name: 'HSD11B1', type: 'stress'       },
        { name: 'MAOA',    type: 'stress'       },
        { name: 'IGF1',    type: 'protective'   },
        { name: 'VEGF',    type: 'protective'   },
        { name: 'ACE',     type: 'inflammatory' },
        { name: 'PTGS2',   type: 'inflammatory' },
        { name: 'CORT',    type: 'stress'       },
        { name: 'GR',      type: 'stress'       },
        { name: 'SOD2',    type: 'protective'   },
        { name: 'CAT',     type: 'protective'   },
        { name: 'TP53',    type: 'protective'   },
        { name: 'TERT',    type: 'protective'   },
    ];

    const grid = document.getElementById('geneGrid');
    if (!grid) return;

    GENES.forEach((gene, i) => {
        const cell = document.createElement('div');
        cell.className = 'gene-cell active';
        cell.title = gene.name;
        cell.id = 'gene-' + i;
        grid.appendChild(cell);
    });

    const stressSlider  = document.getElementById('stressSlider');
    const envSlider     = document.getElementById('envSlider');
    const supportSlider = document.getElementById('supportSlider');

    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateAll() {
        const stress  = parseInt(stressSlider.value) / 100;
        const env     = parseInt(envSlider.value) / 100;
        const support = parseInt(supportSlider.value) / 100;

        document.getElementById('stressVal').textContent  = Math.round(stress * 100) + '%';
        document.getElementById('envVal').textContent     = Math.round(env * 100) + '%';
        document.getElementById('supportVal').textContent = Math.round(support * 100) + '%';

        const burden = Math.min(1, Math.max(0, stress * 0.5 + (1 - env) * 0.3 + (1 - support) * 0.2));

        // Deterministic gene states based on index (no random flicker)
        GENES.forEach((gene, i) => {
            const cell = document.getElementById('gene-' + i);
            let state = 'active';
            const phase = i / GENES.length; // 0–1, different threshold per gene

            if (gene.type === 'protective') {
                if (burden > 0.4 + phase * 0.35) state = 'silenced';
            } else if (gene.type === 'inflammatory') {
                if (burden > 0.3 + phase * 0.3) state = 'upreg';
            } else if (gene.type === 'stress') {
                if (burden > 0.35 + phase * 0.3) state = 'upreg';
            } else if (gene.type === 'social') {
                if (support < 0.35) state = 'silenced';
            }

            cell.className = 'gene-cell ' + (state === 'upreg' ? 'upreg' : state === 'silenced' ? 'silenced' : 'active');
        });

        const inflammation = Math.round(lerp(5,  95, burden));
        const immune       = Math.round(lerp(90, 25, burden));
        const cortisol     = Math.round(lerp(10, 90, stress * 0.7 + (1 - support) * 0.3));
        const cvRisk       = Math.round(lerp(8,  88, burden * 0.8 + stress * 0.2));

        setBar('inflammationBar', 'inflammationVal', inflammation);
        setBar('immuneBar',       'immuneVal',       immune);
        setBar('cortisolBar',     'cortisolVal',     cortisol);
        setBar('riskBar',         'riskVal',         cvRisk);

        setDisease('risk-hypertension', Math.round(lerp(8,  55, burden)));
        setDisease('risk-diabetes',     Math.round(lerp(5,  42, burden * 0.7 + stress * 0.3)));
        setDisease('risk-depression',   Math.round(lerp(6,  60, stress * 0.6 + (1 - support) * 0.4)));
        setDisease('risk-autoimmune',   Math.round(lerp(4,  35, burden * 0.5 + (1 - env) * 0.5)));

        const insightEl = document.getElementById('epiInsight');
        if (burden < 0.25) {
            insightEl.textContent = 'Low allostatic load — protective genes are active, inflammation is well-regulated, and the stress-response system is within a healthy range. This reflects conditions of safety, stability, and adequate social support.';
        } else if (burden < 0.5) {
            insightEl.textContent = 'Moderate burden — some inflammatory pathways are activating and cortisol is elevated. Sustained at this level, epigenetic changes may begin to accumulate, particularly silencing of BDNF (brain plasticity) and upregulation of NF-κB (the master inflammation switch).';
        } else if (burden < 0.75) {
            insightEl.textContent = 'High allostatic load — multiple stress-response genes are upregulated, protective genes are being silenced through DNA methylation, and the HPA axis is dysregulated. This pattern is associated with accelerated biological aging — a phenomenon Geronimus called "weathering."';
        } else {
            insightEl.textContent = 'Severe chronic burden — inflammatory cytokines (IL-6, TNF-α) are chronically elevated, anti-aging genes (SIRT1, TERT) are silenced, and disease risk is substantially elevated. This biological profile has been documented in communities experiencing compounded socioeconomic and environmental adversity.';
        }
    }

    function setBar(barId, valId, pct) {
        const bar = document.getElementById(barId);
        const val = document.getElementById(valId);
        if (bar) bar.style.width = pct + '%';
        if (val) val.textContent = pct + '%';
    }

    function setDisease(id, pct) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = pct + '%';
        el.className = 'disease-risk ' + (pct < 20 ? 'low' : pct < 40 ? 'medium' : 'high');
    }

    [stressSlider, envSlider, supportSlider].forEach(s => {
        s.addEventListener('input', updateAll);
    });

    updateAll();

})();
