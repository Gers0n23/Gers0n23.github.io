// Datos de habilidades integrados directamente en el archivo JS
const skillsData = {
  "technical_skills": [
    {
      "name": "Python",
      "level": "Experto",
      "levelValue": 90,
      "category": "programming"
    },
    {
      "name": "JavaScript",
      "level": "Avanzado",
      "levelValue": 80,
      "category": "programming"
    },
    {
      "name": "HTML/CSS",
      "level": "Avanzado",
      "levelValue": 85,
      "category": "programming"
    },
    {
      "name": "Django",
      "level": "Avanzado",
      "levelValue": 80,
      "category": "programming"
    },
    {
      "name": "React Native",
      "level": "Medio",
      "levelValue": 75,
      "category": "programming"
    },
    {
      "name": "SQL",
      "level": "Experto",
      "levelValue": 90,
      "category": "databases"
    },
    {
      "name": "MongoDB",
      "level": "Medio",
      "levelValue": 70,
      "category": "databases"
    },
    {
      "name": "Power BI",
      "level": "Experto",
      "levelValue": 95,
      "category": "analytics"
    },
    {
      "name": "EasyMorph",
      "level": "Experto",
      "levelValue": 90,
      "category": "analytics"
    },
    {
      "name": "Excel",
      "level": "Experto",
      "levelValue": 95,
      "category": "analytics"
    },
    {
      "name": "Azure ML",
      "level": "Avanzado",
      "levelValue": 80,
      "category": "analytics"
    },
    {
      "name": "Pandas/NumPy",
      "level": "Avanzado",
      "levelValue": 85,
      "category": "datascience"
    },
    {
      "name": "Scikit-learn",
      "level": "Avanzado",
      "levelValue": 80,
      "category": "datascience"
    },
    {
      "name": "Matplotlib/Seaborn",
      "level": "Avanzado",
      "levelValue": 85,
      "category": "datascience"
    },
    {
      "name": "ETL Processes",
      "level": "Experto",
      "levelValue": 90,
      "category": "dataeng"
    },
    {
      "name": "API Integration",
      "level": "Avanzado",
      "levelValue": 80,
      "category": "dataeng"
    }
  ]
};

// Función para crear el gráfico de habilidades
function createSkillsChart() {
    const data = skillsData;
    if (!data.technical_skills || data.technical_skills.length === 0) {
        console.error('No se encontraron datos de habilidades');
        return;
    }

    // Buscar el contenedor donde agregaremos el gráfico
    const skillsContainer = document.getElementById('skills-chart-container');
    if (!skillsContainer) {
        console.error('No se encontró el contenedor para el gráfico de habilidades');
        return;
    }

    // Agrupar habilidades por categoría
    const categories = {
        programming: { title: 'Programación', skills: [] },
        databases: { title: 'Bases de Datos', skills: [] },
        analytics: { title: 'Análisis de Datos', skills: [] },
        datascience: { title: 'Data Science', skills: [] },
        dataeng: { title: 'Ingeniería de Datos', skills: [] }
    };

    // Organizar habilidades por categoría
    data.technical_skills.forEach(skill => {
        if (categories[skill.category]) {
            categories[skill.category].skills.push(skill);
        }
    });

    // Crear contenedor para la visualización
    skillsContainer.innerHTML = `
        <div class="skills-chart">
            <h3 class="skills-chart-title">Nivel de Habilidades Técnicas</h3>
            <div class="skills-chart-content" id="skills-chart-content"></div>
        </div>
    `;

    const chartContent = document.getElementById('skills-chart-content');
    
    // Crear un contenedor para la estructura de columnas
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'skills-columns';
    chartContent.appendChild(columnsContainer);
    
    // Crear columnas
    const leftColumn = document.createElement('div');
    leftColumn.className = 'skills-column';
    
    const rightColumn = document.createElement('div');
    rightColumn.className = 'skills-column';
    
    columnsContainer.appendChild(leftColumn);
    columnsContainer.appendChild(rightColumn);
    
    // Distribuir categorías entre las columnas
    let columnCounter = 0;
    const columnsArr = [leftColumn, rightColumn];

    // Crear gráficos por cada categoría
    for (const [key, category] of Object.entries(categories)) {
        if (category.skills.length === 0) continue;

        // Ordenar habilidades por nivel (de mayor a menor)
        category.skills.sort((a, b) => b.levelValue - a.levelValue);

        // Crear sección para esta categoría
        const categorySection = document.createElement('div');
        categorySection.className = 'skills-category-section';
        categorySection.innerHTML = `
            <h4 class="category-title">${category.title}</h4>
            <div class="skills-bars" id="skills-${key}"></div>
        `;
        
        // Alternar entre columnas
        const targetColumn = columnsArr[columnCounter % columnsArr.length];
        targetColumn.appendChild(categorySection);
        columnCounter++;

        const skillsContainer = document.getElementById(`skills-${key}`);

        // Crear barras para cada habilidad
        category.skills.forEach(skill => {
            const skillBar = document.createElement('div');
            skillBar.className = 'skill-bar';
            
            // Asegurarnos de que la barra de progreso tenga el ancho correcto según levelValue
            skillBar.innerHTML = `
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level-text">${skill.level}</span>
                </div>
                <div class="skill-progress-bg">
                    <div class="skill-progress-fill" style="width: ${skill.levelValue}%; 
                    background-color: ${getLevelColor(skill.level)}"></div>
                </div>
            `;
            skillsContainer.appendChild(skillBar);
        });
    }

    // Añadir leyenda
    const legend = document.createElement('div');
    legend.className = 'skills-legend';
    legend.innerHTML = `
        <div class="legend-title">Niveles de Habilidad:</div>
        <div class="legend-items">
            <div class="legend-item">
                <span class="legend-color" style="background-color: #e74c3c;"></span>
                <span class="legend-text">Básico</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #f39c12;"></span>
                <span class="legend-text">Medio</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #3498db;"></span>
                <span class="legend-text">Avanzado</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background-color: #2ecc71;"></span>
                <span class="legend-text">Experto</span>
            </div>
        </div>
    `;
    chartContent.appendChild(legend);
}

// Función para obtener color según el nivel
function getLevelColor(level) {
    switch (level) {
        case 'Básico':
            return '#e74c3c'; // Rojo
        case 'Medio':
            return '#f39c12'; // Naranja
        case 'Avanzado':
            return '#3498db'; // Azul
        case 'Experto':
            return '#2ecc71'; // Verde
        default:
            return '#95a5a6'; // Gris
    }
}

// Inicializar gráfico cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    createSkillsChart();
});
