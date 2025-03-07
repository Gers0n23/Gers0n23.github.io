// Archivo: js/projects-manager.js
// Gestiona la visualización de proyectos y el modal de detalles

// Variable global accesible para el índice del proyecto actual
let currentProjectIndex = 0;

// Mapeo de categorías
const CATEGORY_MAPPING = {
    'data-science': 'data-science',
    'datascience': 'data-science',
    'visualizacion': 'visualizacion',
    'dashboards': 'visualizacion',
    'desarrollo': 'desarrollo',
    'development': 'desarrollo',
    'logistica': 'logistica',
    'logistics': 'logistica'
};

// Función para normalizar categorías
function normalizeCategory(category) {
    if (!category) return 'all';
    const normalized = CATEGORY_MAPPING[category.toLowerCase()];
    return normalized || category;
}

function logCategoriesDebug() {
    console.log("==== Depuración de categorías ====");
    // Revisar los botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        console.log(`Botón: ${btn.textContent.trim()}, data-filter: ${btn.dataset.filter}`);
    });
    
    // Revisar las tarjetas de proyectos
    document.querySelectorAll('.project-card').forEach(card => {
        console.log(`Tarjeta: ${card.querySelector('h3')?.textContent}, data-category: ${card.dataset.category}`);
    });
}

// Hacer la función openProjectModal disponible globalmente
window.openProjectModal = function(projectId) {
    console.log("Abriendo modal para proyecto:", projectId);
    
    // Encontrar el índice del proyecto seleccionado
    currentProjectIndex = PROJECTS_DATA.findIndex(p => p.id === projectId);
    
    if (currentProjectIndex === -1) {
        console.error('Proyecto no encontrado:', projectId);
        return;
    }
    
    // Obtener los datos del proyecto
    const project = PROJECTS_DATA[currentProjectIndex];
    
    // Crear el modal si no existe
    initializeModal();
    
    // Construir y mostrar el modal
    buildProjectModal(project);
    
    // Mostrar el modal
    const modalOverlay = document.getElementById('projectModalOverlay');
    modalOverlay.style.display = 'flex';
    
    // Bloquear el scroll del body
    document.body.style.overflow = 'hidden';
};

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la visualización de los proyectos en la página principal
    initializeProjectsGrid();
    
    // Inicializar el modal
    initializeModal();
    
    // Inicializar controladores de eventos
    initializeEventListeners();
});

// Función para inicializar la visualización de los proyectos en la página principal
function initializeProjectsGrid() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Limpiar el contenedor de proyectos
    projectsGrid.innerHTML = '';
    
    // Verificar datos de proyectos
    console.log("Verificando datos de proyectos:");
    PROJECTS_DATA.forEach(project => {
        console.log(`Proyecto: ${project.title}, Categoría: ${project.category}`);
    });
    
    // Filtrar proyectos vacíos o incorrectos
    const validProjects = PROJECTS_DATA.filter(project => 
        project && project.id && project.title && project.thumbnailImage && project.shortDescription
    );
    
    // Añadir cada proyecto a la grid
    validProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    
    console.log(`Proyectos inicializados: ${validProjects.length}`);
}

// Función para crear una tarjeta de proyecto
function createProjectCard(project) {
     // Crear elemento para la tarjeta de proyecto
     const card = document.createElement('div');
     card.className = 'project-card';
     card.dataset.category = project.category;

     console.log(`Creando tarjeta para proyecto ${project.title} con categoría ${project.category}`);
    
    // Generar el HTML de la tarjeta
    card.innerHTML = `
    <div class="project-img">
        <img src="${project.thumbnailImage}" alt="${project.title}" onerror="this.src='img/proyecto_default.jpg'">
    </div>
    <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.shortDescription}</p>
        <div class="project-links">
            <button class="btn btn-sm project-details-btn" data-project-id="${project.id}">Ver Detalles</button>
            <a href="${project.codeUrl}" class="btn btn-sm btn-outline" target="_blank">Código <i class="fab fa-github"></i></a>
        </div>
    </div>
`;
    
    // Hacer que toda la tarjeta sea clickeable para abrir el modal
    card.addEventListener('click', function(e) {
        // Si se hace clic en un botón o enlace, no abrir el modal
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || 
            e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        
        openProjectModal(project.id);
    });
    
    // Añadir listener específico para el botón de detalles
    const detailsBtn = card.querySelector('.project-details-btn');
    detailsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openProjectModal(project.id);
    });
    
    return card;
}

// Función para construir el contenido del modal

function buildProjectModal(project) {
    console.log("Construyendo modal para proyecto:", project);
    
    // Actualizar título y categoría
    document.getElementById('modalProjectTitle').textContent = project.title;
    document.getElementById('modalProjectCategory').textContent = project.categoryLabel || project.category;
    
    // Actualizar media (imagen/video)
    updateProjectMedia(project);
    
    // Actualizar detalles
    document.getElementById('projectDifficulty').textContent = project.difficulty || 'No especificado';
    document.getElementById('projectTime').textContent = project.developmentTime || 'No especificado';
    document.getElementById('projectImpact').textContent = project.impact || 'No especificado';
    document.getElementById('projectTeam').textContent = project.team || 'No especificado';
    
    // Actualizar tecnologías
    updateProjectTechnologies(project);
    
    // Actualizar descripción
    const descElement = document.getElementById('projectDescription');
    if (descElement && project.fullDescription) {
        descElement.innerHTML = project.fullDescription.replace(/\n/g, '<br>');
    } else if (descElement) {
        descElement.innerHTML = project.shortDescription || 'No hay descripción disponible';
    }
    
    // Actualizar botones
    const demoBtn = document.getElementById('projectDemoBtn');
    const codeBtn = document.getElementById('projectCodeBtn');
    
    if (demoBtn) demoBtn.href = project.demoUrl || '#';
    if (codeBtn) codeBtn.href = project.codeUrl || '#';
    
    // Actualizar navegación
    updateNavigationButtons();
}

// Función para actualizar la imagen/video del proyecto
function updateProjectMedia(project) {
    const mediaContainer = document.getElementById('modalMediaContainer');
    if (!mediaContainer) return;
    
    console.log("Actualizando media del proyecto:", project.media);
    
    // Limpiar contenedor
    mediaContainer.innerHTML = '';
    
    // Si no hay media, mostrar imagen por defecto
    if (!project.media || project.media.length === 0) {
        mediaContainer.innerHTML = `
            <img src="img/proyecto_default.jpg" alt="Imagen no disponible" class="default-image">
            <p class="no-media-message">No hay imágenes disponibles para este proyecto</p>
        `;
        return;
    }
    
    // Mostrar la primera imagen/video
    const firstItem = project.media[0];
    
    if (firstItem.type === 'image') {
        mediaContainer.innerHTML = `
            <img src="${firstItem.url}" alt="${firstItem.alt || firstItem.caption || project.title}" 
                 onerror="this.src='img/proyecto_default.jpg'">
        `;
    } else if (firstItem.type === 'youtube' && firstItem.videoId && firstItem.videoId !== 'YOUTUBE_VIDEO_ID') {
        mediaContainer.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${firstItem.videoId}" 
                    title="YouTube video player" 
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
        `;
    } else {
        mediaContainer.innerHTML = `
            <img src="img/proyecto_default.jpg" alt="Contenido no disponible" class="default-image">
            <p class="no-media-message">El contenido multimedia no está disponible</p>
        `;
    }
}

// Función para actualizar las tecnologías del proyecto
function updateProjectTechnologies(project) {
    const techContainer = document.getElementById('modalTechContainer');
    if (!techContainer) return;
    
    console.log("Actualizando tecnologías:", project.technologies);
    
    // Limpiar contenedor
    techContainer.innerHTML = '';
    
    // Si no hay tecnologías, mostrar mensaje
    if (!project.technologies || project.technologies.length === 0) {
        techContainer.innerHTML = '<p class="no-tech-message">No se han especificado tecnologías para este proyecto</p>';
        return;
    }
    
    // Añadir cada tecnología
    project.technologies.forEach(tech => {
        const techTag = document.createElement('div');
        techTag.className = 'tech-tag';
        
        const icon = tech.icon || 'fas fa-code';
        const name = tech.name || 'Tecnología';
        
        techTag.innerHTML = `<i class="${icon}"></i> ${name}`;
        techContainer.appendChild(techTag);
    });
}

// Función para actualizar el carrusel
function updateCarousel(mediaItems) {
    const carouselContainer = document.getElementById('carouselContainer');
    const carouselControls = document.getElementById('carouselControls');
    
    if (!carouselContainer || !carouselControls) return;
    
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
                <img src="${item.url}" alt="${item.alt || item.caption}" onerror="this.src='img/proyecto_default.jpg'">
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
    
    if (!prevBtn || !nextBtn) return;
    
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
    if (modalOverlay) {
        modalOverlay.style.display = 'none';
        
        // Restaurar el scroll del body
        document.body.style.overflow = 'auto';
        
        // Pausar videos si hay alguno en reproducción
        pauseAllYouTubeVideos();
        
        // Determinar qué filtro está activo actualmente
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilter ? activeFilter.dataset.filter : 'all';
        
        console.log(`Filtro activo al cerrar modal: ${currentFilter}`);
        
        // Reconstruir completamente el grid y el carrusel según el filtro activo
        resetProjectsGrid(currentFilter);
    }
}

function resetProjectsGrid(filter = 'all') {
    // 1. Eliminar el carrusel existente
    const existingCarousel = document.querySelector('.projects-carousel-container');
    if (existingCarousel) {
        existingCarousel.remove();
    }
    
    // 2. Obtener o crear el grid
    const projectsContainer = document.querySelector('.projects .container');
    let projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        projectsGrid = document.createElement('div');
        projectsGrid.className = 'projects-grid';
        
        // Asegurarse de insertar el grid antes del botón "Ver más proyectos"
        const projectsMore = document.querySelector('.projects-more');
        if (projectsMore) {
            projectsContainer.insertBefore(projectsGrid, projectsMore);
        } else {
            projectsContainer.appendChild(projectsGrid);
        }
    }
    
    // 3. Limpiar el grid
    projectsGrid.innerHTML = '';
    
    // 4. Filtrar proyectos según el filtro activo
    let filteredProjects = [];
    if (filter === 'all') {
        filteredProjects = PROJECTS_DATA;
    } else {
        filteredProjects = PROJECTS_DATA.filter(project => 
            normalizeCategory(project.category) === filter
        );
    }
    
    // 5. Añadir los proyectos filtrados al grid
    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    
    // 6. Inicializar el carrusel con los nuevos elementos
    setTimeout(() => {
        if (typeof initProjectsCarousel === 'function') {
            initProjectsCarousel();
        }
    }, 100);
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
                <!-- Área para imágenes/videos -->
                <div class="modal-media-section">
                    <div class="modal-media-container" id="modalMediaContainer">
                        <!-- Imágenes/videos se cargarán aquí -->
                        <img src="img/proyecto_default.jpg" alt="Imagen por defecto">
                    </div>
                </div>

                <!-- Información del proyecto -->
                <div class="modal-info-section">
                    <!-- Detalles del proyecto -->
                    <div class="modal-project-details">
                        <h3>Detalles del Proyecto</h3>
                        
                        <div class="detail-grid">
                            <div class="detail-item">
                                <i class="fas fa-code-branch"></i>
                                <div>
                                    <h4>Dificultad</h4>
                                    <p id="projectDifficulty">Media</p>
                                </div>
                            </div>
                            
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <h4>Tiempo de Desarrollo</h4>
                                    <p id="projectTime">2 meses</p>
                                </div>
                            </div>
                            
                            <div class="detail-item">
                                <i class="fas fa-chart-line"></i>
                                <div>
                                    <h4>Impacto</h4>
                                    <p id="projectImpact">Reducción 15% costos</p>
                                </div>
                            </div>
                            
                            <div class="detail-item">
                                <i class="fas fa-users"></i>
                                <div>
                                    <h4>Equipo</h4>
                                    <p id="projectTeam">Individual</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tecnologías -->
                    <div class="modal-technologies">
                        <h3>Tecnologías Utilizadas</h3>
                        <div id="modalTechContainer" class="tech-tags-container">
                            <!-- Tecnologías se cargarán aquí -->
                        </div>
                    </div>
                    
                    <!-- Descripción -->
                    <div class="modal-description">
                        <h3>Descripción</h3>
                        <div id="projectDescription" class="description-content">
                            <!-- Descripción se cargará aquí -->
                        </div>
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

                <div class="modal-actions">
                    <a id="projectDemoBtn" href="#" class="btn btn-primary" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Ver Demo
                    </a>
                    <a id="projectCodeBtn" href="#" class="btn btn-secondary" target="_blank">
                        <i class="fab fa-github"></i> Ver Código
                    </a>
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

// Inicializar controladores de eventos
function initializeEventListeners() {
    // Botones de navegación del carrusel
    const prevSlideBtn = document.getElementById('modalPrevSlideBtn');
    const nextSlideBtn = document.getElementById('modalNextSlideBtn');

    if (prevSlideBtn && nextSlideBtn) {
        prevSlideBtn.addEventListener('click', function() {
            const slides = document.querySelectorAll('.modal-carousel-slide');
            const activeDot = document.querySelector('.modal-carousel-dot.active');
            if (!activeDot) return;

            let currentIndex = parseInt(activeDot.dataset.slideIndex);
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            showModalSlide(prevIndex);
        });

        nextSlideBtn.addEventListener('click', function() {
            const slides = document.querySelectorAll('.modal-carousel-slide');
            const activeDot = document.querySelector('.modal-carousel-dot.active');
            if (!activeDot) return;

            let currentIndex = parseInt(activeDot.dataset.slideIndex);
            let nextIndex = (currentIndex + 1) % slides.length;
            showModalSlide(nextIndex);
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
            const filter = this.dataset.filter;
            console.log(`Filtro seleccionado: ${filter}`);
            
            // Remover clase active de todos los botones
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón actual
            this.classList.add('active');
            
            // ENFOQUE COMPLETAMENTE NUEVO:
            // 1. Eliminar el carrusel existente
            const existingCarousel = document.querySelector('.projects-carousel-container');
            if (existingCarousel) {
                existingCarousel.remove();
            }
            
            // 2. Recrear el grid de proyectos, pero solo con los proyectos de la categoría seleccionada
            const projectsContainer = document.querySelector('.projects .container');
            let projectsGrid = document.querySelector('.projects-grid');
            
            if (!projectsGrid) {
                projectsGrid = document.createElement('div');
                projectsGrid.className = 'projects-grid';
                projectsContainer.appendChild(projectsGrid);
            }
            
            // Limpiar el grid
            projectsGrid.innerHTML = '';
            
            // 3. Añadir al grid solo los proyectos que corresponden a la categoría seleccionada
            let filteredProjects = [];
            if (filter === 'all') {
                filteredProjects = PROJECTS_DATA;
            } else {
                filteredProjects = PROJECTS_DATA.filter(project => 
                    normalizeCategory(project.category) === filter
                );
            }
            
            console.log(`Proyectos filtrados para categoría ${filter}: ${filteredProjects.length}`);
            
            // Si no hay proyectos en esta categoría, mostrar mensaje
            if (filteredProjects.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-projects-message';
                emptyMessage.innerHTML = `
                    <p>No hay proyectos disponibles en esta categoría.</p>
                `;
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.padding = '2rem';
                emptyMessage.style.color = 'var(--gray-color)';
                
                projectsGrid.appendChild(emptyMessage);
                return;
            }
            
            // Añadir los proyectos filtrados al grid
            filteredProjects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
            
            // 4. Inicializar el carrusel con los nuevos elementos
            setTimeout(() => {
                if (typeof initProjectsCarousel === 'function') {
                    initProjectsCarousel();
                }
            }, 100);
        });
    });
}