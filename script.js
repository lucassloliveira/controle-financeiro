const CHAVE = "lancamentos";
let lancamentos = [];

function carregar() {
    const texto = localStorage.getItem(CHAVE);
    lancamentos = texto ? JSON.parse(texto) : [];
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(lancamentos));
}

function formatarMoeda(centavos) {
    return (centavos/100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(dataISO) {
    const [ano,mes,dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

const listaEl = document.getElementById("lista");

function mesAtual() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    return `${hoje.getFullYear()}-${mes}`;
}

const MESES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let mesSelecionado = mesAtual();

function nomeDoMes(chave) {
    const [ano, mes] = chave.split("-");
    return `${MESES[Number(mes) - 1]} de ${ano}`;
}

function mudarMes(delta) {
    let [ano, mes] = mesSelecionado.split("-").map(Number);

    mes += delta;

    if (mes > 12) {
        mes = 1;
        ano++;
    }
    if (mes < 1) {
        mes = 12;
        ano--;
    }

    mesSelecionado = `${ano}-${String(mes).padStart(2, "0")}`;

    renderizar();
}

function lancamentoDoMes() {
    return lancamentos.filter((item) => item.data.startsWith(mesSelecionado));
}

function calcularResumo(lista) {
    let receitas = 0;
    let despesas = 0;

    lista.forEach((item) => {
        if (item.tipo === "receita") {
            receitas += item.valorCentavos;
        } else {
            despesas += item.valorCentavos;
        }
    });

    return { receitas, despesas, saldo: receitas - despesas };
}

function renderizarResumo() {
    const resumo = calcularResumo(lancamentoDoMes());
    document.getElementById("saldo").textContent = formatarMoeda(resumo.saldo);
    document.getElementById("total-receitas").textContent = formatarMoeda(resumo.receitas);
    document.getElementById("total-despesas").textContent = formatarMoeda(resumo.despesas);
}

function renderizar() {
    listaEl.innerHTML = "";

    const ordenados = [...lancamentoDoMes()].sort((a, b) => b.data.localeCompare(a.data));

    ordenados.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add(item.tipo);

        const info = document.createElement("div");
        info.className = "info";

        const titulo = document.createElement("strong");
        titulo.textContent = item.descricao;

        const meta = document.createElement("small");
        meta.textContent = `${formatarData(item.data)} · ${item.categoria}`;

        info.append(titulo, meta);

        const sinal = item.tipo === "despesa" ? "-" : "+";
        const valor = document.createElement("span");
        valor.className = "valor";
        valor.textContent = `${sinal} ${formatarMoeda(item.valorCentavos)}`;

        const botao = document.createElement("button");
        botao.textContent = "✕";
        botao.dataset.id = item.id;
        botao.setAttribute("aria-label", `Remover ${item.descricao}`);

        li.append(info, valor, botao);
        listaEl.append(li);
    });

    renderizarResumo();

    document.getElementById("mes-titulo").textContent = nomeDoMes(mesSelecionado);
}

const formEl = document.getElementById("form-lancamento");

function adicionar(evento) {
    evento.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const descricao = document.getElementById("descricao").value.trim();
    const valor = Number(document.getElementById("valor").value);
    const data = document.getElementById("data").value;
    const categoria = document.getElementById("categoria").value;

    if (!descricao || valor <= 0 || !data) return;

    lancamentos.push({
        id: Date.now(),
        tipo,
        descricao,
        valorCentavos: Math.round(valor * 100),
        data,
        categoria
    });

    salvar();
    renderizar();
    formEl.reset();
}

function remover(id) {
    lancamentos = lancamentos.filter((item) => item.id !== id);
    salvar();
    renderizar();
}

formEl.addEventListener("submit", adicionar);

listaEl.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-id]");
    if (!botao) return;
    remover(Number(botao.dataset.id));
});

document.getElementById("mes-anterior").addEventListener("click", () => mudarMes(-1));
document.getElementById("mes-proximo").addEventListener("click", () => mudarMes(1));

carregar();
renderizar();

const btnInstalar = document.getElementById("btn-instalar");
let eventoInstalacao = null;

window.addEventListener("beforeinstallprompt", (evento) => {
    evento.preventDefault();
    eventoInstalacao = evento;
    btnInstalar.hidden = false;
});

btnInstalar.addEventListener("click", async () => {
    if (!eventoInstalacao) return;

    eventoInstalacao.prompt();
    const escolha = await eventoInstalacao.userChoice;
    console.log(`Instalação: ${escolha.outcome}`);

    eventoInstalacao = null;
    btnInstalar.hidden = true;
});

window.addEventListener("appinstalled", () => {
    eventoInstalacao = null;
    btnInstalar.hidden = true;
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => console.log("Service worker registrado"))
            .catch((erro) => console.error("Falha ao registrar o service worker:", erro));
    })
}