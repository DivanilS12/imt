const lista = document.getElementById('lista-profissoes');
const search = document.getElementById('search');
const emptyState = document.getElementById('empty-state');
const totalProfissoes = document.getElementById('total-profissoes');
const chips = document.querySelectorAll('[data-filter]');

let dados = [];
let filtroAtual = 'todas';

const dataPath = window.location.pathname.includes('/pages/') ? '../data/profissoes.json' : 'data/profissoes.json';

const getSaved = () => window.IMT.storage.get('imt_favorites', []);
const setSaved = (items) => window.IMT.storage.set('imt_favorites', items);

fetch(dataPath)
  .then((res) => {
    if (!res.ok) throw new Error('Falha ao carregar profissões');
    return res.json();
  })
  .then((json) => {
    dados = json;
    totalProfissoes.textContent = dados.length;
    render();
  })
  .catch(() => {
    emptyState.hidden = false;
    emptyState.textContent = 'Não foi possível carregar as profissões.';
  });

function matchesFilters(profissao) {
  const termo = search.value.trim().toLowerCase();
  const texto = [
    profissao.nome,
    profissao.area,
    profissao.descricao,
    ...(profissao.habilidades || [])
  ]
    .join(' ')
    .toLowerCase();

  const matchText = !termo || texto.includes(termo);
  const matchArea = filtroAtual === 'todas' || profissao.area === filtroAtual;

  return matchText && matchArea;
}

function render() {
  const salvas = getSaved();
  const filtradas = dados.filter(matchesFilters);

  lista.innerHTML = '';
  emptyState.hidden = filtradas.length > 0;

  filtradas.forEach((p) => {
    const isSaved = salvas.includes(p.id);
    const card = document.createElement('article');
    card.className = `card ${p.classe}`;
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${p.nome}</h3>
        <span class="area-badge">${p.area}</span>
      </div>
      <p class="card-description">${p.descricao}</p>
      <div class="info-grid">
        <div class="metric"><span>Salário médio</span><strong>${p.salario}</strong></div>
        <div class="metric"><span>Perfil</span><strong>${p.genero}</strong></div>
      </div>
      <div>
        <div class="metric"><span>Empregabilidade</span><strong>${p.grafico}%</strong></div>
        <div class="progress" aria-label="Empregabilidade ${p.grafico}%"><span style="width: ${p.grafico}%"></span></div>
      </div>
      <div class="skill-list">
        ${p.habilidades.map((habilidade) => `<span>${habilidade}</span>`).join('')}
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" type="button" data-detail="${p.id}">Ver detalhes</button>
        <button class="btn btn-muted save-btn ${isSaved ? 'saved' : ''}" type="button" data-save="${p.id}">
          ${isSaved ? 'Salva' : 'Salvar'}
        </button>
      </div>
    `;

    lista.appendChild(card);
  });
}

search.addEventListener('input', render);

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    filtroAtual = chip.dataset.filter;
    render();
  });
});

lista.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save]');
  const detailButton = event.target.closest('[data-detail]');

  if (saveButton) {
    const id = saveButton.dataset.save;
    const salvas = getSaved();
    const next = salvas.includes(id) ? salvas.filter((item) => item !== id) : [...salvas, id];
    setSaved(next);
    window.IMT.showToast(next.includes(id) ? 'Profissão salva' : 'Profissão removida');
    render();
  }

  if (detailButton) {
    const id = detailButton.dataset.detail;
    const target = window.location.pathname.includes('/pages/')
      ? `profissao.html?id=${id}`
      : `pages/profissao.html?id=${id}`;
    window.location.href = target;
  }
});
