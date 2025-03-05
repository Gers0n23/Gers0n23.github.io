// Archivo: js/projects-carousel.js
// Gestiona el carrusel de proyectos

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrusel después de que se carguen los proyectos
    setTimeout(initProjectsCarousel, 100);
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
    
    // Dividir los proyectos en slides
    const createSlides = () => {
        carousel.innerHTML = '';
        projectsPerSlide = getProjectsPerSlide();
        
        for (let i = 0; i < projectCards.length; i += projectsPerSlide) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            for (let j = i; j < i + projectsPerSlide && j < projectCards.length; j++) {
                const card = projectCards[j].cloneNode(true);
                
                // Añadir listener para abrir el modal al hacer clic en cualquier parte de la tarjeta
                card.addEventListener('click', function(e) {
                    // Ignorar si se hace clic en el botón de código
                    if (e.target.closest('.btn-outline') || e.target.classList.contains('btn-outline')) {
                        return;
                    }
                    
                    // Encontrar y hacer clic en el botón de detalles
                    const detailsBtn = this.querySelector('.project-details-btn');
                    if (detailsBtn) {
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