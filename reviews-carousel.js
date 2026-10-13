// Irfan Beremcee V11: no autoplay, user-controlled accessible carousels
(() => {
  for (const carousel of document.querySelectorAll('[data-carousel]')) {
    const track = carousel.querySelector('.review-carousel-track');
    const cards = [...track.querySelectorAll('.review-card')];
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const count = carousel.querySelector('.carousel-count');
    if (!cards.length) continue;
    let index = 0;
    const dots = document.createElement('div');
    dots.className='carousel-dots';
    dots.setAttribute('aria-label','Choose a testimonial');
    const dotButtons = cards.map((card,i)=>{
      const b = document.createElement('button');
      b.type='button'; b.setAttribute('aria-label',`Go to review ${i+1}`);
      b.addEventListener('click',()=>go(i));dots.append(b);return b;
    });
    track.after(dots);
    const updateDots = ()=>dotButtons.forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'true':'false')});
    const cardPosition = (card) => track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    function update() {
      const left = track.getBoundingClientRect().left;
      let best = 0, nearest = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const distance = Math.abs(cards[i].getBoundingClientRect().left-left);
        if (distance < nearest) { nearest = distance; best = i; }
      }
      index=best;
      count.textContent = `${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
      prev.disabled=index===0;
      next.disabled=index===cards.length-1;
      updateDots();
    }
    function go(n) {
      index=Math.max(0,Math.min(n,cards.length-1));
      track.scrollTo({left: cardPosition(cards[index]),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      count.textContent = `${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
      prev.disabled=index===0;next.disabled=index===cards.length-1;updateDots();
    }
    prev.addEventListener('click',()=>go(index-1));
    next.addEventListener('click',()=>go(index+1));
    track.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}});
    let raf=false;
    track.addEventListener('scroll',()=>{if(raf)return;raf=true;requestAnimationFrame(()=>{update();raf=false})},{passive:true});
    window.addEventListener('resize',update,{passive:true});
    update();
  }
})();
