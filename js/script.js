// Arrays de objetos que representa las pizzas disponibles
const pizzas = [
    {
        id: 1,
        nombre: "Muza",
        descripcion: "Clásica muzzarella con salsa de tomate.",
        imagen: "./img/muza.webp",
        precioBase: 7500,
        precioSabor: 1500,
        extrasDisponibles: ["Peperoni", "Aceitunas", "Champiñones"]
    },
    {
        id: 2,
        nombre: "Especial",
        descripcion: "Jamón, morrón, huevo y aceitunas.",
        imagen: "./img/especial.webp",
        precioBase: 7500,
        precioSabor: 2000,
        extrasDisponibles: ["Aceitunas", "Cebolla", "Queso extra"]
    },
    {
        id: 3,
        nombre: "Napo",
        descripcion: "Tomate en rodajas, ajo y orégano.",
        imagen: "./img/napo.webp",
        precioBase: 7500,
        precioSabor: 1700,
        extrasDisponibles: ["Cebolla", "Queso extra", "Aceitunas"]
    },
    {
        id: 4,
        nombre: "Fugazzeta",
        descripcion: "Doble queso y mucha cebolla.",
        imagen: "./img/fugazzeta.webp",
        precioBase: 8000,
        precioSabor: 1900,
        extrasDisponibles: ["Cebolla", "Queso extra", "Jamon crudo"]
    },
    {
        id: 5,
        nombre: "Calabresa",
        descripcion: "Mozzarella con longaniza picante.",
        imagen: "./img/cala.webp",
        precioBase: 8000,
        precioSabor: 2000,
        extrasDisponibles: ["Cebolla", "Aceitunas", "roquefort"]
    },
    {
        id: 6,
        nombre: "Crudo y Rúcula",
        descripcion: "Jamón crudo y rúcula fresca.",
        imagen: "./img/crudo1.jpg",
        precioBase: 8500,
        precioSabor: 2500,
        extrasDisponibles: ["Queso extra", "Champiñones", "Aceitunas"]
    }
];

// Pedir nombre del usuario
const usuario = localStorage.getItem("usuario") || prompt("¿Cuál es tu nombre?");
localStorage.setItem("usuario", usuario);

// Agregar el nombre del usuario en la pagina 
const nombreUsuario = document.getElementById("nombre-usuario");
if (nombreUsuario) nombreUsuario.textContent = usuario;

// --- FUNCION PARA CARGAR LAS PIZZAS EN LA PAGINA  (index.html) ---
const contenedor = document.getElementById("contenedor-pizzas");
if (contenedor) {
    pizzas.forEach(pizza => {
        // Creacion de cards de pizza
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-pizza";

        let tamanoSeleccionado = "";
        let extrasSeleccionados = [];

        // Generacion del HTML interno de las cards
        tarjeta.innerHTML = `
            <img src="${pizza.imagen}" alt="${pizza.nombre}" />
            <h3>${pizza.nombre}</h3>
            <p>${pizza.descripcion}</p>

            <div class="seccion-tamano">
                <strong>Tamaño:</strong><br/>
                <button data-tamano="Pequeña">Pequeña</button>
                <button data-tamano="Mediana">Mediana</button>
                <button data-tamano="Grande">Grande</button>
            </div>

            <div class="seccion-extras">
                <strong>Ingredientes extras:</strong>
                ${pizza.extrasDisponibles.map(extra => `
                    <button data-extra="${extra}">${extra}</button>
                `).join('')}
            </div>

            <label>Cantidad:
                <input type="number" min="1" value="1" class="input-cantidad" />
            </label>
            <button class="boton-agregar">AGREGAR AL CARRITO</button>
        `;

        // Seleccion del tamaño
        tarjeta.querySelectorAll('[data-tamano]').forEach(boton => {
            boton.addEventListener("click", () => {
                tamanoSeleccionado = boton.dataset.tamano;
                tarjeta.querySelectorAll('[data-tamano]').forEach(b => b.classList.remove("seleccionado"));
                boton.classList.add("seleccionado");
            });
        });

        // Seleccion de ingredientes extras
        tarjeta.querySelectorAll('[data-extra]').forEach(boton => {
            boton.addEventListener("click", () => {
                const extra = boton.dataset.extra;
                if (extrasSeleccionados.includes(extra)) {
                    extrasSeleccionados = extrasSeleccionados.filter(e => e !== extra);
                    boton.classList.remove("seleccionado");
                } else {
                    extrasSeleccionados.push(extra);
                    boton.classList.add("seleccionado");
                }
            });
        });

        // Boton de "Agregar al carrito"
        const botonAgregar = tarjeta.querySelector(".boton-agregar");
        botonAgregar.addEventListener("click", () => {
            const cantidad = parseInt(tarjeta.querySelector(".input-cantidad").value);
            if (!tamanoSeleccionado || cantidad <= 0) {
                alert("Selecciona un tamaño y una cantidad válida.");
                return;
            }

            // Calcular el precio total de la pizza
            let precioTamano = 0;
            if (tamanoSeleccionado === "Mediana") precioTamano = 2000;
            else if (tamanoSeleccionado === "Grande") precioTamano = 3000;

            const precioTotal = (pizza.precioBase + pizza.precioSabor + precioTamano + extrasSeleccionados.length * 1000) * cantidad;

            // Arrays del pedido
            const pedido = {
                nombre: pizza.nombre,
                tamano: tamanoSeleccionado,
                extras: extrasSeleccionados,
                cantidad,
                total: precioTotal
            };

            // Sacar el carrito del almacenamiento local 
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito.push(pedido);
            localStorage.setItem("carrito", JSON.stringify(carrito));

            // Boton agregado
            botonAgregar.textContent = "AGREGADO";
            botonAgregar.classList.add("boton-agregado");
        });

        contenedor.appendChild(tarjeta);
    });
}

// --- FUNCION PARA MOSTRAR EL CARRITO (carrito.html) ---
const listaCarrito = document.getElementById("lista-carrito");
if (listaCarrito) {
    
    const renderizarCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalElemento = document.getElementById("total-carrito");
        let total = 0;

        listaCarrito.innerHTML = "";
        if (carrito.length === 0) {
            listaCarrito.innerHTML = "<p>Tu carrito esta vacio. ¡Añade una pizza para comenzar tu pedido!</p>";
        } else {
            carrito.forEach((item, index) => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta-carrito";

                // Cards carrito
                tarjeta.innerHTML = `
                    <h3>${item.nombre}</h3>
                    <p>Tamaño: ${item.tamano}</p>
                    <p>Extras: ${item.extras.join(", ") || "Ninguno"}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p><strong>Subtotal: $${item.total}</strong></p>
                    <button class="boton-eliminar" data-index="${index}">Eliminar</button>
                `;

                listaCarrito.appendChild(tarjeta);
                total += item.total;
            });
        }
        totalElemento.textContent = total;
    };

    // Eliminar un pedido del carrito
    listaCarrito.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-eliminar")) {
            const index = e.target.dataset.index;
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            carrito.splice(index, 1); 
            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderizarCarrito();
        }
    });

    // Botón de "PEDIR"
    const botonPedir = document.getElementById("boton-pedir");
    const mensajePedido = document.getElementById("mensaje-pedido");

    botonPedir.addEventListener("click", () => {
        botonPedir.textContent = "PEDIDO ENVIADO";
        botonPedir.classList.add("boton-agregado");
        // Mensaje 
        mensajePedido.textContent = `¡Gracias por tu pedido, ${usuario}! Estara listo para disfrutar en 20 minutos.`;
        
        // Vaciar el carrito despues de 10 segundos 
        setTimeout(() => {
            localStorage.removeItem("carrito");
            renderizarCarrito();
        }, 10000);
    });

    // Llamada inicial para cargar el carrito
    renderizarCarrito();

    //  Limpiar el carrito 
    window.addEventListener("beforeunload", () => {
        const mensajePedidoTexto = mensajePedido.textContent;
        //  borrar el carrito si el pedido ya fue enviado
        if (mensajePedidoTexto.includes("PEDIDO ENVIADO")) {
            localStorage.removeItem("carrito");
        }
    });
}