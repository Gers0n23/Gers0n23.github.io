// Archivo: js/projects-manager.js
// Gestiona la visualización de proyectos y el modal de detalles

window.openProjectModal = function(projectId) {
    // Encontrar el índice del proyecto seleccionado
    currentProjectIndex = PROJECTS_DATA.findIndex(p => p.id === projectId);
    
    if (currentProjectIndex === -1) {
        console.error('Proyecto no encontrado');
        return;
    }
    
    // Obtener los datos del proyecto
    const project = PROJECTS_DATA[currentProjectIndex];
    
    // Construir y mostrar el modal
    buildProjectModal(project);
    
    // Mostrar el modal
    const modalOverlay = document.getElementById('projectModalOverlay');
    if (modalOverlay) {
        modalOverlay.style.display = 'flex';
        // Bloquear el scroll del body
        document.body.style.overflow = 'hidden';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentProjectIndex = 0;
    
    // Inicializar la visualización de los proyectos en la página principal
    function initializeProjectsGrid() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        // Limpiar el contenedor de proyectos
        projectsGrid.innerHTML = '';
        
        // Añadir cada proyecto a la grid
        PROJECTS_DATA.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    // Función para crear una tarjeta de proyecto
    function createProjectCard(project) {
        // Crear elemento para la tarjeta de proyecto
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.category = project.category;
        
        // Generar el HTML de la tarjeta
        card.innerHTML = `
            <div class="project-img">
                <img src="${project.thumbnailImage}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="project-tags">
                    ${project.technologies.slice(0, 4).map(tech => 
                        `<span><i class="${tech.icon}"></i> ${tech.name}</span>`
                    ).join('')}
                </div>
                <div class="project-links">
                    <button class="btn btn-sm project-details-btn" data-project-id="${project.id}">Ver Detalles</button>
                    <a href="${project.codeUrl}" class="btn btn-sm btn-outline" target="_blank">Código <i class="fab fa-github"></i></a>
                </div>
            </div>
        `;
        
        // Añadir listener para abrir el modal
        const detailsBtn = card.querySelector('.project-details-btn');
        detailsBtn.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            openProjectModal(projectId);
        });
        
        return card;
    }
    
    // Función para abrir el modal de proyecto
    function openProjectModal(projectId) {
        console.log("Abriendo modal para proyecto:", projectId); // Añadir para depuración
        
        // Encontrar el índice del proyecto seleccionado
        currentProjectIndex = PROJECTS_DATA.findIndex(p => p.id === projectId);
        
        if (currentProjectIndex === -1) {
            console.error('Proyecto no encontrado:', projectId);
            return;
        }
        
        // Obtener los datos del proyecto
        const project = PROJECTS_DATA[currentProjectIndex];
        
        // Construir y mostrar el modal
        buildProjectModal(project);
        
        // Mostrar el modal
        const modalOverlay = document.getElementById('projectModalOverlay');
        if (!modalOverlay) {
            console.error('Modal overlay no encontrado');
            return;
        }
        
        modalOverlay.style.display = 'flex';
        
        // Bloquear el scroll del body
        document.body.style.overflow = 'hidden';
    }
    
    // Función para construir el contenido del modal
    function buildProjectModal(project) {
        const modalContent = document.getElementById('projectModalContent');
        if (!modalContent) return;
        
        // Actualizar el título y la categoría
        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectCategory').textContent = project.categoryLabel;
        
        // Actualizar el carrusel
        updateCarousel(project.media);
        
        // Actualizar la información del proyecto
        document.getElementById('projectDescription').innerHTML = project.fullDescription.replace(/\n/g, '<br>');
        
        // Actualizar detalles del proyecto
        document.getElementById('projectDifficulty').textContent = project.difficulty;
        document.getElementById('projectTime').textContent = project.developmentTime;
        document.getElementById('projectImpact').textContent = project.impact;
        document.getElementById('projectTeam').textContent = project.team;
        
        // Actualizar tecnologías
        const techTagsContainer = document.getElementById('projectTechTags');
        techTagsContainer.innerHTML = '';
        
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.innerHTML = `<i class="${tech.icon}"></i> ${tech.name}`;
            techTagsContainer.appendChild(tag);
        });
        
        // Actualizar enlaces
        const demoBtn = document.getElementById('projectDemoBtn');
        const codeBtn = document.getElementById('projectCodeBtn');
        
        demoBtn.href = project.demoUrl;
        codeBtn.href = project.codeUrl;
        
        // Actualizar botones de navegación
        updateNavigationButtons();
    }
    
    // Función para actualizar el carrusel
    function updateCarousel(mediaItems) {
        const carouselContainer = document.getElementById('carouselContainer');
        const carouselControls = document.getElementById('carouselControls');
        
        // Limpiar contenedores
        carouselContainer.innerHTML = '';
        carouselControls.innerHTML = '';
        
        // Añadir cada elemento multimedia
        mediaItems.forEach((item, index) => {
            // Crear slide
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            
            // Contenido según tipo (imagen, video o youtube)
            if (item.type === 'image') {
                slide.innerHTML = `
                    <img src="${item.url}" alt="${item.alt || item.caption}">
                    ${item.caption ? `<div class="slide-caption">${item.caption}</div>` : ''}
                `;
            } else if (item.type === 'youtube') {
                slide.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${item.videoId}" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                    ${item.caption ? `<div class="slide-caption">${item.caption}</div>` : ''}
                `;
            }
            
            carouselContainer.appendChild(slide);
            
            // Crear dot indicador
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.slideIndex = index;
            
            dot.addEventListener('click', function() {
                showSlide(parseInt(this.dataset.slideIndex));
            });
            
            carouselControls.appendChild(dot);
        });
        
        // Reiniciar el carrusel mostrando la primera imagen
        if (mediaItems.length > 0) {
            showSlide(0);
        }
    }
    
    // Función para mostrar un slide específico
    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (slides.length === 0) return;
        
        // Pausar todos los videos de YouTube antes de cambiar de slide
        pauseAllYouTubeVideos();
        
        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Desactivar todos los dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Mostrar el slide seleccionado
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    // Función para pausar todos los videos de YouTube
    function pauseAllYouTubeVideos() {
        const iframes = document.querySelectorAll('.carousel-slide iframe');
        iframes.forEach(iframe => {
            // La forma de pausar un video de YouTube es volver a cargar el src
            const currentSrc = iframe.src;
            iframe.src = currentSrc;
        });
    }
    
    // Función para actualizar botones de navegación
    function updateNavigationButtons() {
        const prevBtn = document.getElementById('prevProjectBtn');
        const nextBtn = document.getElementById('nextProjectBtn');
        
        // Deshabilitar botón previo si estamos en el primer proyecto
        prevBtn.disabled = currentProjectIndex === 0;
        
        // Deshabilitar botón siguiente si estamos en el último proyecto
        nextBtn.disabled = currentProjectIndex === PROJECTS_DATA.length - 1;
    }
    
    // Función para navegar al proyecto anterior
    function navigateToPreviousProject() {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            buildProjectModal(PROJECTS_DATA[currentProjectIndex]);
        }
    }
    
    // Función para navegar al proyecto siguiente
    function navigateToNextProject() {
        if (currentProjectIndex < PROJECTS_DATA.length - 1) {
            currentProjectIndex++;
            buildProjectModal(PROJECTS_DATA[currentProjectIndex]);
        }
    }
    
    // Función para cerrar el modal
    function closeProjectModal() {
        const modalOverlay = document.getElementById('projectModalOverlay');
        modalOverlay.style.display = 'none';
        
        // Restaurar el scroll del body
        document.body.style.overflow = 'auto';
        
        // Pausar videos si hay alguno en reproducción
        pauseAllYouTubeVideos();
    }
    
    // Inicializar modal y añadir al DOM
    function initializeModal() {
        // Crear estructura del modal si no existe
        if (!document.getElementById('projectModalOverlay')) {
            const modalHTML = `
            <div id="projectModalOverlay" class="modal-overlay">
                <div id="projectModal" class="project-modal">
                    <div class="modal-header">
                        <div>
                            <h2 id="modalProjectTitle" class="modal-title">Título del Proyecto</h2>
                            <span id="modalProjectCategory" class="project-category">Categoría</span>
                        </div>
                        <button id="closeModalBtn" class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div id="projectModalContent" class="modal-content">
                        <div class="project-carousel">
                            <div class="carousel-container">
                                <div id="carouselContainer">
                                    <!-- Slides se cargarán dinámicamente -->
                                </div>
                                
                                <div id="prevSlideBtn" class="carousel-nav carousel-prev">
                                    <i class="fas fa-chevron-left"></i>
                                </div>
                                <div id="nextSlideBtn" class="carousel-nav carousel-next">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                                
                                <div id="carouselControls" class="carousel-controls">
                                    <!-- Dots se cargarán dinámicamente -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="project-info">
                            <div id="projectDescription" class="project-description">
                                <!-- Descripción se cargará dinámicamente -->
                            </div>
                            
                            <div class="project-details">
                                <div class="detail-item">
                                    <div class="detail-icon">
                                        <i class="fas fa-code-branch"></i>
                                    </div>
                                    <div class="detail-content">
                                        <h4>Dificultad</h4>
                                        <p id="projectDifficulty">Media</p>
                                    </div>
                                </div>
                                
                                <div class="detail-item">
                                    <div class="detail-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="detail-content">
                                        <h4>Tiempo de Desarrollo</h4>
                                        <p id="projectTime">2 meses</p>
                                    </div>
                                </div>
                                
                                <div class="detail-item">
                                    <div class="detail-icon">
                                        <i class="fas fa-chart-line"></i>
                                    </div>
                                    <div class="detail-content">
                                        <h4>Impacto</h4>
                                        <p id="projectImpact">Reducción 15% costos</p>
                                    </div>
                                </div>
                                
                                <div class="detail-item">
                                    <div class="detail-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="detail-content">
                                        <h4>Equipo</h4>
                                        <p id="projectTeam">Individual</p>
                                    </div>
                                </div>
                            </div>
                            
                            <h4>Tecnologías Utilizadas</h4>
                            <div id="projectTechTags" class="project-tech-tags">
                                <!-- Tags se cargarán dinámicamente -->
                            </div>
                            
                            <div class="project-actions">
                                <a id="projectDemoBtn" href="#" class="action-btn btn-primary" target="_blank">
                                    <i class="fas fa-external-link-alt"></i> Ver Demo
                                </a>
                                <a id="projectCodeBtn" href="#" class="action-btn btn-secondary" target="_blank">
                                    <i class="fab fa-github"></i> Ver Código
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="project-navigation">
                            <button id="prevProjectBtn" class="nav-btn">
                                <i class="fas fa-arrow-left"></i> Proyecto Anterior
                            </button>
                            <button id="nextProjectBtn" class="nav-btn">
                                Proyecto Siguiente <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            // Añadir el modal al final del body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Inicialmente ocultar el modal
            document.getElementById('projectModalOverlay').style.display = 'none';
        }
    }
    
    // Inicializar controladores de eventos una vez que el DOM esté cargado
    function initializeEventListeners() {
        // Botones de navegación del carrusel
        const prevSlideBtn = document.getElementById('prevSlideBtn');
        const nextSlideBtn = document.getElementById('nextSlideBtn');
        
        if (prevSlideBtn && nextSlideBtn) {
            prevSlideBtn.addEventListener('click', function() {
                const slides = document.querySelectorAll('.carousel-slide');
                const activeDot = document.querySelector('.carousel-dot.active');
                if (!activeDot) return;
                
                let currentIndex = parseInt(activeDot.dataset.slideIndex);
                let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(prevIndex);
            });
            
            nextSlideBtn.addEventListener('click', function() {
                const slides = document.querySelectorAll('.carousel-slide');
                const activeDot = document.querySelector('.carousel-dot.active');
                if (!activeDot) return;
                
                let currentIndex = parseInt(activeDot.dataset.slideIndex);
                let nextIndex = (currentIndex + 1) % slides.length;
                showSlide(nextIndex);
            });
        }
        
        // Botones de navegación entre proyectos
        const prevProjectBtn = document.getElementById('prevProjectBtn');
        const nextProjectBtn = document.getElementById('nextProjectBtn');
        
        if (prevProjectBtn && nextProjectBtn) {
            prevProjectBtn.addEventListener('click', navigateToPreviousProject);
            nextProjectBtn.addEventListener('click', navigateToNextProject);
        }
        
        // Botón de cierre del modal
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalOverlay = document.getElementById('projectModalOverlay');
        
        if (closeModalBtn && modalOverlay) {
            closeModalBtn.addEventListener('click', closeProjectModal);
            
            // Cerrar modal al hacer clic fuera
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeProjectModal();
                }
            });
            
            // Cerrar modal con tecla Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
                    closeProjectModal();
                }
            });
        }
        
        // Inicializar los filtros de proyectos
        initializeProjectFilters();
    }
    
    // Inicializar los filtros de proyectos
    function initializeProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Añadir clase active al botón actual
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                // Filtrar proyectos
                const projectCards = document.querySelectorAll('.project-card');
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
    }
    
    // Iniciar todo el proceso
    initializeModal();
    initializeProjectsGrid();
    initializeEventListeners();
});