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
  const [card, tipo] = arg;
  
  if(tipo=='Lucro'){
    ControllerLucros.criarCard(card[0].titulo,card[0].valor,card[0].data);
    ControllerLucros.carregarCards();
  }
  else{
    ControllerGastos.criarCard(card[0].titulo,card[0].valor,card[0].data);
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

ipcMain.on('main/removerCardLucro', (event,arg)=>{
  const [card, tipo] = arg;

  if(tipo=='Lucro'){
    ControllerLucros.removerCard(card);
  }
  else{
    ControllerGastos.removerCard(card);
  }
})

// Funcionando
ipcMain.on('main/atualizarCard',(event,arg)=>{
  console.log(`ID: ${arg[0]} - Titulo: ${arg[1]} - Valor: ${arg[2]}`);
  ControllerLucros.atualizarCard(arg[0],arg[1],arg[2]);
  console.log("Atualizado!");
})