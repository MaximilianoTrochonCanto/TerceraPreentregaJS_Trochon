//#region Variables
let ganador = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
const chances = 5;
const refresca = "Si querés volver a jugar, refrescá la página.";
let tabla = document.createElement('table')
let tablaJugadores = document.querySelector("#top5");
let ul = tablaJugadores.getElementsByTagName("ul");

const colorVictorioso = 'rgb(171, 250, 171)';
//#endregion

//#region Funciones

const esconderSecciones = function(){
    document.getElementById("one").style.display = "none"
    document.getElementById("two").style.display = "none"
    document.getElementById("main").style.display = "block"
} 

esconderSecciones();

document.querySelector("#singlePlayer").addEventListener("click",singlePlayer)
document.querySelector("#vsBtn").addEventListener("click",vsBtn)

function singlePlayer(){
    document.getElementById("main").style.display = "none"
    document.getElementById("one").style.display = "block"
}

function vsBtn(){
    document.getElementById("main").style.display = "none"
    document.getElementById("two").style.display = "block"
}


const crearTabla = function(){                
    tabla.innerHTML = `<thead><tr><th>Nombre</th><th>Procedencia</th><th>Intentos</th></tr></thead>`
    
}

function crearLinks(h2,top5){    
    let li1 = document.createElement("li");
    li1.textContent = "Ver todos"        
    li1.addEventListener("click",function(){
        h2.innerHTML = "Ganadores de hoy"
        crearTabla();
        
        rellenarTabla(jugadoresPrecargados)            

    })
    let li2 = document.createElement("li");
    li2.textContent = "Ver top 5"        
    li2.addEventListener("click",
    function(){
        h2.innerHTML = "Top 5 jugadores"
        crearTabla();
        
        rellenarTabla(top5)        
    })
    ul[0].appendChild(li1)
    ul[0].appendChild(li2)
    

    
}


const listar = (a) => tabla.innerHTML += `<tbody><tr><td>${a.nombre}</td><td>${a.procedencia}</td><td>${a.intentos}</td></tr></tbody>`
const rellenarTabla = (j) => j.forEach(listar);

const agregarFelicitaciones = function(texto){
    let h3 = document.createElement('h3');    
    h3.innerHTML = texto;    
    tablaJugadores.appendChild(h3);
}

const consultarJugadorNuevo = function(){
    
    let nombreJugador = '';
    let procedenciaJugador = '';
    while(nombreJugador == '' || nombreJugador == undefined || nombreJugador == null){
        nombreJugador = prompt('Como te llamas?');
    }    
    jugadorNuevo.nombre = nombreJugador;
    while(procedenciaJugador == '' || procedenciaJugador == undefined || procedenciaJugador == null){
        procedenciaJugador = prompt('De donde eres?');
    }
    jugadorNuevo.procedencia = procedenciaJugador;
    jugadorNuevo.intentos = intentos;
    jugadoresPrecargados.unshift(jugadorNuevo);
    
    
}

function numeroIncorrecto(numero) {
    document.querySelector("#div1").classList.remove("diverror")
    document.querySelector("#div1").offsetWidth;
    document.querySelector("#div1").classList.add("diverror")
    document.querySelector("#div1").onanimationend = () => alert("Incorrecto, te quedan " + (chances-intentos) + " chances. Pista: " + pistaNumero(numero, chances - intentos));
}

function ingresarNumero() {
    let numero = Number(document.querySelector("#numero").value);
    if (numero > 100 || numero < 1) alert("El número debe estar entre 1 y 100.")
    else
        for (let i = 0; i <= chances; i++) {
            intentos++;
            if (!consultarNumero(numero)) {                                
                if (intentos < chances) numeroIncorrecto(numero);
            }
            break;
        }
    if (consultarNumero(numero)){
        consultarJugadorNuevo();
        tuResultado(colorVictorioso, `Felicidades ${jugadorNuevo.nombre}, adivinaste el número! `);
    }
    
    else if (intentos == chances) tuResultado('red', "Lo sentimos, perdiste la partida. El correcto erá: " + ganador + ". ");
}

const consultarNumero = (numero) => numero == ganador;

function pistaNumero(numero, chances) {
    let pista = "";
    if (chances == 4) {
        switch (true) {
            case ganador % 10 == 0:
                pista = "El numero es múltiplo de 10 y también "
                break;
            case ganador % 5 == 0:
                pista = "El numero es múltiplo de 5 y también "
                break;
            case ganador % 2 == 0:
                pista = "El numero es par y también "
                break;
            case ganador % 2 != 0:
                pista = "El numero es impar y también "
                break;
        }
    } else {
        switch (true) {
            case ganador > 0 && ganador < 16:
                pista = "El numero esta entre 1-15 y es "
                break;
            case ganador > 15 && ganador < 31:
                pista = "El numero esta entre 16-30 y es "
                break;
            case ganador > 30 && ganador < 46:
                pista = "El numero esta entre 31-45 y es "
                break;
            case ganador > 45 && ganador < 61:
                pista = "El numero esta entre 46-60 y es "
                break;
            case ganador > 60 && ganador < 76:
                pista = "El numero esta entre 61-75 y es "
                break;
            case ganador > 75 && ganador < 90:
                pista = "El numero esta entre 76-90 y es "
                break;
            default:
                pista = "El numero es mayor a 90 y es "
        }
    }
    (numero > ganador)? pista += "menor al número que pusiste.": pista += "mayor al número que pusiste."
    return pista;
}

const figuraEnTop5 = function(objeto,top5){
    if(objeto == top5[0])agregarFelicitaciones('Sos el mejor jugador! Te recomendamos que juegues a la quiniela.')
    for(let i = 1; i < top5.length;i++)
    if (objeto == top5[i]){
        agregarFelicitaciones('Felicitaciones! Estas en el top 5.');
        break
    }    
}

function tuResultado(color, texto) {                   
    document.querySelector("#boton").disabled = true;
    document.querySelector("#body").style.background = color;
    alert(texto + refresca);    
    crearTabla();
    let top5 = jugadoresOrdenados.slice(0,5);
    let h2 = tablaJugadores.getElementsByTagName("h2")[0]
    h2.innerHTML = "Top 5 jugadores"
    crearLinks(h2,top5);
    rellenarTabla(top5);
    tablaJugadores.appendChild(tabla);    
    figuraEnTop5(jugadorNuevo,top5)
} 


    
    



//#endregion

//#region Objetos

class Jugador{
    constructor(n,p,i){
        this.nombre = n,
        this.procedencia = p,
        this.intentos = i
        
    }
}

let jugadorNuevo = new Jugador()

let jugadoresPrecargados = [
    {
        "nombre":'xxXJuancit00Xxx',
        "procedencia":'Nirvana',
        "intentos": (Math.random() * (5-3) + 3).toFixed(0)        
    },
    {
        "nombre":'Yeluzzzz',
        "procedencia":'Cordoba',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'MatiCNdeF',
        "procedencia":'Barros Blancos',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Miliiii<3',
        "procedencia":'BarbieWorld',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Ruben Silva',
        "procedencia":'Buenos Aires, Argentina.',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'L0rdV0lde3m0rt',
        "procedencia":'Slytheryn',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'RauwwwPasoMolino',
        "procedencia":'Del Paso Molino yatusabe',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Maluma Maluma',
        "procedencia":'ARG',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'D.Martinss',
        "procedencia":'NovoHamburgo',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Yenderson.C',
        "procedencia":'Varadero',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'ManuelAA',
        "procedencia":'IslaDelEntretenimiento',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'卢卡斯 ',
        "procedencia":'台湾',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'伊莎贝尔',
        "procedencia":'上海',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'L4P1ZZZconsciente',
        "procedencia":'RD',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'YOLOSwaGG',
        "procedencia":'LA',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'LuuuGonzalez2000',
        "procedencia":'Corrientes',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'VanessaSoarez99',
        "procedencia":'BahiaBR',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Pipitaaa12',
        "procedencia":'CABJ',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'444555Luahn',
        "procedencia":'Shangai',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'RobertoCarlos',
        "procedencia":'?',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'JoaoLema',
        "procedencia":'BR<3',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Chiníítáá',
        "procedencia":'Marte',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'xXLulzzXx',
        "procedencia":'Andromeda',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
    {
        "nombre":'Farruko ;)',
        "procedencia":'PR',
        "intentos":(Math.random() * (5-3) + 3).toFixed(0)
    },
]

let jugadoresOrdenados = jugadoresPrecargados.sort((a,b) => a.intentos - b.intentos || a.nombre.localeCompare(b.nombre));    

//#endregion

//#region localstorage
localStorage.clear()
localStorage.setItem("Jugadores",JSON.stringify(jugadoresPrecargados));
localStorage.setItem("JugadoresOrdenados",JSON.stringify(jugadoresOrdenados));
//#endregion

