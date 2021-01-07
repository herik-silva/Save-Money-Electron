const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

const ControllerLucros = require('./Controllers/ControllerLucros')();

const ControllerGastos = require('./Controllers/ControllerGastos')()


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
  });

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
        event.reply('render/changeIcon',[true, "OK"]);
    }
    else{
        BrowserWindow.getFocusedWindow().unmaximize();
        event.reply('render/changeIcon',[false, "desOK"]);
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

ipcMain.on('main/inserirCard',(event, arg)=>{
  const [card, tipo] = arg

  console.log("CRIADO: "+card.titulo);
  
  if(tipo=='Lucro'){
    ControllerLucros.then((Controller)=>{
      Controller.criarCard(card.titulo, card.valor, card.data);
    });
  }
  else{
    ControllerGastos.then((Controller)=>{
      Controller.criarCard(card.titulo, card.valor, card.data);
    })
  }
})

ipcMain.on('main/primeiroCarregamento', (event, arg)=>{
  ControllerLucros.then((Controller)=>{
    Controller.carregarCards().then(()=>{
      console.log("LISTA LUCROS: " + Controller.listaLucros);
      event.reply('render/primeiroCarregamento', [Controller.listaLucros, true, 'Lucro']);
    });
  });
  
  ControllerGastos.then((Controller)=>{
    Controller.carregarCards().then(()=>{
      console.log("LISTA GASTOS: " + Controller.listaGastos);
      event.reply('render/primeiroCarregamento', [Controller.listaGastos, true, 'Gasto']);
    })
  })
})

ipcMain.on('main/removerCard', (event,arg)=>{
  const [id, tipo] = arg;

  if(tipo=='Lucro'){
    console.log(`ID REMOVIDO: ${id}`);
    ControllerLucros.then((Controller)=>{
      Controller.removerCard(id);
    });
  }
  else{
    console.log(`ID REMOVIDO: ${id}`);
    ControllerGastos.then((Controller)=>{
      Controller.removerCard(id);
    });
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
    ControllerLucros.then((Controller)=>{
      Controller.atualizarCard(card.id,card.titulo, card.valor);
    });
  }
  else{
    ControllerGastos.then((Controller)=>{
      Controller.atualizarCard(card.id,card.titulo, card.valor);
    });
  }

  console.log("Atualizado!");
})