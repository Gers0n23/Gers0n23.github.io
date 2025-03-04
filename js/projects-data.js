// Archivo: js/projects-data.js
// Datos de todos los proyectos del portafolio

const PROJECTS_DATA = [
  {
    "id": "inventory-forecast",
    "title": "Sistema de Forecasting para Inventarios",
    "shortDescription": "Modelo predictivo que optimiza la gestión de inventarios mediante algoritmos de machine learning, reduciendo sobrestocks y roturas de stock.",
    "fullDescription": "Este sistema utiliza modelos de machine learning para predecir y optimizar los niveles de inventario en empresas de retail y logística. La solución combina análisis de series temporales con factores externos como estacionalidad, promociones y tendencias de mercado.\n\nEl modelo principal está basado en Prophet de Facebook con ajustes personalizados para adaptarse a las particularidades del negocio logístico, logrando reducir significativamente tanto los sobrestocks como las roturas de stock.",
    "category": "data-science",
    "categoryLabel": "Data Science & ML",
    "difficulty": "Alta",
    "developmentTime": "3 meses",
    "impact": "Reducción del 28% en costos de inventario",
    "team": "Desarrollo individual",
    "technologies": [
      {"name": "Python", "icon": "fab fa-python"},
      {"name": "Prophet", "icon": "fas fa-brain"},
      {"name": "Scikit-learn", "icon": "fas fa-code"},
      {"name": "Pandas", "icon": "fas fa-table"},
      {"name": "Matplotlib", "icon": "fas fa-chart-bar"},
      {"name": "Flask API", "icon": "fas fa-server"}
    ],
    "thumbnailImage": "img/forecasting-project.jpg",
    "media": [
      {
        "type": "image",
        "url": "img/forecasting-project.jpg",
        "alt": "Dashboard Principal",
        "caption": "Interfaz principal del sistema de Forecasting"
      },
      {
        "type": "youtube",
        "videoId": "YOUTUBE_VIDEO_ID", // Reemplazar con un ID real
        "caption": "Demo del sistema de predicción de inventario"
      },
      {
        "type": "image",
        "url": "img/forecasting-project.jpg",
        "alt": "Resultados",
        "caption": "Análisis de resultados y precisión"
      }
    ],
    "demoUrl": "https://github.com/Gers0n23/inventory-forecast",
    "codeUrl": "https://github.com/Gers0n23/inventory-forecast"
  },
  {
    "id": "logistics-kpi-dashboard",
    "title": "Dashboard KPIs Logísticos en Tiempo Real",
    "shortDescription": "Sistema de visualización para monitoreo de métricas clave de desempeño logístico con actualización en tiempo real y alertas automatizadas.",
    "fullDescription": "Plataforma de visualización avanzada que integra datos de múltiples fuentes para proporcionar una visión completa y en tiempo real del desempeño logístico. El dashboard incluye KPIs críticos como OTIF (On Time In Full), disponibilidad de inventario, tiempos de procesamiento y eficiencia operativa.\n\nEl sistema implementa alertas automatizadas basadas en análisis estadístico de desviaciones, permitiendo identificar proactivamente problemas potenciales antes de que impacten el servicio.",
    "category": "visualizacion",
    "categoryLabel": "Dashboards & BI",
    "difficulty": "Media",
    "developmentTime": "2 meses",
    "impact": "Mejora del 15% en tiempos de respuesta a incidencias",
    "team": "Colaboración con equipo de TI",
    "technologies": [
      {"name": "Power BI", "icon": "fas fa-chart-pie"},
      {"name": "DAX", "icon": "fas fa-calculator"},
      {"name": "SQL", "icon": "fas fa-database"},
      {"name": "REST API", "icon": "fas fa-plug"}
    ],
    "thumbnailImage": "img/dashboard-kpi.jpg",
    "media": [
      {
        "type": "image",
        "url": "img/dashboard-kpi.jpg",
        "alt": "Vista principal",
        "caption": "Panel principal de KPIs logísticos"
      },
      {
        "type": "youtube",
        "videoId": "YOUTUBE_VIDEO_ID", // Reemplazar con un ID real
        "caption": "Demostración de alertas en tiempo real"
      }
    ],
    "demoUrl": "https://github.com/Gers0n23/logistics-kpi-dashboard",
    "codeUrl": "https://github.com/Gers0n23/logistics-kpi-dashboard"
  },
  {
    "id": "supermarket-api",
    "title": "Sistema Gestor de Productos con API",
    "shortDescription": "Aplicación web fullstack para la gestión de inventario de supermercado con API RESTful y dashboard para análisis de movimientos de productos.",
    "fullDescription": "Sistema integral para la gestión de productos de supermercado que facilita el control de inventario, seguimiento de movimientos y análisis de rotación. La aplicación incluye un backend desarrollado en Django que proporciona una API RESTful completa, conectado a una interfaz frontend desarrollada con React.\n\nEl sistema permite gestionar categorías, productos, proveedores, realizar pedidos y genera reportes detallados de stock y ventas. Implementa autenticación JWT para seguridad y cuenta con un dashboard analítico para toma de decisiones.",
    "category": "desarrollo",
    "categoryLabel": "Desarrollo Web/Apps",
    "difficulty": "Media",
    "developmentTime": "2.5 meses",
    "impact": "Reducción del 40% en tiempo de gestión de inventario",
    "team": "Desarrollo individual con mentorías",
    "technologies": [
      {"name": "Django", "icon": "fab fa-python"},
      {"name": "React", "icon": "fab fa-react"},
      {"name": "PostgreSQL", "icon": "fas fa-database"},
      {"name": "Docker", "icon": "fab fa-docker"},
      {"name": "JWT", "icon": "fas fa-key"}
    ],
    "thumbnailImage": "img/product-manager.jpg",
    "media": [
      {
        "type": "image",
        "url": "img/product-manager.jpg",
        "alt": "Panel de administración",
        "caption": "Interfaz de administración de productos"
      },
      {
        "type": "image",
        "url": "img/product-manager.jpg",
        "alt": "API Documentation",
        "caption": "Documentación interactiva de la API"
      },
      {
        "type": "youtube",
        "videoId": "YOUTUBE_VIDEO_ID", // Reemplazar con un ID real
        "caption": "Demo del funcionamiento del sistema"
      }
    ],
    "demoUrl": "https://github.com/Gers0n23/supermarket-api",
    "codeUrl": "https://github.com/Gers0n23/ProgramacionBackend/tree/main/evaluaciones/Sumativa4/gestion_productos"
  },
  {
    "id": "demand-planning-app",
    "title": "Aplicación Móvil para Planificación de Demanda",
    "shortDescription": "App móvil que permite a los equipos logísticos ajustar pronósticos de demanda en tiempo real desde cualquier ubicación, integrándose con sistemas ERP.",
    "fullDescription": "Aplicación multiplataforma desarrollada con React Native que permite a los planificadores de demanda y gerentes logísticos visualizar, ajustar y aprobar pronósticos de demanda desde dispositivos móviles. La app se integra con sistemas ERP empresariales mediante una API desarrollada en Python con FastAPI.\n\nLa aplicación implementa análisis estadístico para detectar anomalías en patrones de demanda, permitiendo a los usuarios realizar ajustes informados. El sistema sincroniza los cambios en tiempo real y funciona incluso sin conexión a internet, sincronizando cuando se restablece la conexión.",
    "category": "logistica",
    "categoryLabel": "Sistemas Logísticos",
    "difficulty": "Alta",
    "developmentTime": "4 meses",
    "impact": "Reducción de 65% en tiempo de planificación",
    "team": "Desarrollo con equipo de 2 personas",
    "technologies": [
      {"name": "React Native", "icon": "fab fa-react"},
      {"name": "Python", "icon": "fab fa-python"},
      {"name": "FastAPI", "icon": "fas fa-bolt"},
      {"name": "Azure", "icon": "fab fa-microsoft"},
      {"name": "SQLite", "icon": "fas fa-database"}
    ],
    "thumbnailImage": "img/demand-planning.jpg",
    "media": [
      {
        "type": "image",
        "url": "img/demand-planning.jpg",
        "alt": "Interfaz móvil",
        "caption": "Interfaz principal de la aplicación"
      },
      {
        "type": "youtube",
        "videoId": "YOUTUBE_VIDEO_ID", // Reemplazar con un ID real
        "caption": "Demostración de uso en entorno real"
      },
      {
        "type": "image",
        "url": "img/demand-planning.jpg",
        "alt": "Análisis de datos",
        "caption": "Módulo de análisis de patrones de demanda"
      }
    ],
    "demoUrl": "https://github.com/Gers0n23/demand-planning-app",
    "codeUrl": "https://github.com/Gers0n23/demand-planning-app"
  }
];

// Exportamos los datos para que otros scripts puedan usarlos
