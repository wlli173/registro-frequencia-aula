export function atualizarLista(diario, listaId = "lista", opcoes = {}) {
  const { modoProfessor = false, aoMarcar = null } = opcoes;

  const lista = document.getElementById(listaId);
  if (!lista) return;

  lista.innerHTML = "";

  if (!diario?.aulas || !diario?.alunos) {
    lista.innerHTML = "<li>Dados inválidos recebidos.</li>";
    return;
  }

  const dataHoje = new Date().toISOString().split("T")[0];
  const aulaHoje = diario.aulas.find((a) => a.data === dataHoje);

  const fragment = document.createDocumentFragment();

  diario.alunos.forEach((aluno) => {
    const li = document.createElement("li");

    // Nome
    const nomeSpan = document.createElement("span");
    nomeSpan.classList.add("aluno-nome");
    nomeSpan.textContent = aluno.nome;

    // Status
    const statusSpan = document.createElement("span");
    const status = aulaHoje?.presencas?.[aluno.matricula] || "Não marcado";

    statusSpan.textContent = status;
    statusSpan.classList.add("status-badge");

    switch (status.toLowerCase()) {
      case "presente":
        statusSpan.classList.add("status-presente");
        break;
      case "ausente":
        statusSpan.classList.add("status-ausente");
        break;
      default:
        statusSpan.classList.add("status-nao-marcado");
    }

    li.appendChild(nomeSpan);
    li.appendChild(statusSpan);

    // MODO PROFESSOR
    if (modoProfessor && aulaHoje) {
      const botoesDiv = document.createElement("div");
      botoesDiv.classList.add("acoes-professor");

      const btnPresente = document.createElement("button");
      btnPresente.textContent = "Presente";
      btnPresente.onclick = () => aoMarcar?.(aluno.matricula, "Presente");

      const btnAusente = document.createElement("button");
      btnAusente.textContent = "Ausente";
      btnAusente.onclick = () => aoMarcar?.(aluno.matricula, "Ausente");

      botoesDiv.appendChild(btnPresente);
      botoesDiv.appendChild(btnAusente);

      li.appendChild(botoesDiv);
    }

    fragment.appendChild(li);
  });

  lista.appendChild(fragment);
}