/* ============================================
   SATHWIK NEELISETTY — PORTFOLIO v2 SCRIPTS
   Deen Dayal Aesthetic (Full-Screen Dark Mode)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const nav = document.querySelector('.dd-nav');

    // ==== NAVBAR SCROLL (Shadow/Blur on scroll) ====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ==== MOBILE NAV TOGGLE ====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isMenuOpen = mobileNav.style.display === 'block';
            mobileNav.style.display = isMenuOpen ? 'none' : 'block';
        });

        // Close mobile nav when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.style.display = 'none';
            });
        });
    }

    // ==== SMOOTH SCROLL ====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = nav.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==== SCROLL REVEAL (Standard Window IntersectionObserver) ====
    const revealEls = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    });

    revealEls.forEach(el => revealObserver.observe(el));

    // ==== FETCH WEATHER API ====
    const fetchWeatherBtn = document.getElementById('fetchWeather');
    if (fetchWeatherBtn) {
        fetchWeatherBtn.addEventListener('click', async () => {
            const responseEl = document.getElementById('apiResponseArea');
            responseEl.innerHTML = `<div class="loading-spinner"></div><p style="margin-left:16px;color:var(--text-secondary)">Fetching weather data...</p>`;

            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=14.4426&longitude=79.9865&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia/Kolkata');
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                const current = data.current;

                responseEl.innerHTML = `
                    <div class="api-result">
                        <div class="result-header">
                            📍 <strong style="color:var(--text-primary)">Nellore, AP</strong> — Real-time metrics
                        </div>
                        <div class="stat-grid">
                            <div class="stat-item"><div class="stat-val">${current.temperature_2m}°</div><div class="stat-lbl">TEMP (°C)</div></div>
                            <div class="stat-item"><div class="stat-val">${current.relative_humidity_2m}%</div><div class="stat-lbl">HUMIDITY</div></div>
                            <div class="stat-item"><div class="stat-val">${current.wind_speed_10m}</div><div class="stat-lbl">WIND (km/h)</div></div>
                            <div class="stat-item"><div class="stat-val">${current.weather_code}</div><div class="stat-lbl">WMO CODE</div></div>
                        </div>
                    </div>
                `;
            } catch (err) {
                responseEl.innerHTML = `<div class="demo-error" style="color:#ef4444"><i class="ti ti-alert-triangle"></i> Failed to fetch weather data.</div>`;
            }
        });
    }

    // ==== FETCH GITHUB API ====
    const fetchGithubBtn = document.getElementById('fetchGithub');
    if (fetchGithubBtn) {
        fetchGithubBtn.addEventListener('click', async () => {
            const responseEl = document.getElementById('apiResponseArea');
            responseEl.innerHTML = `<div class="loading-spinner"></div><p style="margin-left:16px;color:var(--text-secondary)">Fetching GitHub stats...</p>`;

            try {
                const [userRes, reposRes] = await Promise.all([
                    fetch('https://api.github.com/users/Sathvik1696'),
                    fetch('https://api.github.com/users/Sathvik1696/repos?per_page=100')
                ]);

                if (!userRes.ok || !reposRes.ok) throw new Error('API error');

                const user = await userRes.json();
                const repos = await reposRes.json();
                const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

                responseEl.innerHTML = `
                    <div class="api-result">
                        <div class="result-header">
                            👤 <strong style="color:var(--text-primary)">${user.login}</strong> — Live GitHub Data
                        </div>
                        <div class="stat-grid">
                            <div class="stat-item"><div class="stat-val">${user.public_repos}</div><div class="stat-lbl">REPOS</div></div>
                            <div class="stat-item"><div class="stat-val">${totalStars}</div><div class="stat-lbl">TOTAL STARS</div></div>
                            <div class="stat-item"><div class="stat-val">${user.followers}</div><div class="stat-lbl">FOLLOWERS</div></div>
                            <div class="stat-item"><div class="stat-val"><i class="ti ti-brand-github" style="font-size:2rem"></i></div><div class="stat-lbl">ACTIVE</div></div>
                        </div>
                    </div>
                `;
            } catch (err) {
                responseEl.innerHTML = `<div class="demo-error" style="color:#ef4444"><i class="ti ti-alert-triangle"></i> Failed to fetch GitHub data.</div>`;
            }
        });
    }

    // ==== PROJECT MODAL ====
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseBackdrop = document.getElementById('modalCloseBackdrop');
    const toggles = document.querySelectorAll('.toggle-modal');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const projectId = e.target.dataset.target || e.target.closest('.toggle-modal').dataset.target;
            
            if (projectId === 'multiservice') {
                modalBody.innerHTML = `
                    <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Multi-Service Data API</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 30px; font-size: 1.1rem;">A production-grade RESTful API aggregating real-time data from external sources.</p>
                    <h3 style="margin-bottom: 16px;">Architecture</h3>
                    <ul style="color: var(--text-secondary); margin-left: 20px; margin-bottom: 30px;">
                        <li style="margin-bottom: 10px;">Django DRF ViewSets & Serializers</li>
                        <li style="margin-bottom: 10px;">Service-oriented external API integration</li>
                        <li style="margin-bottom: 10px;">Redis caching for response optimization</li>
                        <li style="margin-bottom: 10px;">JWT token authentication</li>
                    </ul>
                    <h3 style="margin-bottom: 16px;">Endpoints</h3>
                    <div style="background: #111; padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); font-family: monospace; color: var(--accent); margin-bottom: 16px;">
                        GET /api/v1/weather/?city={city}
                    </div>
                    <div style="background: #111; padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); font-family: monospace; color: var(--accent);">
                        GET /api/v1/news/
                    </div>
                `;
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCloseBackdrop) modalCloseBackdrop.addEventListener('click', closeModal);

});

/* ==== THEME TOGGLE LOGIC ==== */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    if (!themeToggleBtn || !themeIcon) return;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('sathwik-theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Default is dark, unless light is explicitly saved or preferred
    const isLightMode = savedTheme === 'light' || (!savedTheme && systemPrefersLight);
    
    if (isLightMode) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('ti-sun', 'ti-moon');
    }

    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('sathwik-theme', 'dark');
            themeIcon.classList.replace('ti-moon', 'ti-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('sathwik-theme', 'light');
            themeIcon.classList.replace('ti-sun', 'ti-moon');
        }
    });
});
