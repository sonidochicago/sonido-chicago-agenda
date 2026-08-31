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
// ELEMENTOS
// =========================================

const tituloCalendario =
    document.getElementById(
        "tituloCalendario"
    );


const calendarioAnual =
    document.getElementById(
        "calendarioAnual"
    );


const calendarioMes =
    document.getElementById(
        "calendarioMes"
    );


const calendarioSemana =
    document.getElementById(
        "calendarioSemana"
    );


const calendarioDia =
    document.getElementById(
        "calendarioDia"
    );


const listaContratos =
    document.getElementById(
        "listaContratos"
    );


const ventanaContrato =
    document.getElementById(
        "ventanaContrato"
    );


const ventanaDetalle =
    document.getElementById(
        "ventanaDetalle"
    );


// =========================================
// OBTENER CONTRATOS
// =========================================

function obtenerContratos() {

    return JSON.parse(
        localStorage.getItem(
            "contratos"
        )
    ) || [];

}


// =========================================
// GUARDAR CONTRATOS
// =========================================

function guardarTodos(
    contratos
) {

    localStorage.setItem(
        "contratos",
        JSON.stringify(
            contratos
        )
    );

}


// =========================================
// FORMATO FECHA
// =========================================

function fechaTexto(
    fecha
) {

    if (!fecha) {

        return "Sin fecha";

    }

    const partes =
        fecha.split("-");

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

function nombreEstado(
    estado
) {

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
// CAMBIAR VISTA
// =========================================

function cambiarVista(
    vista
) {

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


    document.getElementById(
        "vistaAño"
    ).classList.toggle(
        "oculto",
        vista !== "año"
    );


    document.getElementById(
        "vistaMes"
    ).classList.toggle(
        "oculto",
        vista !== "mes"
    );


    document.getElementById(
        "vistaSemana"
    ).classList.toggle(
        "oculto",
        vista !== "semana"
    );


    document.getElementById(
        "vistaDia"
    ).classList.toggle(
        "oculto",
        vista !== "dia"
    );


    document.getElementById(
        "vistaEventos"
    ).classList.toggle(
        "oculto",
        vista !== "eventos"
    );


    mostrarTodo();

}


// =========================================
// BOTONES VISTAS
// =========================================

document.querySelectorAll(
    ".vista-btn"
).forEach(
    boton => {

        boton.onclick =
            function() {

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
            document.createElement(
                "div"
            );

        contenedor.className =
            "mes";


        const titulo =
            document.createElement(
                "h3"
            );

        titulo.textContent =
            meses[mes];


        contenedor.appendChild(
            titulo
        );


        const semana =
            document.createElement(
                "div"
            );

        semana.className =
            "dias-semana";


        diasSemana.forEach(
            dia => {

                const d =
                    document.createElement(
                        "div"
                    );

                d.textContent =
                    dia[0];

                semana.appendChild(
                    d
                );

            }
        );


        contenedor.appendChild(
            semana
        );


        const dias =
            document.createElement(
                "div"
            );

        dias.className =
            "dias-mes";


        let primerDia =
            new Date(
                año,
                mes,
                1
            ).getDay();


        if (
            primerDia === 0
        ) {

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
                document.createElement(
                    "div"
                )
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


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "dia";


            elemento.textContent =
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


            if (
                eventos.length > 0
            ) {

                elemento.classList.add(
                    eventos[0].estado ||
                    "reservado"
                );

            }


            if (
                esHoy(fecha)
            ) {

                elemento.classList.add(
                    "hoy"
                );

            }


            elemento.onclick =
                function() {

                    if (
                        eventos.length > 0
                    ) {

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
                elemento
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
        String(mes + 1)
            .padStart(2, "0") +
        "-" +
        String(dia)
            .padStart(2, "0")
    );

}


// =========================================
// ES HOY
// =========================================

function esHoy(
    fecha
) {

    const hoy =
        new Date();


    const texto =
        crearFecha(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        );


    return fecha === texto;

}


// =========================================
// VISTA MES
// =========================================

function mostrarMes() {


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
        document.createElement(
            "div"
        );

    contenedor.className =
        "mes";


    const semana =
        document.createElement(
            "div"
        );

    semana.className =
        "dias-semana";


    diasSemana.forEach(
        dia => {

            const d =
                document.createElement(
                    "div"
                );

            d.textContent =
                dia;

            semana.appendChild(
                d
            );

        }
    );


    contenedor.appendChild(
        semana
    );


    const dias =
        document.createElement(
            "div"
        );

    dias.className =
        "dias-mes";


    let primero =
        new Date(
            año,
            mes,
            1
        ).getDay();


    if (
        primero === 0
    ) {

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
            document.createElement(
                "div"
            )
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


        const elemento =
            document.createElement(
                "div"
            );


        elemento.className =
            "dia";


        elemento.textContent =
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


        if (
            eventos.length
        ) {

            elemento.classList.add(
                eventos[0].estado ||
                "reservado"
            );

        }


        if (
            esHoy(fecha)
        ) {

            elemento.classList.add(
                "hoy"
            );

        }


        elemento.onclick =
            function() {

                if (
                    eventos.length
                ) {

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
            elemento
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


    const fecha =
        new Date(
            fechaActual
        );


    let diaSemana =
        fecha.getDay();


    if (
        diaSemana === 0
    ) {

        diaSemana = 7;

    }


    const lunes =
        new Date(
            fecha
        );


    lunes.setDate(
        fecha.getDate() -
        diaSemana +
        1
    );


    const domingo =
        new Date(
            lunes
        );


    domingo.setDate(
        lunes.getDate() +
        6
    );


    tituloCalendario.textContent =
        formatoCorto(
            lunes
        ) +
        " - " +
        formatoCorto(
            domingo
        );


    calendarioSemana.innerHTML =
        "";


    const grid =
        document.createElement(
            "div"
        );

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
            new Date(
                lunes
            );


        fechaDia.setDate(
            lunes.getDate() +
            i
        );


        const fecha =
            crearFecha(
                fechaDia.getFullYear(),
                fechaDia.getMonth(),
                fechaDia.getDate()
            );


        const columna =
            document.createElement(
                "div"
            );

        columna.className =
            "columna-dia";


        const titulo =
            document.createElement(
                "h3"
            );


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
                    document.createElement(
                        "div"
                    );

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
                    function() {

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
        document.createElement(
            "div"
        );


    contenedor.className =
        "dia-grande";


    const titulo =
        document.createElement(
            "h3"
        );


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


    if (
        contratos.length === 0
    ) {

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
                crearTarjeta(
                    contrato
                )
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


    tituloCalendario.textContent =
        "Todos los eventos";


    listaContratos.innerHTML =
        "";


    const contratos =
        obtenerContratos();


    if (
        contratos.length === 0
    ) {

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
                crearTarjeta(
                    contrato
                )
            );

        }
    );

}


// =========================================
// CREAR TARJETA
// =========================================

function crearTarjeta(
    contrato
) {


    const tarjeta =
        document.createElement(
            "div"
        );


    tarjeta.className =
        "tarjeta-evento " +
        (
            contrato.estado ||
            "reservado"
        );


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
        function() {

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


    if (
        vistaActual === "año"
    ) {

        mostrarAño();

    }


    if (
        vistaActual === "mes"
    ) {

        mostrarMes();

    }


    if (
        vistaActual === "semana"
    ) {

        mostrarSemana();

    }


    if (
        vistaActual === "dia"
    ) {

        mostrarDia();

    }


    if (
        vistaActual === "eventos"
    ) {

        mostrarEventos();

    }

}


// =========================================
// ANTERIOR
// =========================================

document.getElementById(
    "anterior"
).onclick =
    function() {


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

        } else {

            fechaActual.setDate(
                fechaActual.getDate() - 7
            );

        }


        mostrarTodo();

    };


// =========================================
// SIGUIENTE
// =========================================

document.getElementById(
    "siguiente"
).onclick =
    function() {


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

        } else {

            fechaActual.setDate(
                fechaActual.getDate() + 7
            );

        }


        mostrarTodo();

    };


// =========================================
// HOY
// =========================================

document.getElementById(
    "btnHoy"
).onclick =
    function() {

        fechaActual =
            new Date();

        mostrarTodo();

    };


// =========================================
// ABRIR FORMULARIO
// =========================================

function abrirFormulario(
    fecha = ""
) {


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "📝 Nuevo Evento";


    document.getElementById(
        "guardarContrato"
    ).dataset.id =
        "";


    document.getElementById(
        "cliente"
    ).value = "";


    document.getElementById(
        "telefono"
    ).value = "";


    document.getElementById(
        "fechaContrato"
    ).value =
        fecha;


    document.getElementById(
        "horaContrato"
    ).value = "";


    document.getElementById(
        "tipoEvento"
    ).value = "";


    document.getElementById(
        "estado"
    ).value =
        "reservado";


    document.getElementById(
        "lugar"
    ).value = "";


    document.getElementById(
        "direccion"
    ).value = "";


    document.getElementById(
        "servicio"
    ).value = "";


    document.getElementById(
        "precio"
    ).value = "";


    document.getElementById(
        "adelanto"
    ).value = "";


    document.getElementById(
        "observaciones"
    ).value = "";


    document.getElementById(
        "fotoContrato"
    ).value = "";


    document.getElementById(
        "vistaPrevia"
    ).style.display =
        "none";


    fotoTemporal = "";


    ventanaContrato.style.display =
        "flex";

}


// =========================================
// NUEVO
// =========================================

document.getElementById(
    "nuevoContrato"
).onclick =
    function() {

        abrirFormulario();

    };


document.getElementById(
    "btnNuevo"
).onclick =
    function() {

        abrirFormulario();

    };


// =========================================
// FOTO
// =========================================

document.getElementById(
    "fotoContrato"
).onchange =
    function(evento) {


        const archivo =
            evento.target.files[0];


        if (
            !archivo
        ) {

            return;

        }


        const lector =
            new FileReader();


        lector.onload =
            function(e) {

                comprimirFoto(
                    e.target.result
                );

            };


        lector.readAsDataURL(
            archivo
        );

    };


// =========================================
// COMPRIMIR FOTO
// =========================================

function comprimirFoto(
    imagen
) {


    const img =
        new Image();


    img.onload =
        function() {


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


            if (
                ancho > maximo
            ) {

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


            const vista =
                document.getElementById(
                    "vistaPrevia"
                );


            vista.src =
                fotoTemporal;


            vista.style.display =
                "block";

        };


    img.src =
        imagen;

}


// =========================================
// GUARDAR CONTRATO
// =========================================

document.getElementById(
    "guardarContrato"
).onclick =
    function() {


        const fecha =
            document.getElementById(
                "fechaContrato"
            ).value;


        // Solo la fecha es necesaria
        // para colocar el evento
        // correctamente en el calendario.


        if (
            !fecha
        ) {

            alert(
                "Selecciona una fecha para guardar el evento."
            );

            return;

        }


        let contratos =
            obtenerContratos();


        const id =
            document.getElementById(
                "guardarContrato"
            ).dataset.id;


        const datos = {

            cliente:
                document.getElementById(
                    "cliente"
                ).value.trim(),

            telefono:
                document.getElementById(
                    "telefono"
                ).value.trim(),

            fecha:
                fecha,

            hora:
                document.getElementById(
                    "horaContrato"
                ).value,

            tipoEvento:
                document.getElementById(
                    "tipoEvento"
                ).value,

            estado:
                document.getElementById(
                    "estado"
                ).value,

            lugar:
                document.getElementById(
                    "lugar"
                ).value.trim(),

            direccion:
                document.getElementById(
                    "direccion"
                ).value.trim(),

            servicio:
                document.getElementById(
                    "servicio"
                ).value.trim(),

            precio:
                Number(
                    document.getElementById(
                        "precio"
                    ).value
                ) || 0,

            adelanto:
                Number(
                    document.getElementById(
                        "adelanto"
                    ).value
                ) || 0,

            observaciones:
                document.getElementById(
                    "observaciones"
                ).value.trim(),

            foto:
                fotoTemporal

        };


        // =================================
        // EDITAR
        // =================================

        if (
            id
        ) {


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

        // =================================
        // NUEVO
        // =================================

        else {


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


// =========================================
// CERRAR FORMULARIO
// =========================================

document.getElementById(
    "cerrarFormulario"
).onclick =
    cerrarFormulario;


document.getElementById(
    "cancelarFormulario"
).onclick =
    cerrarFormulario;


function cerrarFormulario() {

    ventanaContrato.style.display =
        "none";

}


// =========================================
// MOSTRAR DETALLE
// =========================================

function mostrarDetalle(
    id
) {


    const contratos =
        obtenerContratos();


    const contrato =
        contratos.find(
            c =>
                String(c.id) ===
                String(id)
        );


    if (
        !contrato
    ) {

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


    if (
        contrato.observaciones
    ) {

        html +=
            `
            <p>
                <b>📝 Observaciones:</b><br>
                ${contrato.observaciones}
            </p>
            `;

    }


    if (
        contrato.foto
    ) {

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


    document.getElementById(
        "contenidoDetalle"
    ).innerHTML =
        html;


    ventanaDetalle.style.display =
        "flex";

}


// =========================================
// CERRAR DETALLE
// =========================================

document.getElementById(
    "cerrarDetalle"
).onclick =
    function() {

        ventanaDetalle.style.display =
            "none";

    };


// =========================================
// EDITAR DESDE DETALLE
// =========================================

document.getElementById(
    "editarDesdeDetalle"
).onclick =
    function() {


        if (
            !contratoSeleccionado
        ) {

            return;

        }


        const c =
            contratoSeleccionado;


        document.getElementById(
            "tituloFormulario"
        ).textContent =
            "✏️ Editar Evento";


        document.getElementById(
            "guardarContrato"
        ).dataset.id =
            c.id;


        document.getElementById(
            "cliente"
        ).value =
            c.cliente || "";


        document.getElementById(
            "telefono"
        ).value =
            c.telefono || "";


        document.getElementById(
            "fechaContrato"
        ).value =
            c.fecha || "";


        document.getElementById(
            "horaContrato"
        ).value =
            c.hora || "";


        document.getElementById(
            "tipoEvento"
        ).value =
            c.tipoEvento || "";


        document.getElementById(
            "estado"
        ).value =
            c.estado ||
            "reservado";


        document.getElementById(
            "lugar"
        ).value =
            c.lugar || "";


        document.getElementById(
            "direccion"
        ).value =
            c.direccion || "";


        document.getElementById(
            "servicio"
        ).value =
            c.servicio || "";


        document.getElementById(
            "precio"
        ).value =
            c.precio || "";


        document.getElementById(
            "adelanto"
        ).value =
            c.adelanto || "";


        document.getElementById(
            "observaciones"
        ).value =
            c.observaciones || "";


        fotoTemporal =
            c.foto || "";


        const vista =
            document.getElementById(
                "vistaPrevia"
            );


        if (
            fotoTemporal
        ) {

            vista.src =
                fotoTemporal;

            vista.style.display =
                "block";

        } else {

            vista.style.display =
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

document.getElementById(
    "eliminarDesdeDetalle"
).onclick =
    function() {


        if (
            !contratoSeleccionado
        ) {

            return;

        }


        const confirmar =
            confirm(
                "¿Seguro que deseas eliminar este evento?"
            );


        if (
            !confirmar
        ) {

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

document.getElementById(
    "whatsappBtn"
).onclick =
    function() {


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

        if (
            telefono.length === 8
        ) {

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
// GOOGLE MAPS
// =========================================

document.getElementById(
    "mapsBtn"
).onclick =
    function() {


        if (
            !contratoSeleccionado ||
            !contratoSeleccionado.direccion
        ) {

            alert(
                "Este evento no tiene dirección."
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


// =========================================
// MENÚ CALENDARIO
// =========================================

document.getElementById(
    "btnCalendario"
).onclick =
    function() {

        cambiarVista(
            "mes"
        );

    };


// =========================================
// MENÚ CONTRATOS
// =========================================

document.getElementById(
    "btnContratos"
).onclick =
    function() {

        cambiarVista(
            "eventos"
        );

    };


// =========================================
// FORMATO CORTO
// =========================================

function formatoCorto(
    fecha
) {

    return (
        fecha.getDate() +
        "/" +
        (fecha.getMonth() + 1)
    );

}


// =========================================
// INICIAR
// =========================================

mostrarTodo();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registrado correctamente");
            })
            .catch(error => {
                console.error("Error al registrar Service Worker:", error);
            });
    });
}
