// Número de WhatsApp (CAMBIA ESTO CON TU NÚMERO)
const WHATSAPP_NUMBER = '573216974633';

// Cargar carrito desde localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    updateCartUI();
});

// Evento para escuchar cambios en localStorage (cuando se agrega desde index.html)
window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
        cart = JSON.parse(event.newValue) || [];
        renderCart();
        updateCartUI();
    }
});

// Función para agregar productos al carrito (llamada desde index.html)
function agregarAlCarrito(name, price) {
    const productoExistente = cart.find(item => item.name === name);

    if (productoExistente) {
        productoExistente.quantity++;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    updateCartUI();
    
    // Mostrar notificación
    showNotification(`${name} agregado al carrito`);
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Renderizar carrito
function renderCart() {
    const container = document.getElementById('cartItemsContainer');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
                <p class="text-gray-500 text-lg">Tu carrito está vacío</p>
                <a href="../index.html" class="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    Continuar comprando
                </a>
            </div>
        `;
        return;
    }

    let html = '<div class="space-y-4">';

    cart.forEach((item, index) => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        html += `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 text-lg mb-1">${item.name}</h3>
                        <p class="text-gray-600 text-sm">$${item.price.toFixed(2)} c/u</p>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
                            <button onclick="decrementQuantity(${index})" class="bg-red-500 text-white w-8 h-8 rounded hover:bg-red-600 transition-colors duration-300 font-bold">−</button>
                            <span class="w-8 text-center font-semibold">${item.quantity}</span>
                            <button onclick="incrementQuantity(${index})" class="bg-blue-500 text-white w-8 h-8 rounded hover:bg-blue-600 transition-colors duration-300 font-bold">+</button>
                        </div>
                        
                        <div class="text-right min-w-24">
                            <p class="font-bold text-gray-900 text-lg">$${subtotal}</p>
                        </div>
                        
                        <button onclick="removeItem(${index})" class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors duration-300 text-sm font-semibold">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Incrementar cantidad
function incrementQuantity(index) {
    cart[index].quantity++;
    saveCart();
    renderCart();
    updateCartUI();
}

// Decrementar cantidad
function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        renderCart();
        updateCartUI();
    }
}

// Eliminar producto
function removeItem(index) {
    const productName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartUI();
    showNotification(`${productName} eliminado del carrito`);
}

// Actualizar UI (totales y botón)
function updateCartUI() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cartCount').textContent = cart.length;
    
    // Mostrar/ocultar botón Continuar comprando
    const continueBtnContainer = document.getElementById('continueBtnContainer');
    if (cart.length > 0) {
        continueBtnContainer.classList.remove('hidden');
    } else {
        continueBtnContainer.classList.add('hidden');
    }
    
    // Habilitar/deshabilitar botón de pago
    document.getElementById('payBtn').disabled = cart.length === 0;
}

// Pagar por WhatsApp
function pagarWhatsapp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    let mensaje = '*🛒 PEDIDO DE COMPRA - AutoParts Pro*\n\n';
    mensaje += '*📦 PRODUCTOS ORDENADOS:*\n';
    mensaje += '─────────────────────\n';

    cart.forEach((item, index) => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        mensaje += `${index + 1}. ${item.name}\n`;
        mensaje += `   Cantidad: ${item.quantity} × $${item.price.toFixed(2)}\n`;
        mensaje += `   Subtotal: $${subtotal}\n\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    mensaje += '─────────────────────\n';
    mensaje += `*💰 TOTAL A PAGAR: $${total.toFixed(2)}*\n\n`;
    mensaje += '✅ Confirma tu pedido para continuar.\n';
    mensaje += '¡Gracias por tu compra!';

    const mensajeEncodado = encodeURIComponent(mensaje);
    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeEncodado}`;

    window.open(urlWhatsapp, '_blank');
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce';
    notification.innerHTML = `<i class="fas fa-check mr-2"></i>${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Hacer agregarAlCarrito accesible desde otras páginas
window.agregarAlCarrito = agregarAlCarrito;
