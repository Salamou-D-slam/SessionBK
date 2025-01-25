/*
fetch('http://localhost:3000/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log('Error:', error));
*/

document.addEventListener('DOMContentLoaded', () => {
  const authButton = document.getElementById('connexion-button');

  // Vérifie l'état d'authentification en appelant l'API
  fetch('/api/auth/status')
      .then(response => response.json())
      .then(data => {
          if (data.isAuthenticated) {
              // Si l'utilisateur est connecté, changez le texte et le comportement du bouton
              authButton.textContent = 'Mon Espace';
              authButton.onclick = () => {
                  // Rediriger vers la page secrets
                  window.location.href = '/secrets';
              };
          } else {
              // Si l'utilisateur n'est pas connecté, garder le bouton de connexion
              authButton.textContent = 'Connexion';
              authButton.onclick = () => {
                  // Rediriger vers la page de connexion
                  window.location.href = '/connexion';
              };
          }
      })
      .catch(err => {
          console.error('Erreur lors de la vérification de l\'authentification:', err);
          authButton.textContent = 'Erreur';
      });
});

