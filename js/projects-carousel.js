// Archivo: js/projects-carousel.js
// Gestiona el carrusel de proyectos en la página principal

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrusel después de que se carguen los proyectos
    setTimeout(initProjectsCarousel, 200);
});

function initProjectsCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Obtener todas las tarjetas de proyectos válidas
    const projectCards = Array.from(document.querySelectorAll('.project-card')).filter(card => 
        card.querySelector('.project-img') && 
        card.querySelector('h3') && 
        card.querySelector('p')
    );
    
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
    function createSlides() {
        carousel.innerHTML = '';
        projectsPerSlide = getProjectsPerSlide();
        
        // Calcular cuántos slides necesitamos
        const slideCount = Math.ceil(projectCards.length / projectsPerSlide);
        
        for (let i = 0; i < slideCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            // Añadir proyectos al slide actual
            for (let j = 0; j < projectsPerSlide; j++) {
                const cardIndex = i * projectsPerSlide + j;
                
                if (cardIndex < projectCards.length) {
                    // Clonar la tarjeta para el carrusel
                    const clonedCard = projectCards[cardIndex].cloneNode(true);
                    
                    // Asegurarse de que los event listeners estén correctamente asignados
                    const projectId = clonedCard.querySelector('.project-details-btn')?.dataset.projectId;
                    
                    if (projectId) {
                        // Hacer que toda la tarjeta sea clickeable
                        clonedCard.addEventListener('click', function(e) {
                            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || 
                                e.target.closest('button') || e.target.closest('a')) {
                                return;
                            }
                            
                            if (typeof openProjectModal === 'function') {
                                openProjectModal(projectId);
                            }
                        });
                        
                        // Asignar evento al botón de detalles
                        const detailsBtn = clonedCard.querySelector('.project-details-btn');
                        if (detailsBtn) {
                            detailsBtn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                if (typeof openProjectModal === 'function') {
                                    openProjectModal(projectId);
                                }
                            });
                        }
                    }
                    
                    slide.appendChild(clonedCard);
                }
            }
            
            carousel.appendChild(slide);
        }
    }
    
    createSlides();
    carouselContainer.appendChild(carousel);
    
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