//#region Variables
let nombreJugador = procedenciaJugador = '';
let ganador = intentos = victorias = 0;
let numeroRival = Math.floor(Math.random() * 20) + 1;
let tabla = document.createElement('table')
let tablaVs = document.querySelector("#tablaVs");
let tablaJugadores = document.querySelector("#top5");
let h2Single = tablaJugadores.getElementsByTagName("h2")[0]
let h2Vs = tablaVs.getElementsByTagName("h2")[0]
const chances = 5;
var ganasteTu, ganoRival = false;
let ulSingle = tablaJugadores.getElementsByTagName("ul")[0];
let ulVs = tablaVs.getElementsByTagName("ul")[0];
var jugadores, numerosElegidosRival = new Array();
const colorVictorioso = 'rgb(171, 250, 171)';
const refresca = "Si querés volver a jugar, refrescá la página.";
let parrafosMensaje = document.getElementsByClassName("mensajeResultado")
let modo;
//#endregion



//#region Funciones
const esconderSecciones = function () {
    document.getElementById("one").style.display = "none"
    document.getElementById("two").style.display = "none"
    document.getElementById("three").style.display = "none"
    document.getElementById("main").style.display = "block"

}

esconderSecciones();

document.querySelector("#singlePlayer").addEventListener("click", singlePlayer)
document.querySelector("#vsBtn").addEventListener("click", vsBtn)

function singlePlayer() {
    document.getElementById("main").style.display = "none";
    document.getElementById("one").style.display = "block";
    document.getElementById("three").style.display = "none";
    ganador = Math.floor(Math.random() * 100) + 1;
    console.log("Ganador: " + ganador)
    modo = "intentos"
}

function vsBtn() {
    document.getElementById("main").style.display = "none"
    document.getElementById("two").style.display = "block"
    document.getElementById("three").style.display = "none"
    ganador = Math.floor(Math.random() * 20) + 1;
    console.log("Ganador: " + ganador)
    modo = "victorias"
}

const crearTabla = () => tabla.innerHTML = `<thead><tr><th>Nombre</th><th>Email</th><th>Procedencia</th><th>${modo}</th></tr></thead>`

function crearLinks(top5) {
    let li1 = document.createElement("li");
    (modo == "intentos")?tablaJugadores.classList.add("border"):tablaVs.classList.add("border")
    li1.textContent = "Ver todos"
    let h2;
    let ul;
    (modo == "intentos") ? h2 = h2Single : h2 = h2Vs;
    (modo == "intentos") ? ul = ulSingle : ul = ulVs;

    h2.innerHTML = "Top 5 Jugadores"
    li1.addEventListener("click", function () {
        h2.innerHTML = "Ganadores de hoy"
        crearTabla();
        (modo == "intentos") ? rellenarTabla(ordenarJugadores()) : rellenaTablaVictorias(ordenarJugadores())
    })
    let li2 = document.createElement("li");
    li2.textContent = "Ver top 5"
    li2.addEventListener("click",
        function () {
            h2.innerHTML = "Top 5 jugadores"
            crearTabla();
            (modo == "intentos") ? rellenarTabla(top5) : rellenaTablaVictorias(top5)
        })

    ul.appendChild(li1)
    ul.appendChild(li2)
}



const listar = (a) => tabla.innerHTML += `<tbody><tr><td>${a.nombre}</td><td>${a.email}</td><td>${a.procedencia}</td><td>${a.intentos}</td></tr></tbody>`
const llenarVs = (a) => tabla.innerHTML += `<tbody><tr><td>${a.nombre}</td><td>${a.email}</td><td>${a.procedencia}</td><td>${a.victorias}</td></tr></tbody>`
const rellenarTabla = (j) => j.forEach(listar);
const rellenaTablaVictorias = (j) => j.forEach(llenarVs)

const agregarFelicitaciones = function (texto, elemento) {
    let h3 = document.createElement('h3');
    h3.innerHTML = texto;
    elemento.appendChild(h3);
}

function mostrarIngreso() {
    (modo == "intentos")?parrafosMensaje[0].innerHTML = "":parrafosMensaje[1].innerHTML = ""
    document.getElementById("three").style.display = "block";
}



document.querySelector("#btnIngresarJugador").addEventListener("click", consultarJugadorNuevo)
document.querySelector("#txtNombre").addEventListener("input",()=>{
    document.querySelector("#tuNombre").textContent = document.querySelector("#txtNombre").value
})

function consultarJugadorNuevo() {
    
    nombreJugador = document.querySelector("#txtNombre").value;
    procedenciaJugador = document.querySelector("#txtProcedencia").value;
    emailJugador = document.querySelector("#txtEmail").value
    if (nombreJugador == "" || emailJugador == "") {
        document.querySelector("#errorIngreso").innerHTML = "revisa los datos"
        document.querySelector("#errorIngreso").classList.add("pError")
        setTimeout(()=>{
            document.querySelector("#errorIngreso").classList.remove("pError");
            document.querySelector("#errorIngreso").innerHTML = "";
        },3000)  
    } else {        
        jugadorNuevo.nombre = nombreJugador;
        jugadorNuevo.procedencia = procedenciaJugador;
        jugadorNuevo.email = emailJugador;
        if (modo == "intentos") {
            jugadorNuevo.intentos = intentos;
            if (!existeJugador(jugadorNuevo.email)) {
                jugadorNuevo.victorias = 0;
                jugadores.unshift(jugadorNuevo)
            } else {
                sobrescribirDatos(jugadorNuevo)
            }
        } else {
            jugadorNuevo.nombre = nombreJugador;
            jugadorNuevo.procedencia = procedenciaJugador;
            if (!existeJugador(jugadorNuevo.email)) {
                jugadorNuevo.victorias = 1;
                jugadorNuevo.intentos = 0;
                jugadores.unshift(jugadorNuevo)
            } else {
                sobrescribirDatos(jugadorNuevo);
            }
        }
        sincronizarStorage();
        
        (modo == "intentos")?singlePlayer():document.getElementById("three").style.display = "none";                
        tuResultado(true, `Felicidades ${jugadorNuevo.nombre}, ganaste el partido! `);
        
        
    }
}



function ordenarJugadores() {    
    let jugadoresOrdenados;
    (modo == "intentos") ? jugadoresOrdenados = jugadores.sort((a, b) => a.intentos - b.intentos || a.nombre.localeCompare(b.nombre)).filter((j) => j.intentos > 0) : jugadoresOrdenados = jugadores.sort((a, b) => b.victorias - a.victorias || a.nombre.localeCompare(b.nombre)).filter((j) => j.victorias > 0)
    return jugadoresOrdenados;
}

function sobrescribirDatos(jugadorEspecifico){
    obtenerJugador(jugadorEspecifico.email).procedencia = jugadorEspecifico.procedencia;
    obtenerJugador(jugadorEspecifico.email).nombre = jugadorEspecifico.nombre;
    (modo == "intentos")?sobrescribirIntentos(jugadorEspecifico):sobrescribirVictorias(jugadorEspecifico)
}

function sobrescribirIntentos(jugadorEspecifico) {
    if (jugadorEspecifico.intentos < obtenerJugador(jugadorEspecifico.email).intentos) obtenerJugador(jugadorEspecifico.email).intentos = jugadorEspecifico.intentos
}

function sobrescribirVictorias(jugadorEspecifico) {
    obtenerJugador(jugadorEspecifico.email).victorias++;
}

function existeJugador(emailJ) {
    let retorno;
    (obtenerJugador(emailJ) != null) ? retorno = true : retorno = false;
    return retorno;
}

function numeroIncorrecto(numero) {
    let n;
    (modo == "intentos") ? n = 1 : n = 2;
    let div = document.getElementsByTagName("div")[n]
    div.classList.remove("diverror")
    div.offsetWidth;
    div.classList.add("diverror")
    if (modo == "intentos") div.onanimationend = () => parrafosMensaje[0].innerHTML = "Incorrecto, te quedan " + (chances - intentos) + " chances. Pista: " + pistaNumero(numero, chances - intentos)
    else div.onanimationend = () => parrafosMensaje[1].innerHTML = "Sigan participando";


}

document.querySelector("#boton").addEventListener("click", ingresarNumero)

function ingresarNumero() {
    let numero = Number(document.querySelector("#numero").value);

    if (numero > 100 || numero < 1){
        parrafosMensaje[0].innerHTML = "El número debe estar entre 1 y 100."
        parrafosMensaje[0].classList.add("pError")    
        setTimeout(()=>{
            parrafosMensaje[0].classList.remove("pError");
            parrafosMensaje[0].innerHTML = "";
        },3000)    
    }else{    
        for (let i = 0; i <= chances; i++) {
            intentos++;
            if (!consultarNumero(numero)) {
                if (intentos < chances) numeroIncorrecto(numero);
            }
            break;
        }
    if (consultarNumero(numero)) {
        mostrarIngreso()
    }
    else if (intentos == chances) tuResultado(false, "Lo sentimos, perdiste la partida. El correcto erá: " + ganador + ". ");
    }

}

document.querySelector("#botonVs").addEventListener("click", ingresarNumeroVs)



function ingresarNumeroVs() {
    let tuNumero = Number(document.querySelector("#tuNumero").value);
    if (tuNumero > 20 || tuNumero < 1){
     parrafosMensaje[1].innerHTML = "El número debe estar entre 1 y 20."
     parrafosMensaje[1].classList.add("pError")    
     setTimeout(()=>{
        parrafosMensaje[1].classList.remove("pError");
        parrafosMensaje[1].innerHTML = "";
    },3000)  
    }else {        
        if (!Boolean(ganasteTu ^ ganoRival)) {
            while (!noEsta(numeroRival, numerosElegidosRival)) {
                numeroRival = Math.floor(Math.random() * 20) + 1;
            }
            document.querySelector("#respuestaRival").innerHTML = ` ${numeroRival}`
            ganasteTu = consultarNumero(tuNumero)
            ganoRival = consultarNumero(numeroRival)
            numerosElegidosRival.push(numeroRival)
        }
        
        console.log(Boolean(ganasteTu ^ ganoRival))
        if (Boolean(ganasteTu ^ ganoRival)) {            
            (ganasteTu) ? mostrarIngreso() : tuResultado(false, "Gano tu Rival. ", "victorias");            
        } else {
            (ganasteTu && ganoRival) ? reiniciarJuego() : numeroIncorrecto()
        }

        
    }

}

function reiniciarJuego() {
    numerosElegidosRival = [];
    ganador = Math.floor(Math.random() * 20) + 1;
    parrafosMensaje[1].innerHTML = "Empataron. Comiencen de nuevo!"
    console.log(ganador)
}

function noEsta(num, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == num) return false
    }
    return true
}


function obtenerJugador(emailJugador) {
    for (let i = 0; i < jugadores.length; i++) {
        if (jugadores[i].email == emailJugador) return jugadores[i];
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
    let titulo = elemento = "";
    (modo == "intentos") ? titulo = "Sos el mejor jugador. Te recomendamos que jueges la quiniela." : titulo = "Sos el jugador con mas victorias!";
    (modo == "intentos") ? elemento = tablaJugadores : elemento = tablaVs;;
    if (objeto.email == array[0].email) agregarFelicitaciones(titulo, elemento)
    for (let i = 1; i < array.length; i++)
        if (objeto == array[i]) {
            agregarFelicitaciones('Felicitaciones! Estas en el top 5.', elemento);
            break
        }
}



function tuResultado(victoria, texto) {
    (victoria) ? document.querySelector("#body").classList.add("victoria") : document.querySelector("#body").classList.add("derrota")    
    document.querySelector("#boton").disabled = true
    document.querySelector("#botonVs").disabled = true
    let posP = 1;
    if(modo == "intentos")posP = 0;    
    parrafosMensaje[posP].innerHTML = texto + refresca;    
    let top5 = ordenarJugadores().slice(0, 5);
    if (top5.length != 0) {
        crearTabla();
        (modo == "intentos") ? rellenarTabla(top5) : rellenaTablaVictorias(top5);
        (modo == "intentos") ? tablaJugadores.appendChild(tabla) : tablaVs.appendChild(tabla);
        figuraEnTop5(jugadorNuevo, top5)
        crearLinks(top5);
    } else {
        (modo == "intentos") ? parrafoListaVacia(tablaJugadores) : parrafoListaVacia(tablaVs)

    }
}

function parrafoListaVacia(elemento) {
    let p = document.createElement("p")
    p.style.color = "white";
    p.textContent = "No hubo ningun ganador hoy"
    elemento.appendChild(p);
}



//#endregion

//#region Objetos
class Jugador {
    constructor(n,e, p, i, v) {
        this.nombre = n,
        this.email = e,
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

//#region bola

//#endregion