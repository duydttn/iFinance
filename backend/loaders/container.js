'use strict';

/**
 * Dependency Injection Container
 * A simple registry for services, models, and shared utilities.
 * Mimics @inject and @module behavior in a Vanilla JS environment.
 */
class Container {
    constructor() {
        this.dependencies = {};
    }

    /**
     * Register a dependency
     * @param {string} name - The unique name of the dependency
     * @param {any} instance - The instance or value to register
     */
    register(name, instance) {
        if (this.dependencies[name]) {
            console.warn(`[Container] Dependency "${name}" is already registered and will be overwritten.`);
        }
        this.dependencies[name] = instance;
    }

    /**
     * Resolve a dependency
     * @param {string} name - The name of the dependency to resolve
     * @returns {any} The registered dependency
     * @throws {Error} If dependency is not found
     */
    resolve(name) {
        const dependency = this.dependencies[name];
        if (!dependency) {
            throw new Error(`[Container] Could not resolve dependency: "${name}". Check your dependencyLoader.`);
        }
        return dependency;
    }

    /**
     * Get all dependencies (useful for debugging or bulk injection)
     */
    registry() {
        return this.dependencies;
    }
}

// Export a singleton instance by default, or the class for factory usage
module.exports = new Container();