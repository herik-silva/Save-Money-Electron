var auto_increment=1;
const listaLucros = [];
const listaGastos = [];

const valor = {
    lucro: 0,
    gasto: 0,
    saldoAtual: 0
}

const novoCardLucro = document.querySelector('.item-lucro .novoItem');
const novoCardGasto = document.querySelector('.item-gasto .novoItem');

function toNumber(value){
    console.log("ATUALIZANDO");
    return parseFloat(value.split('R$ ')[1]);
}

function criarItem(id, titulo,valor,data){
    const date = new Date();
    var dia,mes;

    if(date.getMonth() < 10){
        mes = `0${date.getMonth()+1}`;
    }
    else{
        mes = date.getMonth()+1;
    }

    if(date.getDate()>10){
        dia = date.getDate();
    }
    else{
        dia = `0${date.getDate()}`;
    }

    let novoLucro = {
        id: id || auto_increment++,
        titulo: titulo,
        valor: valor,
        data: data  || `${dia}/${mes}/${date.getFullYear()}`
    }

    return novoLucro;
}

function trocarElemento(elementoA,elementoB){
    elementoA.style.display = 'none';
    elementoB.style.display = 'block';
}

function carregamento(listaLucros){
    console.log(listaLucros);
    
}

function criarCard(elemento,tipo, cardEnviado, carregamento){
    const itens = document.querySelector(elemento);
    const novoItem = document.querySelector(`${elemento} .novoItem`);
    itens.removeChild(novoItem);

    if(cardEnviado==null){
        var novoLucro = criarItem(null,'Ex: Salário','Ex: 1045');
    }
    else{
        var novoLucro = criarItem(cardEnviado.id ,cardEnviado.titulo, cardEnviado.valor, cardEnviado.data);
    }

    const item = document.createElement('div');
    item.setAttribute('class',`item${tipo}`);
    if(cardEnviado == null){
        item.id = novoLucro.id;
    }
    else{
        item.id = cardEnviado.id;
    }

    const titulo_marquee = document.createElement('marquee');
    titulo_marquee.setAttribute('class','nome');
    if(cardEnviado==null){
        titulo_marquee.innerText = novoLucro.titulo;
    }
    else{
        console.log("Atualizado mesmo!")
        titulo_marquee.innerText = cardEnviado.titulo;
    }
    
    const titulo_input = document.createElement('input');
    titulo_input.setAttribute('class','nome');
    titulo_input.style.display = 'none';
    titulo_input.style.textAlign = 'center';

    titulo_marquee.addEventListener('click',()=>{
        titulo_input.value = titulo_marquee.innerText;
        trocarElemento(titulo_marquee, titulo_input);
    });

    titulo_input.addEventListener('blur',()=>{
        titulo_marquee.innerText = titulo_input.value;
        trocarElemento(titulo_input, titulo_marquee);
        var aux = parseFloat(valor.value.split('R$ ')[1]);

        ipcRenderer.send('main/atualizarCard', [item.id, titulo_marquee.innerText, aux, tipo]);
    })
    
    const valor = document.createElement('input');
    valor.setAttribute('class','valor');
    valor.placeholder = novoLucro.valor;
    if(cardEnviado==null){
        valor.value = "R$ 0";
    }
    else{
        valor.value = `R$ ${cardEnviado.valor}`;
    }
    
    valor.onfocus = ()=>{
        removeRS(valor);
    }
    valor.addEventListener('blur',()=>{
        concatRS(valor, tipo);
        console.log("Atualizando Preço");
        var valor_card = parseFloat(valor.value.split('R$ ')[1]);

        ipcRenderer.send('main/atualizarCard', [item.id, titulo_marquee.innerText , valor_card, tipo]);
    })

    const data = document.createElement('span');
    data.innerText = novoLucro.data;

    const botao = document.createElement('button');
   
    // Remover Item
    botao.addEventListener('click',()=>{
        var itemEncontrado;

        if(tipo=='Lucro'){
            itemEncontrado = listaLucros.find(itemProcurado => itemProcurado.id == item.id);
            // Alocando elementos e removendo o ultimo elemento
            listaLucros.forEach((valor,index)=>{
                if(valor.id == itemEncontrado.id){
                    for(let i=index; i<listaLucros.length; i++){
                        listaLucros[i] = listaLucros[i+1];
                    }
                    console.log("Removido!");
                    console.log("ID: " + valor.id);
                    ipcRenderer.send("main/removerCard", [valor.id, tipo]);
                    listaLucros.pop();
                    return
                }
            });

            calcularLucros();
        }
        else{
            itemEncontrado = listaGastos.find(itemProcurado => itemProcurado.id == item.id);

            // Alocando elementos e removendo o ultimo elemento
            listaGastos.forEach((valor,index)=>{
                if(valor.id == itemEncontrado.id){
                    for(let i=index; i<listaGastos.length; i++){
                        listaGastos[i] = listaGastos[i+1];
                    }
                    listaGastos.pop();
                    return
                }
            })

            calcularGastos();
        }
    
        itens.removeChild(itemEncontrado);

        calcularSaldoAtual();
    })

    botao.innerText = "Remover";

    item.appendChild(titulo_marquee);
    item.appendChild(titulo_input);
    item.appendChild(valor);
    item.appendChild(data);
    item.appendChild(botao);

    itens.appendChild(item);
    itens.appendChild(novoItem);
    
    // Adicionado na lista de itens

    if(tipo=='Lucro'){
        listaLucros.push(item);
        calcularLucros();
    }
    else{
        listaGastos.push(item);
        calcularGastos();
    }

    if(!carregamento){
        if(tipo=='Lucro'){
            novoLucro.valor = parseFloat(valor.value.split('R$ ')[1]);
            ipcRenderer.send('main/inserirCard',[novoLucro, tipo]);
        }
        else{
            novoLucro.valor = parseFloat(valor.value.split('R$ ')[1]);
            ipcRenderer.send('main/inserirCard',[novoLucro, tipo]);
        }
    }
}

function removeRS(input){
    if(input.value.length>0){
        var string = input.value;
        input.value = string.split("R$ ")[1]
    }
}

function concatRS(input, tipo){
    if(input.value.length>0){
        input.value = `R$ ${input.value}`;
        if(tipo=='Lucro'){
            calcularLucros();
        }else{
            calcularGastos();
        }
    }
}

function calcularLucros(){
    const lucroAtual = document.getElementById('lucroAtual');
    var lucro=0;
    listaLucros.forEach((item)=>{
        let valor = item.children[2].value.split('R$ ')[1];
        lucro += parseFloat(valor);
    });

    valor.lucro = lucro;

    lucroAtual.value = valor.lucro.toLocaleString('pt-br',{style:'currency',currency:'BRL',currencyDisplay: 'symbol'});

    calcularSaldoAtual();
}

function calcularGastos(){
    const gastoAtual = document.getElementById('gastoAtual');
    var gasto=0;
    listaGastos.forEach((item)=>{
        let valor = item.children[2].value.split('R$ ')[1];
        gasto += parseFloat(valor);
    });

    valor.gasto = gasto;

    gastoAtual.value = valor.gasto.toLocaleString('pt-br',{style:'currency',currency:'BRL',currencyDisplay: 'symbol'});

    calcularSaldoAtual();
}

function calcularSaldoAtual(){
    var saldo = valor.lucro - valor.gasto;

    valor.saldoAtual = saldo;

    saldoAtual.value = valor.saldoAtual.toLocaleString('pt-br',{style:'currency',currency:'BRL',currencyDisplay: 'symbol'});
}

novoCardLucro.addEventListener('click', ()=>{
    criarCard('.item-lucro .itens', 'Lucro', null);
});

novoCardGasto.addEventListener('click',()=>{
    criarCard('.item-gasto .itens', 'Gasto', null);
})

ipcRenderer.send('main/primeiroCarregamento', null);
ipcRenderer.on('render/primeiroCarregamento', (event, arg)=>{
    const [array, carregamento, tipo] = arg;
    console.log(array + "\n TIPO: "+tipo);
    if(array.length>0 && tipo=='Lucro'){
        console.log("Carregando cards");
        for(let i=0; i<array.length; i++){
            criarCard('.item-lucro .itens', tipo, array[i], carregamento);
        }
        // Ultimo id do card 
        auto_increment = array[array.length-1].id+1;
    }

    if(array.length>0 && tipo=='Gasto'){
        console.log("Carregando Gastos");
        for(let i=0; i<array.length; i++){
            criarCard('.item-gasto .itens', tipo, array[i], carregamento);
        }
        auto_increment = array[array.length-1].id+1;
    }
})