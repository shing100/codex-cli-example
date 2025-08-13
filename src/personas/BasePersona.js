/**
 * Base Persona
 * Abstract base class for all persona implementations
 */

export class BasePersona {
  constructor(type, config = {}) {
    this.type = type;
    this.config = {
      priorityHierarchy: [],
      mcpPreferences: {
        primary: null,
        secondary: null,
        avoided: null
      },
      optimizedCommands: [],
      qualityStandards: {},
      ...config
    };
  }

  /**
   * Generate workflow based on requirements
   * @param {Object} requirements - Parsed requirements
   * @param {Object} options - Generation options
   * @returns {Object} Generated workflow
   */
  async generateWorkflow(requirements, options) {
    const workflow = {
      title: requirements.title || 'Implementation Workflow',
      strategy: options.strategy || 'systematic',
      persona: this.type,
      phases: [],
      metadata: {
        estimatedDuration: this.estimateProjectDuration(requirements),
        complexity: requirements.complexity || 0.5,
        riskLevel: this.assessRiskLevel(requirements)
      }
    };

    // Generate strategy-specific workflow
    switch (options.strategy) {
      case 'systematic':
        workflow.phases = await this.generateSystematicWorkflow(requirements, options);
        break;
      case 'agile':
        workflow.phases = await this.generateAgileWorkflow(requirements, options);
        break;
      case 'mvp':
        workflow.phases = await this.generateMVPWorkflow(requirements, options);
        break;
      default:
        workflow.phases = await this.generateSystematicWorkflow(requirements, options);
    }

    return this.enhanceWorkflow(workflow, requirements, options);
  }

  /**
   * Generate systematic workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Array} Workflow phases
   */
  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createRequirementsAnalysisPhase(requirements),
      await this.createArchitecturePlanningPhase(requirements),
      await this.createDependencyMappingPhase(requirements),
      await this.createImplementationPhases(requirements),
      await this.createTestingStrategyPhase(requirements),
      await this.createDeploymentPlanningPhase(requirements)
    ].filter(phase => phase && phase.tasks && phase.tasks.length > 0);
  }

  /**
   * Generate agile workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Array} Workflow phases
   */
  async generateAgileWorkflow(requirements, options) {
    const epics = this.convertToEpics(requirements);
    const sprints = this.organizeSprints(epics);
    
    return sprints.map((sprint, index) => ({
      name: `Sprint ${index + 1}`,
      type: 'sprint',
      duration: '2 weeks',
      tasks: sprint.userStories.map(story => ({
        type: 'user-story',
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria,
        storyPoints: story.storyPoints
      }))
    }));
  }

  /**
   * Generate MVP workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Array} Workflow phases
   */
  async generateMVPWorkflow(requirements, options) {
    const coreFeatures = this.identifyCoreFeatures(requirements);
    
    return [
      {
        name: 'MVP Definition',
        type: 'planning',
        tasks: [
          {
            type: 'analysis',
            title: 'Define MVP scope',
            description: 'Identify minimum viable features for initial release'
          },
          {
            type: 'design',
            title: 'Create MVP wireframes',
            description: 'Design core user flows and interfaces'
          }
        ]
      },
      {
        name: 'Rapid Development',
        type: 'implementation',
        tasks: coreFeatures.map(feature => ({
          type: 'implement',
          title: `Implement ${feature.name}`,
          description: feature.description,
          priority: 'high'
        }))
      },
      {
        name: 'MVP Validation',
        type: 'validation',
        tasks: [
          {
            type: 'test',
            title: 'User acceptance testing',
            description: 'Validate core functionality with target users'
          },
          {
            type: 'deploy',
            title: 'MVP deployment',
            description: 'Deploy MVP to production environment'
          }
        ]
      }
    ];
  }

  /**
   * Create requirements analysis phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createRequirementsAnalysisPhase(requirements) {
    return {
      name: 'Requirements Analysis',
      type: 'analysis',
      duration: '3-5 days',
      tasks: [
        {
          type: 'analysis',
          title: 'Analyze functional requirements',
          description: 'Deep dive into feature specifications and user needs',
          deliverables: ['Requirements matrix', 'Feature breakdown']
        },
        {
          type: 'analysis',
          title: 'Define acceptance criteria',
          description: 'Create testable criteria for each requirement',
          deliverables: ['Acceptance criteria document']
        },
        {
          type: 'analysis',
          title: 'Identify constraints and assumptions',
          description: 'Document project limitations and dependencies',
          deliverables: ['Constraints document', 'Risk register']
        }
      ]
    };
  }

  /**
   * Create architecture planning phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createArchitecturePlanningPhase(requirements) {
    return {
      name: 'Architecture Planning',
      type: 'design',
      duration: '5-8 days',
      tasks: [
        {
          type: 'design',
          title: 'System architecture design',
          description: 'Design high-level system architecture and component structure',
          deliverables: ['Architecture diagram', 'Component specifications']
        },
        {
          type: 'design',
          title: 'Technology stack selection',
          description: 'Choose appropriate frameworks, libraries, and tools',
          deliverables: ['Technology decisions document']
        },
        {
          type: 'design',
          title: 'Database schema design',
          description: 'Design data models and database structure',
          deliverables: ['Database schema', 'Data flow diagrams']
        }
      ]
    };
  }

  /**
   * Create dependency mapping phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createDependencyMappingPhase(requirements) {
    const dependencies = this.identifyDependencies(requirements);
    
    if (dependencies.length === 0) return null;
    
    return {
      name: 'Dependency Mapping',
      type: 'planning',
      duration: '2-3 days',
      tasks: [
        {
          type: 'analysis',
          title: 'Map external dependencies',
          description: 'Identify and document all external service dependencies',
          deliverables: ['Dependency matrix', 'Integration points']
        },
        {
          type: 'planning',
          title: 'Create integration timeline',
          description: 'Plan integration sequence and test strategies',
          deliverables: ['Integration roadmap']
        }
      ]
    };
  }

  /**
   * Create implementation phases
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createImplementationPhases(requirements) {
    const features = requirements.features || [];
    const phases = [];
    
    // Group features by priority and dependencies
    const highPriorityFeatures = features.filter(f => f.priority === 'high');
    const mediumPriorityFeatures = features.filter(f => f.priority === 'medium');
    const lowPriorityFeatures = features.filter(f => f.priority === 'low');
    
    if (highPriorityFeatures.length > 0) {
      phases.push({
        name: 'Core Implementation',
        type: 'implementation',
        duration: '2-4 weeks',
        tasks: highPriorityFeatures.map(feature => ({
          type: 'implement',
          title: `Implement ${feature.name}`,
          description: feature.description || `Implementation of ${feature.name} feature`,
          priority: 'high'
        }))
      });
    }
    
    if (mediumPriorityFeatures.length > 0) {
      phases.push({
        name: 'Feature Enhancement',
        type: 'implementation',
        duration: '1-3 weeks',
        tasks: mediumPriorityFeatures.map(feature => ({
          type: 'implement',
          title: `Implement ${feature.name}`,
          description: feature.description || `Implementation of ${feature.name} feature`,
          priority: 'medium'
        }))
      });
    }
    
    if (phases.length === 0) {
      phases.push({
        name: 'Implementation',
        type: 'implementation',
        duration: '2-4 weeks',
        tasks: [
          {
            type: 'implement',
            title: 'Core feature implementation',
            description: 'Implement main application features',
            priority: 'high'
          }
        ]
      });
    }
    
    return phases;
  }

  /**
   * Create testing strategy phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createTestingStrategyPhase(requirements) {
    return {
      name: 'Testing & Validation',
      type: 'testing',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'test',
          title: 'Unit testing implementation',
          description: 'Create and execute unit tests for all components',
          deliverables: ['Unit test suite', 'Coverage report']
        },
        {
          type: 'test',
          title: 'Integration testing',
          description: 'Test component interactions and API integrations',
          deliverables: ['Integration test suite']
        },
        {
          type: 'test',
          title: 'User acceptance testing',
          description: 'Validate functionality against acceptance criteria',
          deliverables: ['UAT results', 'Bug reports']
        }
      ]
    };
  }

  /**
   * Create deployment planning phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createDeploymentPlanningPhase(requirements) {
    return {
      name: 'Deployment & Launch',
      type: 'deployment',
      duration: '3-5 days',
      tasks: [
        {
          type: 'setup',
          title: 'Production environment setup',
          description: 'Configure production infrastructure and services',
          deliverables: ['Environment configuration', 'Deployment scripts']
        },
        {
          type: 'deploy',
          title: 'Production deployment',
          description: 'Deploy application to production environment',
          deliverables: ['Deployed application', 'Deployment logs']
        },
        {
          type: 'monitor',
          title: 'Post-deployment monitoring',
          description: 'Monitor application performance and user feedback',
          deliverables: ['Monitoring dashboard', 'Performance metrics']
        }
      ]
    };
  }

  /**
   * Enhance workflow with persona-specific improvements
   * @param {Object} workflow - Base workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Object} Enhanced workflow
   */
  enhanceWorkflow(workflow, requirements, options) {
    // Add persona-specific enhancements
    workflow.mcpRecommendations = this.getMCPRecommendations();
    workflow.qualityGates = this.getQualityGates();
    workflow.bestPractices = this.getBestPractices();
    
    return workflow;
  }

  /**
   * Get MCP server recommendations
   * @returns {Object} MCP recommendations
   */
  getMCPRecommendations() {
    return {
      primary: this.config.mcpPreferences.primary,
      secondary: this.config.mcpPreferences.secondary,
      avoided: this.config.mcpPreferences.avoided,
      rationale: `${this.type} persona optimized for ${this.config.mcpPreferences.primary} integration`
    };
  }

  /**
   * Get quality gates for this persona
   * @returns {Array} Quality gates
   */
  getQualityGates() {
    return [
      'Requirements validation',
      'Architecture review',
      'Code quality check',
      'Security assessment',
      'Performance validation',
      'User acceptance testing'
    ];
  }

  /**
   * Get best practices for this persona
   * @returns {Array} Best practices
   */
  getBestPractices() {
    return [
      'Follow established coding standards',
      'Implement comprehensive testing',
      'Document all design decisions',
      'Ensure security best practices',
      'Optimize for maintainability'
    ];
  }

  /**
   * Convert requirements to epics
   * @param {Object} requirements - Requirements object
   * @returns {Array} List of epics
   */
  convertToEpics(requirements) {
    const features = requirements.features || [];
    return features.map(feature => ({
      name: feature.name,
      description: feature.description,
      userStories: this.createUserStories(feature),
      acceptanceCriteria: feature.acceptanceCriteria || []
    }));
  }

  /**
   * Create user stories from feature
   * @param {Object} feature - Feature object
   * @returns {Array} User stories
   */
  createUserStories(feature) {
    return [
      {
        title: `User can ${feature.name}`,
        description: feature.description || `As a user, I want to ${feature.name}`,
        acceptanceCriteria: feature.acceptanceCriteria || [],
        storyPoints: this.estimateStoryPoints(feature)
      }
    ];
  }

  /**
   * Organize features into sprints
   * @param {Array} epics - List of epics
   * @returns {Array} Sprint organization
   */
  organizeSprints(epics) {
    const sprints = [];
    let currentSprint = { userStories: [], totalPoints: 0 };
    const maxPointsPerSprint = 20;
    
    for (const epic of epics) {
      for (const story of epic.userStories) {
        if (currentSprint.totalPoints + story.storyPoints > maxPointsPerSprint) {
          if (currentSprint.userStories.length > 0) {
            sprints.push(currentSprint);
          }
          currentSprint = { userStories: [], totalPoints: 0 };
        }
        
        currentSprint.userStories.push(story);
        currentSprint.totalPoints += story.storyPoints;
      }
    }
    
    if (currentSprint.userStories.length > 0) {
      sprints.push(currentSprint);
    }
    
    return sprints;
  }

  /**
   * Identify core features for MVP
   * @param {Object} requirements - Requirements object
   * @returns {Array} Core features
   */
  identifyCoreFeatures(requirements) {
    const features = requirements.features || [];
    return features
      .filter(feature => feature.priority === 'high' || feature.priority === 'critical')
      .slice(0, 5); // Limit MVP to 5 core features
  }

  /**
   * Identify dependencies from requirements
   * @param {Object} requirements - Requirements object
   * @returns {Array} List of dependencies
   */
  identifyDependencies(requirements) {
    const dependencies = [];
    
    if (requirements.integrations) {
      dependencies.push(...requirements.integrations.map(integration => ({
        type: 'integration',
        name: integration,
        critical: true
      })));
    }
    
    if (requirements.technicalRequirements?.security) {
      dependencies.push({
        type: 'security',
        name: 'Authentication service',
        critical: true
      });
    }
    
    return dependencies;
  }

  /**
   * Estimate project duration
   * @param {Object} requirements - Requirements object
   * @returns {string} Duration estimate
   */
  estimateProjectDuration(requirements) {
    const baseWeeks = 2;
    const featureCount = (requirements.features || []).length;
    const complexity = requirements.complexity || 0.5;
    
    const estimatedWeeks = Math.ceil(baseWeeks + (featureCount * 0.5) * (1 + complexity));
    
    if (estimatedWeeks <= 4) {
      return `${estimatedWeeks} weeks`;
    } else {
      const months = Math.ceil(estimatedWeeks / 4);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  }

  /**
   * Assess risk level
   * @param {Object} requirements - Requirements object
   * @returns {string} Risk level
   */
  assessRiskLevel(requirements) {
    let riskScore = 0;
    
    if (requirements.complexity > 0.7) riskScore += 2;
    if ((requirements.integrations || []).length > 3) riskScore += 2;
    if (requirements.technicalRequirements?.security) riskScore += 1;
    if ((requirements.features || []).length > 10) riskScore += 1;
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Estimate story points for feature
   * @param {Object} feature - Feature object
   * @returns {number} Story points
   */
  estimateStoryPoints(feature) {
    if (feature.complexity === 'high') return 8;
    if (feature.complexity === 'medium') return 5;
    if (feature.complexity === 'low') return 3;
    return 5; // Default
  }
}