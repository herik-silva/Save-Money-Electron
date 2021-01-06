const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
var ControllerLucros, ControllerGastos;

require('./Controllers/ControllerLucros')().then((value)=>{
  ControllerLucros = value;
});

require('./Controllers/ControllerGastos')().then((value)=>{
  ControllerGastos = value;
})


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    show: false,
    minimizable: true,
    frame: false,
    resizable: true,
    icon: './resources/logoApp.png',
    webPreferences: {
      nodeIntegration: true,
    }
  })

  win.loadFile(path.join(`${__dirname}/src/index.html`));

  win.once('ready-to-show', ()=>{
      win.show();
  })
}

ipcMain.on('main/resolution',(event,arg)=>{
  event.reply('render/resolution',screen.getPrimaryDisplay().size);
})

// Fecha janela quando usuário clicar em fechar
ipcMain.on('main/close',(event,arg)=>{
   BrowserWindow.getFocusedWindow().close();
})

ipcMain.on('main/minimize',(event,arg)=>{
    BrowserWindow.getFocusedWindow().minimize();
})

ipcMain.on('main/cangeIcon',(event,isMaximized)=>{
  if(isMaximized){
    event.reply('render/changeIcon',true);
  }
  else{
      event.reply('render/changeIcon',false);
  }
})

ipcMain.on('main/maximize',(event,isMaximized)=>{
    if(isMaximized){
        BrowserWindow.getFocusedWindow().maximize();
        event.reply('render/changeIcon',true);
    }
    else{
        BrowserWindow.getFocusedWindow().unmaximize();
        event.reply('render/changeIcon',false);
    }
})

// Mantem a janela sempre no topo caso o usuário defina
ipcMain.on('main/top',(event,arg)=>{
    BrowserWindow.getFocusedWindow().setAlwaysOnTop(arg);
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

// Banco de Dados

ipcMain.on('main/editarValor',(event,arg)=>{
  const [id, titulo, valor, tipo] = arg;

  if(tipo=='Lucro'){
    ControllerLucros.atualizarCard(id, titulo, valor);
  }
  else{
    ControllerGastos.atualizarCard(id, titulo, valor);
  }
})

ipcMain.on('main/inserirCard',(event, arg)=>{
  const [card, tipo] = arg

  console.log("CRIADO: "+card.titulo);
  
  if(tipo=='Lucro'){
    ControllerLucros.criarCard(card.titulo,card.valor,card.data);
    ControllerLucros.carregarCards();
  }
  else{
    ControllerGastos.criarCard(card.titulo,card.valor,card.data);
    ControllerGastos.carregarCards();
  }
})

ipcMain.on('main/primeiroCarregamento', (event, arg)=>{
  ControllerLucros.carregarCards().then((value)=>{
    console.log(`Enviando: ${ControllerLucros.listaLucros}`);
    event.reply('render/primeiroCarregamento', [ControllerLucros.listaLucros, true, 'Lucro']);
  });
  
  ControllerGastos.carregarCards().then((value)=>{
    console.log(`Enviando Gastos: ${ControllerGastos.listaGastos}`);
    event.reply('render/primeiroCarregamento', [ControllerGastos.listaGastos, true, 'Gasto']);
  })
})

ipcMain.on('main/removerCard', (event,arg)=>{
  const [id, tipo] = arg;

  if(tipo=='Lucro'){
    console.log(`ID REMOVIDO: ${id}`);
    ControllerLucros.removerCard(id);
  }
  else{
    console.log(`ID REMOVIDO: ${id}`);
    ControllerGastos.removerCard(id);
  }
})

// Funcionando
ipcMain.on('main/atualizarCard',(event,arg)=>{
  const card = {
    id: arg[0],
    titulo: arg[1],
    valor: arg[2],
    tipo: arg[3]
  }
  
  console.log("TIPO: ", card.tipo);
  console.log(`ID: ${card.id} - Titulo: ${card.titulo} - Valor: ${card.valor}`);

  if(card.tipo=='Lucro'){
    ControllerLucros.atualizarCard(card.id,card.titulo,card.valor);
  }
  else{
    ControllerGastos.atualizarCard(card.id,card.titulo,card.valor);
  }

  console.log("Atualizado!");
})