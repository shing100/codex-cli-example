/**
 * Persona Factory
 * Creates specialized persona instances for workflow generation
 */

import { ArchitectPersona } from './ArchitectPersona.js';
import { FrontendPersona } from './FrontendPersona.js';
import { BackendPersona } from './BackendPersona.js';
import { SecurityPersona } from './SecurityPersona.js';
import { DevOpsPersona } from './DevOpsPersona.js';
import { QAPersona } from './QAPersona.js';

export class PersonaFactory {
  constructor() {
    this.personas = new Map([
      ['architect', ArchitectPersona],
      ['frontend', FrontendPersona],
      ['backend', BackendPersona],
      ['security', SecurityPersona],
      ['devops', DevOpsPersona],
      ['qa', QAPersona]
    ]);
  }

  /**
   * Create persona instance
   * @param {string} type - Persona type
   * @returns {Object} Persona instance
   */
  create(type) {
    const PersonaClass = this.personas.get(type.toLowerCase());
    
    if (!PersonaClass) {
      throw new Error(`Unknown persona type: ${type}`);
    }
    
    return new PersonaClass();
  }

  /**
   * Get available persona types
   * @returns {Array} List of available persona types
   */
  getAvailableTypes() {
    return Array.from(this.personas.keys());
  }

  /**
   * Check if persona type exists
   * @param {string} type - Persona type
   * @returns {boolean} Whether persona exists
   */
  hasType(type) {
    return this.personas.has(type.toLowerCase());
  }
}