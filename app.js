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
let cotizacionAceptada = null;
let cotizacionEditando = null;  

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
// BOTÓN SEGÚN LA VISTA
// =========================================

function actualizarBotonVista() {

    const btn =
        elemento("btnHoy");

    if (!btn) {

        return;

    }

    if (vistaActual === "año") {

        btn.textContent = "AÑO";

    } else if (vistaActual === "mes") {

        btn.textContent = "MES";

    } else if (vistaActual === "semana") {

        btn.textContent = "SEMANA";

    } else if (vistaActual === "dia") {

        btn.textContent = "DIA";

    } else if (vistaActual === "eventos") {

        btn.textContent = "EVENTOS";

    } else if (vistaActual === "contratos") {

        btn.textContent = "CONTRATOS";

    }
    else if (vistaActual === "cotizacion") {
        btnHoy.textContent = "COTIZACIÓN";
    }

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

    actualizarBotonVista();

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
                    contrato.estado === "confirmado" ||
                    !contrato.estado;

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
// BOTÓN SEGÚN VISTA
// =========================================

const btnHoy =
    elemento("btnHoy");

if (btnHoy) {

    btnHoy.onclick =
        function () {

            // En EVENTOS y CONTRATOS
            // el botón solamente muestra
            // el nombre de la vista.
            if (
                vistaActual === "eventos" ||
                vistaActual === "contratos"
            ) {

                return;

            }

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
function abrirFormularioDesdeCotizacion(cotizacion) {
    cotizacionAceptada = cotizacion;
    elemento(
        "tituloFormulario"
    ).textContent =
        "📝 Contrato desde Cotización";

    guardarContrato.dataset.id =
        "";

    ponerValor(
        "cliente",
        cotizacion.cliente || ""
    );

    ponerValor(
        "nombreEvento",
        cotizacion.evento || ""
    );

    ponerValor(
        "telefono",
        cotizacion.telefono || ""
    );

    ponerValor(
        "fechaContrato",
        cotizacion.fecha || ""
    );

    ponerValor(
        "horaContrato",
        ""
    );

    ponerValor(
        "tipoEvento",
        cotizacion.evento || ""
    );

    ponerValor(
        "estado",
        "reservado"
    );

    ponerValor(
        "lugar",
        cotizacion.lugar || ""
    );

    ponerValor(
        "direccion",
        cotizacion.direccion || ""
    );

    // Paquete + adicionales
    let servicio =
        cotizacion.paquete || "";

    if (
        cotizacion.adicionales &&
        cotizacion.adicionales.length > 0
    ) {

        servicio +=
            "\n\nSERVICIOS ADICIONALES:";

        cotizacion.adicionales.forEach(
            function (adicional) {

                servicio +=
                    "\n" +
                    adicional.nombre;

            }
        );

    }

    ponerValor(
        "servicio",
        servicio
    );

    ponerValor(
        "precio",
        cotizacion.total || 0
    );

    ponerValor(
        "adelanto",
        ""
    );

    ponerValor(
        "saldo",
        cotizacion.total || 0
    );

    ponerValor(
        "observaciones",
        ""
    );

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
function editarCotizacion(cotizacion) {

    cotizacionEditando = cotizacion;

    // Abrir el formulario de cotización individual
    document.getElementById(
        "btnCotizacionIndividual"
    ).click();

    // Mostrar como ventana
    document.getElementById(
        "formCotizacionIndividual"
    ).classList.add(
        "modal-edicion-cotizacion"
    );

    // Cargar datos
    document.getElementById("cotCliente").value =
        cotizacion.cliente || "";

    document.getElementById("cotTelefono").value =
        cotizacion.telefono || "";

    document.getElementById("cotEvento").value =
        cotizacion.evento || "";

    document.getElementById("cotFecha").value =
        cotizacion.fecha || "";

    document.getElementById("cotLugar").value =
        cotizacion.lugar || "";

    document.getElementById("cotDireccion").value =
        cotizacion.direccion || "";

    // Seleccionar paquete
    const selectPaquete =
        document.getElementById("cotPaquete");

    selectPaquete.value =
        cotizacion.precioPaquete || "";

    // Actualizar información del paquete
    selectPaquete.dispatchEvent(
        new Event("change")
    );

    // Descuento
    document.getElementById("cotDescuento").value =
        cotizacion.descuento || 0;

    // Limpiar adicionales
    document.getElementById("servicioMC").checked =
        false;

    document.getElementById("servicioNiebla").checked =
        false;

    document.getElementById("servicioPirotecnia").checked =
        false;

    document.getElementById("servicioData").checked =
        false;

    document.getElementById("servicioLed").checked =
        false;

    // Activar adicionales guardados
    if (cotizacion.adicionales) {

        cotizacion.adicionales.forEach(
            function (adicional) {

                if (
                    adicional.nombre ===
                    "Maestro de ceremonias"
                ) {
                    document.getElementById(
                        "servicioMC"
                    ).checked = true;
                }

                if (
                    adicional.nombre ===
                    "Niebla baja"
                ) {
                    document.getElementById(
                        "servicioNiebla"
                    ).checked = true;
                }

                if (
                    adicional.nombre.startsWith(
                        "Pirotecnia fria"
                    )
                ) {
                    document.getElementById(
                        "servicioPirotecnia"
                    ).checked = true;
                }

                if (
                    adicional.nombre ===
                    "Hora adicional"
                ) {
                    document.getElementById(
                        "servicioData"
                    ).checked = true;
                }

                if (
                    adicional.nombre ===
                    "Pantalla LED"
                ) {
                    document.getElementById(
                        "servicioLed"
                    ).checked = true;
                }

            }
        );
    }

}   
document.getElementById(
    "btnCerrarEdicionCotizacion"
).addEventListener(
    "click",
    function () {

        const formulario =
            document.getElementById(
                "formCotizacionIndividual"
            );

        formulario.style.display =
            "none";

        formulario.classList.remove(
            "modal-edicion-cotizacion"
        );

        cotizacionEditando =
            null;

        mostrarCotizaciones();

    }
);
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
    // =========================================================
// ACTUALIZAR COTIZACION ACEPTADA
// =========================================================

if (cotizacionAceptada) {

    let cotizaciones =
        JSON.parse(
            localStorage.getItem("cotizaciones") || "[]"
        );

    const posicionCotizacion =
        cotizaciones.findIndex(
            function (cotizacion) {

                return (
                    cotizacion.id ===
                    cotizacionAceptada.id
                );

            }
        );

    if (posicionCotizacion !== -1) {

        cotizaciones[posicionCotizacion].estado =
            "ACEPTADA";

        cotizaciones[posicionCotizacion].contratoId =
            id || Date.now();

        localStorage.setItem(
            "cotizaciones",
            JSON.stringify(cotizaciones)
        );

    }

    cotizacionAceptada =
        null;
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

        ponerValor(
            "cliente",
            c.cliente || ""
        );

        ponerValor(
            "nombreEvento",
            c.nombreEvento || ""
        );

        ponerValor(
            "telefono",
            c.telefono || ""
        );

        ponerValor(
            "fechaContrato",
            c.fecha || ""
        );

        ponerValor(
            "horaContrato",
            c.hora || ""
        );

        ponerValor(
            "tipoEvento",
            c.tipoEvento || ""
        );

        ponerValor(
            "estado",
            c.estado || "reservado"
        );

        ponerValor(
            "lugar",
            c.lugar || ""
        );

        ponerValor(
            "direccion",
            c.direccion || ""
        );

        ponerValor(
            "servicio",
            c.servicio || ""
        );

        ponerValor(
            "precio",
            c.precio || ""
        );

        ponerValor(
            "adelanto",
            c.adelanto || ""
        );

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
// AVISOS DE EVENTOS PRÓXIMOS
// =========================================

function revisarEventosProximos() {

    const contratos =
        obtenerContratos();

    if (!contratos.length) {

        return;

    }

    const hoy =
        new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );

    let avisosGuardados = {};

    try {

        avisosGuardados =
            JSON.parse(
                localStorage.getItem(
                    "avisosEventos"
                )
            ) || {};

    } catch (error) {

        avisosGuardados = {};

    }

    const avisosNuevos = [];

    contratos.forEach(
        contrato => {

            const estado =
                contrato.estado ||
                "reservado";

            // Solo avisamos de eventos
            // reservados o confirmados.
            if (
                estado !== "reservado" &&
                estado !== "confirmado"
            ) {

                return;

            }

            if (!contrato.fecha) {

                return;

            }

            const partes =
                contrato.fecha.split("-");

            if (partes.length !== 3) {

                return;

            }

            const año =
                Number(partes[0]);

            const mes =
                Number(partes[1]) - 1;

            const dia =
                Number(partes[2]);

            const fechaEvento =
                new Date(
                    año,
                    mes,
                    dia
                );

            fechaEvento.setHours(
                0,
                0,
                0,
                0
            );

            const diferencia =
                Math.round(
                    (
                        fechaEvento.getTime() -
                        hoy.getTime()
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );

            // Avisar 7, 3, 1 día antes
            // y el mismo día.
            if (
                diferencia !== 7 &&
                diferencia !== 3 &&
                diferencia !== 1 &&
                diferencia !== 0
            ) {

                return;

            }

            const clave =
                contrato.id +
                "-" +
                contrato.fecha +
                "-" +
                diferencia;

            // Si ya se mostró este aviso,
            // no lo mostramos nuevamente.
            if (
                avisosGuardados[clave]
            ) {

                return;

            }

            avisosNuevos.push({

                contrato:
                    contrato,

                diferencia:
                    diferencia,

                clave:
                    clave

            });

        }
    );

    if (!avisosNuevos.length) {

        return;

    }

    let mensaje =
        "🔔 SONIDO CHICAGO\n\n";

    avisosNuevos.forEach(
        aviso => {

            const contrato =
                aviso.contrato;

            let cuando = "";

            if (
                aviso.diferencia === 0
            ) {

                cuando =
                    "🔴 ES HOY";

            } else if (
                aviso.diferencia === 1
            ) {

                cuando =
                    "🟠 FALTA 1 DÍA";

            } else {

                cuando =
                    "🟡 FALTAN " +
                    aviso.diferencia +
                    " DÍAS";

            }

            mensaje +=
                cuando +
                "\n";

            mensaje +=
                "👤 " +
                (
                    contrato.cliente ||
                    "Cliente"
                ) +
                "\n";

            mensaje +=
                "🎉 " +
                (
                    contrato.nombreEvento ||
                    contrato.tipoEvento ||
                    "Evento"
                ) +
                "\n";

            mensaje +=
                "📅 " +
                fechaTexto(
                    contrato.fecha
                ) +
                "\n";

            if (contrato.hora) {

                mensaje +=
                    "🕐 " +
                    contrato.hora +
                    "\n";

            }

            if (contrato.lugar) {

                mensaje +=
                    "📍 " +
                    contrato.lugar +
                    "\n";

            }

            mensaje +=
                "Estado: " +
                nombreEstado(
                contrato.estado
                ) +
                "\n\n";

            avisosGuardados[
                aviso.clave
            ] = true;

        }
    );

    localStorage.setItem(
        "avisosEventos",
        JSON.stringify(
            avisosGuardados
        )
    );

    alert(mensaje);

}
    // =========================================
    // EXPORTAR CONTRATOS
    // =========================================

    function exportarContratos() {

        const contratos =
            obtenerContratos();

        const datos =
            JSON.stringify(
                contratos,
                null,
                2
            );

        const archivo =
            new Blob(
                [datos],
                {
                    type: "application/json"
                }
            );

        const enlace =
            document.createElement("a");

        enlace.href =
            URL.createObjectURL(
                archivo
            );

        enlace.download =
            "contratos-sonido-chicago.json";

        enlace.click();

        URL.revokeObjectURL(
            enlace.href
        );

    }
// =========================================
// IMPORTAR CONTRATOS
// =========================================

function importarContratos(archivo) {

    const lector = new FileReader();

    lector.onload = function () {

        try {

            const contratosImportados =
                JSON.parse(lector.result);

            if (!Array.isArray(contratosImportados)) {

                alert("El archivo no contiene contratos válidos.");

                return;
            }

            guardarTodos(contratosImportados);

            alert(
                "Se importaron " +
                contratosImportados.length +
                " contratos correctamente."
            );

            mostrarTodo();

        } catch (error) {

            alert("No se pudo leer el archivo de contratos.");

            console.error(error);

        }

    };

    lector.readAsText(archivo);

}

// =========================================
// AVISOS DE EVENTOS PRÓXIMOS
// =========================================

function revisarEventosProximos() {

    const contratos =
        obtenerContratos();

    if (!contratos.length) {

        return;

    }

    const hoy =
        new Date();

    hoy.setHours(
        0,
        0,
        0,
        0
    );

    let avisosGuardados = {};

    try {

        avisosGuardados =
            JSON.parse(
                localStorage.getItem(
                    "avisosEventos"
                )
            ) || {};

    } catch (error) {

        avisosGuardados = {};

    }

    const avisosNuevos = [];

    contratos.forEach(
        contrato => {

            const estado =
                contrato.estado ||
                "reservado";

            // Solo avisamos de eventos
            // reservados o confirmados.
            if (
                estado !== "reservado" &&
                estado !== "confirmado"
            ) {

                return;

            }

            if (!contrato.fecha) {

                return;

            }

            const partes =
                contrato.fecha.split("-");

            if (partes.length !== 3) {

                return;

            }

            const año =
                Number(partes[0]);

            const mes =
                Number(partes[1]) - 1;

            const dia =
                Number(partes[2]);

            const fechaEvento =
                new Date(
                    año,
                    mes,
                    dia
                );

            fechaEvento.setHours(
                0,
                0,
                0,
                0
            );

            const diferencia =
                Math.round(
                    (
                        fechaEvento.getTime() -
                        hoy.getTime()
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );

            // Avisar 3,2 1 día antes
            // y el mismo día.
            if (
                diferencia !== 3 &&
                diferencia !== 2 &&
                diferencia !== 1 &&
                diferencia !== 0
            ) {

                return;

            }

            const clave =
                contrato.id +
                "-" +
                contrato.fecha +
                "-" +
                diferencia;

            // Si ya se mostró este aviso,
            // no lo mostramos nuevamente.
            if (
                avisosGuardados[clave]
            ) {

                return;

            }

            avisosNuevos.push({

                contrato:
                    contrato,

                diferencia:
                    diferencia,

                clave:
                    clave

            });

        }
    );

    if (!avisosNuevos.length) {

        return;

    }

    let mensaje =
        "🔔 SONIDO CHICAGO\n\n";

    avisosNuevos.forEach(
        aviso => {

            const contrato =
                aviso.contrato;

            let cuando = "";

            if (
                aviso.diferencia === 0
            ) {

                cuando =
                    "🔴 ES HOY";

            } else if (
                aviso.diferencia === 1
            ) {

                cuando =
                    "🟠 FALTA 1 DÍA";

            } else {

                cuando =
                    "🟡 FALTAN " +
                    aviso.diferencia +
                    " DÍAS";

            }

            mensaje +=
                cuando +
                "\n";

            mensaje +=
                "👤 " +
                (
                    contrato.cliente ||
                    "Cliente"
                ) +
                "\n";

            mensaje +=
                "🎉 " +
                (
                    contrato.nombreEvento ||
                    contrato.tipoEvento ||
                    "Evento"
                ) +
                "\n";

            mensaje +=
                "📅 " +
                fechaTexto(
                    contrato.fecha
                ) +
                "\n";

            if (contrato.hora) {

                mensaje +=
                    "🕐 " +
                    contrato.hora +
                    "\n";

            }

            if (contrato.lugar) {

                mensaje +=
                    "📍 " +
                    contrato.lugar +
                    "\n";

            }

            mensaje +=
                "Estado: " +
                nombreEstado(
                    contrato.estado
                ) +
                "\n\n";

            avisosGuardados[
                aviso.clave
            ] = true;

        }   
    );

    localStorage.setItem(
        "avisosEventos",
        JSON.stringify(
            avisosGuardados
        )
    );

    alert(mensaje);

}
// =============================
// COTIZACIÓN - PAQUETES
// =============================

const cotPaquete = document.getElementById("cotPaquete");
const precioPaquete = document.getElementById("precioPaquete");
const detallePaquete = document.getElementById("detallePaquete");
const cotDescuento = document.getElementById("cotDescuento");
const cotTotal = document.getElementById("cotTotal");
let precioSeleccionado = 0;

function calcularTotal() {

    let descuento = Number(cotDescuento.value);

    let total = precioSeleccionado - descuento;

    if (total < 0) {
        total = 0;
    }

    cotTotal.innerHTML = `
        <strong>Total: Bs ${total}</strong>
    `;
}

if (cotPaquete) {
    cotPaquete.addEventListener("change", function () {

        if (cotPaquete.value === "") {
            precioPaquete.textContent = "";
            detallePaquete.innerHTML = "";
        }

        if (cotPaquete.value === "1000") {
            
            precioSeleccionado = 1000;
            precioPaquete.textContent = "";

            detallePaquete.innerHTML = `
                <h3>PAQUETE BASICO (ECONOMICO)</h3>

                <p><strong>Precio del paquete: 1.000 Bs</strong></p>

                <h4>🔊 Sonido</h4>
                <p>• 2 Altavoces activos FBT</p>
                <p>• 1 Consola Soundcraft analógica de 8 canales</p>
                <p>• 1 Ecualizador DBX analógico</p>
                <p>• 1 Micrófono inalámbrico</p>

                <h4>💡 Iluminación</h4>
                <p>• No incluye</p>

                <h4>👤 Personal</h4>
                <p>• 1 Cabina DJ</p>
                <p>• 1 DJ Animador</p>

                <h4>🚚 Servicio</h4>
                <p>• Transporte incluido (solo zonas cercanas)</p>
                <p>• 5 horas + 1 hora de regalo</p>
                <p>• Ideal para 10 a 30 personas</p>
            `;
        }

        if (cotPaquete.value === "1400") {

             precioSeleccionado = 1400;
            precioPaquete.textContent = "";

            detallePaquete.innerHTML = `
                <h3>PAQUETE BASICO (INTERMEDIO)</h3>

                <p><strong>Precio del paquete: 1.400 Bs</strong></p>

                <h4>🔊 Sonido</h4>
                <p>• 2 Medios activos FBT Vertus 406A</p>
                <p>• 2 Bajos Sub-118A FBT</p>
                <p>• 1 Consola Soundcraft Analógica</p>
                <p>• 1 Ecualizador DBX Analógico</p>
                <p>• 1 Micrófono inalámbrico</p>

                <h4>💡 Iluminación</h4>
                <p>• No incluye</p>

                <h4>👤 Personal</h4>
                <p>• 1 DJ</p>
                <p>• 1 Animador</p>
                <p>• 1 Cabina DJ iluminada</p>

                <h4>🚚 Servicio</h4>
                <p>• Transporte incluido (Solo Cochabamba)</p>
                <p>• 5 horas + 1 hora de regalo</p>
                <p>• Ideal para 50 personas</p>
            `;
        }

        if (cotPaquete.value === "1700") {

            precioSeleccionado = 1700;
            precioPaquete.textContent = "";

            detallePaquete.innerHTML = `
                <h3>PAQUETE BRONCE (MEDIO)</h3>

                <p><strong>Precio del paquete: 1.700 Bs</strong></p>

                <h4>🔊 Sonido</h4>
                <p>• 2 Medios Line Array FBT Muse 210</p>
                <p>• 2 Bajos activos FBT Sub118</p>
                <p>• 1 Consola digital Ui24R Soundcraft</p>
                <p>• 1 Crossover digital PA2</p>
                <p>• 1 Micrófono inalámbrico</p>

                <h4>💡 Iluminación</h4>
                <p>• 4 Mini cabezas móviles</p>
                <p>• 1 Estructura simple de luces</p>
                <p>• 1 Humo aromático</p>

                <h4>👤 Personal</h4>
                <p>• 1 DJ</p>
                <p>• 1 Animador</p>
                <p>• 1 Cabina DJ iluminada</p>

                <h4>🚚 Servicio</h4>
                <p>• Transporte incluido (Solo Cochabamba)</p>
                <p>• 🥁🔥 Show sorpresa de cortesía</p>
                <p>• 6 horas + 1 hora de regalo</p>
                <p>• Ideal para 50 personas</p>
            `;
        }

        if (cotPaquete.value === "2000") {

            precioSeleccionado = 2000;
            precioPaquete.textContent = "";

            detallePaquete.innerHTML = `
                <h3>PAQUETE PLATA</h3>

                <p><strong>Precio del paquete: 2.000 Bs</strong></p>

                <h4>🔊 Sonido</h4>
                <p>• 2 Medios Line Array FBT Muse 210</p>
                <p>• 2 Bajos activos FBT Sub118</p>
                <p>• 2 Monitores 115A Italianos</p>
                <p>• 1 Consola digital Ui24R Soundcraft</p>
                <p>• 1 Crossover digital PA2</p>
                <p>• 1 Micrófono inalámbrico</p>

                <h4>💡 Iluminación</h4>
                <p>• 2 Cabezas móviles Beam</p>
                <p>• 4 Strobos LED</p>
                <p>• 1 Esfera de espejos</p>
                <p>• 1 Humo aromático</p>
                <p>• Estructura de luces</p>

                <h4>👤 Personal</h4>
                <p>• 1 DJ</p>
                <p>• 1 Animador</p>
                <p>• 1 Cabina DJ iluminada</p>

                <h4>🚚 Servicio</h4>
                <p>• Transporte incluido (Solo Cochabamba)</p>
                <p>• 🥁🔥 Show sorpresa de cortesía</p>
                <p>• 6 horas + 1 hora de regalo</p>
                <p>• Ideal para 50 a 80 personas</p>
            `;
        }

        if (cotPaquete.value === "3000") {

            precioSeleccionado = 3000;
            precioPaquete.textContent = "";

            detallePaquete.innerHTML = `
                <h3>PAQUETE ORO</h3>

                <p><strong>Precio del paquete: 3.000 Bs</strong></p>

                <h4>🔊 Sonido</h4>
                <p>• 4 Medios Line Array FBT Muse 210</p>
                <p>• 4 Bajos activos FBT Sub118</p>
                <p>• 1 Consola digital Ui24R Soundcraft</p>
                <p>• 1 Crossover digital PA2</p>
                <p>• 1 Micrófono inalámbrico doble Sennheiser</p>

                <h4>💡 Iluminación</h4>
                <p>• 4 Cabezas móviles Beam</p>
                <p>• 4 Strobos LED</p>
                <p>• 2 Luces LED</p>
                <p>• 1 Humo aromático</p>
                <p>• 1 Esfera de espejos</p>
                <p>• 1 Estructura de luces</p>

                <h4>👤 Personal</h4>
                <p>• 1 DJ</p>
                <p>• 1 Animador</p>
                <p>• 1 Cabina DJ iluminada</p>

                <h4>🚚 Servicio</h4>
                <p>• Transporte incluido (Solo Cochabamba)</p>
                <p>• 🥁🔥 Show sorpresa de cortesía</p>
                <p>• 6 horas + 1 hora de regalo</p>
                <p>• Ideal para 100 a 200 personas</p>
            `;
        }

        if (cotPaquete.value === "5000") {

            precioSeleccionado = 5000;
            precioPaquete.textContent = "";

            detallePaquete.innerHTML = `
                <h3>PAQUETE PREMIUM PLATINO</h3>

                <p><strong>Precio del paquete: 5.000 Bs</strong></p>

                <h4>🔊 Sonido</h4>
                <p>• 4 Medios Line Array FBT Muse 210</p>
                <p>• 4 Bajos activos FBT Sub118</p>
                <p>• 2 Medios activos FBT 115 Italianos</p>
                <p>• 1 Consola digital Ui24R Soundcraft</p>
                <p>• 1 Crossover digital PA2</p>
                <p>• 1 Micrófono inalámbrico doble</p>

                <h4>💡 Iluminación</h4>
                <p>• 6 Cabezas móviles Beam</p>
                <p>• 8 Strobos LED</p>
                <p>• 2 Truss verticales iluminados</p>
                <p>• 1 Esfera de espejos</p>
                <p>• 1 Humo aromático</p>
                <p>• 1 Pantalla LED 2 cajas 2x2</p>
                <p>• 1 Estructura de luces</p>

                <h4>👤 Personal</h4>
                <p>• 1 DJ</p>
                <p>• 1 Animador</p>
                <p>• 1 Cabina DJ fondo infinito</p>

                <h4>🚚 Servicio</h4>
                <p>• Transporte incluido (Solo Cochabamba)</p>
                <p>• 🥁🔥 Show sorpresa de cortesía</p>
                <p>• 6 horas + 1 hora de regalo</p>
                <p>• Ideal para 200 a 300 personas</p>
            `;
        }
        actualizarResumen();
    });
}
if (cotDescuento) {
    cotDescuento.addEventListener("input", function () {
        actualizarResumen();
    });
}
// =============================
// SERVICIOS ADICIONALES
// =============================

const btnServicios = document.getElementById("btnServicios");
const listaServicios = document.getElementById("listaServicios");

if (btnServicios) {

    btnServicios.addEventListener("click", function () {

        if (listaServicios.style.display === "none") {

            listaServicios.style.display = "block";
            btnServicios.textContent = "➖ Servicios adicionales";

        } else {

            listaServicios.style.display = "none";
            btnServicios.textContent = "➕ Servicios adicionales";

        }

    });

}
// =============================
// RESUMEN DE COTIZACIÓN
// =============================

const resumenPaquete = document.getElementById("resumenPaquete");
const resumenDescuento = document.getElementById("resumenDescuento");
const detalleAdicionales = document.getElementById("detalleAdicionales");
const resumenTotal = document.getElementById("resumenTotal");

function actualizarResumen() {

    let descuento = Number(cotDescuento.value);

    let adicionales = calcularAdicionales();

    let total = precioSeleccionado - descuento + adicionales;

    if (total < 0) {
        total = 0;
    }

    resumenPaquete.textContent = "Bs " + precioSeleccionado;
    resumenDescuento.textContent = "Bs " + descuento;

    let detalle = "";

    if (servicioMC.checked) {
        detalle = detalle + "<p>• Maestro de Ceremonia — Bs 400</p>";
    }

    if (servicioNiebla.checked) {
        detalle = detalle + "<p>• Niebla baja — Bs 500</p>";
    }

    if (servicioPirotecnia.checked) {

        let cantidad = Number(cantidadPirotecnia.value);

        if (cantidad > 0) {
            detalle = detalle + "<p>• Pirotecnia fría (" + cantidad + ") — Bs " + (cantidad * 100) + "</p>";
        }
    }

    if (servicioData.checked) {
        detalle = detalle + "<p>• Pantalla 2×2 Data Display — Bs 250</p>";
    }

    if (servicioLed.checked) {
        detalle = detalle + "<p>• Pantallas LED 2×2 — Bs 1.500</p>";
    }

    if (detalle === "") {
        detalle = "<p>Bs 0</p>";
    } else {
        detalle = detalle + "<p><strong>Total adicionales: Bs " + adicionales + "</strong></p>";
    }

    detalleAdicionales.innerHTML = detalle;

    resumenTotal.textContent = "Bs " + total;
}

// =============================
// CALCULAR SERVICIOS ADICIONALES
// =============================

const servicioMC = document.getElementById("servicioMC");
const servicioNiebla = document.getElementById("servicioNiebla");
const servicioPirotecnia = document.getElementById("servicioPirotecnia");
const cantidadPirotecnia = document.getElementById("cantidadPirotecnia");
const servicioData = document.getElementById("servicioData");
const servicioLed = document.getElementById("servicioLed");

function calcularAdicionales() {

    let adicionales = 0;

    if (servicioMC.checked) {
        adicionales = adicionales + 400;
    }

    if (servicioNiebla.checked) {
        adicionales = adicionales + 500;
    }

    if (servicioPirotecnia.checked) {
        adicionales = adicionales + (100 * Number(cantidadPirotecnia.value));
    }

    if (servicioData.checked) {
        adicionales = adicionales + 250;
    }

    if (servicioLed.checked) {
        adicionales = adicionales + 1500;
    }

    return adicionales;
}
if (servicioMC) {
    servicioMC.addEventListener("change", function () {
        actualizarResumen();
    });
}

if (servicioNiebla) {
    servicioNiebla.addEventListener("change", function () {
        actualizarResumen();
    });
}
if (servicioPirotecnia) {
    servicioPirotecnia.addEventListener("change", function () {
        actualizarResumen();
    });
}

if (cantidadPirotecnia) {
    cantidadPirotecnia.addEventListener("input", function () {
        actualizarResumen();
    });
}

if (servicioData) {
    servicioData.addEventListener("change", function () {
        actualizarResumen();
    });
}

if (servicioLed) {
    servicioLed.addEventListener("change", function () {
        actualizarResumen();
    });
}
// ========================================
// FOTOS DE LOS PAQUETES PARA EL PDF
// ========================================

const fotosPaquetes = {

    "1000": [
        "img/basico-economico-1.jpeg",
        "img/basico-economico-2.jpeg"
    ],

    "1400": [
        "img/basico-intermedio-1.jpeg",
        "img/basico-intermedio-2.jpeg"
    ],

    "1700": [
        "img/bronce-1.jpeg",
        "img/bronce-2.jpeg"
    ],

    "2000": [
        "img/plata-1.jpeg",
        "img/plata-2.jpeg"
    ],

    "3000": [
        "img/oro-1.jpeg",
        "img/oro-2.jpeg"
    ],

    "5000": [
        "img/premium-platino-1.jpeg",
        "img/premium-platino-2.jpeg"
    ]

};

// ========================================
// GENERAR PDF DE COTIZACIÓN INDIVIDUAL
// ========================================

document.getElementById("btnGenerarPDF").addEventListener("click", async function () {

    const { jsPDF } = window.jspdf;

    // =========================================================
    // DATOS DEL CLIENTE
    // =========================================================

    const cliente = document.getElementById("cotCliente").value;
    const telefono = document.getElementById("cotTelefono").value;
    const evento = document.getElementById("cotEvento").value;
    const fecha = document.getElementById("cotFecha").value;
    const lugar = document.getElementById("cotLugar").value;
    const campoDireccion = document.getElementById("cotDireccion");
        const direccion = campoDireccion ? campoDireccion.value : "";

    // =========================================================
    // PAQUETE
    // =========================================================

    const selectPaquete = document.getElementById("cotPaquete");
    const nombrePaquete =
        selectPaquete.options[selectPaquete.selectedIndex].text;

    const preciosPaquetes = {
        "1000": 1000,
        "1400": 1400,
        "1700": 1700,
        "2000": 2000,
        "3000": 3000,
        "5000": 5000
    };

    const precioPaquete =
        preciosPaquetes[selectPaquete.value] || 0;

    // =========================================================
    // DESCUENTO
    // =========================================================

    const descuento =
        parseFloat(
            document.getElementById("cotDescuento").value
        ) || 0;

    // =========================================================
    // ADICIONALES
    // =========================================================

    const adicionales = [];

    if (document.getElementById("servicioMC").checked) {
        adicionales.push({
            nombre: "Maestro de ceremonias",
            precio: 400
        });
    }

    if (document.getElementById("servicioNiebla").checked) {
        adicionales.push({
            nombre: "Niebla baja",
            precio: 500
        });
    }

    if (document.getElementById("servicioPirotecnia").checked) {

        const cantidad =
            parseInt(
                document.getElementById("cantidadPirotecnia").value
            ) || 1;

        adicionales.push({
            nombre: "Pirotecnia fria (" + cantidad + ")",
            precio: 100 * cantidad
        });
    }

    if (document.getElementById("servicioData").checked) {
        adicionales.push({
            nombre: "Hora adicional",
            precio: 250
        });
    }

    if (document.getElementById("servicioLed").checked) {
        adicionales.push({
            nombre: "Pantalla LED",
            precio: 1500
        });
    }

    // =========================================================
    // TOTAL
    // =========================================================

    let totalAdicionales = 0;

    for (let i = 0; i < adicionales.length; i++) {
        totalAdicionales += adicionales[i].precio;
    }

    let total =
        precioPaquete +
        totalAdicionales -
        descuento;

    if (total < 0) {
        total = 0;
    }

    // =========================================================
    // CREAR PDF
    // =========================================================

    const pdf = new jsPDF("p", "mm", "a4");

    // =========================================================
    // FORMATO DE PRECIOS
    // =========================================================

    function formatoPrecio(valor) {
        return "Bs " + valor.toLocaleString("es-BO");
    }

    // =========================================================
    // CARGAR IMAGEN
    // =========================================================

    async function cargarImagenPDF(ruta) {

        return new Promise(function (resolve, reject) {

            const imagen = new Image();

            imagen.onload = function () {
                resolve(imagen);
            };

            imagen.onerror = function () {
                reject(
                    "No se pudo cargar la imagen: " + ruta
                );
            };

            imagen.src = ruta;
        });
    }

    // =========================================================
    // IMAGEN SIN DEFORMAR
    // =========================================================

    function agregarImagenProporcional(
        imagen,
        x,
        y,
        anchoMax,
        altoMax
    ) {

        const anchoOriginal = imagen.naturalWidth;
        const altoOriginal = imagen.naturalHeight;

        const proporcion =
            anchoOriginal / altoOriginal;

        let ancho = anchoMax;
        let alto = ancho / proporcion;

        if (alto > altoMax) {

            alto = altoMax;
            ancho = alto * proporcion;
        }

        const xFinal =
            x + (anchoMax - ancho) / 2;

        const yFinal =
            y + (altoMax - alto) / 2;

        pdf.addImage(
            imagen,
            "JPEG",
            xFinal,
            yFinal,
            ancho,
            alto
        );
    }

    // =========================================================
    // ENCABEZADO AZUL
    // =========================================================

    pdf.setFillColor(
        44,
        62,
        80
    );

    // Encabezado reducido
    pdf.rect(
        0,
        0,
        210,
        25,
        "F"
    );

    // =========================================================
    // LOGO
    // =========================================================

    try {

        const logo =
            await cargarImagenPDF("logo.png");

        const anchoLogo = 34;

        const altoLogo =
            anchoLogo *
            (
                logo.naturalHeight /
                logo.naturalWidth
            );

        pdf.addImage(
            logo,
            "PNG",
            12,
            3,
            anchoLogo,
            altoLogo
        );

    } catch (error) {

        console.log(error);
    }

    // =========================================================
    // CONTACTOS
    // =========================================================

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(8);

    pdf.text(
        "CONTACTOS",
        196,
        7,
        {
            align: "right"
        }
    );

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.text(
        "60716641",
        196,
        13,
        {
            align: "right"
        }
    );

    pdf.text(
        "79772806",
        196,
        19,
        {
            align: "right"
        }
    );

    // =========================================================
    // TITULO COTIZACION
    // =========================================================

    pdf.setFillColor(
        235,
        235,
        235
    );

    pdf.rect(
        0,
        25,
        210,
        13,
        "F"
    );

    pdf.setTextColor(
        44,
        62,
        80
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(13);

    pdf.text(
        "COTIZACION",
        105,
        33,
        {
            align: "center"
        }
    );


// =========================================================
// DATOS DEL CLIENTE
// =========================================================

pdf.setDrawColor(
    210,
    210,
    210
);

pdf.setFillColor(
    250,
    250,
    250
);

// Tarjeta más pequeña
pdf.roundedRect(
    12,
    43,
    186,
    39,
    3,
    3,
    "FD"
);

pdf.setTextColor(
    44,
    62,
    80
);

pdf.setFont(
    "helvetica",
    "bold"
);

pdf.setFontSize(9);

// TÍTULO CENTRADO
pdf.text(
    "DATOS DEL CLIENTE",
    105,
    51,
    {
        align: "center"
    }
);

pdf.setFont(
    "helvetica",
    "normal"
);

pdf.setFontSize(8.5);

// =========================================================
// COLUMNA IZQUIERDA
// =========================================================

pdf.text(
    "Cliente:",
    17,
    59
);

pdf.text(
    cliente || "-",
    42,
    59
);

pdf.text(
    "Telefono:",
    17,
    67
);

pdf.text(
    telefono || "-",
    42,
    67
);

pdf.text(
    "Evento:",
    17,
    75
);

pdf.text(
    evento || "-",
    42,
    75
);

// =========================================================
// COLUMNA DERECHA
// =========================================================

// FECHA
pdf.text(
    "Fecha:",
    105,
    59
);

pdf.text(
    fecha || "-",
    140,
    59
);

// DIRECCION
pdf.text(
    "Direccion:",
    105,
    67
);

pdf.text(
    direccion || "-",
    140,
    67
);

// LUGAR DEL EVENTO
pdf.text(
    "Lugar del evento:",
    105,
    75
);

pdf.text(
    lugar || "-",
    140,
    75
);


    // =========================================================
    // TITULO DEL PAQUETE
    // =========================================================

    pdf.setFillColor(
        44,
        62,
        80
    );

    pdf.roundedRect(
    12,
    87,
    186,
    10,
    2,
    2,
    "F"
);

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(9.5);

    const tituloLimpio =
    nombrePaquete
        .toUpperCase()
        .replace("Á", "A")
        .replace("É", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ú", "U")
        .trim();

    pdf.text(
    "PAQUETE " + tituloLimpio,
    105,
    93.5,
    {
        align: "center"
    }
    );

    // =========================================================
    // DETALLE DEL PAQUETE
    // =========================================================

    let detalle =
        document
            .getElementById("detallePaquete")
            .innerText;

// ---------------------------------------------------------
// LIMPIAR CARACTERES DAÑADOS
// ---------------------------------------------------------

detalle = detalle
    .replace(/Ø[^A-Za-zÁÉÍÓÚáéíóúÑñ]*[^\n]*/gi, function (texto) {

        // Si la línea dañada contiene "Show", conservar solamente Show
        if (/Show/i.test(texto)) {
            return "Show";
        }

        return "";
    });

// Eliminar cualquier resto de caracteres dañados
detalle = detalle
    .replace(/Ø[^\n]*/gi, "");

// Eliminar símbolos que puedan quedar al inicio
detalle = detalle
    .replace(/^[^A-Za-zÁÉÍÓÚáéíóúÑñ•\-]+/gm, "");


    // ---------------------------------------------------------
    // LIMPIAR INFORMACION QUE NO NECESITAMOS
    // ---------------------------------------------------------

    detalle = detalle.replace(
        /DETALLE DEL PAQUETE/gi,
        ""
    );

    detalle = detalle.replace(
        /Precio del paquete:[^\n]*/gi,
        ""
    );

    // Mantener el nombre completo del paquete
// ---------------------------------------------------------
// CORREGIR NOMBRE DEL PAQUETE
// ---------------------------------------------------------

let nombreDetalle = nombrePaquete
    .replace(/\s*-\s*Bs\s*[\d.,]+/i, "")
    .toUpperCase()
    .replace("Á", "A")
    .replace("É", "E")
    .replace("Í", "I")
    .replace("Ó", "O")
    .replace("Ú", "U");

detalle = detalle.replace(
    /^PAQUETE\s+[^\n]+/im,
    "PAQUETE " + nombreDetalle
);

    // ---------------------------------------------------------
// CORREGIR SHOW SORPRESA
// ---------------------------------------------------------

detalle = detalle.replace(
    /[^\n]*Show\s+sorpresa\s+de\s+cortes[ií]a/gi,
    "• Show sorpresa de cortesia"
);

    // ---------------------------------------------------------
    // AGREGAR ENCABEZADOS
    // ---------------------------------------------------------

    detalle = detalle
        .replace(/\bSonido\b/gi, "\nSONIDO")
        .replace(/\bIluminación\b/gi, "\nILUMINACION")
        .replace(/\bIluminacion\b/gi, "\nILUMINACION")
        .replace(/\bPersonal\b/gi, "\nPERSONAL")
        .replace(/\bServicio\b/gi, "\nSERVICIO");

    // ---------------------------------------------------------
    // LIMPIAR LINEAS VACIAS
    // ---------------------------------------------------------

    detalle = detalle
        .split("\n")
        .map(function (linea) {
            return linea.trim();
        })
        .filter(function (linea) {
            return linea !== "";
        });

    // =========================================================
    // PREPARAR LINEAS PARA EL PDF
    // =========================================================

    const anchoTexto = 82;

    let lineasDetalle = [];

    for (
        let i = 0;
        i < detalle.length;
        i++
    ) {

        const linea =
            detalle[i];

        const lineas =
            pdf.splitTextToSize(
                linea,
                anchoTexto
            );

        for (
            let j = 0;
            j < lineas.length;
            j++
        ) {

            lineasDetalle.push(
                lineas[j]
            );
        }
    }

    // =========================================================
    // DETALLE
    // =========================================================

    const xDetalle = 14;
    const yDetalle = 106;

    pdf.setTextColor(
        50,
        50,
        50
    );

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(8.3);

    let y = yDetalle;

    for (
        let i = 0;
        i < lineasDetalle.length;
        i++
    ) {

        const linea =
            lineasDetalle[i];

        const lineaMayuscula =
            linea.toUpperCase();

        if (
            lineaMayuscula === "SONIDO" ||
            lineaMayuscula === "ILUMINACION" ||
            lineaMayuscula === "PERSONAL" ||
            lineaMayuscula === "SERVICIO"
        ) {

            y += 1;

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(8.8);

            pdf.setTextColor(
                44,
                62,
                80
            );

            pdf.text(
                lineaMayuscula,
                xDetalle,
                y
            );

            y += 4.5;

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(8.3);

            pdf.setTextColor(
                50,
                50,
                50
            );

        } else {

            pdf.text(
                linea,
                xDetalle,
                y
            );

            y += 4.1;
        }
    }

    // =========================================================
    // FOTOS
    // =========================================================

    const fotos =
        fotosPaquetes[
            selectPaquete.value
        ] || [];

    const xFoto = 112;
    const anchoFoto = 84;
    const altoFoto = 48;

    for (
        let i = 0;
        i < fotos.length && i < 2;
        i++
    ) {

        try {

            const imagen =
                await cargarImagenPDF(
                    fotos[i]
                );

            const yFoto =
                102 + (i * 51);

            pdf.setDrawColor(
                210,
                210,
                210
            );

            pdf.roundedRect(
                xFoto,
                yFoto,
                anchoFoto,
                altoFoto,
                2,
                2,
                "S"
            );

            agregarImagenProporcional(
                imagen,
                xFoto,
                yFoto,
                anchoFoto,
                altoFoto
            );

        } catch (error) {

            console.log(error);
        }
    }

    // =========================================================
    // POSICION DEL RESUMEN
    // =========================================================

    let yResumen =
        Math.max(
            y + 5,
            222
        );

    if (yResumen > 258) {
        yResumen = 258;
    }

    // =========================================================
    // ALTURA DEL RESUMEN
    // =========================================================

    let altoResumen = 24;

    altoResumen += adicionales.length * 6;

    if (descuento > 0) {
        altoResumen += 6;
    }

    altoResumen += 10;

    // =========================================================
    // CAJA DEL RESUMEN
    // =========================================================

    pdf.setFillColor(
        245,
        245,
        245
    );

    pdf.setDrawColor(
        210,
        210,
        210
    );

    pdf.roundedRect(
        12,
        yResumen,
        186,
        altoResumen,
        3,
        3,
        "FD"
    );

    pdf.setTextColor(
        44,
        62,
        80
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(9.5);

    pdf.text(
        "RESUMEN DE LA COTIZACION",
        17,
        yResumen + 7
    );

    let yFila =
        yResumen + 14;

    // =========================================================
    // PRECIO DEL PAQUETE
    // =========================================================

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(8.3);

    pdf.setTextColor(
        50,
        50,
        50
    );

    pdf.text(
        "Precio del paquete",
        17,
        yFila
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.text(
        formatoPrecio(
            precioPaquete
        ),
        193,
        yFila,
        {
            align: "right"
        }
    );

    yFila += 6;

    // =========================================================
    // ADICIONALES
    // =========================================================

    for (
        let i = 0;
        i < adicionales.length;
        i++
    ) {

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(8.3);

        pdf.text(
            adicionales[i].nombre,
            17,
            yFila
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.text(
            formatoPrecio(
                adicionales[i].precio
            ),
            193,
            yFila,
            {
                align: "right"
            }
        );

        yFila += 6;
    }

    // =========================================================
    // DESCUENTO
    // =========================================================

    if (descuento > 0) {

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(8.3);

        pdf.text(
            "Descuento",
            17,
            yFila
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.text(
            "- " +
            formatoPrecio(
                descuento
            ),
            193,
            yFila,
            {
                align: "right"
            }
        );

        yFila += 6;
    }

    // =========================================================
    // LINEA ANTES DEL TOTAL
    // =========================================================

    pdf.setDrawColor(
        180,
        180,
        180
    );

    pdf.line(
        17,
        yFila + 1,
        193,
        yFila + 1
    );

    yFila += 7;

    // =========================================================
    // TOTAL
    // =========================================================

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(10.5);

    pdf.setTextColor(
        44,
        62,
        80
    );

    pdf.text(
        "TOTAL",
        17,
        yFila
    );

    pdf.text(
        formatoPrecio(total),
        193,
        yFila,
        {
            align: "right"
        }
    );

    // =========================================================
    // PIE DE PAGINA
    // =========================================================

    pdf.setDrawColor(
        210,
        210,
        210
    );

    pdf.line(
        12,
        286,
        198,
        286
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(8.5);

    pdf.setTextColor(
        44,
        62,
        80
    );

    pdf.text(
        "Cochabamba - Bolivia",
        105,
        293,
        {
            align: "center"
        }
    );

    // =========================================================
// GUARDAR COTIZACION
// =========================================================

let cotizaciones =
    JSON.parse(
        localStorage.getItem("cotizaciones") || "[]"
    );

const nuevaCotizacion = {

    id:
        Date.now(),

    fechaCreacion:
        new Date().toISOString(),

    estado:
        "PENDIENTE",

    cliente:
        cliente,

    telefono:
        telefono,

    evento:
        evento,

    fecha:
        fecha,

    lugar:
        lugar,

    direccion:
        direccion,

    paquete:
        nombrePaquete,

    precioPaquete:
        precioPaquete,

    descuento:
        descuento,

    adicionales:
        adicionales,

    total:
        total

};

if (cotizacionEditando) {

    const posicion =
        cotizaciones.findIndex(
            function (cotizacion) {

                return (
                    cotizacion.id ===
                    cotizacionEditando.id
                );

            }
        );

    if (posicion !== -1) {

        nuevaCotizacion.id =
            cotizacionEditando.id;

        nuevaCotizacion.fechaCreacion =
            cotizacionEditando.fechaCreacion;

        nuevaCotizacion.estado =
            cotizacionEditando.estado;

        cotizaciones[posicion] =
            nuevaCotizacion;

    }

    cotizacionEditando =
        null;

} else {

    cotizaciones.push(
        nuevaCotizacion 
    );

}

localStorage.setItem(
    "cotizaciones",
    JSON.stringify(cotizaciones)
);

mostrarCotizaciones();  
// =========================================================
// GUARDAR PDF
// =========================================================

const nombreArchivo =
    "Cotizacion_" +
    nombrePaquete
        .replace(/\s+/g, "_") +
    ".pdf";

pdf.save(
    nombreArchivo
);

});


// ========================================
// CARGAR IMAGEN PARA EL PDF
// ========================================

function cargarImagenPDF(ruta) {

    return new Promise(function (resolve, reject) {

        const imagen = new Image();

        imagen.onload = function () {
            resolve(imagen);
        };

        imagen.onerror = function () {
            reject("No se pudo cargar la imagen: " + ruta);
        };

        imagen.src = ruta;

    });

}
// BOTÓN COTIZACIÓN INDIVIDUAL
document.getElementById("btnCotizacionIndividual").addEventListener("click", function () {

    // Ocultar las opciones del PDF
    document.getElementById("opcionesPDF").style.display = "none";

    // Mostrar el formulario individual
    document.getElementById("formCotizacionIndividual").style.display = "block";

});


// BOTÓN VER TODOS LOS PAQUETES
document.getElementById("btnTodosPaquetes").addEventListener("click", function () {

    // Ocultar el formulario individual
    document.getElementById("formCotizacionIndividual").style.display = "none";

    // Mostrar las opciones del PDF
    document.getElementById("opcionesPDF").style.display = "flex";

});
// RUTA DEL PDF
const rutaPDF = "archivos/PAQUETES SONIDO CHICAGO 2026.pdf";


// VER PDF
document.getElementById("btnVerPDF").addEventListener("click", function () {

    window.open(rutaPDF, "_blank");

});


// COMPARTIR PDF
document.getElementById("btnCompartirPDF").addEventListener("click", async function () {

    // Si el navegador permite compartir archivos
    if (navigator.share && navigator.canShare) {

        try {

            const respuesta = await fetch(rutaPDF);
            const archivo = await respuesta.blob();

            const file = new File(
                [archivo],
                "PAQUETES SONIDO CHICAGO 2026.pdf",
                {
                    type: "application/pdf"
                }
            );

            if (navigator.canShare({ files: [file] })) {

                await navigator.share({
                    title: "Paquetes Sonido Chicago 2026",
                    text: "Te envío los paquetes de Sonido Chicago 2026.",
                    files: [file]
                });

                return;
            }

        } catch (error) {

            console.log("Compartir no disponible:", error);

        }

    }

    // Si no se puede compartir, descargar el PDF
    const enlace = document.createElement("a");

    enlace.href = rutaPDF;
    enlace.download = "PAQUETES SONIDO CHICAGO 2026.pdf";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

});


// WHATSAPP
document.getElementById("btnWhatsAppPDF").addEventListener("click", function () {

    const mensaje = encodeURIComponent(
        "Hola, te envío los paquetes de Sonido Chicago 2026. Puedes revisar las diferentes opciones de sonido e iluminación."
    );

    window.open(
        "https://wa.me/?text=" + mensaje,
        "_blank"
    );

});
function mostrarCotizaciones() {

    const lista =
        document.getElementById("listaCotizaciones");

    const contenedor =
        document.getElementById("contenedorCotizaciones");

    let cotizaciones =
        JSON.parse(
            localStorage.getItem("cotizaciones") || "[]"
        );

    contenedor.innerHTML = "";

    // Si no hay cotizaciones
    if (cotizaciones.length === 0) {

        contenedor.innerHTML =
            "<p>No hay cotizaciones guardadas.</p>";

        lista.style.display = "block";

        return;
    }

    // Mostrar cotizaciones
   cotizaciones.forEach(function (cotizacion) {

    // No mostrar cotizaciones que ya fueron aceptadas
    if (cotizacion.estado === "ACEPTADA") {
        return;
    }

    const tarjeta =
        document.createElement("div");

        tarjeta.className =
            "tarjeta-cotizacion";

        tarjeta.innerHTML = `

            <div class="encabezado-cotizacion">

                <strong>
                    ${cotizacion.cliente || "Sin nombre"}
                </strong>

                <span class="estado-cotizacion">
                    ${cotizacion.estado || "PENDIENTE"}
                </span>

            </div>

            <div class="datos-cotizacion">

                <p>
                    <strong>Evento:</strong>
                    ${cotizacion.evento || "-"}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${cotizacion.fecha || "-"}
                </p>

                <p>
                    <strong>Teléfono:</strong>
                    ${cotizacion.telefono || "-"}
                </p>

                <p>
                    <strong>Paquete:</strong>
                    ${cotizacion.paquete || "-"}
                </p>

                <p>
                    <strong>Total:</strong>
                    Bs ${cotizacion.total || 0}
                </p>

            </div>

            <div class="acciones-cotizacion">

    <button type="button">
        Ver
    </button>

    <button type="button">
        Editar
    </button>

    ${
        cotizacion.estado === "ACEPTADA"
        ?
        `<button type="button" disabled>
            Contrato creado
        </button>`
        :
        `<button type="button">
            Aceptar
        </button>`
    }

    <button type="button">
        Eliminar
    </button>

</div>

        `;

        contenedor.appendChild(tarjeta);
        const botones =
    tarjeta.querySelectorAll(
        ".acciones-cotizacion button"
    );
botones[0].addEventListener(
    "click",
    function () {

        let mensaje =
            "DETALLE DE LA COTIZACION\n\n";

        mensaje +=
            "Cliente: " +
            (cotizacion.cliente || "-") +
            "\n";

        mensaje +=
            "Telefono: " +
            (cotizacion.telefono || "-") +
            "\n";

        mensaje +=
            "Evento: " +
            (cotizacion.evento || "-") +
            "\n";

        mensaje +=
            "Fecha: " +
            (cotizacion.fecha || "-") +
            "\n";

        mensaje +=
            "Lugar: " +
            (cotizacion.lugar || "-") +
            "\n";

        mensaje +=
            "Direccion: " +
            (cotizacion.direccion || "-") +
            "\n\n";

        mensaje +=
            "Paquete: " +
            (cotizacion.paquete || "-") +
            "\n";

        mensaje +=
            "Precio paquete: Bs " +
            (cotizacion.precioPaquete || 0) +
            "\n";

        mensaje +=
            "Descuento: Bs " +
            (cotizacion.descuento || 0) +
            "\n";

        if (
            cotizacion.adicionales &&
            cotizacion.adicionales.length > 0
        ) {

            mensaje +=
                "\nSERVICIOS ADICIONALES:\n";

            cotizacion.adicionales.forEach(
                function (adicional) {

                    mensaje +=
                        "- " +
                        adicional.nombre +
                        ": Bs " +
                        adicional.precio +
                        "\n";

                }
            );
        }

        mensaje +=
            "\nTOTAL: Bs " +
            (cotizacion.total || 0);

        alert(mensaje);

    }
);
botones[1].addEventListener(
    "click",
    function () {

        editarCotizacion(
            cotizacion
        );

    }
);

botones[2].addEventListener(
    "click",
    function () {

        abrirFormularioDesdeCotizacion(
            cotizacion
        );

    }
);

// ELIMINAR
botones[3].addEventListener(
    "click",
    function () {

        const confirmar =
            confirm(
                "¿Estás seguro de eliminar esta cotización?"
            );

        if (!confirmar) {
            return;
        }

        let cotizaciones =
            JSON.parse(
                localStorage.getItem("cotizaciones") || "[]"
            );

        cotizaciones =
            cotizaciones.filter(
                function (item) {

                    return (
                        item.id !==
                        cotizacion.id
                    );

                }
            );

        localStorage.setItem(
            "cotizaciones",
            JSON.stringify(cotizaciones)
        );

        mostrarCotizaciones();

    }
);

});

    lista.style.display = "block";
}
document.getElementById("btnVerCotizaciones").addEventListener("click", function () {

    mostrarCotizaciones();

});
// =========================================
// INICIAR
// =========================================

actualizarBotonVista();

mostrarTodo();

revisarEventosProximos();