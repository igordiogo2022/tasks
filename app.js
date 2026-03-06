let listas = JSON.parse(localStorage.getItem("listasLS") || "[]");
let listaTasks = JSON.parse(localStorage.getItem("listaTasksLS") || "[]");
let dados = JSON.parse(localStorage.getItem("dados")) || {version: 2, categorias: [], tarefas: []};
let [categorias, tarefas] = [dados.categorias, dados.tarefas];

// Exibe as categorias na tela
function carregarCategorias(){
    if(listas.length>0){
        listas.forEach(item => {
            let idCategoria = obterId(categorias);
            categorias.push({id: idCategoria, nome: item});
        });
        localStorage.setItem("dados", JSON.stringify(dados));
        localStorage.removeItem("listasLS");
    }
    if(listaTasks.length>0){
        listaTasks.forEach(tarefa => {
            let idTarefa = obterId(tarefas);
            let categoriaId = categorias.find(categoria => categoria.nome==tarefa[1]).id;
            dados.tarefas.push({id: idTarefa, tarefa: tarefa[0], categoria: categoriaId, situacao: tarefa[2]})
        });        
            localStorage.setItem("dados", JSON.stringify(dados));
        localStorage.removeItem("listaTasksLS");
    }

    categorias.forEach(categoria => {
        main = document.querySelector("main");
        main.innerHTML += `<div class='cardCategoria'>
        <p class='iconeCard'><i class='fa-solid fa-clipboard-check'></i></p>
        <p>${categoria.nome}</p>
        <div class='botoesCard'>
            <button onclick='verCategoria(${categoria.id})'>Ver</button>
            <button onclick='carregarFormulario(${categoria.id})'>Editar</button>
            <button onclick='preRemoverCategoria(${categoria.id})' id='btnDeletar${categoria.id}'>Deletar</button>
        </div>
        </div>`;
    });
}

function obterId(lista){
    return (lista[lista.length-1] || {id:0}).id+1;
}
function verCategoria(id){
    window.location.href = `task.html?categoria=${id}`;
}

// Exibe as tarefas na tela
function carregarTarefas(){ 
    const parametros = new URLSearchParams(window.location.search);
    const categoriaId = parametros.get("categoria");
    const categoria = categorias.find(categoria => categoria.id==categoriaId);
    const btnFormulario = document.querySelector("#btnFormulario");
    
    btnFormulario.setAttribute("onclick", `adicionarTarefa(${categoria.id})`);
    
    titulo = document.getElementById("titulo");
    titulo.innerHTML = categoria.nome;
    
    const tarefasSelecionadas = tarefas.filter(tarefa => tarefa.categoria==categoria.id);
    
    const tabelaTasks = document.getElementById("listaItens");
    tarefasSelecionadas.forEach(tarefa => {
        tdTask = document.createElement("td");
        tdAcao = document.createElement("td");
        checkbox = document.createElement("input");
        tr = document.createElement("tr"); 
        tr.id = "tr"+tarefa.id;
    
        tdTask.innerHTML = tarefa.tarefa;
        
        checkbox.type = "checkbox";
        checkbox.id = "cb"+tarefa.id;
        checkbox.setAttribute("onclick","mudaSituacao("+tarefa.id+")");
        
        tdAcao.classList.add("acoes");
        tdAcao.appendChild(checkbox);
        
        tr.appendChild(tdTask);
        tr.appendChild(tdAcao);
        
        
        if(tarefa.situacao=="concluida"){
            tr.style.backgroundColor = "green";
            tr.style.textDecoration = "line-through";
            tr.style.fontStyle = "italic";
            checkbox.checked = true;
        }else if(tarefa.situacao=="pendente"){
            tr.style.backgroundColor = "var(--cor1)";
            checkbox.checked = false;
        }
        
        tabelaTasks.appendChild(tr);
    });
    
    tr = document.createElement("tr");
    
    apagarConcluidasTd = document.createElement("td");
    apagarConcluidasTd.setAttribute("colspan", "3");

    btn = document.createElement("button");
    btn.setAttribute("onclick", "apagarTarefasConcluidas("+categoria.id+")");
    btn.innerHTML = "<i class='fa-solid fa-trash'></i> Apagar já Concluídas";
    btn.id = "apagarConcluidasBtn";

    apagarConcluidasTd.appendChild(btn);
    tr.appendChild(apagarConcluidasTd);
    
    tabelaTasks.appendChild(tr);
}

function criarCategoria(){
    nomeCategoria = document.querySelector("#categoriaInput").value;
    
    id = obterId(categorias);
    categorias.push({id: id, nome: nomeCategoria});
    
    localStorage.setItem("dados", JSON.stringify(dados));
    window.location.href = `index.html`;
}

function carregarFormulario(idCategoria){
    const categoriaInput = document.querySelector("#categoriaInput");
    const btnFormulario = document.querySelector("#btnFormulario");
    let categoriaSelecionada = categorias.find(item => item.id==idCategoria);

    categoriaInput.value = categoriaSelecionada.nome;
    btnFormulario.setAttribute("onclick", `editarCategoria(${idCategoria})`);
}

function editarCategoria(idCategoria){
    nomeCategoria = document.querySelector("#categoriaInput").value;

    let categoriaSelecionada = categorias.find(item => item.id==idCategoria);
    
    categoriaSelecionada.nome = nomeCategoria;
    localStorage.setItem("dados", JSON.stringify(dados));
}

function preRemoverCategoria(idCategoria){
    const btnDeletar = document.querySelector("#btnDeletar"+idCategoria);
    btnDeletar.style.backgroundColor = "#c41e1e";
    btnDeletar.style.color = "white";
    btnDeletar.textContent = "Confirmar";
    btnDeletar.setAttribute("onclick", "removerCategoria("+idCategoria+")");
}

function removerCategoria(idCategoria){
    dados.categorias = categorias.filter(item => item.id!=idCategoria);
    limparTarefas(idCategoria);
    localStorage.setItem("dados", JSON.stringify(dados));
    window.location.reload();
}

function adicionarTarefa(idCategoria){
    let categoriaSelecionada = categorias.find(item => item.id==idCategoria); 
    
    let id = obterId(tarefas);
    let tarefa = document.getElementById("tarefaInput").value; 
    let situacao = "pendente";
    
    tarefas.push({id: id, tarefa: tarefa, categoria: categoriaSelecionada.id, situacao: situacao});
    
    localStorage.setItem("dados", JSON.stringify(dados));
    window.location.href = `task.html?categoria=${idCategoria}`;
}

function editarTarefa(lista){
    indexProcurado = document.getElementById("index").value;
    taskNome = document.getElementById("nomeInput").value;

    indexLista = 0;
    indexGeral = 0;

    for(const task of listaTasks){
        console.log(indexGeral,indexLista);
        if(lista == task[1]){
            if(indexLista == indexProcurado-1){
                listaTasks[indexGeral][0] = taskNome;
                localStorage.setItem("listaTasksLS", JSON.stringify(listaTasks));
            }else{
                indexGeral++;
                indexLista++;
            }

        }else{
            indexGeral++;
        }
    }

    if(indexGeral>listaTasks.length){
        alert("Index não encontrado");
    }
}

function mudaSituacao(id){
    const checkbox = document.querySelector("#cb"+id);
    const tr = document.querySelector("#tr"+id);
    let tarefa = tarefas.find(item => item.id == id);

    if(checkbox.checked){
        tarefa.situacao = "concluida";
        tr.style.backgroundColor = "green";
        tr.style.textDecoration = "line-through";
        tr.style.fontStyle = "italic";
    }else{
        tr.style.backgroundColor = "var(--cor1)";
        tr.style.textDecoration = "none";
        tr.style.fontStyle = "none";
        tarefa.situacao = "pendente";
    }
    localStorage.setItem("dados", JSON.stringify(dados));
}

function apagarTarefasConcluidas(categoriaId){
    dados.tarefas = tarefas.filter(tarefa => tarefa.situacao=="pendente" || tarefa.categoria!=categoriaId);
    console.log(dados);
    localStorage.setItem("dados", JSON.stringify(dados));
    window.location.reload();
}

function limparTarefas(categoriaId){
    dados.tarefas = tarefas.filter(tarefa => tarefa.categoria!=categoriaId);
}