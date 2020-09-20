import '../assets/css/main.css';
window.addEventListener('load', () => {
  const messageEl: HTMLElement | null = document.getElementById('message');
  if (messageEl) {
    messageEl.innerHTML = 'Este es un mensaje';
  }
})