const { ipcRenderer } = require('electron');

const screen = {
    w: 0,
    h: 0
}

const btnLucros = { 
    element: document.querySelector('.Lucros'),
    ativo: true,
    
    controller: ()=>{
        if(btnLucros.ativo==false){
            btnLucros.ativo = true;
            btnGastos.ativo = false;
            document.querySelector('.item-gasto').style.display = 'none';
            document.querySelector('.item-lucro').style.display = 'flex';
        }
    }
}

const btnGastos = { 
    element: document.querySelector('.Gastos'),
    ativo: false,
    
    controller: ()=>{
        if(btnGastos.ativo==false){
            btnGastos.ativo = true;
            btnLucros.ativo = false;
            document.querySelector('.item-lucro').style.display = 'none';
            document.querySelector('.item-gasto').style.display = 'flex';
        }
    }
}

btnLucros.element.addEventListener('click', btnLucros.controller);
btnGastos.element.addEventListener('click', btnGastos.controller);


const botaoFechar = {
    element: document.querySelector('.fecharBtn'),

    close: ()=>{
        ipcRenderer.send('main/close',null);
    },

    init: ()=>{
        botaoFechar.element.addEventListener('click',()=>{
            botaoFechar.close();
        })
    },
}

const botaoMinimizar = {
    element: document.querySelector('.minimizarBtn'),

    minimize: ()=>{
        ipcRenderer.send('main/minimize',null);
    },

    init: ()=>{
        botaoMinimizar.element.addEventListener('click',()=>{
            botaoMinimizar.minimize();
        })
    },
}

const botaoMaximizar = {
    isOnMaximized: false,
    element: document.querySelector('.maximizarBtn'),

    maximize: ()=>{
        botaoMaximizar.isOnMaximized = !botaoMaximizar.isOnMaximized;
        ipcRenderer.send('main/maximize',botaoMaximizar.isOnMaximized);
    },

    init: ()=>{
        botaoMaximizar.element.addEventListener('click',()=>{
            botaoMaximizar.maximize();
        })
        ipcRenderer.on('render/changeIcon',(event,arg)=>{
            if(botaoMaximizar.isOnMaximized){
                document.getElementById('maximizar').setAttribute('src','../resources/unmaximize.png')
            }
            else{
                document.getElementById('maximizar').setAttribute('src','../resources/maximize.png')
            }
        })
    },
}

const botaoSempreTopo = {
    isOnTop: false,
    element: document.querySelector('.sempreTopoBtn'),

    setTop: ()=>{
        botaoSempreTopo.isOnTop = !botaoSempreTopo.isOnTop;
        ipcRenderer.send('main/top',botaoSempreTopo.isOnTop);
    },

    init: ()=>{
        botaoSempreTopo.element.addEventListener('click',()=>{
            botaoSempreTopo.setTop();
            if(botaoSempreTopo.isOnTop){
                document.getElementById('sempre_topo').setAttribute('src','../resources/onTop.png')
            }
            else{
                document.getElementById('sempre_topo').setAttribute('src','../resources/offTop.png')
            }
        })
    }
}

ipcRenderer.send('main/resolution',null);
ipcRenderer.on('render/resolution',(event,arg)=>{
    screen.w = arg.width;
    screen.h = arg.height;
})

botaoFechar.init();
botaoSempreTopo.init();
botaoMinimizar.init();
botaoMaximizar.init();

setInterval(()=>{
    const tela_cheia = screen.w == window.innerWidth && screen.h == window.innerHeight+40;
    if(tela_cheia){
        ipcRenderer.send('main/changeIcon',true);
        botaoMaximizar.isOnMaximized = true;
        document.getElementById('maximizar').setAttribute('src','../resources/unmaximize.png')
    }
    else{
        ipcRenderer.send('main/changeIcon',false);
        botaoMaximizar.isOnMaximized = false;
        document.getElementById('maximizar').setAttribute('src','../resources/maximize.png')
    }
},500);

