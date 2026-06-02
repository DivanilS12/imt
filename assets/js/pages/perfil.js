const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileInputName = document.getElementById('profile-input-name');
const profileInputEmail = document.getElementById('profile-input-email');
const avatar = document.getElementById('avatar');
const profileForm = document.getElementById('profile-form');

function renderProfile() {
  const user = window.IMT.storage.get('imt_user', {
    nome: 'Visitante IMT',
    email: 'visitante@imt.local'
  });

  profileName.textContent = user.nome;
  profileEmail.textContent = user.email;
  profileInputName.value = user.nome;
  profileInputEmail.value = user.email;
  avatar.textContent = user.nome
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  window.IMT.storage.set('imt_user', {
    nome: profileInputName.value.trim(),
    email: profileInputEmail.value.trim()
  });
  renderProfile();
  window.IMT.showToast('Perfil atualizado.', 'success');
});

renderProfile();
