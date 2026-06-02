const savedList = document.getElementById('saved-list');
const detail = document.getElementById('profession-detail');
const title = document.getElementById('profession-title');
const empty = document.getElementById('empty-state');

fetch('../data/profissoes.json')
  .then((response) => response.json())
  .then((profissoes) => {
    if (savedList) renderSaved(profissoes);
    if (detail) renderDetail(profissoes);
  });

function renderSaved(profissoes) {
  const savedIds = window.IMT.storage.get('imt_favorites', []);
  const salvas = profissoes.filter((item) => savedIds.includes(item.id));

  empty.hidden = salvas.length > 0;
  savedList.innerHTML = salvas
    .map(
      (p) => `
        <article class="card ${p.classe}">
          <div class="card-header"><h3 class="card-title">${p.nome}</h3><span class="area-badge">${p.area}</span></div>
          <p class="card-description">${p.descricao}</p>
          <div class="metric"><span>Salário</span><strong>${p.salario}</strong></div>
          <a class="btn btn-primary" href="profissao.html?id=${p.id}">Ver detalhes</a>
        </article>
      `
    )
    .join('');
}

function renderDetail(profissoes) {
  const id = new URLSearchParams(window.location.search).get('id');
  const p = profissoes.find((item) => item.id === id) || profissoes[0];
  title.textContent = p.nome;
  detail.innerHTML = `
    <article class="page-card">
      <p class="eyebrow">${p.area}</p>
      <h2>Visão geral</h2>
      <p>${p.descricao}</p>
      <div class="info-grid">
        <div class="metric"><span>Salário</span><strong>${p.salario}</strong></div>
        <div class="metric"><span>Empregabilidade</span><strong>${p.grafico}%</strong></div>
      </div>
    </article>
    <article class="page-card">
      <h2>Habilidades e cursos</h2>
      <p><strong>Habilidades:</strong> ${p.habilidades.join(', ')}</p>
      <p><strong>Cursos recomendados:</strong> ${p.cursos.join(', ')}</p>
      <button class="btn btn-primary" type="button" id="save-detail">Salvar profissão</button>
    </article>
  `;

  document.getElementById('save-detail').addEventListener('click', () => {
    const saved = window.IMT.storage.get('imt_favorites', []);
    if (!saved.includes(p.id)) window.IMT.storage.set('imt_favorites', [...saved, p.id]);
    window.IMT.showToast('Profissão salva.', 'success');
  });
}
