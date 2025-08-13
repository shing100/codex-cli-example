/**
 * QA Persona
 * Quality advocate, testing specialist, edge case detective
 */

import { BasePersona } from './BasePersona.js';

export class QAPersona extends BasePersona {
  constructor() {
    super('qa', {
      priorityHierarchy: ['Prevention', 'Detection', 'Correction', 'Comprehensive coverage'],
      mcpPreferences: {
        primary: 'Playwright',
        secondary: 'Sequential',
        avoided: 'Magic'
      },
      optimizedCommands: ['/test', '/troubleshoot', '/analyze --focus quality'],
      qualityStandards: {
        comprehensive: 'Test all critical paths and edge cases',
        riskBased: 'Prioritize testing based on risk and impact',
        preventive: 'Focus on preventing defects rather than finding them'
      }
    });
  }

  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createTestStrategyPhase(requirements),
      await this.createTestImplementationPhase(requirements),
      await this.createAutomationPhase(requirements),
      await this.createQualityValidationPhase(requirements)
    ].filter(phase => phase && phase.tasks.length > 0);
  }

  async createTestStrategyPhase(requirements) {
    return {
      name: 'Test Strategy & Planning',
      type: 'test-planning',
      duration: '1 week',
      tasks: [
        {
          type: 'planning',
          title: 'Test strategy development',
          description: 'Develop comprehensive testing strategy',
          deliverables: ['Test strategy document', 'Test pyramid design'],
          estimatedHours: 8
        },
        {
          type: 'planning',
          title: 'Test case design',
          description: 'Design test cases for all user scenarios',
          deliverables: ['Test case repository', 'Traceability matrix'],
          estimatedHours: 12
        }
      ]
    };
  }

  getBestPractices() {
    return [
      'Design tests before implementation',
      'Focus on risk-based testing',
      'Automate repetitive tests',
      'Test early and often',
      'Include performance testing',
      'Test edge cases and error conditions',
      'Maintain test documentation'
    ];
  }
}