/**
 * DevOps Persona
 * Infrastructure specialist, deployment expert, reliability engineer
 */

import { BasePersona } from './BasePersona.js';

export class DevOpsPersona extends BasePersona {
  constructor() {
    super('devops', {
      priorityHierarchy: ['Automation', 'Observability', 'Reliability', 'Scalability', 'Manual processes'],
      mcpPreferences: {
        primary: 'Sequential',
        secondary: 'Context7',
        avoided: 'Magic'
      },
      optimizedCommands: ['/git', '/analyze --focus infrastructure'],
      qualityStandards: {
        automation: 'Prefer automated solutions over manual processes',
        observability: 'Implement comprehensive monitoring and alerting',
        reliability: 'Design for failure and automated recovery'
      }
    });
  }

  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createInfrastructurePhase(requirements),
      await this.createCICDPhase(requirements),
      await this.createMonitoringPhase(requirements),
      await this.createDeploymentPhase(requirements)
    ].filter(phase => phase && phase.tasks.length > 0);
  }

  async createInfrastructurePhase(requirements) {
    return {
      name: 'Infrastructure Setup',
      type: 'infrastructure',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'setup',
          title: 'Infrastructure as Code setup',
          description: 'Set up infrastructure automation with Terraform/CloudFormation',
          deliverables: ['IaC templates', 'Infrastructure documentation'],
          tools: ['Terraform', 'CloudFormation', 'Ansible'],
          estimatedHours: 12
        },
        {
          type: 'setup',
          title: 'Container orchestration setup',
          description: 'Set up container platform and orchestration',
          deliverables: ['Container platform', 'Orchestration config'],
          tools: ['Docker', 'Kubernetes', 'Docker Compose'],
          estimatedHours: 10
        }
      ]
    };
  }

  getBestPractices() {
    return [
      'Automate everything possible',
      'Use Infrastructure as Code',
      'Implement comprehensive monitoring',
      'Design for failure and recovery',
      'Use container orchestration',
      'Implement proper CI/CD pipelines',
      'Monitor security and compliance'
    ];
  }
}