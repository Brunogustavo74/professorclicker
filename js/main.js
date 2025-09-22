const score = document.getElementById("score");
const cabibara = document.getElementById("cabibara_img");
const title = document.querySelector(".h1");
const click = document.querySelector("#click");
const storeContainer = document.getElementById("store-items");
const menuToggle = document.getElementById("menu-toggle");
const store = document.getElementById("store");

const professores = {
    tetimulher: { nome: "Teti Mulher", preco: 50, bonus: 2, img: "assets/cabibara_1.png", background: "url('assets/cozinha.webp')" },
    tetianao: { nome: "Teti Anão", preco: 300, bonus: 3, img: "assets/cabibara_2.png", background: "url('assets/anao.webp')" },
    tetisupremo: { nome: "Teti Supremo", preco: 1500, bonus: 5, img: "assets/cabibara_3.jpg", background: "url('assets/sala.jpg')" },
    FelipeBase: { nome: "Felipe O Físico", preco: 2500, bonus: 9, img: "assets/FelipeBase.jpeg", background: "url('assets/Fisica.jpg')" },
 Richardson: { nome: "Master Rick", preco: 7500, bonus: 11, img: "assets/Richardson.png", background: "url('assets/Program.jpeg')" },
    silviogoat: { nome: "Silvio Goat", preco: 10000, bonus: 13, img: "assets/Silviogoat.jpeg", background: "url('assets/ibura.jpg')" },
    silviofurry: { nome: "Silvio Furry", preco: 50000, bonus: 17, img: "assets/silviogoatfurry.png", background: "url('assets/academia.jpg')" },
    silviofurryshiny: { nome: "Silvio Furry Shiny", preco: 100000000000000, bonus: 99999, img: "assets/silviofurryshiny.png", background: "url('assets/City.jpg')" }
};

let i = Number(localStorage.getItem('score')) || 0;
let bonus = 1;
let professoresComprados = JSON.parse(localStorage.getItem('professores_comprados') || '{}');
const session = localStorage.getItem("nickname");


if (!session) {
    window.location.href = "index.html";
    throw new Error("Usuário não logado / Não tente burlar");
} else {
    title.innerText = `${session}`;
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
    });
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
    click.classList.remove("popp");
    score.classList.remove("pop");
    void score.offsetWidth;
    score.classList.add("pop");
    click.classList.add("popp");
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
    if (!confirmReset) return;

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
    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 1000);
    }, 3000);
}



menuToggle.addEventListener("click", () => {
    store.classList.toggle("active");
    menuToggle.classList.toggle("active");

    const icon = menuToggle.querySelector("i");

   
    icon.style.transition = "transform 0.4s ease";
    icon.style.transform = "rotate(180deg)";

    setTimeout(() => {
        if (store.classList.contains("active")) {
            icon.classList.remove("fa-store");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-store");
        }
   
        icon.style.transform = "rotate(0deg)";
    }, 200);
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
