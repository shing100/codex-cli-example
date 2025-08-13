/**
 * Architect Persona
 * Systems architecture specialist, long-term thinking focus, scalability expert
 */

import { BasePersona } from './BasePersona.js';

export class ArchitectPersona extends BasePersona {
  constructor() {
    super('architect', {
      priorityHierarchy: ['Long-term maintainability', 'Scalability', 'Performance', 'Short-term gains'],
      mcpPreferences: {
        primary: 'Sequential',
        secondary: 'Context7',
        avoided: 'Magic'
      },
      optimizedCommands: ['/analyze', '/estimate', '/improve --arch', '/design'],
      qualityStandards: {
        maintainability: 'Solutions must be understandable and modifiable',
        scalability: 'Designs accommodate growth and increased load',
        modularity: 'Components should be loosely coupled and highly cohesive'
      }
    });
  }

  /**
   * Generate architect-specific systematic workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Array} Workflow phases
   */
  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createSystemAnalysisPhase(requirements),
      await this.createArchitecturalDesignPhase(requirements),
      await this.createTechnologySelectionPhase(requirements),
      await this.createScalabilityPlanningPhase(requirements),
      await this.createImplementationRoadmapPhase(requirements),
      await this.createQualityAssurancePhase(requirements),
      await this.createEvolutionStrategyPhase(requirements)
    ].filter(phase => phase && phase.tasks.length > 0);
  }

  /**
   * Create system analysis phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createSystemAnalysisPhase(requirements) {
    return {
      name: 'System Analysis & Context',
      type: 'analysis',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'analysis',
          title: 'Stakeholder analysis',
          description: 'Identify all stakeholders and their requirements',
          deliverables: ['Stakeholder matrix', 'Requirements traceability'],
          estimatedHours: 8
        },
        {
          type: 'analysis',
          title: 'System context mapping',
          description: 'Map system boundaries and external dependencies',
          deliverables: ['Context diagram', 'Integration boundaries'],
          estimatedHours: 12
        },
        {
          type: 'analysis',
          title: 'Quality attribute analysis',
          description: 'Define performance, security, and scalability requirements',
          deliverables: ['Quality attribute scenarios', 'Non-functional requirements'],
          estimatedHours: 10
        },
        {
          type: 'analysis',
          title: 'Constraint analysis',
          description: 'Identify technical, business, and regulatory constraints',
          deliverables: ['Constraint catalog', 'Risk assessment'],
          estimatedHours: 6
        },
        {
          type: 'analysis',
          title: 'Legacy system analysis',
          description: 'Analyze existing systems and integration requirements',
          deliverables: ['Legacy system inventory', 'Migration strategy'],
          estimatedHours: 8
        }
      ]
    };
  }

  /**
   * Create architectural design phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createArchitecturalDesignPhase(requirements) {
    return {
      name: 'Architectural Design',
      type: 'architecture',
      duration: '2-3 weeks',
      tasks: [
        {
          type: 'design',
          title: 'High-level architecture design',
          description: 'Create system overview and major component structure',
          deliverables: ['System architecture diagram', 'Component overview'],
          estimatedHours: 16
        },
        {
          type: 'design',
          title: 'Data architecture design',
          description: 'Design data storage, flow, and management strategy',
          deliverables: ['Data architecture diagram', 'Data governance plan'],
          estimatedHours: 12
        },
        {
          type: 'design',
          title: 'Integration architecture',
          description: 'Design service boundaries and communication patterns',
          deliverables: ['Integration patterns', 'API strategy'],
          estimatedHours: 14
        },
        {
          type: 'design',
          title: 'Security architecture',
          description: 'Design security controls and threat mitigation',
          deliverables: ['Security architecture', 'Threat model'],
          estimatedHours: 10
        },
        {
          type: 'design',
          title: 'Deployment architecture',
          description: 'Design infrastructure and deployment strategy',
          deliverables: ['Deployment diagram', 'Infrastructure plan'],
          estimatedHours: 8
        }
      ]
    };
  }

  /**
   * Create technology selection phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createTechnologySelectionPhase(requirements) {
    return {
      name: 'Technology Selection & Standards',
      type: 'technology',
      duration: '1 week',
      tasks: [
        {
          type: 'research',
          title: 'Technology landscape analysis',
          description: 'Research and evaluate technology options',
          deliverables: ['Technology comparison matrix', 'Evaluation criteria'],
          estimatedHours: 12
        },
        {
          type: 'design',
          title: 'Technology stack selection',
          description: 'Select frameworks, libraries, and platform technologies',
          deliverables: ['Technology stack document', 'Decision rationale'],
          estimatedHours: 8
        },
        {
          type: 'design',
          title: 'Development standards definition',
          description: 'Define coding standards, patterns, and practices',
          deliverables: ['Development standards', 'Architecture patterns catalog'],
          estimatedHours: 6
        },
        {
          type: 'design',
          title: 'Tool chain selection',
          description: 'Select development, testing, and deployment tools',
          deliverables: ['Tool chain specification', 'Development workflow'],
          estimatedHours: 4
        }
      ]
    };
  }

  /**
   * Create scalability planning phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createScalabilityPlanningPhase(requirements) {
    const scalabilityNeeded = this.requiresScalabilityPlanning(requirements);
    
    if (!scalabilityNeeded) return null;
    
    return {
      name: 'Scalability & Performance Planning',
      type: 'scalability',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'analysis',
          title: 'Load and performance modeling',
          description: 'Model expected load patterns and performance requirements',
          deliverables: ['Load model', 'Performance targets'],
          estimatedHours: 10
        },
        {
          type: 'design',
          title: 'Horizontal scaling strategy',
          description: 'Design horizontal scaling approach and auto-scaling',
          deliverables: ['Scaling strategy', 'Auto-scaling configuration'],
          estimatedHours: 8
        },
        {
          type: 'design',
          title: 'Caching strategy design',
          description: 'Design multi-level caching strategy',
          deliverables: ['Caching architecture', 'Cache invalidation strategy'],
          estimatedHours: 6
        },
        {
          type: 'design',
          title: 'Database scaling design',
          description: 'Design database scaling and partitioning strategy',
          deliverables: ['Database scaling plan', 'Sharding strategy'],
          estimatedHours: 12
        },
        {
          type: 'design',
          title: 'Performance monitoring design',
          description: 'Design performance monitoring and alerting',
          deliverables: ['Monitoring strategy', 'Performance dashboards'],
          estimatedHours: 4
        }
      ]
    };
  }

  /**
   * Create implementation roadmap phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createImplementationRoadmapPhase(requirements) {
    return {
      name: 'Implementation Roadmap',
      type: 'planning',
      duration: '1 week',
      tasks: [
        {
          type: 'planning',
          title: 'Module dependency analysis',
          description: 'Analyze dependencies between system modules',
          deliverables: ['Dependency matrix', 'Implementation sequence'],
          estimatedHours: 6
        },
        {
          type: 'planning',
          title: 'Incremental delivery planning',
          description: 'Plan incremental delivery milestones and MVPs',
          deliverables: ['Delivery roadmap', 'Milestone definitions'],
          estimatedHours: 8
        },
        {
          type: 'planning',
          title: 'Risk mitigation planning',
          description: 'Identify architectural risks and mitigation strategies',
          deliverables: ['Risk register', 'Mitigation plans'],
          estimatedHours: 6
        },
        {
          type: 'planning',
          title: 'Team structure planning',
          description: 'Plan team organization around architectural components',
          deliverables: ['Team topology', 'Communication strategy'],
          estimatedHours: 4
        }
      ]
    };
  }

  /**
   * Create quality assurance phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createQualityAssurancePhase(requirements) {
    return {
      name: 'Quality Assurance Strategy',
      type: 'quality',
      duration: '1 week',
      tasks: [
        {
          type: 'design',
          title: 'Testing strategy design',
          description: 'Design comprehensive testing strategy across all levels',
          deliverables: ['Testing strategy', 'Test automation plan'],
          estimatedHours: 8
        },
        {
          type: 'design',
          title: 'Code quality framework',
          description: 'Define code quality metrics and enforcement mechanisms',
          deliverables: ['Quality framework', 'Code review guidelines'],
          estimatedHours: 4
        },
        {
          type: 'design',
          title: 'Architecture review process',
          description: 'Define architecture review and governance process',
          deliverables: ['Review process', 'Architecture decision records'],
          estimatedHours: 3
        },
        {
          type: 'design',
          title: 'Continuous integration design',
          description: 'Design CI/CD pipeline and quality gates',
          deliverables: ['CI/CD pipeline design', 'Quality gate definitions'],
          estimatedHours: 6
        }
      ]
    };
  }

  /**
   * Create evolution strategy phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createEvolutionStrategyPhase(requirements) {
    return {
      name: 'Evolution & Maintenance Strategy',
      type: 'evolution',
      duration: '3-5 days',
      tasks: [
        {
          type: 'planning',
          title: 'Maintainability planning',
          description: 'Plan for long-term maintainability and evolution',
          deliverables: ['Maintainability plan', 'Evolution strategy'],
          estimatedHours: 6
        },
        {
          type: 'planning',
          title: 'Technical debt management',
          description: 'Define technical debt tracking and management process',
          deliverables: ['Debt management process', 'Refactoring schedule'],
          estimatedHours: 4
        },
        {
          type: 'planning',
          title: 'Knowledge management',
          description: 'Plan documentation and knowledge transfer strategy',
          deliverables: ['Documentation strategy', 'Knowledge base structure'],
          estimatedHours: 3
        },
        {
          type: 'planning',
          title: 'Future capability planning',
          description: 'Plan for anticipated future requirements and capabilities',
          deliverables: ['Future roadmap', 'Capability evolution plan'],
          estimatedHours: 5
        }
      ]
    };
  }

  /**
   * Check if scalability planning is needed
   * @param {Object} requirements - Requirements object
   * @returns {boolean} Whether scalability planning is needed
   */
  requiresScalabilityPlanning(requirements) {
    const indicators = [
      requirements.complexity > 0.6,
      (requirements.integrations || []).length > 2,
      requirements.technicalRequirements?.scalability === 'enterprise',
      (requirements.features || []).length > 8,
      requirements.userRoles && requirements.userRoles.length > 3
    ];
    
    return indicators.filter(Boolean).length >= 2;
  }

  /**
   * Get architect-specific best practices
   * @returns {Array} Best practices
   */
  getBestPractices() {
    return [
      'Design for change and evolution',
      'Separate concerns and minimize coupling',
      'Document architectural decisions and rationale',
      'Plan for failure and implement circuit breakers',
      'Use well-established patterns and avoid over-engineering',
      'Consider the total cost of ownership',
      'Design for observability and debugging',
      'Implement proper abstraction layers',
      'Plan for data consistency and integrity',
      'Consider security from the beginning',
      'Design for testability at all levels',
      'Plan for incremental delivery and rollback'
    ];
  }

  /**
   * Get architect-specific quality gates
   * @returns {Array} Quality gates
   */
  getQualityGates() {
    return [
      'Architecture decision record review',
      'System design consistency check',
      'Scalability requirements validation',
      'Security architecture review',
      'Performance requirements verification',
      'Integration pattern compliance',
      'Code quality and maintainability assessment',
      'Documentation completeness review',
      'Risk assessment and mitigation validation',
      'Future evolution capability check'
    ];
  }

  /**
   * Enhance workflow with architect-specific improvements
   * @param {Object} workflow - Base workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Object} Enhanced workflow
   */
  enhanceWorkflow(workflow, requirements, options) {
    const enhanced = super.enhanceWorkflow(workflow, requirements, options);
    
    // Add architect-specific enhancements
    enhanced.architecturalPrinciples = [
      'Separation of Concerns',
      'Single Responsibility',
      'Open/Closed Principle',
      'Dependency Inversion',
      'Composition over Inheritance'
    ];
    
    enhanced.designDecisions = {
      template: 'Architecture Decision Record (ADR)',
      required: ['Context', 'Decision', 'Rationale', 'Consequences'],
      review: 'All architectural decisions require peer review'
    };
    
    enhanced.qualityAttributes = {
      performance: 'Response time, throughput, resource utilization',
      scalability: 'Horizontal and vertical scaling capabilities',
      reliability: 'Availability, fault tolerance, recovery',
      security: 'Authentication, authorization, data protection',
      maintainability: 'Modifiability, testability, documentation',
      usability: 'User experience, accessibility, learnability'
    };
    
    enhanced.evolutionStrategy = {
      versionStrategy: 'Semantic versioning with backward compatibility',
      migrationPlanning: 'Zero-downtime deployment capability',
      technicalDebt: 'Regular debt assessment and refactoring cycles',
      futureProofing: 'Anticipate and plan for future requirements'
    };
    
    return enhanced;
  }
}