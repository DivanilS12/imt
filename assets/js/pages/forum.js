const topicForm = document.getElementById('topic-form');
const topicList = document.getElementById('topic-list');
const topicTitle = document.getElementById('topic-title');
const topicContent = document.getElementById('topic-content');

const seedTopics = [
  {
    id: 'boas-vindas',
    titulo: 'Como escolher uma área para começar?',
    conteudo: 'Compare rotina, salário, empregabilidade e o tipo de problema que você gosta de resolver.',
    respostas: 4
  }
];

function getTopics() {
  return window.IMT.storage.get('imt_topics', seedTopics);
}

function setTopics(topics) {
  window.IMT.storage.set('imt_topics', topics);
}

function renderTopics() {
  const topics = getTopics();
  topicList.innerHTML = topics
    .map(
      (topic) => `
        <article class="topic-item">
          <h3>${topic.titulo}</h3>
          <p>${topic.conteudo}</p>
          <a class="btn btn-muted" href="topico.html?id=${topic.id}">${topic.respostas || 0} respostas</a>
        </article>
      `
    )
    .join('');
}

topicForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const topic = {
    id: `${Date.now()}`,
    titulo: topicTitle.value.trim(),
    conteudo: topicContent.value.trim(),
    respostas: 0
  };

  if (!topic.titulo || !topic.conteudo) return;
  setTopics([topic, ...getTopics()]);
  topicForm.reset();
  renderTopics();
  window.IMT.showToast('Tópico publicado localmente.', 'success');
});

renderTopics();
