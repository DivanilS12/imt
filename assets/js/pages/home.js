const lista = document.getElementById("lista-profissoes");
const search = document.getElementById("search");

let dados = [];

// carregar dados
fetch("data/profissoes.json")
  .then(res => res.json())
  .then(json => {
    dados = json;
    render(dados);
  });

function render(listaDados) {
  lista.innerHTML = "";

  listaDados.forEach(p => {
    const card = document.createElement("div");
    card.className = `card ${p.classe}`;

   card.innerHTML = `
  <div class="card-title">${p.nome}</div>

  <div class="info">
     ${p.salario} <br>
     ${p.genero}

    <div class="chart" 
      style="background: conic-gradient(blue ${p.grafico}%, pink ${100 - p.grafico}%);">
    </div>
  </div>
`;

    lista.appendChild(card);
  });
}

// PESQUISA
search.addEventListener("input", () => {
  const valor = search.value.toLowerCase();

  const filtrado = dados.filter(p =>
    p.nome.toLowerCase().includes(valor)
  );

  render(filtrado);
});