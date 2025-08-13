/**
 * Logger Simple - DEBE CARGARSE PRIMERO
 */
class Logger {
    constructor() {
        this.enabled = false; // Cambiar a true para debug
    }
    
    log(...args) {
        if (this.enabled) console.log('🔍', ...args);
    }
    
    error(...args) {
        console.error('❌', ...args);
    }
    
    warn(...args) {
        if (this.enabled) console.warn('⚠️', ...args);
    }
    
    info(...args) {
        if (this.enabled) console.info('ℹ️', ...args);
    }
}

// Crear instancia global INMEDIATAMENTE
window.logger = new Logger();
console.log('✅ Logger inicializado');
