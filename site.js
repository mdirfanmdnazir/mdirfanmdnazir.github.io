(() => {
  const menu = document.querySelector('#menuToggle');
  const nav = document.querySelector('#navlinks');
  function closeMenu() {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a, button').forEach(item => item.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) closeMenu();
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', closeMenu);

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  const dialog = document.querySelector('#enquiryDialog');
  const form = document.querySelector('#enquiryForm');
  const status = document.querySelector('#formStatus');
  const draftResult = document.querySelector('#draftResult');
  const draftText = document.querySelector('#draftText');
  const whatsappLink = document.querySelector('#openWhatsApp');
  const formDate = form?.elements.namedItem('date');
  if (formDate) {
    const today = new Date();
    formDate.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  document.querySelectorAll('.enquiry-trigger').forEach(button => button.addEventListener('click', () => {
    if (!dialog || !form) return;
    const service = form.elements.namedItem('type');
    if ([...service.options].some(option => option.value === button.dataset.enquiry)) {
      service.value = button.dataset.enquiry;
    }
    status.textContent = '';
    draftResult.hidden = true;
    closeMenu();
    dialog.showModal();
    form.elements.namedItem('name')?.focus();
  }));
  document.querySelector('#closeDialog')?.addEventListener('click', () => dialog?.close());
  for (const modal of document.querySelectorAll('dialog')) {
    modal.addEventListener('click', event => {
      const rect = modal.getBoundingClientRect();
      if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) modal.close();
    });
  }

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const service = String(data.get('type'));
    const brand = service.toLowerCase().includes('hias acara') ? 'HIAS ACARA' : 'IRFAN BEREMCEE';
    const message = `Hello! I found ${brand} through your website and would like to enquire about my event.\n\nName: ${data.get('name')}\nService: ${service}\nDate: ${data.get('date')}\nLanguage: ${data.get('language')}\nLocation: ${data.get('location') || 'To be confirmed'}\nNotes: ${data.get('notes') || 'None yet'}\n\nCould you please check availability and share the next steps?`;
    draftText.value = message;
    draftResult.hidden = false;
    const number = String(window.IRFAN_SITE_CONFIG?.whatsappNumber || '').replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(number)) {
      whatsappLink.hidden = true;
      status.textContent = 'Copy your enquiry below and contact us using the WhatsApp link in the footer.';
      return;
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    whatsappLink.hidden = false;
    whatsappLink.href = url;
    status.textContent = 'Your message is ready. Press Send in WhatsApp to submit it. If a new tab does not open, use the WhatsApp button below. Your date is reserved only after personal confirmation.';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  document.querySelector('#copyDraft')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(draftText?.value || '');
      status.textContent = 'Message copied. Paste it into WhatsApp to send.';
    } catch {
      status.textContent = 'Select the message above and copy it manually.';
      draftText?.focus();
      draftText?.select();
    }
  });

  const privacyDialog = document.querySelector('#privacyDialog');
  document.querySelectorAll('.privacy-trigger').forEach(button => button.addEventListener('click', () => privacyDialog?.showModal()));
  document.querySelector('#closePrivacy')?.addEventListener('click', () => privacyDialog?.close());
})();
