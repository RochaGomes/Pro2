// obtem a data no formato padrao ,DIA/MES/ANO
function getDataAtual() {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    return dia + '/' + mes + '/' + ano;
}

// adicionar um envio à lista
function adicionarEnvio(nome, numero, email, cep, sugestao) {
    var listaEnvios = document.getElementById('lista-envios');

    var novaLinha = document.createElement('div');
    novaLinha.classList.add('envio');
    novaLinha.setAttribute('data-numero', numero);

    var data = document.createElement('span');
    data.textContent = getDataAtual();
    novaLinha.appendChild(data);

    var detalhes = document.createElement('div');
    detalhes.innerHTML = 'Número:' + numero + '|Nome: ' + nome + '<br>' + '|E-mail: ' + email + '<br>' + 'VSugestãoV' + '<br>' + sugestao;
    novaLinha.appendChild(detalhes);

    var excluirBotao = document.createElement('button');
    excluirBotao.textContent = 'Excluir';
    excluirBotao.addEventListener('click', function() {
        excluirEnvio(novaLinha);
    });
    novaLinha.appendChild(excluirBotao);

    listaEnvios.appendChild(novaLinha);

    // Salvar o que foi enviado no Local Storage
    var envios = JSON.parse(localStorage.getItem('envios')) || [];
    envios.push({
        nome: nome,
        numero: numero,
        email: email,
        cep: cep,
        sugestao: sugestao,
        data: getDataAtual()
    });
    localStorage.setItem('envios', JSON.stringify(envios));
}


//exclui o envio selecionado da lista 
function excluirEnvio(linha) {
    var listaEnvios = document.getElementById('lista-envios');
    listaEnvios.removeChild(linha);

    // Remover o envio do Local Storage
    var envios = JSON.parse(localStorage.getItem('envios') || '[]');
    var index = Array.from(listaEnvios.children).indexOf(linha);
    envios.splice(index, 1);
    localStorage.setItem('envios', JSON.stringify(envios));
}
////exclui todos os envios da lista
function excluirTodosEnvios() {
    var listaEnvios = document.getElementById('lista-envios');
    var envios = listaEnvios.getElementsByClassName('envio');

    // Remover os elementos da lista
    while (envios.length > 0) {
        listaEnvios.removeChild(envios[0]);
    }

    // Remover os envios do Local Storage
    localStorage.removeItem('envios');
}

// limpa os campos do formulário 
function limparCampos() {
    document.getElementById('formulario').reset();
}

//adiciona um envio à lista apos preencher os campos corretamente 
function adicionarEnvioToLista(envio) {
    var listaEnvios = document.getElementById('lista-envios');

    var novaLinha = document.createElement('div');
    novaLinha.classList.add('envio');
    novaLinha.setAttribute('data-numero', envio.numero);

    var data = document.createElement('span');
    data.textContent = envio.data;
    novaLinha.appendChild(data);

    var detalhes = document.createElement('div');
    detalhes.innerHTML = 'Número...' + envio.numero + '|Nome...: ' + envio.nome + '|E-mail...: ' + envio.email + '<br>' + '|Sugestão...:' + envio.sugestao;
    novaLinha.appendChild(detalhes);

    var excluirBotao = document.createElement('button');
    excluirBotao.textContent = 'Excluir';
    excluirBotao.addEventListener('click', function() {
        excluirEnvio(novaLinha);
    });
    novaLinha.appendChild(excluirBotao);

    listaEnvios.appendChild(novaLinha);
}

//filtra os envios com base no número correspondente ao envio inserido
function filtrarEnvios() {
    var filtroNumero = document.getElementById('pesquisa-numero').value;

    // Carregar envios do Local Storage para imprimilos na tela
    var envios = JSON.parse(localStorage.getItem('envios')) || [];

    // Verificar se há algum envio com o número inserido
    var envioFiltrado = envios.find(function(envio) {
        return envio.numero === filtroNumero;
    });

    if (envioFiltrado) {
        // Oculta todos os envios que não correspondem ao numero
        var listaEnvios = document.getElementById('lista-envios');
        var envios = listaEnvios.getElementsByClassName('envio');
        for (var i = 0; i < envios.length; i++) {
            envios[i].style.display = 'none';
        }

        // Adicionar o envio filtrado à lista e o exibe 
        var linha = document.querySelector('[data-numero="' + envioFiltrado.numero + '"]');
        if (!linha) {
            adicionarEnvioToLista(envioFiltrado);
        }
        linha = document.querySelector('[data-numero="' + envioFiltrado.numero + '"]');
        linha.style.display = 'block';
    } else {
    //caso não bata com nenhum envio
        alert('Nenhum envio encontrado com o número inserido.');
    }
}

// Carrega os envios salvos no Local Storage ao carregar a página
window.onload = function() {
    //evento de submissão ao formulário
    var formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Obtem os valores dos campos do formulário
        var nome = document.getElementById('nome').value;
        var numero = document.getElementById('numero').value;
        var email = document.getElementById('email').value;
        var cep = document.getElementById('cep').value;
        var sugestao = document.getElementById('sugestao').value;

        // Chamar a função adicionarEnvio com os valores dos campos
        adicionarEnvio(nome, numero, email, cep, sugestao);

        // Limpa os campos do formulário
        limparCampos();
    });

    // Carrega envios do Local Storage para adicioná-los à lista
    var envios = JSON.parse(localStorage.getItem('envios')) || [];
    envios.forEach(function(envio) {
        adicionarEnvioToLista(envio);
    });
};