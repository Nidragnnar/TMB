// ========== Fórmulas ==========
// Mifflin-St Jeor (1990): a mais usada hoje para adultos
function tmbMifflin({ peso, alturaCm, idade, sexo }) {
    const base = 10 * peso + 6.25 * alturaCm - 5 * idade;
    return sexo === "masculino" ? base + 5 : base - 161;
}

// Harris-Benedict revisada por Roza e Shizgal (1984), para comparação
function tmbHarrisBenedict({ peso, alturaCm, idade, sexo }) {
    return sexo === "masculino"
        ? 88.362 + 13.397 * peso + 4.799 * alturaCm - 5.677 * idade
        : 447.593 + 9.247 * peso + 3.098 * alturaCm - 4.33 * idade;
}

// Fatores de atividade física usados para estimar o gasto diário
const ATIVIDADES = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    ativo: 1.725,
    muitoAtivo: 1.9,
};

// Ajustes de referência para as metas (kcal por dia)
const DEFICIT = 500; // cerca de 0,5 kg a menos por semana
const SUPERAVIT = 300; // ganho de peso gradual

// ========== Leitura e validação ==========
// Aceita vírgula ou ponto como separador decimal ("70,5" ou "70.5")
function lerNumero(texto) {
    const limpo = texto.trim().replace(",", ".");
    if (limpo === "" || !/^\d+(\.\d+)?$/.test(limpo)) return NaN;
    return Number(limpo);
}

function validarPeso(texto) {
    if (texto.trim() === "") return { erro: "Informe seu peso." };
    const peso = lerNumero(texto);
    if (Number.isNaN(peso)) return { erro: "Use apenas números, por exemplo 70 ou 70,5." };
    if (peso < 20 || peso > 400) return { erro: "O peso deve ficar entre 20 e 400 kg." };
    return { valor: peso };
}

// Altura até 3 é tratada como metros (1,75 → 175 cm)
function validarAltura(texto) {
    if (texto.trim() === "") return { erro: "Informe sua altura." };
    const numero = lerNumero(texto);
    if (Number.isNaN(numero)) return { erro: "Use apenas números, por exemplo 1,75 ou 175." };
    const alturaCm = numero <= 3 ? numero * 100 : numero;
    if (alturaCm < 100 || alturaCm > 250) return { erro: "A altura deve ficar entre 100 e 250 cm." };
    return { valor: alturaCm };
}

function validarIdade(texto) {
    if (texto.trim() === "") return { erro: "Informe sua idade." };
    const idade = lerNumero(texto);
    if (Number.isNaN(idade) || !Number.isInteger(idade)) return { erro: "Use um número inteiro, por exemplo 30." };
    if (idade < 15 || idade > 100) return { erro: "As fórmulas valem para idades entre 15 e 100 anos." };
    return { valor: idade };
}

const kcal = (valor) => Math.round(valor).toLocaleString("pt-BR");

// ========== Interface ==========
const form = document.querySelector("#form-tmb");
const campos = {
    peso: { el: document.querySelector("#peso"), validar: validarPeso },
    altura: { el: document.querySelector("#altura"), validar: validarAltura },
    idade: { el: document.querySelector("#idade"), validar: validarIdade },
};
const resultado = document.querySelector(".resultado");
const saida = {
    tmb: document.querySelector("#valor-tmb"),
    get: document.querySelector("#valor-get"),
    harris: document.querySelector("#valor-harris"),
    perder: document.querySelector("#meta-perder"),
    manter: document.querySelector("#meta-manter"),
    ganhar: document.querySelector("#meta-ganhar"),
    aviso: document.querySelector("#aviso-deficit"),
};

function mostrarErro(campo, mensagem) {
    const grupo = campo.closest(".campo");
    grupo.classList.toggle("invalido", Boolean(mensagem));
    grupo.querySelector(".erro").textContent = mensagem || "";
    campo.setAttribute("aria-invalid", Boolean(mensagem));
}

function valorMarcado(nome) {
    return form.querySelector(`input[name=${nome}]:checked`)?.value;
}

// Enquanto a pessoa digita só apagamos erros já corrigidos; os avisos aparecem
// ao sair do campo ou ao enviar, para não reclamar de "17" no meio de "175"
function atualizar(mostrarErros) {
    const lidos = {};
    let valido = true;

    for (const [nome, { el, validar }] of Object.entries(campos)) {
        const r = validar(el.value);
        if (mostrarErros) mostrarErro(el, r.erro);
        else if (!r.erro) mostrarErro(el, "");
        if (r.erro) valido = false;
        lidos[nome] = r.valor;
    }

    if (!valido) {
        resultado.classList.remove("visivel");
        return false;
    }

    const dados = {
        peso: lidos.peso,
        alturaCm: lidos.altura,
        idade: lidos.idade,
        sexo: valorMarcado("sexo"),
    };
    const tmb = tmbMifflin(dados);
    const get = tmb * ATIVIDADES[valorMarcado("atividade")];
    const perder = get - DEFICIT;

    saida.tmb.textContent = kcal(tmb);
    saida.get.textContent = kcal(get);
    saida.harris.textContent = kcal(tmbHarrisBenedict(dados));
    saida.perder.textContent = kcal(perder);
    saida.manter.textContent = kcal(get);
    saida.ganhar.textContent = kcal(get + SUPERAVIT);
    saida.aviso.hidden = perder >= tmb;

    resultado.classList.add("visivel");
    return true;
}

Object.values(campos).forEach(({ el, validar }) => {
    el.addEventListener("input", () => atualizar(false));
    el.addEventListener("blur", () => {
        if (el.value.trim() !== "") mostrarErro(el, validar(el.value).erro);
    });
});

form.querySelectorAll("input[type=radio]").forEach((radio) => {
    radio.addEventListener("change", () => atualizar(false));
});

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!atualizar(true)) {
        form.querySelector(".invalido input").focus();
    } else {
        resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
});

form.addEventListener("reset", () => {
    Object.values(campos).forEach(({ el }) => mostrarErro(el, ""));
    resultado.classList.remove("visivel");
    campos.peso.el.focus();
});
