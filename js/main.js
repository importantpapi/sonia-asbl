/**
 * SONIA ASBL - Main Interactions (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. HEADER SCROLL EFFECT
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }

        if (scrollTopBtn) {
          if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
          } else {
            scrollTopBtn.classList.remove('visible');
          }
        }
        scrollTimeout = false;
      });
      scrollTimeout = true;
    }
  }, { passive: true });

  // Scroll to Top action
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. MOBILE MENU NAVIGATION
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (navToggle && mobileNav) {
    const toggleMenu = () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('open');
      // Prevent body scrolling when mobile nav is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    };

    navToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.faq-content');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    }
  });

  // 4. ACTIVE LINK HIGHLIGHTING
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  const desktopLinks = document.querySelectorAll('.nav-link');
  const allNavLinks = [...desktopLinks, ...mobileLinks];

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 5. CONTACT FORM VALIDATION & HANDLING
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      const feedback = document.getElementById('formFeedback');

      feedback.className = 'form-feedback'; // reset
      feedback.style.display = 'none';

      if (!name || !email || !subject || !message) {
        feedback.innerText = 'Veuillez remplir tous les champs obligatoires.';
        feedback.classList.add('error');
        feedback.style.display = 'block';
        return;
      }

      // Simple email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        feedback.innerText = 'Veuillez entrer une adresse e-mail valide.';
        feedback.classList.add('error');
        feedback.style.display = 'block';
        return;
      }

      // Simulate successful API call
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Envoi en cours...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        feedback.innerText = 'Votre message a bien été envoyé ! Nous vous recontacterons très rapidement.';
        feedback.classList.add('success');
        feedback.style.display = 'block';
        contactForm.reset();
      }, 1500);
    });
  }

  // 6. DONATION AMOUNT SWITCHER
  const donationTabs = document.querySelectorAll('.donation-tab');
  const customDonInput = document.getElementById('customDonationAmount');
  const donForm = document.getElementById('donationForm');

  if (donationTabs.length > 0 && customDonInput) {
    donationTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Toggle active tabs
        donationTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update custom input value
        const amount = tab.getAttribute('data-amount');
        if (amount !== 'custom') {
          customDonInput.value = amount;
        } else {
          customDonInput.value = '';
          customDonInput.focus();
        }
      });
    });

    customDonInput.addEventListener('input', () => {
      // If user types manually, deselect any matching fixed amounts unless it matches
      const currentVal = customDonInput.value.trim();
      let matched = false;

      donationTabs.forEach(tab => {
        const amount = tab.getAttribute('data-amount');
        if (amount === currentVal) {
          tab.classList.add('active');
          matched = true;
        } else {
          tab.classList.remove('active');
        }
      });

      if (!matched) {
        const customTab = document.querySelector('.donation-tab[data-amount="custom"]');
        if (customTab) customTab.classList.add('active');
      }
    });
  }

  if (donForm) {
    donForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const amount = customDonInput ? customDonInput.value.trim() : '';
      const feedback = document.getElementById('donFeedback');

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        if (feedback) {
          feedback.innerText = 'Veuillez spécifier un montant de don valide.';
          feedback.className = 'form-feedback error';
        }
        return;
      }

      const isRecurring = document.getElementById('donTypeMonthly') ? document.getElementById('donTypeMonthly').checked : false;
      const typeText = isRecurring ? 'mensuel' : 'unique';

      const submitBtn = donForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Traitement...';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        if (feedback) {
          feedback.innerHTML = `Merci infiniment ! Votre simulation de don ${typeText} de <strong>${amount}€</strong> est enregistrée. <br><small>Pour finaliser, effectuez un virement bancaire sur le compte de l'ASBL (détails ci-dessous).</small>`;
          feedback.className = 'form-feedback success';
        }
      }, 1200);
    });
  }

  // ==========================================================================
  // AMÉLIORATIONS UI : 7. ACCESSIBILITY MODE FALC (FACILE A LIRE ET A COMPRENDRE)
  // ==========================================================================
  const falcToggleBtns = document.querySelectorAll('.falc-toggle-btn');
  const falcModeActive = localStorage.getItem('falcModeActive') === 'true';

  const setFalcMode = (isActive) => {
    if (isActive) {
      document.body.classList.add('falc-mode');
      falcToggleBtns.forEach(btn => {
        btn.classList.add('active');
        const span = btn.querySelector('span');
        if (span) span.innerText = "Mode Standard";
      });
    } else {
      document.body.classList.remove('falc-mode');
      falcToggleBtns.forEach(btn => {
        btn.classList.remove('active');
        const span = btn.querySelector('span');
        if (span) span.innerText = "Version FALC (Facile à lire)";
      });
    }
    localStorage.setItem('falcModeActive', isActive);
  };

  // Initialize from storage
  if (falcModeActive) {
    setFalcMode(true);
  }

  // Toggle events
  falcToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentActive = document.body.classList.contains('falc-mode');
      setFalcMode(!currentActive);
    });
  });

  // ==========================================================================
  // AMÉLIORATIONS UI : 8. CALCULATEUR INTERACTIF DE DONS (don.html)
  // ==========================================================================
  const donSlider = document.getElementById('donationSlider');
  const breakdownGift = document.getElementById('breakdownGiftAmount');
  const breakdownTax = document.getElementById('breakdownTaxReduction');
  const breakdownReal = document.getElementById('breakdownRealCost');
  const breakdownInfo = document.getElementById('breakdownTaxInfo');

  const updateDonationCost = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      if (breakdownGift) breakdownGift.innerText = "0,00 €";
      if (breakdownTax) breakdownTax.innerText = "0,00 €";
      if (breakdownReal) breakdownReal.innerText = "0,00 €";
      if (breakdownInfo) breakdownInfo.style.display = "none";
      return;
    }

    const val = parseFloat(amount);
    let taxReduction = 0;
    
    if (val >= 40) {
      taxReduction = val * 0.45;
      if (breakdownInfo) {
        breakdownInfo.innerHTML = `<i data-lucide="sparkles"></i> Éligible à une attestation fiscale (-45%)`;
        breakdownInfo.className = "tax-badge-info";
        breakdownInfo.style.display = "inline-flex";
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    } else {
      if (breakdownInfo) {
        breakdownInfo.innerHTML = `<i data-lucide="info"></i> Déduction fiscale dès 40 € cumulés par an`;
        breakdownInfo.className = "tax-badge-info";
        breakdownInfo.style.backgroundColor = "var(--primary-light)";
        breakdownInfo.style.color = "var(--primary)";
        breakdownInfo.style.display = "inline-flex";
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }

    const realCost = val - taxReduction;

    if (breakdownGift) breakdownGift.innerText = `${val.toFixed(2).replace('.', ',')} €`;
    if (breakdownTax) breakdownTax.innerText = `${taxReduction.toFixed(2).replace('.', ',')} €`;
    if (breakdownReal) breakdownReal.innerText = `${realCost.toFixed(2).replace('.', ',')} €`;
  };

  // Sync inputs
  if (customDonInput) {
    customDonInput.addEventListener('input', () => {
      const amt = customDonInput.value;
      if (donSlider) donSlider.value = amt || 0;
      updateDonationCost(amt);
    });
  }

  if (donSlider && customDonInput) {
    donSlider.addEventListener('input', () => {
      const amt = donSlider.value;
      customDonInput.value = amt;
      
      // Highlight matching predefined tabs
      donationTabs.forEach(tab => {
        const tabAmt = tab.getAttribute('data-amount');
        if (tabAmt === amt) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      
      // If no pre-defined tab matched, activate the 'custom' tab
      const matched = [...donationTabs].some(tab => tab.getAttribute('data-amount') === amt);
      if (!matched) {
        const customTab = document.querySelector('.donation-tab[data-amount="custom"]');
        if (customTab) customTab.classList.add('active');
      }

      updateDonationCost(amt);
    });
  }

  // Predefined tabs listener adjustment to update calculator
  if (donationTabs.length > 0) {
    donationTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const amt = tab.getAttribute('data-amount');
        if (amt !== 'custom') {
          if (donSlider) donSlider.value = amt;
          updateDonationCost(amt);
        } else {
          const customAmt = customDonInput.value;
          if (donSlider) donSlider.value = customAmt || 0;
          updateDonationCost(customAmt);
        }
      });
    });
  }

  // Initial calculation on don.html
  if (donForm && customDonInput) {
    updateDonationCost(customDonInput.value);
  }

  // ==========================================================================
  // AMÉLIORATIONS UI : 9. RECHERCHE & FILTRAGE FAQ (actualites.html)
  // ==========================================================================
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqFilterBtns = document.querySelectorAll('.faq-filter-btn');

  const filterFAQ = () => {
    if (!faqSearchInput && faqFilterBtns.length === 0) return;
    
    const query = faqSearchInput ? faqSearchInput.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('.faq-filter-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');
      const itemText = (trigger.innerText + " " + (content ? content.innerText : "")).toLowerCase();
      const itemCategory = item.getAttribute('data-category');

      const matchesQuery = query === '' || itemText.includes(query);
      const matchesCategory = category === 'all' || itemCategory === category;

      if (matchesQuery && matchesCategory) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
        // Close if it was open
        item.classList.remove('active');
        if (content) content.style.maxHeight = null;
      }
    });
  };

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', filterFAQ);
  }

  faqFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      faqFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterFAQ();
    });
  });

  // ==========================================================================
  // AMÉLIORATIONS UI : 10. FILTRAGE DE L'ÉQUIPE (mission.html)
  // ==========================================================================
  const teamFilterBtns = document.querySelectorAll('.team-filter-btn');
  const teamCards = document.querySelectorAll('.team-card');

  teamFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      teamFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      teamCards.forEach(card => {
        const cardPole = card.getAttribute('data-pole');
        if (filterValue === 'all' || cardPole === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});
