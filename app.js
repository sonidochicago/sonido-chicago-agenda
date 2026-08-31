
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
// UBICACIÓN DEL EVENTO
// =========================================

let mapa = null;
let marcador = null;

let latitudSeleccionada = "";
let longitudSeleccionada = "";


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
// FUNCIÓN SEGURA PARA OBTENER ELEMENTOS
// =========================================

function elemento(id) {
    return document.getElementById(id);
}

function obtenerValor(id, valorPorDefecto = "") {

    const campo = document.getElementById(id);

    if (!campo) {
        console.warn("No existe el elemento:", id);
        return valorPorDefecto;
    }

    return campo.value;
}


// =========================================
// OBTENER VALOR DE UN ELEMENTO
// =========================================

function obtenerValor(id, valorPorDefecto = "") {

    const el = elemento(id);

    if (!el) {
        console.warn(
            "No existe el elemento con id:",
            id
        );

        return valorPorDefecto;
    }

    return el.value;
}


// =========================================
// COLOCAR VALOR
// =========================================

function ponerValor(id, valor = "") {

    const el = elemento(id);

    if (el) {
        el.value = valor;
    }
}


// =========================================
// ELEMENTOS PRINCIPALES
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

const ventanaContrato =
    elemento("ventanaContrato");

const ventanaDetalle =
    elemento("ventanaDetalle");


// =========================================
// OBTENER CONTRATOS
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


// =========================================
// GUARDAR CONTRATOS
// =========================================

function guardarTodos(contratos) {

    localStorage.setItem(
        "contratos",
        JSON.stringify(contratos)
    );

}


// =========================================
// FORMATO FECHA
// =========================================

function fechaTexto(fecha) {

    if (!fecha) {
        return "Sin fecha";
    }

    const partes = fecha.split("-");

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


// =========================================
// NOMBRE DEL ESTADO
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

    return (
        nombres[estado] ||
        "🟡 RESERVADO"
    );

}


// =========================================
// CREAR FECHA
// =========================================

function crearFecha(
    año,
    mes,
    dia
) {

    return (
        año +
        "-" +
        String(mes + 1).padStart(2, "0") +
        "-" +
        String(dia).padStart(2, "0")
    );

}


// =========================================
// ES HOY
// =========================================

function esHoy(fecha) {

    const hoy = new Date();

    const texto = crearFecha(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
    );

    return fecha === texto;

}


// =========================================
// FORMATO CORTO
// =========================================

function formatoCorto(fecha) {

    return (
        fecha.getDate() +
        "/" +
        (fecha.getMonth() + 1)
    );

}


// =========================================
// MAPA - SELECCIONAR UBICACIÓN
// =========================================

const ubicacionBtn =
    elemento("ubicacionBtn");

if (ubicacionBtn) {

    ubicacionBtn.onclick = function () {

        const mapaContenedor =
            elemento("mapaUbicacion");

        if (!mapaContenedor) {
            return;
        }

        mapaContenedor.style.display =
            "block";


        // Crear mapa solamente una vez

        if (!mapa) {

            if (
                typeof L === "undefined"
            ) {

                alert(
                    "No se pudo cargar Google Maps/Leaflet."
                );

                return;
            }


            mapa =
                L.map("mapa").setView(
                    [-17.3935, -66.1570],
                    13
                );


            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "© OpenStreetMap"
                }
            ).addTo(mapa);


            mapa.on(
                "click",
                function (e) {

                    latitudSeleccionada =
                        e.latlng.lat;

                    longitudSeleccionada =
                        e.latlng.lng;


                    if (marcador) {

                        mapa.removeLayer(
                            marcador
                        );

                    }


                    marcador =
                        L.marker([
                            latitudSeleccionada,
                            longitudSeleccionada
                        ])
                        .addTo(mapa);


                    ponerValor(
                        "latitud",
                        latitudSeleccionada
                    );


                    ponerValor(
                        "longitud",
                        longitudSeleccionada
                    );


                    console.log(
                        "Ubicación seleccionada:",
                        latitudSeleccionada,
                        longitudSeleccionada
                    );

                }
            );

        }


        // Mostrar ubicación guardada

        if (
            latitudSeleccionada !== "" &&
            longitudSeleccionada !== ""
        ) {

            mapa.setView(
                [
                    Number(latitudSeleccionada),
                    Number(longitudSeleccionada)
                ],
                17
            );


            if (marcador) {

                mapa.removeLayer(
                    marcador
                );

            }


            marcador =
                L.marker([
                    Number(latitudSeleccionada),
                    Number(longitudSeleccionada)
                ])
                .addTo(mapa);

        }


        setTimeout(
            function () {

                if (mapa) {
                    mapa.invalidateSize();
                }

            },
            200
        );

    };

}


// =========================================
// CAMBIAR VISTA
// =========================================

function cambiarVista(vista) {

    vistaActual = vista;


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

        año: "vistaAño",
        mes: "vistaMes",
        semana: "vistaSemana",
        dia: "vistaDia",
        eventos: "vistaEventos"

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


// =========================================
// BOTONES DE VISTAS
// =========================================

document.querySelectorAll(
    ".vista-btn"
).forEach(
    boton => {

        boton.onclick = function () {

            cambiarVista(
                boton.dataset.vista
            );

        };

    }
);


// =========================================
// CALENDARIO ANUAL
// =========================================

function mostrarAño() {

    if (!calendarioAnual) {
        return;
    }


    calendarioAnual.innerHTML = "";


    const año =
        fechaActual.getFullYear();


    if (tituloCalendario) {

        tituloCalendario.textContent =
            año;

    }


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

                    if (eventos.length > 0) {

                        mostrarDetalle(
                            eventos[0].id
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


    if (tituloCalendario) {

        tituloCalendario.textContent =
            meses[mes] +
            " " +
            año;

    }


    calendarioMes.innerHTML = "";


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

                if (eventos.length > 0) {

                    mostrarDetalle(
                        eventos[0].id
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
        lunes.getDate() +
        6
    );


    if (tituloCalendario) {

        tituloCalendario.textContent =
            formatoCorto(lunes) +
            " - " +
            formatoCorto(domingo);

    }


    calendarioSemana.innerHTML = "";


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


        const eventos =
            contratos.filter(
                c =>
                    c.fecha === fecha
            );


        eventos.forEach(
            evento => {

                const mini =
                    document.createElement("div");

                mini.className =
                    "evento-mini " +
                    (
                        evento.estado ||
                        "reservado"
                    );


                mini.innerHTML =
                    `
                    <b>
                        ${evento.hora || ""}
                    </b>
                    <br>
                    ${evento.cliente || "Evento"}
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


    if (tituloCalendario) {

        tituloCalendario.textContent =
            dia +
            " de " +
            meses[mes] +
            " " +
            año;

    }


    calendarioDia.innerHTML = "";


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


    if (contratos.length === 0) {

        contenedor.innerHTML +=
            `
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
// VISTA EVENTOS
// =========================================

function mostrarEventos() {

    if (!listaContratos) {
        return;
    }


    if (tituloCalendario) {

        tituloCalendario.textContent =
            "Todos los eventos";

    }


    listaContratos.innerHTML = "";


    const contratos =
        obtenerContratos();


    if (contratos.length === 0) {

        listaContratos.innerHTML =
            `
            <div class="tarjeta-evento">
                <h3>📋 No hay eventos</h3>

                <p>
                    Todavía no tienes contratos registrados.
                </p>
            </div>
            `;

        return;

    }


    contratos.sort(
        (a, b) =>
            (a.fecha || "")
            .localeCompare(
                b.fecha || ""
            )
    );


    contratos.forEach(
        contrato => {

            listaContratos.appendChild(
                crearTarjeta(contrato)
            );

        }
    );

}


// =========================================
// CREAR TARJETA
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
        precio - adelanto;


    tarjeta.innerHTML =
        `
        <h3>
            👤
            ${
                contrato.cliente ||
                "Cliente no especificado"
            }
        </h3>

        <p>
            📅
            ${
                fechaTexto(
                    contrato.fecha
                )
            }
        </p>

        <p>
            🕐
            ${
                contrato.hora ||
                "Hora no especificada"
            }
        </p>

        <p>
            🎉
            ${
                contrato.tipoEvento ||
                "Evento no especificado"
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
            🗺️
            ${
                contrato.direccion ||
                "Dirección no especificada"
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

    } else if (vistaActual === "mes") {

        mostrarMes();

    } else if (vistaActual === "semana") {

        mostrarSemana();

    } else if (vistaActual === "dia") {

        mostrarDia();

    } else if (vistaActual === "eventos") {

        mostrarEventos();

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

            if (vistaActual === "año") {

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

            if (vistaActual === "año") {

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

    ponerValor(
        "tituloFormulario",
        ""
    );


    const titulo =
        elemento("tituloFormulario");

    if (titulo) {

        titulo.textContent =
            "📝 Nuevo Evento";

    }


    const guardar =
        elemento("guardarContrato");

    if (guardar) {

        guardar.dataset.id = "";

    }


    ponerValor("cliente", "");

    ponerValor("telefono", "");

    ponerValor(
        "fechaContrato",
        fecha
    );

    ponerValor("horaContrato", "");

    ponerValor("tipoEvento", "");

    ponerValor(
        "estado",
        "reservado"
    );

    ponerValor("lugar", "");

    ponerValor("direccion", "");

    ponerValor("servicio", "");

    ponerValor("precio", "");

    ponerValor("adelanto", "");

    ponerValor("saldo", "0.00");

    ponerValor(
        "observaciones",
        ""
    );


    const foto =
        elemento("fotoContrato");

    if (foto) {
        foto.value = "";
    }


    const vista =
        elemento("vistaPrevia");

    if (vista) {
        vista.src = "";
        vista.style.display = "none";
    }


    fotoTemporal = "";

    latitudSeleccionada = "";

    longitudSeleccionada = "";


    ponerValor(
        "latitud",
        ""
    );

    ponerValor(
        "longitud",
        ""
    );

    ponerValor(
        "ubicacion",
        ""
    );


    const mapaContenedor =
        elemento("mapaUbicacion");

    if (mapaContenedor) {

        mapaContenedor.style.display =
            "none";

    }


    if (marcador && mapa) {

        mapa.removeLayer(
            marcador
        );

        marcador = null;

    }


    if (ventanaContrato) {

        ventanaContrato.style.display =
            "flex";

    }

}


// =========================================
// NUEVO CONTRATO
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
                canvas.getContext("2d");


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


            const vista =
                elemento("vistaPrevia");


            if (vista) {

                vista.src =
                    fotoTemporal;

                vista.style.display =
                    "block";

            }

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


            // ===============================
            // FECHA
            // ===============================

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


            // ===============================
            // CONTRATOS EXISTENTES
            // ===============================

            let contratos =
                obtenerContratos();


            // ===============================
            // ID
            // ===============================

            const id =
                guardarContrato.dataset.id;


            // ===============================
            // DATOS
            // ===============================

            const datos = {

                cliente:
                    obtenerValor(
                        "cliente"
                    ).trim(),

                telefono:
                    obtenerValor(
                        "telefono"
                    ).trim(),

                fecha:
                    fecha,

                hora:
                    obtenerValor(
                        "horaContrato"
                    ),

                tipoEvento:
                    obtenerValor(
                        "tipoEvento"
                    ),

                estado:
                    obtenerValor(
                        "estado",
                        "reservado"
                    ),

                lugar:
                    obtenerValor(
                        "lugar"
                    ).trim(),

                direccion:
                    obtenerValor(
                        "direccion"
                    ).trim(),

               ubicacion:
    (
        latitudSeleccionada !== "" &&
        longitudSeleccionada !== ""
    )
    ?
    `https://www.google.com/maps?q=${latitudSeleccionada},${longitudSeleccionada}`
    :
    "",

latitud:
    latitudSeleccionada,

longitud:
    longitudSeleccionada,

servicio:
    obtenerValor(
        "servicio"
    ).trim(),

                precio:
                    Number(
                        obtenerValor(
                            "precio"
                        )
                    ) || 0,

                adelanto:
                    Number(
                        obtenerValor(
                            "adelanto"
                        )
                    ) || 0,

                observaciones:
                    obtenerValor(
                        "observaciones"
                    ).trim(),

                foto:
                    fotoTemporal

            };


            // ===============================
            // EDITAR
            // ===============================

            if (id) {

                const posicion =
                    contratos.findIndex(
                        c =>
                            String(c.id) ===
                            String(id)
                    );


                if (
                    posicion !== -1
                ) {

                    contratos[posicion] = {

                        ...contratos[posicion],

                        ...datos

                    };

                }

            }


            // ===============================
            // NUEVO
            // ===============================

            else {

                contratos.push({

                    id:
                        Date.now(),

                    ...datos

                });

            }


                // ===============================
                // GUARDAR
                // ===============================

                guardarTodos(
                    contratos
                );


                if (ventanaContrato) {

                    ventanaContrato.style.display =
                        "none";

                }


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

    if (ventanaContrato) {

        ventanaContrato.style.display =
            "none";

    }

}


const cerrarFormularioBtn =
    elemento("cerrarFormulario");

if (cerrarFormularioBtn) {

    cerrarFormularioBtn.onclick =
        cerrarFormulario;

}


const cancelarFormulario =
    elemento("cancelarFormulario");

if (cancelarFormulario) {

    cancelarFormulario.onclick =
        cerrarFormulario;

}


// =========================================
// CALCULAR SALDO
// =========================================

function calcularSaldo() {

    const precio =
        Number(
            obtenerValor(
                "precio"
            )
        ) || 0;


    const adelanto =
        Number(
            obtenerValor(
                "adelanto"
            )
        ) || 0;


    const saldo =
        precio -
        adelanto;


    ponerValor(
        "saldo",
        saldo.toFixed(2)
    );

}


const precioElemento =
    elemento("precio");

if (precioElemento) {

    precioElemento.addEventListener(
        "input",
        calcularSaldo
    );

}


const adelantoElemento =
    elemento("adelanto");

if (adelantoElemento) {

    adelantoElemento.addEventListener(
        "input",
        calcularSaldo
    );

}


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

        console.warn(
            "No se encontró el contrato:",
            id
        );

        return;

    }


    contratoSeleccionado =
        contrato;


    const precio =
        Number(
            contrato.precio
        ) || 0;


    const adelanto =
        Number(
            contrato.adelanto
        ) || 0;


    const saldo =
        precio -
        adelanto;


    let html =
        `
        <div class="detalle-info">

            <h3>
                ${
                    contrato.cliente ||
                    "Evento sin cliente"
                }
            </h3>

            <p>
                <b>📅 Fecha:</b>
                ${
                    fechaTexto(
                        contrato.fecha
                    )
                }
            </p>

            <p>
                <b>🕐 Hora:</b>
                ${
                    contrato.hora ||
                    "Sin especificar"
                }
            </p>

            <p>
                <b>🎉 Evento:</b>
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
                <b>🗺️ Dirección:</b>
                ${
                    contrato.direccion ||
                    "Sin especificar"
                }
            </p>
        `;


    // =====================================
    // UBICACIÓN GPS
    // =====================================

    if (contrato.ubicacion) {

        html +=
            `
            <p>
                <b>📍 Ubicación exacta:</b>
                <br><br>

                <button
                    type="button"
                    onclick="window.open('${contrato.ubicacion}', '_blank')">

                    🗺️ VER UBICACIÓN

                </button>

            </p>
            `;

    }


    html +=
        `
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
                <b>Estado:</b>

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


    if (contrato.observaciones) {

        html +=
            `
            <p>
                <b>📝 Observaciones:</b>
                <br>
                ${contrato.observaciones}
            </p>
            `;

    }


    if (contrato.foto) {

        html +=
            `
            <img
                src="${contrato.foto}"
                class="foto-detalle"
                alt="Foto del contrato">
            `;

    }


    html +=
        "</div>";


    const contenido =
        elemento("contenidoDetalle");


    if (contenido) {

        contenido.innerHTML =
            html;

    }


    if (ventanaDetalle) {

        ventanaDetalle.style.display =
            "flex";

    }

}


// =========================================
// CERRAR DETALLE
// =========================================

const cerrarDetalle =
    elemento("cerrarDetalle");

if (cerrarDetalle) {

    cerrarDetalle.onclick =
        function () {

            if (ventanaDetalle) {

                ventanaDetalle.style.display =
                    "none";

            }

        };

}


// =========================================
// EDITAR DESDE DETALLE
// =========================================

const editarDesdeDetalle =
    elemento("editarDesdeDetalle");


if (editarDesdeDetalle) {

    editarDesdeDetalle.onclick =
        function () {


            if (!contratoSeleccionado) {

                return;

            }


            const c =
                contratoSeleccionado;


            const titulo =
                elemento(
                    "tituloFormulario"
                );


            if (titulo) {

                titulo.textContent =
                    "✏️ Editar Evento";

            }


            if (guardarContrato) {

                guardarContrato.dataset.id =
                    c.id;

            }


            ponerValor(
                "cliente",
                c.cliente || ""
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


            // ===============================
            // UBICACIÓN
            // ===============================

            latitudSeleccionada =
                c.latitud || "";

            longitudSeleccionada =
                c.longitud || "";


            ponerValor(
                "latitud",
                latitudSeleccionada
            );

            ponerValor(
                "longitud",
                longitudSeleccionada
            );

            ponerValor(
                "ubicacion",
                c.ubicacion || ""
            );


            // ===============================
            // SERVICIO
            // ===============================

            ponerValor(
                "servicio",
                c.servicio || ""
            );


            // ===============================
            // PRECIO
            // ===============================

            ponerValor(
                "precio",
                c.precio || ""
            );


            // ===============================
            // ADELANTO
            // ===============================

            ponerValor(
                "adelanto",
                c.adelanto || ""
            );


            // ===============================
            // SALDO
            // ===============================

            calcularSaldo();


            // ===============================
            // OBSERVACIONES
            // ===============================

            ponerValor(
                "observaciones",
                c.observaciones || ""
            );


            // ===============================
            // FOTO
            // ===============================

            fotoTemporal =
                c.foto || "";


            const vista =
                elemento("vistaPrevia");


            if (vista) {

                if (fotoTemporal) {

                    vista.src =
                        fotoTemporal;

                    vista.style.display =
                        "block";

                } else {

                    vista.src = "";

                    vista.style.display =
                        "none";

                }

            }


            if (ventanaDetalle) {

                ventanaDetalle.style.display =
                    "none";

            }


            if (ventanaContrato) {

                ventanaContrato.style.display =
                    "flex";

            }

        };

}


// =========================================
// ELIMINAR
// =========================================

const eliminarDesdeDetalle =
    elemento(
        "eliminarDesdeDetalle"
    );


if (eliminarDesdeDetalle) {

    eliminarDesdeDetalle.onclick =
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


            if (ventanaDetalle) {

                ventanaDetalle.style.display =
                    "none";

            }


            contratoSeleccionado =
                null;


            alert(
                "🗑️ Evento eliminado."
            );


            mostrarTodo();

        };

}


// =========================================
// WHATSAPP
// =========================================

const whatsappBtn =
    elemento("whatsappBtn");


if (whatsappBtn) {

    whatsappBtn.onclick =
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


            // Bolivia

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

}


// =========================================
// GOOGLE MAPS
// =========================================

const mapsBtn =
    elemento("mapsBtn");


if (mapsBtn) {

    mapsBtn.onclick =
        function () {


            if (!contratoSeleccionado) {

                alert(
                    "No hay evento seleccionado."
                );

                return;

            }


            // Primero intenta usar GPS

            if (
                contratoSeleccionado.latitud !== "" &&
                contratoSeleccionado.longitud !== "" &&
                contratoSeleccionado.latitud != null &&
                contratoSeleccionado.longitud != null
            ) {

                const url =
                    `https://www.google.com/maps?q=${contratoSeleccionado.latitud},${contratoSeleccionado.longitud}`;


                window.open(
                    url,
                    "_blank"
                );

                return;

            }


            // Si no tiene GPS utiliza dirección

            if (
                !contratoSeleccionado.direccion
            ) {

                alert(
                    "Este evento no tiene ubicación ni dirección."
                );

                return;

            }


            const direccion =
                encodeURIComponent(
                    contratoSeleccionado.direccion
                );


            window.open(
                "https://www.google.com/maps/search/?api=1&query=" +
                direccion,
                "_blank"
            );

        };

}


// =========================================
// MENÚ CALENDARIO
// =========================================

const btnCalendario =
    elemento("btnCalendario");


if (btnCalendario) {

    btnCalendario.onclick =
        function () {

            cambiarVista(
                "mes"
            );

        };

}


// =========================================
// MENÚ CONTRATOS
// =========================================

const btnContratos =
    elemento("btnContratos");


if (btnContratos) {

    btnContratos.onclick =
        function () {

            cambiarVista(
                "eventos"
            );

        };

}


// =========================================
// INICIAR APLICACIÓN
// =========================================

mostrarTodo();


// =========================================
// SERVICE WORKER
// =========================================

