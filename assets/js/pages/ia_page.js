const iaForm = document.getElementById('ia-form');
const iaMessage = document.getElementById('ia-message');
const iaResponse = document.getElementById('ia-response');
const clearHistory = document.getElementById('clear-history');

const suggestions = [
  'Pelo seu interesse, vale comparar tecnologia, design de produto e análise de dados. Observe rotina, habilidades exigidas e cursos introdutórios antes de decidir.',
  'Uma boa escolha começa cruzando três pontos: o que você gosta de fazer, o que aprende com facilidade e quais áreas têm demanda no mercado.',
  'Para avançar, escolha duas profissões favoritas, veja as habilidades em comum e monte um plano de estudo de quatro semanas.'
];

iaForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = iaMessage.value.trim();
  if (!message) return;

  const history = window.IMT.storage.get('imt_ia_history', []);
  const response = suggestions[Math.floor(Math.random() * suggestions.length)];
  window.IMT.storage.set('imt_ia_history', [{ message, response, date: new Date().toISOString() }, ...history]);
  iaResponse.textContent = response;
  iaMessage.value = '';
  window.IMT.showToast('Resposta gerada localmente. A API OpenAI já está preparada no backend.', 'success');
});

clearHistory?.addEventListener('click', () => {
  window.IMT.storage.set('imt_ia_history', []);
  iaResponse.textContent = 'Histórico limpo. Faça uma nova pergunta para continuar.';
});
