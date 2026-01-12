        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('active');
        }

        // Función para agregar productos al carrito
        function agregarAlCarrito(name, price) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
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

            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Mostrar notificación
            showNotification(`${name} agregado al carrito`);
            
            // Actualizar contador del carrito en el header
            updateCartCount(cart.length);
        }

        // Función para actualizar el contador del carrito
        function updateCartCount(count) {
            const cartCountElement = document.getElementById('cartCount');
            if (cartCountElement) {
                cartCountElement.textContent = count;
            }
        }

        // Función para mostrar notificación
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
            notification.innerHTML = `<i class="fas fa-check mr-2"></i>${message}`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);
        }

        // Inicializar contador al cargar
        document.addEventListener('DOMContentLoaded', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            updateCartCount(cart.length);
        });