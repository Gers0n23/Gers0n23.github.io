// Esperar a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.querySelector('#contactForm');

    // Función para manejar la barra de navegación fija al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Menú móvil - Burger
    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Cerrar menú móvil al hacer clic en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            burger.classList.remove('active');
        });
    });

    // Destacar el enlace de navegación activo según la sección visible
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.querySelector('a').classList.remove('active');
            if (item.querySelector('a').getAttribute('href') === `#${current}`) {
                item.querySelector('a').classList.add('active');
            }
        });
    });

    // Filtro de proyectos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón actual
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Formulario de contacto - Prevenir el envío real hasta que tengas backend
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const subject = document.querySelector('#subject').value.trim();
            const message = document.querySelector('#message').value.trim();
            
            // Validación básica
            if (!name || !email || !subject || !message) {
                showFormMessage('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Simulación de envío exitoso
            showFormMessage('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
            contactForm.reset();
        });
    }

    // Función para mostrar mensajes en el formulario
    function showFormMessage(text, type) {
        // Eliminar mensajes anteriores
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crear nuevo mensaje
        const messageElement = document.createElement('div');
        messageElement.classList.add('form-message');
        messageElement.classList.add(type === 'success' ? 'form-message-success' : 'form-message-error');
        messageElement.textContent = text;
        
        // Insertar después del botón de envío
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.insertAdjacentElement('afterend', messageElement);
        
        // Eliminar después de 5 segundos
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Animación para aparecer los elementos mientras se hace scroll
    const fadeInElements = document.querySelectorAll('.project-card, .skill-item, .about-image');
    
    const fadeInOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, fadeInObserver) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(element);
    });
    
    // Clase para animación fade-in
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .form-message {
                margin-top: 1rem;
                padding: 0.8rem;
                border-radius: 4px;
                font-weight: 500;
            }
            
            .form-message-success {
                background-color: rgba(46, 204, 113, 0.1);
                color: #27ae60;
                border: 1px solid #27ae60;
            }
            
            .form-message-error {
                background-color: rgba(231, 76, 60, 0.1);
                color: #e74c3c;
                border: 1px solid #e74c3c;
            }
        </style>
    `);
});

// Función para escribir el código en la sección hero con efecto de typing
document.addEventListener('DOMContentLoaded', function() {
    const codeElement = document.querySelector('.code-block code');
    if (!codeElement) return;
    
    const originalCode = codeElement.innerHTML;
    codeElement.innerHTML = '';
    
    let i = 0;
    const typeCode = () => {
        if (i < originalCode.length) {
            codeElement.innerHTML += originalCode.charAt(i);
            i++;
            setTimeout(typeCode, 20);
        }
    };
    
    // Iniciar animación después de un breve retraso
    setTimeout(typeCode, 1000);
});
