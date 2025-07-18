// Admin Dashboard JavaScript - Funcionalidad interactiva

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard JS Loaded');
    
    // Inicializar componentes del dashboard
    initStatCards();
    initActionButtons();
    initTableInteractions();
    initTooltips();
    
    // Auto-refresh de estadísticas cada 5 minutos
    setInterval(refreshStats, 300000);
});

/**
 * Inicializar animaciones de las tarjetas de estadísticas
 */
function initStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
        
        // Animación de números al cargar
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
            animateNumber(numberElement);
        }
    });
}

/**
 * Animar números de estadísticas
 */
function animateNumber(element) {
    const finalNumber = parseInt(element.textContent) || 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para suavizar la animación
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.floor(finalNumber * easeOutCubic);
        
        element.textContent = currentNumber;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    element.textContent = '0';
    requestAnimationFrame(updateNumber);
}

/**
 * Inicializar comportamiento de botones de acción
 */
function initActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Efecto visual de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Mostrar loading si es necesario
            const icon = this.querySelector('i');
            if (icon) {
                const originalClass = icon.className;
                icon.className = 'fas fa-spinner fa-spin';
                
                setTimeout(() => {
                    icon.className = originalClass;
                }, 1000);
            }
        });
        
        // Efecto hover mejorado
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Inicializar interacciones de tabla
 */
function initTableInteractions() {
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Resaltar fila seleccionada
            tableRows.forEach(r => r.classList.remove('table-row-selected'));
            this.classList.add('table-row-selected');
        });
        
        // Efecto hover mejorado
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(74, 144, 226, 0.08)';
        });
        
        row.addEventListener('mouseleave', function() {
            if (!this.classList.contains('table-row-selected')) {
                this.style.backgroundColor = '';
            }
        });
    });
    
    // Funcionalidad de filtrado rápido
    addQuickFilter();
}

/**
 * Agregar filtro rápido para la tabla
 */
function addQuickFilter() {
    const tableContainer = document.querySelector('.formularios-table');
    if (!tableContainer) return;
    
    // Crear input de búsqueda
    const filterContainer = document.createElement('div');
    filterContainer.className = 'table-filter-container mb-3';
    filterContainer.innerHTML = `
        <div class="input-group">
            <span class="input-group-text">
                <i class="fas fa-search"></i>
            </span>
            <input type="text" class="form-control" id="tableFilter" 
                   placeholder="Buscar en formularios...">
        </div>
    `;
    
    tableContainer.parentNode.insertBefore(filterContainer, tableContainer);
    
    // Implementar filtrado
    const filterInput = document.getElementById('tableFilter');
    filterInput.addEventListener('input', function() {
        const filterValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('.table-row');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(filterValue);
            row.style.display = isVisible ? '' : 'none';
        });
    });
}

/**
 * Inicializar tooltips para iconos
 */
function initTooltips() {
    const icons = document.querySelectorAll('[data-tooltip]');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, this.dataset.tooltip);
        });
        
        icon.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

/**
 * Mostrar tooltip
 */
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
}

/**
 * Ocultar tooltip
 */
function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Refrescar estadísticas del dashboard
 */
function refreshStats() {
    console.log('Refreshing dashboard stats...');
    
    // Aquí se podría implementar una llamada AJAX para actualizar estadísticas
    // fetch('/api/dashboard-stats/')
    //     .then(response => response.json())
    //     .then(data => updateStatsDisplay(data));
}

/**
 * Actualizar display de estadísticas
 */
function updateStatsDisplay(stats) {
    // Actualizar números en las tarjetas
    Object.keys(stats).forEach(key => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) {
            const oldValue = parseInt(element.textContent);
            const newValue = stats[key];
            
            if (oldValue !== newValue) {
                element.textContent = newValue;
                // Añadir efecto visual de actualización
                element.classList.add('stat-updated');
                setTimeout(() => element.classList.remove('stat-updated'), 1000);
            }
        }
    });
}

/**
 * Función utilitaria para mostrar notificaciones
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Exportar funciones globales si es necesario
 */
window.AdminDashboard = {
    refreshStats,
    showNotification,
    animateNumber
};
