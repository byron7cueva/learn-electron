console.log('Holla');
window.addEventListener('load', () => {
  const messageEl: HTMLElement | null = document.getElementById('message');
  if (messageEl) {
    messageEl.innerHTML = 'Este es un mensaje insertado por JS';
  }
})