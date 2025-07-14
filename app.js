// verifica se a lista já foi criada no LocalStorage
try{
    listas = JSON.parse(localStorage.getItem("listasLS"));
    if(listas == null){
        listas = [];
    }
}catch{
    listas = [];
}
// verifica se a listaTasks já foi criada no LocalStorage
try{
    listaTasks = JSON.parse(localStorage.getItem("listaTasksLS"));
    if(listaTasks == null){
        listaTasks = [];
    }
}catch{
    listaTasks = [];
}


// Exibe as listas na tela
function carregarListas(){
    
    if(listas.length>0){
        contadorIndex = 1;
        for (const lista of listas){
            divLista = document.createElement("a");
            divLista.href = "task.html?nome="+lista;
            divLista.classList.add("divLista");
            divLista.innerHTML = contadorIndex+"."+lista;

            contadorIndex++;
            
            main = document.querySelector("main");
            main.appendChild(divLista);
        }
    }
}

// Exibe as tasks na tela
function carregarTasks(){
    const parametros = new URLSearchParams(window.location.search);
    const lista = parametros.get("nome");
    
    adicionarBtn = document.getElementById("adicionar");
    editarBtn = document.getElementById("editar");
    excluirBtn = document.getElementById("excluir");
    adicionarBtn.href = "formulario.html?acao=adicionar&tipo=task&lista="+lista;
    editarBtn.href = "formulario.html?acao=editar&tipo=task&lista="+lista;
    excluirBtn.href = "formulario.html?acao=excluir&tipo=task&lista="+lista;
    
    titulo = document.getElementById("titulo");
    titulo.innerHTML = lista;
    
    if(listaTasks.length>0){
        contadorIndex = 1;
        id = 0;
        for (const task of listaTasks){
            if(task[1]==lista){
                tdIndex = document.createElement("td");
                tdTask = document.createElement("td");
                tdAcao = document.createElement("td");
                checkbox = document.createElement("input");
                tr = document.createElement("tr"); 
        
                tdIndex.innerHTML = contadorIndex;
                contadorIndex++;
                tdTask.innerHTML = task[0];
                
                checkbox.type = "checkbox";
                checkbox.id = "cb"+id;
                checkbox.setAttribute("onclick","mudaSituacao("+id+")");
                
                tdAcao.classList.add("acoes");
                tdAcao.appendChild(checkbox);
                
                tr.appendChild(tdIndex);
                tr.appendChild(tdTask);
                tr.appendChild(tdAcao);
                
                tabelaTasks = document.getElementById("listaItens");

                if(task[2]=="concluida"){
                    marcarConcluido(tr);
                    checkbox.checked = true;
                }else if(task[2]=="pendente"){
                    desmarcarConcluido(tr);
                    checkbox.checked = false;
                }
                
                tabelaTasks.appendChild(tr);
            }
            id++;
        }
    }
}


function verificarAcao(){
    const parametros = new URLSearchParams(window.location.search);
    const acao = parametros.get("acao");
    const tipo = parametros.get("tipo");
    
    if(tipo=="lista"){
        label = document.getElementById("nomeLb");
            input = document.getElementById("nomeInput");
            botao = document.getElementById("botao");
            label.innerHTML="Nome";
            input.placeholder = " Nome";
            botao.href = "index.html";
            
        if(acao=="criar"){
            document.getElementById("divIndex").style.display = "none";
            botao.setAttribute("onclick","criarLista()");
            document.getElementById("titulo").innerHTML = "Criar Lista";
            
        }else if(acao=="editar"){
            document.getElementById("titulo").innerHTML = "Editar Lista";
            botao.setAttribute("onclick","editarLista()");
            
        }else if(acao=="remover"){
            document.getElementById("divTasks").style.display = "none";
            document.getElementById("titulo").innerHTML = "Remover Lista";
            botao.setAttribute("onclick","removerLista()");
        }
        
    }else if(tipo=="task"){
        const parametros = new URLSearchParams(window.location.search);
        const lista = parametros.get("lista");
        botao = document.getElementById("botao");
        botao.href = "task.html?nome="+lista;
        if(acao=="adicionar"){
            document.getElementById("divIndex").style.display = "none";
            botao.setAttribute("onclick","adicionarTask()");
            document.getElementById("titulo").innerHTML = "Adicionar Task";
            
        }else if(acao=="editar"){
            document.getElementById("titulo").innerHTML = "Editar Task";
            botao.setAttribute("onclick","editarTask('"+lista+"')");
            
        }else if(acao=="excluir"){
            document.getElementById("divTasks").style.display = "none";
            document.getElementById("titulo").innerHTML = "Excluir Task";
            botao.setAttribute("onclick","excluirTask('"+lista+"')");
        }
    }   
}

function criarLista(){
    nomeLista = document.getElementById("nomeInput").value;
    
    listas.push(nomeLista);
    
    localStorage.setItem("listasLS", JSON.stringify(listas));
}

function editarLista(){
    index = document.getElementById("index").value;
    nomeLista = document.getElementById("nomeInput").value;
    if(index>listas.length){
        alert("Index não encontrado");
    }else{
        for(let i=1; i<listaTasks.length; i++){
            if(listas[index-1] == listaTasks[i][1]){
                listaTasks[i][1] = nomeLista;
            }
        }
        
        listas[index-1] = nomeLista;
        localStorage.setItem("listasLS", JSON.stringify(listas));
        localStorage.setItem("listaTasksLS", JSON.stringify(listaTasks));
    }
}

function removerLista(){
    index = document.getElementById("index").value;
    if(index>listas.length){
        alert("Index não encontrado");
    }else{
        for(let i=1; i<listaTasks.length; i++){
            if(listas[index-1] == listaTasks[i][1]){
                listaTasks.splice(i, 1);
            }
        }
        
        listas.splice(index-1, 1)
        localStorage.setItem("listasLS", JSON.stringify(listas));
        localStorage.setItem("listaTasksLS", JSON.stringify(listaTasks));
    }
    
}

function adicionarTask(){
    const parametros = new URLSearchParams(window.location.search);
    const lista = parametros.get("lista");
    
    task = document.getElementById("nomeInput").value; 
    situacao = "pendente";
    
    listaTasks.push([task, lista, situacao]);
    
    localStorage.setItem("listaTasksLS", JSON.stringify(listaTasks));
}

function editarTask(lista){
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

function excluirTask(lista){
    indexProcurado = document.getElementById("index").value;
    
    indexLista = 0;
    indexGeral = 0;
    
    for(const task of listaTasks){
        if(lista == task[1]){
            if(indexLista == indexProcurado-1){
                listaTasks.splice(indexGeral, 1)
                localStorage.setItem("listaTasksLS", JSON.stringify(listaTasks));
                indexLista++;
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
    checkbox = document.getElementById("cb"+id);

    if(checkbox.checked){
        listaTasks[id][2] = "concluida";
        limparTasks();
        carregarTasks();
    }else{
        listaTasks[id][2] = "pendente";
        limparTasks();
        carregarTasks();
    }
    localStorage.setItem("listaTasksLS", JSON.stringify(listaTasks));
}

function limparTasks(){
    tr = document.querySelectorAll("tr");
    for (let i=1; i<tr.length; i++){
        tr[i].remove();
    }
}

function marcarConcluido(item){
    item.style.backgroundColor = "green";
    item.style.textDecoration = "line-through";
    item.style.fontStyle = "italic";
}

function desmarcarConcluido(item){
    item.style.backgroundColor = "var(--cor1)";
}