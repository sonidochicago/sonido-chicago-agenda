// =========================================
// SONIDO CHICAGO - AGENDA
// APP.JS COMPLETO
// =========================================

// =========================================
// VARIABLES
// =========================================

let fechaActual = new Date();

let vistaActual = "año";

let contratoSeleccionado = null;

let fotoTemporal = "";

// =========================================
// NOMBRES
// =========================================

const meses = [


"ENERO",
"FEBRERO",
"MARZO",
"ABRIL",
"MAYO",
"JUNIO",
"JULIO",
"AGOSTO",
"SEPTIEMBRE",
"OCTUBRE",
"NOVIEMBRE",
"DICIEMBRE"


];

const diasSemana = [


"LUN",
"MAR",
"MIÉ",
"JUE",
"VIE",
"SÁB",
"DOM"


];

// =========================================
// FUNCIONES GENERALES
// =========================================

function elemento(id) {


return document.getElementById(id);


}

function obtenerValor(id, valorPorDefecto = "") {


const el = elemento(id);

if (!el) {

    return valorPorDefecto;

}

return el.value;


}

function ponerValor(id, valor = "") {


const el = elemento(id);

if (el) {

    el.value = valor;

}


}

// =========================================
// ELEMENTOS
// =========================================

const tituloCalendario =
elemento("tituloCalendario");

const calendarioAnual =
elemento("calendarioAnual");

const calendarioMes =
elemento("calendarioMes");

const calendarioSemana =
elemento("calendarioSemana");

const calendarioDia =
elemento("calendarioDia");

const listaContratos =
elemento("listaContratos");

const listaTodosContratos =
elemento("listaTodosContratos");

const ventanaContrato =
elemento("ventanaContrato");

const ventanaDetalle =
elemento("ventanaDetalle");

// =========================================
// CONTRATOS
// =========================================

function obtenerContratos() {


try {

    return JSON.parse(
        localStorage.getItem("contratos")
    ) || [];

} catch (error) {

    console.error(
        "Error leyendo contratos:",
        error
    );

    return [];

}


}

function guardarTodos(contratos) {


localStorage.setItem(
    "contratos",
    JSON.stringify(contratos)
);


}

// =========================================
// FECHAS
// =========================================

function fechaTexto(fecha) {


if (!fecha) {

    return "Sin fecha";

}

const partes =
    fecha.split("-");

if (partes.length !== 3) {

    return fecha;

}

return (
    partes[2] +
    "/" +
    partes[1] +
    "/" +
    partes[0]
);


}

function crearFecha(año, mes, dia) {


return (
    año +
    "-" +
    String(mes + 1).padStart(2, "0") +
    "-" +
    String(dia).padStart(2, "0")
);


}

function esHoy(fecha) {


const hoy =
    new Date();

return fecha === crearFecha(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
);


}

function formatoCorto(fecha) {


return (
    fecha.getDate() +
    "/" +
    (fecha.getMonth() + 1)
);


}

function fechaHoyTexto() {


const hoy =
    new Date();

return crearFecha(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
);


}

// =========================================
// ESTADOS
// =========================================

function nombreEstado(estado) {


const nombres = {

    reservado:
        "🟡 RESERVADO",

    confirmado:
        "🟢 CONFIRMADO",

    realizado:
        "🔵 REALIZADO",

    cancelado:
        "🔴 CANCELADO"

};

return nombres[estado] ||
    "🟡 RESERVADO";


}

// =========================================
// CAMBIAR VISTA
// =========================================

function cambiarVista(vista) {


vistaActual =
    vista;


document.querySelectorAll(
    ".vista-btn"
).forEach(
    boton => {

        boton.classList.toggle(
            "activo",
            boton.dataset.vista === vista
        );

    }
);


const vistas = {

    año:
        "vistaAño",

    mes:
        "vistaMes",

    semana:
        "vistaSemana",

    dia:
        "vistaDia",

    eventos:
        "vistaEventos",

    contratos:
        "vistaContratos"

};


Object.keys(vistas).forEach(
    nombre => {

        const vistaElemento =
            elemento(
                vistas[nombre]
            );

        if (vistaElemento) {

            vistaElemento.classList.toggle(
                "oculto",
                nombre !== vista
            );

        }

    }
);


mostrarTodo();


}

document.querySelectorAll(
".vista-btn"
).forEach(
boton => {


    boton.onclick =
        function () {

            cambiarVista(
                boton.dataset.vista
            );

        };

}


);

// =========================================
// CALENDARIO AÑO
// =========================================

function mostrarAño() {


if (!calendarioAnual) {

    return;

}


calendarioAnual.innerHTML =
    "";


const año =
    fechaActual.getFullYear();


tituloCalendario.textContent =
    año;


const contratos =
    obtenerContratos();


for (
    let mes = 0;
    mes < 12;
    mes++
) {

    const contenedor =
        document.createElement("div");

    contenedor.className =
        "mes";


    const titulo =
        document.createElement("h3");

    titulo.textContent =
        meses[mes];

    contenedor.appendChild(
        titulo
    );


    const semana =
        document.createElement("div");

    semana.className =
        "dias-semana";


    diasSemana.forEach(
        dia => {

            const d =
                document.createElement("div");

            d.textContent =
                dia[0];

            semana.appendChild(d);

        }
    );


    contenedor.appendChild(
        semana
    );


    const dias =
        document.createElement("div");

    dias.className =
        "dias-mes";


    let primerDia =
        new Date(
            año,
            mes,
            1
        ).getDay();


    if (primerDia === 0) {

        primerDia = 6;

    } else {

        primerDia--;

    }


    for (
        let i = 0;
        i < primerDia;
        i++
    ) {

        dias.appendChild(
            document.createElement("div")
        );

    }


    const cantidad =
        new Date(
            año,
            mes + 1,
            0
        ).getDate();


    for (
        let dia = 1;
        dia <= cantidad;
        dia++
    ) {

        const elementoDia =
            document.createElement("div");

        elementoDia.className =
            "dia";

        elementoDia.textContent =
            dia;


        const fecha =
            crearFecha(
                año,
                mes,
                dia
            );


        const eventos =
            contratos.filter(
                c =>
                    c.fecha === fecha
            );


        if (eventos.length > 0) {

            elementoDia.classList.add(
                eventos[0].estado ||
                "reservado"
            );

        }


        if (esHoy(fecha)) {

            elementoDia.classList.add(
                "hoy"
            );

        }


        elementoDia.onclick =
            function () {

                if (eventos.length === 1) {

                    mostrarDetalle(
                        eventos[0].id
                    );

                } else if (
                    eventos.length > 1
                ) {

                    mostrarEventosDelDia(
                        fecha
                    );

                } else {

                    abrirFormulario(
                        fecha
                    );

                }

            };


        dias.appendChild(
            elementoDia
        );

    }


    contenedor.appendChild(
        dias
    );


    calendarioAnual.appendChild(
        contenedor
    );

}


}

// =========================================
// VISTA MES
// =========================================

function mostrarMes() {


if (!calendarioMes) {

    return;

}


const año =
    fechaActual.getFullYear();

const mes =
    fechaActual.getMonth();


tituloCalendario.textContent =
    meses[mes] +
    " " +
    año;


calendarioMes.innerHTML =
    "";


const contenedor =
    document.createElement("div");

contenedor.className =
    "mes";


const semana =
    document.createElement("div");

semana.className =
    "dias-semana";


diasSemana.forEach(
    dia => {

        const d =
            document.createElement("div");

        d.textContent =
            dia;

        semana.appendChild(d);

    }
);


contenedor.appendChild(
    semana
);


const dias =
    document.createElement("div");

dias.className =
    "dias-mes";


let primero =
    new Date(
        año,
        mes,
        1
    ).getDay();


if (primero === 0) {

    primero = 6;

} else {

    primero--;

}


for (
    let i = 0;
    i < primero;
    i++
) {

    dias.appendChild(
        document.createElement("div")
    );

}


const cantidad =
    new Date(
        año,
        mes + 1,
        0
    ).getDate();


const contratos =
    obtenerContratos();


for (
    let dia = 1;
    dia <= cantidad;
    dia++
) {

    const elementoDia =
        document.createElement("div");

    elementoDia.className =
        "dia";

    elementoDia.textContent =
        dia;


    const fecha =
        crearFecha(
            año,
            mes,
            dia
        );


    const eventos =
        contratos.filter(
            c =>
                c.fecha === fecha
        );


    if (eventos.length > 0) {

        elementoDia.classList.add(
            eventos[0].estado ||
            "reservado"
        );

    }


    if (esHoy(fecha)) {

        elementoDia.classList.add(
            "hoy"
        );

    }


    elementoDia.onclick =
        function () {

            if (eventos.length === 1) {

                mostrarDetalle(
                    eventos[0].id
                );

            } else if (
                eventos.length > 1
            ) {

                mostrarEventosDelDia(
                    fecha
                );

            } else {

                abrirFormulario(
                    fecha
                );

            }

        };


    dias.appendChild(
        elementoDia
    );

}


contenedor.appendChild(
    dias
);


calendarioMes.appendChild(
    contenedor
);


}

// =========================================
// EVENTOS DE UN DÍA
// =========================================

function mostrarEventosDelDia(fecha) {


const contratos =
    obtenerContratos().filter(
        c =>
            c.fecha === fecha
    );


if (!contratos.length) {

    return;

}


let html = `

    <div class="detalle-info">

        <h3>
            📅 Eventos del ${fechaTexto(fecha)}
        </h3>

`;


contratos.forEach(
    contrato => {

        html += `

            <div class="tarjeta-evento ${
                contrato.estado || "reservado"
            }">

                <h3>
                    👤
                    ${contrato.cliente || "Cliente"}
                </h3>

                <p>
                    🎉
                    ${
                        contrato.nombreEvento ||
                        contrato.tipoEvento ||
                        "Evento"
                    }
                </p>

                <p>
                    🕐
                    ${
                        contrato.hora ||
                        "Sin hora"
                    }
                </p>

                <p>

                    <span class="estado ${
                        contrato.estado ||
                        "reservado"
                    }">

                        ${nombreEstado(
                            contrato.estado
                        )}

                    </span>

                </p>

                <button
                    type="button"
                    onclick="mostrarDetalle(${contrato.id})">

                    📋 VER DETALLE

                </button>

            </div>

        `;

    }
);


html +=
    "</div>";


elemento(
    "contenidoDetalle"
).innerHTML =
    html;


ventanaDetalle.style.display =
    "flex";


}

// =========================================
// VISTA SEMANA
// =========================================

function mostrarSemana() {


if (!calendarioSemana) {

    return;

}


const fecha =
    new Date(fechaActual);


let diaSemana =
    fecha.getDay();


if (diaSemana === 0) {

    diaSemana = 7;

}


const lunes =
    new Date(fecha);


lunes.setDate(
    fecha.getDate() -
    diaSemana +
    1
);


const domingo =
    new Date(lunes);


domingo.setDate(
    lunes.getDate() + 6
);


tituloCalendario.textContent =
    formatoCorto(lunes) +
    " - " +
    formatoCorto(domingo);


calendarioSemana.innerHTML =
    "";


const grid =
    document.createElement("div");

grid.className =
    "semana-grid";


const contratos =
    obtenerContratos();


for (
    let i = 0;
    i < 7;
    i++
) {

    const fechaDia =
        new Date(lunes);


    fechaDia.setDate(
        lunes.getDate() + i
    );


    const fecha =
        crearFecha(
            fechaDia.getFullYear(),
            fechaDia.getMonth(),
            fechaDia.getDate()
        );


    const columna =
        document.createElement("div");

    columna.className =
        "columna-dia";


    const titulo =
        document.createElement("h3");

    titulo.textContent =
        diasSemana[i] +
        " " +
        fechaDia.getDate();


    columna.appendChild(
        titulo
    );


    contratos
        .filter(
            c =>
                c.fecha === fecha
        )
        .forEach(
            evento => {

                const mini =
                    document.createElement("div");

                mini.className =
                    "evento-mini " +
                    (
                        evento.estado ||
                        "reservado"
                    );


                mini.innerHTML = `

                    <b>
                        ${evento.hora || ""}
                    </b>

                    <br>

                    ${
                        evento.cliente ||
                        "Evento"
                    }

                    <br>

                    <small>
                        ${
                            evento.nombreEvento ||
                            evento.tipoEvento ||
                            ""
                        }
                    </small>

                `;


                mini.onclick =
                    function () {

                        mostrarDetalle(
                            evento.id
                        );

                    };


                columna.appendChild(
                    mini
                );

            }
        );


    grid.appendChild(
        columna
    );

}


calendarioSemana.appendChild(
    grid
);


}

// =========================================
// VISTA DÍA
// =========================================

function mostrarDia() {


if (!calendarioDia) {

    return;

}


const año =
    fechaActual.getFullYear();

const mes =
    fechaActual.getMonth();

const dia =
    fechaActual.getDate();


const fecha =
    crearFecha(
        año,
        mes,
        dia
    );


tituloCalendario.textContent =
    dia +
    " de " +
    meses[mes] +
    " " +
    año;


calendarioDia.innerHTML =
    "";


const contenedor =
    document.createElement("div");

contenedor.className =
    "dia-grande";


const titulo =
    document.createElement("h3");

titulo.textContent =
    "Eventos del día";


contenedor.appendChild(
    titulo
);


const contratos =
    obtenerContratos().filter(
        c =>
            c.fecha === fecha
    );


if (!contratos.length) {

    contenedor.innerHTML += `

        <p style="text-align:center">

            No hay eventos para este día.

        </p>

    `;

}


contratos.forEach(
    contrato => {

        contenedor.appendChild(
            crearTarjeta(contrato)
        );

    }
);


calendarioDia.appendChild(
    contenedor
);


}

// =========================================
// EVENTOS PENDIENTES
// =========================================

function mostrarEventos() {


if (!listaContratos) {

    return;

}


tituloCalendario.textContent =
    "Eventos pendientes";


listaContratos.innerHTML =
    "";


const hoy =
    fechaHoyTexto();


let contratos =
    obtenerContratos();


contratos =
    contratos.filter(
        contrato => {

            const pendiente =
                contrato.estado === "reservado" ||
                contrato.estado === "confirmado";

            const fechaValida =
                contrato.fecha &&
                contrato.fecha >= hoy;

            return pendiente &&
                fechaValida;

        }
    );


contratos.sort(
    (a, b) => {

        const fechaA =
            (a.fecha || "") +
            " " +
            (a.hora || "");

        const fechaB =
            (b.fecha || "") +
            " " +
            (b.hora || "");

        return fechaA.localeCompare(
            fechaB
        );

    }
);


if (!contratos.length) {

    listaContratos.innerHTML = `

        <div class="tarjeta-evento">

            <h3>
                📋 No hay eventos pendientes
            </h3>

            <p>
                No tienes eventos pendientes registrados.
            </p>

        </div>

    `;

    return;

}


contratos.forEach(
    contrato => {

        listaContratos.appendChild(
            crearTarjetaResumida(
                contrato
            )
        );

    }
);


}

// =========================================
// TODOS LOS CONTRATOS
// =========================================

function mostrarContratos() {


if (!listaTodosContratos) {

    return;

}


tituloCalendario.textContent =
    "Todos los contratos";


listaTodosContratos.innerHTML =
    "";


let contratos =
    obtenerContratos();


contratos.sort(
    (a, b) => {

        const fechaA =
            (a.fecha || "") +
            " " +
            (a.hora || "");

        const fechaB =
            (b.fecha || "") +
            " " +
            (b.hora || "");

        return fechaB.localeCompare(
            fechaA
        );

    }
);


if (!contratos.length) {

    listaTodosContratos.innerHTML = `

        <div class="tarjeta-evento">

            <h3>
                📋 No hay contratos
            </h3>

            <p>
                Todavía no tienes contratos registrados.
            </p>

        </div>

    `;

    return;

}


contratos.forEach(
    contrato => {

        listaTodosContratos.appendChild(
            crearTarjeta(contrato)
        );

    }
);


}

// =========================================
// TARJETA RESUMIDA
// =========================================

function crearTarjetaResumida(contrato) {


const tarjeta =
    document.createElement("div");


tarjeta.className =
    "tarjeta-evento evento-resumido " +
    (
        contrato.estado ||
        "reservado"
    );


tarjeta.innerHTML = `

    <h3>

        👤
        ${
            contrato.cliente ||
            "Cliente no especificado"
        }

    </h3>


    <p class="nombre-evento">

        🎉
        ${
            contrato.nombreEvento ||
            contrato.tipoEvento ||
            "Evento sin nombre"
        }

    </p>


    <p>

        📅
        ${fechaTexto(contrato.fecha)}

    </p>


    ${
        contrato.hora
        ?
        `
            <p>
                🕐 ${contrato.hora}
            </p>
        `
        :
        ""
    }

`;


tarjeta.onclick =
    function () {

        mostrarDetalle(
            contrato.id
        );

    };


return tarjeta;


}

// =========================================
// TARJETA COMPLETA
// =========================================

function crearTarjeta(contrato) {


const tarjeta =
    document.createElement("div");


tarjeta.className =
    "tarjeta-evento " +
    (
        contrato.estado ||
        "reservado"
    );


const precio =
    Number(contrato.precio) || 0;


const adelanto =
    Number(contrato.adelanto) || 0;


const saldo =
    precio -
    adelanto;


let pagoHTML;


if (contrato.pagado) {

    pagoHTML = `

        <div class="contrato-pagado">

            ✅ CONTRATO PAGADO

        </div>

    `;

} else {

    pagoHTML = `

        <div class="contrato-pendiente">

            💳 PAGO PENDIENTE

        </div>

    `;

}


tarjeta.innerHTML = `

    <h3>

        👤
        ${
            contrato.cliente ||
            "Cliente no especificado"
        }

    </h3>


    <p>

        🎉
        ${
            contrato.nombreEvento ||
            contrato.tipoEvento ||
            "Evento no especificado"
        }

    </p>


    <p>

        📅
        ${fechaTexto(contrato.fecha)}

    </p>


    <p>

        🕐
        ${
            contrato.hora ||
            "Hora no especificada"
        }

    </p>


    <p>

        📍
        ${
            contrato.lugar ||
            "Lugar no especificado"
        }

    </p>


    <p>

        🏠
        ${
            contrato.direccion ||
            "Dirección no especificada"
        }

    </p>


    <p>

        🎧
        ${
            contrato.servicio ||
            "Servicio no especificado"
        }

    </p>


    <p>

        💰 Total:
        Bs. ${precio.toFixed(2)}

    </p>


    <p>

        💵 Adelanto:
        Bs. ${adelanto.toFixed(2)}

    </p>


    <p>

        💳 Saldo:
        Bs. ${saldo.toFixed(2)}

    </p>


    ${pagoHTML}


    <p>

        <span class="estado ${
            contrato.estado ||
            "reservado"
        }">

            ${
                nombreEstado(
                    contrato.estado
                )
            }

        </span>

    </p>

`;


tarjeta.onclick =
    function () {

        mostrarDetalle(
            contrato.id
        );

    };


return tarjeta;


}

// =========================================
// MOSTRAR TODO
// =========================================

function mostrarTodo() {


if (vistaActual === "año") {

    mostrarAño();

} else if (
    vistaActual === "mes"
) {

    mostrarMes();

} else if (
    vistaActual === "semana"
) {

    mostrarSemana();

} else if (
    vistaActual === "dia"
) {

    mostrarDia();

} else if (
    vistaActual === "eventos"
) {

    mostrarEventos();

} else if (
    vistaActual === "contratos"
) {

    mostrarContratos();

}


}

// =========================================
// ANTERIOR
// =========================================

const anterior =
elemento("anterior");

if (anterior) {


anterior.onclick =
    function () {

        if (
            vistaActual === "año"
        ) {

            fechaActual.setFullYear(
                fechaActual.getFullYear() - 1
            );

        } else if (
            vistaActual === "mes"
        ) {

            fechaActual.setMonth(
                fechaActual.getMonth() - 1
            );

        } else if (
            vistaActual === "dia"
        ) {

            fechaActual.setDate(
                fechaActual.getDate() - 1
            );

        } else if (
            vistaActual === "contratos" ||
            vistaActual === "eventos"
        ) {

            return;

        } else {

            fechaActual.setDate(
                fechaActual.getDate() - 7
            );

        }


        mostrarTodo();

    };


}

// =========================================
// SIGUIENTE
// =========================================

const siguiente =
elemento("siguiente");

if (siguiente) {


siguiente.onclick =
    function () {

        if (
            vistaActual === "año"
        ) {

            fechaActual.setFullYear(
                fechaActual.getFullYear() + 1
            );

        } else if (
            vistaActual === "mes"
        ) {

            fechaActual.setMonth(
                fechaActual.getMonth() + 1
            );

        } else if (
            vistaActual === "dia"
        ) {

            fechaActual.setDate(
                fechaActual.getDate() + 1
            );

        } else if (
            vistaActual === "contratos" ||
            vistaActual === "eventos"
        ) {

            return;

        } else {

            fechaActual.setDate(
                fechaActual.getDate() + 7
            );

        }


        mostrarTodo();

    };


}

// =========================================
// HOY
// =========================================

const btnHoy =
elemento("btnHoy");

if (btnHoy) {


btnHoy.onclick =
    function () {

        fechaActual =
            new Date();

        mostrarTodo();

    };


}

// =========================================
// ABRIR FORMULARIO
// =========================================

function abrirFormulario(fecha = "") {


elemento(
    "tituloFormulario"
).textContent =
    "📝 Nuevo Evento";


guardarContrato.dataset.id =
    "";


ponerValor("cliente", "");

ponerValor("nombreEvento", "");

ponerValor("telefono", "");

ponerValor("fechaContrato", fecha);

ponerValor("horaContrato", "");

ponerValor("tipoEvento", "");

ponerValor("estado", "reservado");

ponerValor("lugar", "");

ponerValor("direccion", "");

ponerValor("servicio", "");

ponerValor("precio", "");

ponerValor("adelanto", "");

ponerValor("saldo", "0.00");

ponerValor("observaciones", "");


elemento("pagado").checked =
    false;


actualizarEstadoPago();


elemento("fotoContrato").value =
    "";


elemento("vistaPrevia").src =
    "";

elemento("vistaPrevia").style.display =
    "none";


fotoTemporal =
    "";


ventanaContrato.style.display =
    "flex";


}

// =========================================
// BOTONES NUEVO
// =========================================

const nuevoContrato =
elemento("nuevoContrato");

if (nuevoContrato) {


nuevoContrato.onclick =
    function () {

        abrirFormulario();

    };


}

const btnNuevo =
elemento("btnNuevo");

if (btnNuevo) {


btnNuevo.onclick =
    function () {

        abrirFormulario();

    };


}

// =========================================
// FOTO
// =========================================

const fotoContrato =
elemento("fotoContrato");

if (fotoContrato) {


fotoContrato.onchange =
    function (evento) {

        const archivo =
            evento.target.files[0];


        if (!archivo) {

            return;

        }


        const lector =
            new FileReader();


        lector.onload =
            function (e) {

                comprimirFoto(
                    e.target.result
                );

            };


        lector.readAsDataURL(
            archivo
        );

    };


}

// =========================================
// COMPRIMIR FOTO
// =========================================

function comprimirFoto(imagen) {


const img =
    new Image();


img.onload =
    function () {

        const canvas =
            document.createElement(
                "canvas"
            );


        const maximo =
            1000;


        let ancho =
            img.width;

        let alto =
            img.height;


        if (ancho > maximo) {

            alto =
                alto *
                maximo /
                ancho;

            ancho =
                maximo;

        }


        canvas.width =
            ancho;

        canvas.height =
            alto;


        const contexto =
            canvas.getContext(
                "2d"
            );


        contexto.drawImage(
            img,
            0,
            0,
            ancho,
            alto
        );


        fotoTemporal =
            canvas.toDataURL(
                "image/jpeg",
                0.7
            );


        elemento(
            "vistaPrevia"
        ).src =
            fotoTemporal;


        elemento(
            "vistaPrevia"
        ).style.display =
            "block";

    };


img.src =
    imagen;


}

// =========================================
// GUARDAR CONTRATO
// =========================================

const guardarContrato =
elemento("guardarContrato");

if (guardarContrato) {


guardarContrato.onclick =
    function () {

        const fecha =
            obtenerValor(
                "fechaContrato"
            );


        if (!fecha) {

            alert(
                "Selecciona una fecha para guardar el evento."
            );

            return;

        }


        let contratos =
            obtenerContratos();


        const id =
            guardarContrato.dataset.id;


        const precio =
            Number(
                obtenerValor("precio")
            ) || 0;


        const adelanto =
            Number(
                obtenerValor("adelanto")
            ) || 0;


        const pagado =
            elemento("pagado").checked;


        const datos = {

            cliente:
                obtenerValor("cliente").trim(),

            nombreEvento:
                obtenerValor("nombreEvento").trim(),

            telefono:
                obtenerValor("telefono").trim(),

            fecha:
                fecha,

            hora:
                obtenerValor("horaContrato"),

            tipoEvento:
                obtenerValor("tipoEvento"),

            estado:
                obtenerValor(
                    "estado",
                    "reservado"
                ),

            lugar:
                obtenerValor("lugar").trim(),

            direccion:
                obtenerValor("direccion").trim(),

            servicio:
                obtenerValor("servicio").trim(),

            precio:
                precio,

            adelanto:
                adelanto,

            pagado:
                pagado,

            observaciones:
                obtenerValor(
                    "observaciones"
                ).trim(),

            foto:
                fotoTemporal

        };


        if (id) {

            const posicion =
                contratos.findIndex(
                    c =>
                        String(c.id) ===
                        String(id)
                );


            if (posicion !== -1) {

                contratos[posicion] = {

                    ...contratos[posicion],

                    ...datos

                };

            }

        } else {

            contratos.push({

                id:
                    Date.now(),

                ...datos

            });

        }


        guardarTodos(
            contratos
        );


        ventanaContrato.style.display =
            "none";


        alert(
            "✅ Evento guardado correctamente."
        );


        mostrarTodo();

    };


}

// =========================================
// CERRAR FORMULARIO
// =========================================

function cerrarFormulario() {


ventanaContrato.style.display =
    "none";


}

elemento(
"cerrarFormulario"
).onclick =
cerrarFormulario;

elemento(
"cancelarFormulario"
).onclick =
cerrarFormulario;

// =========================================
// CALCULAR SALDO
// =========================================

function calcularSaldo() {


const precio =
    Number(
        obtenerValor("precio")
    ) || 0;


const adelanto =
    Number(
        obtenerValor("adelanto")
    ) || 0;


const saldo =
    precio -
    adelanto;


ponerValor(
    "saldo",
    saldo.toFixed(2)
);


}

elemento("precio")
.addEventListener(
"input",
calcularSaldo
);

elemento("adelanto")
.addEventListener(
"input",
calcularSaldo
);

// =========================================
// ESTADO DE PAGO
// =========================================

function actualizarEstadoPago() {


const pagado =
    elemento("pagado");


const estadoPago =
    elemento("estadoPago");


if (pagado.checked) {

    estadoPago.textContent =
        "✅ CONTRATO PAGADO";

    estadoPago.style.color =
        "#166534";

} else {

    estadoPago.textContent =
        "💳 PAGO PENDIENTE";

    estadoPago.style.color =
        "#92400e";

}


}

elemento("pagado")
.addEventListener(
"change",
actualizarEstadoPago
);

// =========================================
// MOSTRAR DETALLE
// =========================================

function mostrarDetalle(id) {


const contratos =
    obtenerContratos();


const contrato =
    contratos.find(
        c =>
            String(c.id) ===
            String(id)
    );


if (!contrato) {

    return;

}


contratoSeleccionado =
    contrato;


const precio =
    Number(contrato.precio) || 0;


const adelanto =
    Number(contrato.adelanto) || 0;


const saldo =
    precio -
    adelanto;


let html = `

    <div class="detalle-info">

        <h3>

            ${
                contrato.cliente ||
                "Evento sin cliente"
            }

        </h3>


        <p>
            <b>🎉 Nombre del evento:</b>
            ${
                contrato.nombreEvento ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>📅 Fecha:</b>
            ${fechaTexto(contrato.fecha)}
        </p>


        <p>
            <b>🕐 Hora:</b>
            ${
                contrato.hora ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>🎊 Tipo de evento:</b>
            ${
                contrato.tipoEvento ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>📞 Teléfono:</b>
            ${
                contrato.telefono ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>📍 Lugar:</b>
            ${
                contrato.lugar ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>🏠 Dirección:</b>
            ${
                contrato.direccion ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>🎧 Servicio:</b>
            ${
                contrato.servicio ||
                "Sin especificar"
            }
        </p>


        <p>
            <b>💰 Total:</b>
            Bs. ${precio.toFixed(2)}
        </p>


        <p>
            <b>💵 Adelanto:</b>
            Bs. ${adelanto.toFixed(2)}
        </p>


        <p>
            <b>💳 Saldo:</b>
            Bs. ${saldo.toFixed(2)}
        </p>


        <p>

            <b>Estado del evento:</b>

            <span class="estado ${
                contrato.estado ||
                "reservado"
            }">

                ${
                    nombreEstado(
                        contrato.estado
                    )
                }

            </span>

        </p>

`;


if (contrato.pagado) {

    html += `

        <div class="contrato-pagado">

            ✅ CONTRATO PAGADO

        </div>

    `;

} else {

    html += `

        <div class="contrato-pendiente">

            💳 PAGO PENDIENTE

        </div>

    `;

}


if (contrato.observaciones) {

    html += `

        <p>

            <b>📝 Observaciones:</b>

            <br>

            ${contrato.observaciones}

        </p>

    `;

}


if (contrato.foto) {

    html += `

        <img
            src="${contrato.foto}"
            class="foto-detalle"
            alt="Foto del contrato">

    `;

}


html +=
    "</div>";


elemento(
    "contenidoDetalle"
).innerHTML =
    html;


ventanaDetalle.style.display =
    "flex";


}

// =========================================
// CERRAR DETALLE
// =========================================

elemento(
"cerrarDetalle"
).onclick =
function () {


    ventanaDetalle.style.display =
        "none";

};


// =========================================
// EDITAR
// =========================================

elemento(
"editarDesdeDetalle"
).onclick =
function () {


    if (!contratoSeleccionado) {

        return;

    }


    const c =
        contratoSeleccionado;


    elemento(
        "tituloFormulario"
    ).textContent =
        "✏️ Editar Evento";


    guardarContrato.dataset.id =
        c.id;


    ponerValor("cliente", c.cliente || "");

    ponerValor("nombreEvento", c.nombreEvento || "");

    ponerValor("telefono", c.telefono || "");

    ponerValor("fechaContrato", c.fecha || "");

    ponerValor("horaContrato", c.hora || "");

    ponerValor("tipoEvento", c.tipoEvento || "");

    ponerValor("estado", c.estado || "reservado");

    ponerValor("lugar", c.lugar || "");

    ponerValor("direccion", c.direccion || "");

    ponerValor("servicio", c.servicio || "");

    ponerValor("precio", c.precio || "");

    ponerValor("adelanto", c.adelanto || "");


    calcularSaldo();


    elemento("pagado").checked =
        c.pagado === true;


    actualizarEstadoPago();


    ponerValor(
        "observaciones",
        c.observaciones || ""
    );


    fotoTemporal =
        c.foto || "";


    if (fotoTemporal) {

        elemento(
            "vistaPrevia"
        ).src =
            fotoTemporal;

        elemento(
            "vistaPrevia"
        ).style.display =
            "block";

    } else {

        elemento(
            "vistaPrevia"
        ).style.display =
            "none";

    }


    ventanaDetalle.style.display =
        "none";


    ventanaContrato.style.display =
        "flex";

};


// =========================================
// ELIMINAR
// =========================================

elemento(
"eliminarDesdeDetalle"
).onclick =
function () {


    if (!contratoSeleccionado) {

        return;

    }


    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este evento?"
        );


    if (!confirmar) {

        return;

    }


    let contratos =
        obtenerContratos();


    contratos =
        contratos.filter(
            c =>
                String(c.id) !==
                String(
                    contratoSeleccionado.id
                )
        );


    guardarTodos(
        contratos
    );


    ventanaDetalle.style.display =
        "none";


    contratoSeleccionado =
        null;


    alert(
        "🗑️ Evento eliminado."
    );


    mostrarTodo();

};


// =========================================
// WHATSAPP
// =========================================

elemento(
"whatsappBtn"
).onclick =
function () {


    if (
        !contratoSeleccionado ||
        !contratoSeleccionado.telefono
    ) {

        alert(
            "Este evento no tiene número de teléfono."
        );

        return;

    }


    let telefono =
        contratoSeleccionado.telefono
            .replace(
                /\D/g,
                ""
            );


    if (telefono.length === 8) {

        telefono =
            "591" +
            telefono;

    }


    const mensaje =
        encodeURIComponent(

            "Hola " +
            (
                contratoSeleccionado.cliente ||
                ""
            ) +
            ", le escribo de Sonido Chicago."

        );


    window.open(

        "https://wa.me/" +
        telefono +
        "?text=" +
        mensaje,

        "_blank"

    );

};


// =========================================
// MENÚ CALENDARIO
// =========================================

elemento(
"btnCalendario"
).onclick =
function () {


    cambiarVista(
        "mes"
    );

};


// =========================================
// MENÚ CONTRATOS
// =========================================

elemento(
"btnContratos"
).onclick =
function () {


    cambiarVista(
        "contratos"
    );

};


// =========================================
// INICIAR
// =========================================

mostrarTodo();
