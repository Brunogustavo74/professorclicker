const session = localStorage.getItem('score');


function redirectToGame() {
    window.location.href = "game.html";
}

function saveNickname() {
    const nickname = document.getElementById("nicknameInput").value.trim();
    const display = document.getElementById("nicknameDisplay");

    if (nickname === "") {
        alert("Digite um nome antes de continuar!");
        return;
    }

    localStorage.clear(); // apaga cache
    
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("tipo_usuario", "login");

    saveUser(nickname)
        .then(response => response.json())
        .then(data => {
            if (data.error && data.error.includes("já existe")) {
                display.innerText = "Este nome já está em uso. Escolha outro nome.";
                display.style.display = "block";
            } else if (data.user) {
                localStorage.setItem("nickname", nickname);
                display.innerText = "Bem-vindo, " + nickname + "!";
                display.style.display = "block";
                redirectToGame();
            } else {
                display.innerText = "Erro ao criar usuário!";
                display.style.display = "block";
            }
        })
        .catch(() => {
            display.innerText = "Erro de conexão com a API!";
            display.style.display = "block";
        });

    // setTimeout(() => window.location.href = "#l", 1500);
}

function saveUser(nickname) {
    return fetch("https://professorclicker-api.vercel.app/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: nickname })
    })
}
