const score = document.getElementById("score");
const cabibara = document.getElementById("cabibara_img");
const title = document.querySelector(".h1");
const storeContainer = document.getElementById("store-items");

const professores = {
    tetimulher: { nome: "Teti Mulher", preco: 50, bonus: 1, img: "assets/cabibara_1.png", background: "url('assets/cozinha.webp')" },
    tetianao: { nome: "Teti Anão", preco: 300, bonus: 3, img: "assets/cabibara_2.png", background: "url('assets/anao.webp')" },
    tetisupremo: { nome: "Teti Supremo", preco: 1500, bonus: 6, img: "assets/cabibara_3.jpg", background: "url('assets/sala.jpg')" },
    silviogoat: { nome: "Silvio Goat", preco: 5000, bonus: 9, img: "assets/Silviogoat.jpeg", background: "url('assets/ibura.jpg')" },
    silviofurry: { nome: "Silvio Furry", preco: 10000, bonus: 14, img: "assets/silviogoatfurry.png", background: "url('assets/academia.jpg')" },
    silviofurryshiny: { nome: "Silvio Furry Shiny", preco: 100000000000000, bonus: 99999, img: "assets/silviofurryshiny.png", background: "url('assets/silviofurryshiny.png')" }
};

let i = Number(localStorage.getItem('score')) || 0;
let bonus = 1;
let professoresComprados = JSON.parse(localStorage.getItem('professores_comprados') || '{}');

const session = localStorage.getItem("nickname");

if (!session) {
    window.location.href = "index.html";
    throw new Error("Usuário não logado / Não tente burlar");
} else {
    title.innerText = `Professor Clicker - ${session}`;
}

function load() {
    score.textContent = i;
    checarAnimacoes();
}

function saveScore() {
    localStorage.setItem('score', i);
}

function saveScoreInDB() {
    fetch(`/${session}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: i })
    })
}

function saveProfessoresComprados() {
    localStorage.setItem('professores_comprados', JSON.stringify(professoresComprados));
}

setInterval(() => {
    saveScore();
    saveScoreInDB();
    saveProfessoresComprados();
}, 3000);

function count() {
    i += bonus;
    load();
    saveScore();
    score.classList.remove("pop");
    cabibara.classList.remove("pop");
    void score.offsetWidth;
    score.classList.add("pop");
    cabibara.classList.add("pop");
}

function checarAnimacoes() {
    for (let id in professores) {
        const btn = document.getElementById(id);
        if (!professoresComprados[id] && i >= professores[id].preco) {
            btn?.classList.add("compravel");
        } else {
            btn?.classList.remove("compravel");
        }
    }
}

function comprarProfessor(id) {
    const prof = professores[id];
    if (!prof) return;
    if (!professoresComprados[id]) {
        if (i >= prof.preco) {
            i -= prof.preco;
            bonus = prof.bonus;
            professoresComprados[id] = true;
            cabibara.src = prof.img;
            document.body.style.backgroundImage = prof.background;
            document.getElementById(id)?.classList.remove("compravel");
            document.getElementById(id)?.classList.add("comprado");
            notify(`Você comprou ${prof.nome} ✅`);
            saveProfessoresComprados();
            load();
        } else {
            notify('Erro: saldo insuficiente ❌', "error");
        }
    } else {
        cabibara.src = prof.img;
        document.body.style.backgroundImage = prof.background;
        bonus = prof.bonus;
    }
}

function resetGame() {
    const confirmReset = confirm("Tem certeza que deseja reiniciar o jogo? Todo progresso será perdido.");
    if (!confirmReset);
    i = 0;
    bonus = 1;
    for (let id in professores) {
        professoresComprados[id] = false;
        document.getElementById(id)?.classList.remove("comprado", "compravel");
    }
    cabibara.src = "assets/cabibara.png";
    document.body.style.backgroundImage = "none";
    document.getElementById("notification-container").innerHTML = "";
    localStorage.clear();
    load();
    saveScore();
    alert("Jogo reiniciado!");
   
}

function notify(message, type = "normal") {
    const container = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.classList.add("notification");
    if (type === "error") notification.classList.add("error");
    notification.innerText = message;
    container.appendChild(notification);
    setTimeout(() => {
        notification.classList.add("show");
    }, 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 1000);
    }, 3000);
}

const menuToggle = document.getElementById("menu-toggle");
const store = document.querySelector(".store");

menuToggle.addEventListener("click", () => {
    store.classList.toggle("active");
    menuToggle.classList.toggle("active");
});

for (let id in professores) {
    const prof = professores[id];
    const btn = document.createElement("button");
    btn.id = id;
    btn.onclick = () => comprarProfessor(id);
    btn.innerHTML = `
        <div class="prof-name">${prof.nome}</div>
        <img class="icon" src="${prof.img}" alt="${prof.nome}">
        <span>${prof.preco}</span>
    `;
    storeContainer.appendChild(btn);
}

load();
