//#region Variables
let ganador = Math.floor(Math.random() * 100) + 1;
let ganadorVs = Math.floor(Math.random() * 20) + 1;
let intentos = 0;
let victorias = 0;
let tabla = document.createElement('table')
let tablaVs = document.querySelector("#tablaVs");
let tablaJugadores = document.querySelector("#top5");
let h2Single = tablaJugadores.getElementsByTagName("h2")[0]
let h2Vs = tablaVs.getElementsByTagName("h2")[0]
const chances = 5;
let partidoFinalizado = false;
const refresca = "Si querés volver a jugar, refrescá la página.";
let ulSingle = tablaJugadores.getElementsByTagName("ul")[0];
let ulVs = tablaVs.getElementsByTagName("ul")[0];
console.log(ulVs + "," + ulSingle)
let nombreJugador = '';
let procedenciaJugador = '';
let jugadores = []

const colorVictorioso = 'rgb(171, 250, 171)';
//#endregion

//#region Funciones

const esconderSecciones = function () {
    document.getElementById("one").style.display = "none"
    document.getElementById("two").style.display = "none"
    document.getElementById("main").style.display = "block"
}

esconderSecciones();

document.querySelector("#singlePlayer").addEventListener("click", singlePlayer)
document.querySelector("#vsBtn").addEventListener("click", vsBtn)

function singlePlayer() {
    if (partidoFinalizado) {
        alert(refresca)
        document.querySelector("#singlePlayer").disabled = true;
    }
    else {
        document.getElementById("main").style.display = "none"
        document.getElementById("one").style.display = "block"
    }

}

function vsBtn() {
    document.getElementById("main").style.display = "none"
    document.getElementById("two").style.display = "block"    
    consultarJugadorNuevo("vs");
}


const crearTabla = (parametro) => tabla.innerHTML = `<thead><tr><th>Nombre</th><th>Procedencia</th><th>${parametro}</th></tr></thead>`



function crearLinks(top5,criterio){    
    let li1 = document.createElement("li");
    li1.textContent = "Ver todos"        
    let h2;        
    let ul;
    (criterio == "intentos")?h2 = h2Single:h2 = h2Vs;
    (criterio == "intentos")?ul = ulSingle:ul = ulVs;
    console.log(ul)
    h2.innerHTML = "Top 5 Jugadores"
    li1.addEventListener("click",function(){
        h2.innerHTML = "Ganadores de hoy"                
        crearTabla(criterio);        
        (criterio == "intentos")?rellenarTabla(ordenarJugadores(criterio)):rellenaTablaVictorias(ordenarJugadores(criterio))            
    })
    let li2 = document.createElement("li");
    li2.textContent = "Ver top 5"        
    li2.addEventListener("click",
    function(){
        h2.innerHTML = "Top 5 jugadores"        
        crearTabla(criterio);        
        (criterio == "intentos")?rellenarTabla(top5):rellenaTablaVictorias(top5)            
    })
    console.log(li1 + "," + li2)
    
        ul.appendChild(li1)
        ul.appendChild(li2)    
        
    
    

    
}

const listar = (a) => tabla.innerHTML += `<tbody><tr><td>${a.nombre}</td><td>${a.procedencia}</td><td>${a.intentos}</td></tr></tbody>`
const llenarVs = (a) => tabla.innerHTML += `<tbody><tr><td>${a.nombre}</td><td>${a.procedencia}</td><td>${a.victorias}</td></tr></tbody>`
const rellenarTabla = (j) => j.forEach(listar);
const rellenaTablaVictorias = (j) => j.forEach(llenarVs)

const agregarFelicitaciones = function (texto) {
    let h3 = document.createElement('h3');
    h3.innerHTML = texto;
    tablaJugadores.appendChild(h3);
}



const consultarJugadorNuevo = function (modo) {


    while (nombreJugador == '' || nombreJugador == undefined || nombreJugador == null) {
        nombreJugador = prompt('Como te llamas?');
    }
    jugadorNuevo.nombre = nombreJugador;
    while (procedenciaJugador == '' || procedenciaJugador == undefined || procedenciaJugador == null) {
        procedenciaJugador = prompt('De donde eres?');
    }
    jugadorNuevo.nombre = nombreJugador;
    jugadorNuevo.procedencia = procedenciaJugador;            
    if(modo == "single"){
        jugadorNuevo.intentos = intentos;
    if(!existeJugador(jugadorNuevo.nombre, jugadorNuevo.procedencia)){
        jugadorNuevo.victorias = 0;
        jugadores.unshift(jugadorNuevo) 
        }else{
            sobrescribirIntentos(jugadorNuevo)
        }     
    }else{
        jugadorNuevo.nombre = nombreJugador;
        jugadorNuevo.procedencia = procedenciaJugador;
        if(!existeJugador(jugadorNuevo.nombre, jugadorNuevo.procedencia)){
            jugadorNuevo.victorias = 1;
            jugadorNuevo.intentos = 0;
            jugadores.unshift(jugadorNuevo)
        }else{
            sobrescribirVictorias(jugadorNuevo);
        } 
    }
    sincronizarStorage();
    
}



function ordenarJugadores(criterio){
    let jugadoresOrdenados;
    (criterio=="intentos")?jugadoresOrdenados = jugadores.sort((a, b) => a.intentos - b.intentos || a.nombre.localeCompare(b.nombre)).filter((j) => j.intentos > 0):jugadoresOrdenados = jugadores.sort((a, b) => a.victorias - b.victorias || a.nombre.localeCompare(b.nombre)).filter((j) => j.victorias > 0)
    return jugadoresOrdenados;    
}

function sobrescribirIntentos(jugadorEspecifico) {
    if(jugadorEspecifico.intentos<obtenerJugador(jugadorEspecifico.nombre, jugadorEspecifico.procedencia).intentos)obtenerJugador(jugadorEspecifico.nombre, jugadorEspecifico.procedencia).intentos = jugadorEspecifico.intentos
}

function sobrescribirVictorias(jugadorEspecifico){
    obtenerJugador(jugadorEspecifico.nombre, jugadorEspecifico.procedencia).victorias++;
}

function existeJugador(nombreJ, procedenciaJ) {
    let retorno;
    (obtenerJugador(nombreJ, procedenciaJ) != null) ? retorno = true : retorno = false;
    return retorno;
}

function numeroIncorrecto(numero) {
    let div = document.getElementsByTagName("div")[1]
    div.classList.remove("diverror")
    div.offsetWidth;
    div.classList.add("diverror")
    div.onanimationend = () => alert("Incorrecto, te quedan " + (chances - intentos) + " chances. Pista: " + pistaNumero(numero, chances - intentos));
}

document.querySelector("#boton").addEventListener("click", ingresarNumero)

function ingresarNumero() {
    let numero = Number(document.querySelector("#numero").value);
    if (!partidoFinalizado) {
        if (numero > 100 || numero < 1) alert("El número debe estar entre 1 y 100.")
        else
            if (!partidoFinalizado) {

                for (let i = 0; i <= chances; i++) {
                    intentos++;
                    if (!consultarNumero(numero)) {
                        if (intentos < chances) numeroIncorrecto(numero);
                    }
                    break;
                }
                if (consultarNumero(numero)) {
                    consultarJugadorNuevo("single");
                    tuResultado(colorVictorioso, `Felicidades ${jugadorNuevo.nombre}, adivinaste el número! `);
                }
                else if (intentos == chances) tuResultado('red', "Lo sentimos, perdiste la partida. El correcto erá: " + ganador + ". ");
            }
    }


}

document.querySelector("#botonVs").addEventListener("click", ingresarNumeroVs)

console.log("Ganador vs: " + ganadorVs)
console.log("Ganador 5 intentos: " + ganador)


let numerosElegidosRival = []
let numeroRival = Math.floor(Math.random() * 20) + 1;

function ingresarNumeroVs() {
    let tuNumero = Number(document.querySelector("#tuNumero").value);

    let ganasteTu = false;
    let ganoRival = false;

    if (tuNumero > 20 || tuNumero < 1) alert("El número debe estar entre 1 y 20.")
    else {
        if (!ganasteTu && !ganoRival) {

            while (!noEsta(numeroRival, numerosElegidosRival)) {
                numeroRival = Math.floor(Math.random() * 20) + 1;
            }
            document.querySelector("#respuestaRival").innerHTML = ` ${numeroRival}`
            
            numerosElegidosRival.push(numeroRival)
            ganasteTu = tuNumero == ganadorVs
            ganoRival = numeroRival == ganadorVs
            numerosElegidosRival.push(numeroRival)
            
        }
        if(ganasteTu || ganoRival){
            numeroElegidosRival = []            
            crearTabla("victorias");
            crearLinks(ordenarJugadores("victorias").slice(0,5),"victorias")            
            rellenaTablaVictorias(ordenarJugadores("victorias"))
            tablaVs.appendChild(tabla)                               
        }
    }
    (ganasteTu && !ganoRival) ? alert("Felicidades, ganaste.") : (ganoRival && !ganasteTu) ? alert("Gano tu Rival") : (!ganasteTu && !ganoRival)? alert("Sigan participando!"):alert("Felicidades, ganaste.")
    
    

}



function noEsta(num, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == num) return false
    }
    return true
}


function obtenerJugador(nombreJugador, procedenciaJugador) {
    for (let i = 0; i < jugadores.length; i++) {        
        if (jugadores[i].nombre == nombreJugador && jugadores[i].procedencia == procedenciaJugador) return jugadores[i];
    }
    return null;
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
    (numero > ganador) ? pista += "menor al número que pusiste." : pista += "mayor al número que pusiste."
    return pista;
}

const figuraEnTop5 = function (objeto, array) {
    if (objeto == array[0]) agregarFelicitaciones('Sos el mejor jugador! Te recomendamos que juegues a la quiniela.')
    for (let i = 1; i < array.length; i++)
        if (objeto == top5[i]) {
            agregarFelicitaciones('Felicitaciones! Estas en el top 5.');
            break
        }
}

function tuResultado(color, texto) {
    document.querySelector("#body").style.background = color;
    partidoFinalizado = true;
    document.querySelector("#boton").disabled = true
    alert(texto + refresca);        
    let top5 = ordenarJugadores("intentos").slice(0, 5);        
    crearTabla("intentos")
    rellenarTabla(top5)
    crearLinks(top5,"intentos");    
    tablaJugadores.appendChild(tabla);
    figuraEnTop5(jugadorNuevo, top5)
}







//#endregion

//#region Objetos

class Jugador {
    constructor(n, p, i, v) {
        this.nombre = n,
            this.procedencia = p,
            this.intentos = i,
            this.victorias = v

    }
}

let jugadorNuevo = new Jugador()



//#endregion

//#region localstorage

const sincronizarStorage = () => localStorage.setItem("jugadores", JSON.stringify(jugadores))


document.addEventListener('DOMContentLoaded', () => {
    jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

})

//#endregion

