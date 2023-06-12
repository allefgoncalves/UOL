axios.defaults.headers.common['Authorization'] = 'ab7bm1T0yWe01HwEY4ZPFk8l';

const mensagens = [];

//funcao de erro
function erro(erro){
    if ( erro.response.status === 400){
        alert("Status code: 400");  // Ex: 404
        window.location.reload();
    }else{
        alert("Mensagem de erro: "+ erro.response.data);// Ex: Not Found
    }
}

function renderizarmensagens(){
    const ulmensagens = document.querySelector('.corpo_mensagem');
    ulmensagens.innerHTML = '';

    //varrer a lista de msg
    const arrayMensagens = mensagens.map( function(mensagem){
        //pegar a lista
        if ( mensagem.type === 'message'){
        //add <LI> na <LU>
        return `
        <li data-test="message">
            <div class="mensagem">
                <span class="horario">${mensagem.time}</span>
                <strong class="go-to">${mensagem.from}</strong>
                <span> para </span>
                <strong>${mensagem.to}: </strong>
                <span class="mensagem-texto">${mensagem.text}</span>
            </div>
        </li> 
        `;
        }else if ( mensagem.type === 'status'){
            return `
                <li class="entrada-saida">
                    <span class="horario">${mensagem.time}</span>
                    <strong>${mensagem.from}</strong>          
                    <span>${mensagem.text}</span>            
                </li>            
            `;
        }
    }); 
}

renderizarmensagens()

function erroManterConectado(erro){
    alert('usuario desconectado');
    clearInterval( idIntervalStatus );
    clearInterval( idIntervalMens );
}

function manterConectado(){
    const promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', {name: nomeUsuario});
    promise.catch( erroManterConectado );
}

const usuario = [
    {   
       name: ""
   }
   ];

const nomeUsuario="";

function entrarNoChat(){
    nomeUsuario = prompt('Digite seu nome');
    while(  nomeUsuario === ""){
        alert('Nome de usuário inválido!');
        nomeUsuario = prompt('Digite seu nome');
    }

    usuario.mane = nomeUsuario;

    const promise = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', usuario);
    
    promise.then( resposta => {
        idIntervalStatus = setInterval( manterConectado , 5000); //verificar status a cada 5s
        idIntervalMens = setInterval( buscarMensagens, 3000); // atualiza mensagens a cada 3s
    });

    promise.catch( function(erro){
        if ( erro.response.status === 400){
            alert('Já existe um usuário online com esse nome!');
            window.location.reload();
        }else{
            alert('erro no servidor');
        }
    });
}

entrarNoChat();

function buscarMensagens(){
    const promise = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promise.then( sucessoMensagens );
    promise.catch( erroMensagens );    
}

function sucessoMensagens(resposta){
    console.log(resposta.data);
    mensagens = resposta.data;
    renderizarMensagens();
}

function erroMensagens(erro){
    console.log(erro);
}