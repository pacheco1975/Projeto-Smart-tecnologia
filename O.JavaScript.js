const premios = [
    "💸 R$50 em compras", "  📱Ganhou uma capinha", "🚫 Ops! Nada desta vez",
    "🛍️ Vale R$20", "🎉 Cupom de 10%", "🔁 Girar novamente",
    "🎯 Cupom de 30%", "🤩 Cupom 15% desconto"
];
const premiosDiv = document.getElementById("premios");
const resultado = document.getElementById("resultado");
const roleta = document.getElementById("roleta");
const somGiro = document.getElementById("somGiro");
const somPremio = document.getElementById("somPremio");
let anguloAtual = 0;

premios.forEach((txt, i) => {
    const el = document.createElement("div");
    el.className = "premio";
    const ang = (360 / premios.length) * i;
    el.style.backgroundColor = i % 2 ? "#3f51b5" : "#e91e63";
    el.style.transform = `rotate(${ang}deg) translate(100%) rotate(-${ang}deg)`;
    el.textContent = txt;
    premiosDiv.appendChild(el);
});

document.getElementById("cpf").addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
});

function girarRoleta() {
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    if (cpf.length !== 11) {
        alert("Digite um CPF válido.");
        return;
    }

    const chave = "cpf_" + cpf;
    const registro = JSON.parse(localStorage.getItem(chave));

    if (registro?.data && registro.premio !== "🔁 Girar novamente") {
        const ultima = new Date(registro.data);
        const hoje = new Date();
        const dias = Math.floor((hoje - ultima) / (1000 * 60 * 60 * 24));
        if (dias < 30) {
            alert(`Você já girou! Faltam ${30 - dias} dia(s) para tentar de novo.`);
            return;
        }
    }

    const idx = Math.floor(Math.random() * premios.length);
    const degs = 360 / premios.length;
    const alvo = idx * degs + degs / 2;
    const voltas = 5;
    const angFinal = voltas * 360 + alvo;

    anguloAtual -= angFinal;
    roleta.style.transform = `rotate(${anguloAtual}deg)`;
    somGiro.currentTime = 0;
    somGiro.play();

    setTimeout(() => {
        const premio = premios[idx];
        resultado.textContent = `👏 E o prêmio é: ${premio}`;
        somPremio.currentTime = 0;
        somPremio.play();

        if (premio !== "🔁 Girar novamente") {
            localStorage.setItem(chave, JSON.stringify({
                premio,
                data: new Date().toISOString()
            }));
        } else {
            alert("Você ganhou um giro extra! Pode girar novamente 🎉");
        }

        // Enviar para WhatsApp
        const texto = `CPF: ${cpf}\nPrêmio: ${premio}`;
        const numero = "5549984321016";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
        window.open(url, "_blank");
    }, 5200);
}