if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('Service Worker registrado com sucesso:', reg.scope);
      })
      .catch(err => {
        console.error('Falha ao registrar o Service Worker:', err);
      });
  });
}