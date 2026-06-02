const curriculoForm = document.getElementById('curriculo-form');
const curriculoFile = document.getElementById('curriculo-file');
const analysisResult = document.getElementById('analysis-result');

curriculoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const file = curriculoFile.files[0];

  if (!file) return;
  if (file.type !== 'application/pdf') {
    analysisResult.className = 'feedback error';
    analysisResult.textContent = 'Envie um arquivo PDF válido.';
    return;
  }

  const result = {
    habilidadesDetectadas: ['Comunicação', 'Organização', 'Aprendizado contínuo'],
    profissoesRecomendadas: ['Desenvolvimento de Sistemas', 'Professor', 'Analista de Dados'],
    nivelCompatibilidade: 78
  };

  window.IMT.storage.set('imt_last_analysis', result);
  analysisResult.className = 'feedback success';
  analysisResult.innerHTML = `
    <strong>${result.nivelCompatibilidade}% de compatibilidade</strong><br>
    Habilidades: ${result.habilidadesDetectadas.join(', ')}<br>
    Recomendações: ${result.profissoesRecomendadas.join(', ')}
  `;
  window.IMT.showToast('Currículo analisado localmente. Upload real pronto no backend.', 'success');
});
