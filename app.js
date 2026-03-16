let listas = JSON.parse(localStorage.getItem("listasLS") || "[]");
let listaTasks = JSON.parse(localStorage.getItem("listaTasksLS") || "[]");
let dados = JSON.parse(localStorage.getItem("dados")) || {version: 2, categorias: [], tarefas: []};
let [categorias, tarefas] = [dados.categorias, dados.tarefas];

// ----- FUNÇÕES DE CARREGAMENTO -----
function carregarCategorias(){
    converterDadosLocalStorage();
    let htmlCategorias = "";
    
    categorias.forEach(categoria => {
        htmlCategorias += `<div class='cardCategoria'>
        <p class='iconeCard'><i class='fa-solid fa-clipboard-check'></i></p>
        <p>${categoria.nome}</p>
        <button class='btnVerCategoria btnCard' onclick="acessarLink('task.html?categoria=${categoria.id}')">Ver</button>
        <div class='botoesCard'>
        <button class='btnCard' onclick='carregarFormulario("categorias", ${categoria.id})'>Editar</button>
        <button class='btnCard' onclick='preRemoverCategoria(${categoria.id})' id='btnDeletar${categoria.id}'>Deletar</button>
        </div>
        </div>`;
    });
    main = document.querySelector("main");
    main.innerHTML = htmlCategorias;
}

function carregarTarefas(){ 
    const parametros = new URLSearchParams(window.location.search);
    const categoriaId = parametros.get("categoria");
    const categoria = categorias.find(categoria => categoria.id==categoriaId);
    const btnFormulario = document.querySelector("#btnFormulario");
    
    btnFormulario.setAttribute("onclick", `adicionarTarefa(${categoria.id})`);
    
    titulo = document.getElementById("titulo");
    titulo.innerHTML = categoria.nome;
    
    const tarefasSelecionadas = tarefas.filter(tarefa => tarefa.categoria==categoria.id);
    
    const tabelaTarefas = document.getElementById("listaItens");
    let htmlTarefas = "";

    tarefasSelecionadas.forEach(tarefa => {
        if(tarefa.situacao=="concluida"){
            classeTr = "concluida";
            checked = "checked=true";
        }else if(tarefa.situacao=="pendente"){
            classeTr = "pendente";
            checked = "";
        }

        htmlTarefas += `<tr id='tr${tarefa.id}' class='${classeTr}'>
        <td>${tarefa.tarefa}</td>
        <td><button id='btnEditar' onclick='carregarFormulario("tarefas", ${tarefa.id})'><i class="fa-solid fa-pen"></i></button></td>
        <td class='checkboxTd'><input type='checkbox' id='cb${tarefa.id}' onclick='mudaSituacao(${tarefa.id})' ${checked}></td>
        </tr>`; 
    });

    htmlTarefas += `<tr>
    <td colspan="3">
    <button onclick="apagarTarefasConcluidas(${categoria.id})" id="apagarConcluidasBtn"><i class="fa-solid fa-trash" aria-hidden="true"></i> Apagar já Concluídas</button>
    </td>
    </tr>`;   

    tabelaTarefas.innerHTML = htmlTarefas;
}

function carregarFormulario(tipo, idItem){
    window.scrollTo({top: 0});
    const input = document.querySelector("#inputFormulario");
    const btnFormulario = document.querySelector("#btnFormulario");
    
    if(tipo=="tarefas"){
        let itemSelecionado = tarefas.find(item => item.id==idItem);
        btnFormulario.setAttribute("onclick", `editarTarefa(${itemSelecionado.id})`);
        input.value = itemSelecionado.tarefa;
    }else if(tipo=="categorias"){
        let itemSelecionado = categorias.find(item => item.id==idItem);
        btnFormulario.setAttribute("onclick", `editarCategoria(${itemSelecionado.id})`);
        input.value = itemSelecionado.nome;
    }
}

// ----- FUNÇÕES DE CRIAR/EDITAR/DELETAR -----
function criarCategoria(){
    nomeCategoria = document.querySelector("#inputFormulario").value;
    
    id = obterId(categorias);
    categorias.push({id: id, nome: nomeCategoria});
    
    salvarDados();
    acessarLink(`index.html`);
}

function editarCategoria(idCategoria){
    nomeCategoria = document.querySelector("#inputFormulario").value;
    
    let categoriaSelecionada = categorias.find(item => item.id==idCategoria);
    
    categoriaSelecionada.nome = nomeCategoria;
    salvarDados();
    acessarLink(`index.html`);
}

function preRemoverCategoria(idCategoria){
    const btnDeletar = document.querySelector("#btnDeletar"+idCategoria);
    btnDeletar.style.background = "linear-gradient(#c41e1e, #b41616)";
    btnDeletar.style.color = "white";
    btnDeletar.textContent = "Confirmar";
    btnDeletar.setAttribute("onclick", "removerCategoria("+idCategoria+")");
}

function removerCategoria(idCategoria){
    dados.categorias = categorias.filter(item => item.id!=idCategoria);
    limparTarefas(idCategoria);
    salvarDados();
    window.location.reload();
}

function adicionarTarefa(idCategoria){
    let categoriaSelecionada = categorias.find(item => item.id==idCategoria); 
    
    let id = obterId(tarefas);
    let tarefa = document.getElementById("inputFormulario").value; 
    let situacao = "pendente";
    
    tarefas.push({id: id, tarefa: tarefa, categoria: categoriaSelecionada.id, situacao: situacao});
    
    salvarDados();
    acessarLink(`task.html?categoria=${idCategoria}`);
}

function editarTarefa(idTarefa){
    nomeTarefa = document.querySelector("#inputFormulario").value;
    
    let tarefaSelecionada = tarefas.find(item => item.id==idTarefa);
    
    tarefaSelecionada.tarefa = nomeTarefa;
    salvarDados();
    window.location.reload();
}

// ----- FUNÇÕES AUXILIARES -----
function converterDadosLocalStorage(){
    if(listas.length>0){
        listas.forEach(item => {
            let idCategoria = obterId(categorias);
            categorias.push({id: idCategoria, nome: item});
        });
        salvarDados();
        localStorage.removeItem("listasLS");
    }
    if(listaTasks.length>0){
        listaTasks.forEach(tarefa => {
            let idTarefa = obterId(tarefas);
            let categoriaId = categorias.find(categoria => categoria.nome==tarefa[1]).id;
            dados.tarefas.push({id: idTarefa, tarefa: tarefa[0], categoria: categoriaId, situacao: tarefa[2]})
        });        
        salvarDados();
        localStorage.removeItem("listaTasksLS");
    }
}

function mudaSituacao(id){
    const checkbox = document.querySelector("#cb"+id);
    const tr = document.querySelector("#tr"+id);
    let tarefa = tarefas.find(item => item.id == id);
    
    if(checkbox.checked){
        tarefa.situacao = "concluida";
        tr.style.background = "linear-gradient(-30deg, var(--cor4), var(--cor5)";
        tr.style.textDecoration = "line-through";
        tr.style.fontStyle = "italic";
    }else{
        tr.style.background = "var(--cor1)";
        tr.style.textDecoration = "none";
        tr.style.fontStyle = "none";
        tarefa.situacao = "pendente";
    }

    salvarDados();
}

function apagarTarefasConcluidas(categoriaId){
    dados.tarefas = tarefas.filter(tarefa => tarefa.situacao=="pendente" || tarefa.categoria!=categoriaId);
    salvarDados();
    window.location.reload();
}

let limparTarefas = (categoriaId) => { dados.tarefas = tarefas.filter(tarefa => tarefa.categoria!=categoriaId) };

let obterId = (lista) => (lista[lista.length-1] || {id:0}).id+1;

let acessarLink = (link) => { window.location.href = link };

let salvarDados = () => {localStorage.setItem("dados", JSON.stringify(dados))};