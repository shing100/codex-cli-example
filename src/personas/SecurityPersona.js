/**
 * Security Persona
 * Threat modeler, compliance expert, vulnerability specialist
 */

import { BasePersona } from './BasePersona.js';

export class SecurityPersona extends BasePersona {
  constructor() {
    super('security', {
      priorityHierarchy: ['Security', 'Compliance', 'Reliability', 'Performance', 'Convenience'],
      mcpPreferences: {
        primary: 'Sequential',
        secondary: 'Context7',
        avoided: 'Magic'
      },
      optimizedCommands: ['/analyze --focus security', '/improve --security'],
      qualityStandards: {
        securityFirst: 'No compromise on security fundamentals',
        compliance: 'Meet or exceed industry security standards',
        transparency: 'Clear documentation of security measures'
      }
    });
  }

  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createThreatModelingPhase(requirements),
      await this.createSecurityArchitecturePhase(requirements),
      await this.createAuthenticationImplementationPhase(requirements),
      await this.createDataProtectionPhase(requirements),
      await this.createSecurityTestingPhase(requirements),
      await this.createComplianceValidationPhase(requirements)
    ].filter(phase => phase && phase.tasks && phase.tasks.length > 0);
  }

  async createThreatModelingPhase(requirements) {
    return {
      name: 'Threat Modeling & Risk Assessment',
      type: 'security-analysis',
      duration: '1 week',
      tasks: [
        {
          type: 'analysis',
          title: 'Attack surface analysis',
          description: 'Identify and map all potential attack vectors',
          deliverables: ['Attack surface map', 'Entry point inventory'],
          estimatedHours: 8
        },
        {
          type: 'analysis',
          title: 'Threat model creation',
          description: 'Create STRIDE-based threat model',
          deliverables: ['Threat model', 'Risk assessment matrix'],
          estimatedHours: 12
        },
        {
          type: 'analysis',
          title: 'Security requirements definition',
          description: 'Define security requirements and controls',
          deliverables: ['Security requirements', 'Control framework'],
          estimatedHours: 6
        }
      ]
    };
  }

  async createSecurityArchitecturePhase(requirements) {
    return {
      name: 'Security Architecture Design',
      type: 'security-design',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'design',
          title: 'Zero trust architecture design',
          description: 'Design zero trust security architecture',
          deliverables: ['Security architecture', 'Trust boundaries'],
          estimatedHours: 10
        },
        {
          type: 'design',
          title: 'Defense in depth strategy',
          description: 'Design layered security controls',
          deliverables: ['Security layers', 'Control mapping'],
          estimatedHours: 8
        }
      ]
    };
  }

  async createAuthenticationImplementationPhase(requirements) {
    return {
      name: 'Authentication Implementation',
      type: 'security-implementation',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'implement',
          title: 'Authentication system setup',
          description: 'Implement secure authentication with JWT/OAuth',
          deliverables: ['Authentication service', 'Security configuration'],
          estimatedHours: 12
        },
        {
          type: 'implement',
          title: 'Authorization framework',
          description: 'Implement role-based access control',
          deliverables: ['Authorization middleware', 'Permission system'],
          estimatedHours: 10
        }
      ]
    };
  }

  async createDataProtectionPhase(requirements) {
    return {
      name: 'Data Protection',
      type: 'security-implementation',
      duration: '1 week',
      tasks: [
        {
          type: 'implement',
          title: 'Data encryption implementation',
          description: 'Implement encryption for sensitive data',
          deliverables: ['Encryption utilities', 'Data protection policies'],
          estimatedHours: 8
        }
      ]
    };
  }

  async createSecurityTestingPhase(requirements) {
    return {
      name: 'Security Testing',
      type: 'security-testing',
      duration: '1 week',
      tasks: [
        {
          type: 'test',
          title: 'Security vulnerability testing',
          description: 'Conduct security testing and vulnerability assessment',
          deliverables: ['Security test results', 'Vulnerability report'],
          estimatedHours: 16
        }
      ]
    };
  }

  async createComplianceValidationPhase(requirements) {
    return {
      name: 'Compliance Validation',
      type: 'security-validation',
      duration: '3-5 days',
      tasks: [
        {
          type: 'validate',
          title: 'Compliance audit',
          description: 'Validate against security compliance requirements',
          deliverables: ['Compliance report', 'Audit documentation'],
          estimatedHours: 8
        }
      ]
    };
  }

  getBestPractices() {
    return [
      'Implement defense in depth strategy',
      'Follow principle of least privilege',
      'Use secure coding practices',
      'Implement proper input validation',
      'Use encryption for data at rest and in transit',
      'Implement proper session management',
      'Regular security testing and audits',
      'Keep security dependencies updated'
    ];
  }
}