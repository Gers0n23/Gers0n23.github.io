// Archivo: js/projects-carousel.js
// Gestiona el carrusel de proyectos

function getProjectImage(imgContainer) {
    if (!imgContainer || !imgContainer.querySelector('img')) {
        return `<img src="img/proyecto_default.jpg" alt="Imagen de proyecto">`;
    }
    
    // Modificar todas las imágenes para agregar el atributo onerror
    const imgHTML = imgContainer.innerHTML;
    const modifiedHTML = imgHTML.replace('<img ', '<img onerror="this.src=\'img/proyecto_default.jpg\'" ');
    
    return modifiedHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrusel después de que se carguen los proyectos
    setTimeout(initProjectsCarousel, 100);
    
    // Manejar los botones de filtro para dispositivos móviles
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Añadir clase active al botón actual
            this.classList.add('active');
        });
    });
});

function initProjectsCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    if (projectCards.length === 0) return;
    
    // Determinar cuántos proyectos mostrar por slide según el ancho de la ventana
    const getProjectsPerSlide = () => {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    };
    
    let projectsPerSlide = getProjectsPerSlide();
    
    // Crear el contenedor del carrusel
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'projects-carousel-container';
    
    // Crear el carrusel
    const carousel = document.createElement('div');
    carousel.className = 'projects-carousel';
    
    // Dividir los proyectos en slides y simplificar las tarjetas
    const createSlides = () => {
        carousel.innerHTML = '';
        projectsPerSlide = getProjectsPerSlide();
        
        for (let i = 0; i < projectCards.length; i += projectsPerSlide) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            for (let j = i; j < i + projectsPerSlide && j < projectCards.length; j++) {
                // Clonar solo los elementos que necesitamos para una versión simplificada
                const originalCard = projectCards[j];
                const card = document.createElement('div');
                card.className = 'project-card';
                card.dataset.category = originalCard.dataset.category;
                
                // Obtener el proyecto ID del botón original
                const detailsBtn = originalCard.querySelector('.project-details-btn');
                const projectId = detailsBtn ? detailsBtn.dataset.projectId : '';
                
                // Extraer imagen, título y descripción
                const imgContainer = originalCard.querySelector('.project-img');
                const title = originalCard.querySelector('h3').textContent;
                const description = originalCard.querySelector('p').textContent;
                
                // Construir la tarjeta simplificada
                card.innerHTML = `
                    <div class="project-img">
                        ${getProjectImage(imgContainer)}
                    </div>
                    <div class="project-info">
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <div class="project-links">
                            <button class="btn btn-sm project-details-btn" data-project-id="${projectId}">Ver Detalles</button>
                            <a href="${originalCard.querySelector('.btn-outline').href}" class="btn btn-sm btn-outline" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                `;

                // Añadir listener para abrir el modal al hacer clic en cualquier parte de la tarjeta
                card.addEventListener('click', function(e) {
                    // Evitar la propagación si se hace clic en un botón o enlace
                    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || 
                        e.target.closest('button') || e.target.closest('a')) {
                        return;
                    }
                    
                    // Encontrar y hacer clic en el botón de detalles
                    const detailsBtn = this.querySelector('.project-details-btn');
                    if (detailsBtn) {
                        e.preventDefault(); // Prevenir comportamiento predeterminado
                        e.stopPropagation(); // Detener propagación
                        detailsBtn.click();
                    }
                });
                
                slide.appendChild(card);
            }
            
            carousel.appendChild(slide);
        }
    };
    
    createSlides();
    
    // Añadir controles de navegación
    const prevButton = document.createElement('div');
    prevButton.className = 'carousel-nav carousel-prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('div');
    nextButton.className = 'carousel-nav carousel-next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Añadir indicadores de posición (dots)
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-controls';
    
    const slideCount = Math.ceil(projectCards.length / projectsPerSlide);
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.dataset.slide = i;
        
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.slide));
        });
        
        dotsContainer.appendChild(dot);
    }
    
    // Añadir todo al DOM
    carouselContainer.appendChild(carousel);
    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(nextButton);
    carouselContainer.appendChild(dotsContainer);
    
    // Reemplazar la grid con el carrusel
    projectsGrid.parentNode.replaceChild(carouselContainer, projectsGrid);
    
    // Variables de control
    let currentSlide = 0;
    
    // Función para navegar a un slide específico
    function goToSlide(slideIndex) {
        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex >= slideCount) slideIndex = slideCount - 1;
        
        currentSlide = slideIndex;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Event listeners para los botones
    prevButton.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
    });
    
    nextButton.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
    });
    
    // Reconfigurar el carrusel al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        const newProjectsPerSlide = getProjectsPerSlide();
        if (projectsPerSlide !== newProjectsPerSlide) {
            createSlides();
            
            // Actualizar controles
            dotsContainer.innerHTML = '';
            const newSlideCount = Math.ceil(projectCards.length / newProjectsPerSlide);
            
            for (let i = 0; i < newSlideCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.dataset.slide = i;
                
                dot.addEventListener('click', function() {
                    goToSlide(parseInt(this.dataset.slide));
                });
                
                dotsContainer.appendChild(dot);
            }
            
            currentSlide = 0;
            goToSlide(0);
        }
    });
}