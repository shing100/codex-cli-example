/**
 * Dependency Analyzer
 * Analyzes and maps dependencies within workflows
 */

export class DependencyAnalyzer {
  constructor() {
    this.dependencyTypes = {
      internal: 'Internal project dependencies',
      external: 'External service dependencies',
      technical: 'Technical/framework dependencies',
      team: 'Cross-team dependencies',
      infrastructure: 'Infrastructure dependencies'
    };
  }

  /**
   * Analyze dependencies in workflow
   * @param {Object} workflow - Workflow object
   * @returns {Object} Dependency analysis
   */
  async analyze(workflow) {
    const dependencies = {
      internal: this.analyzeInternalDependencies(workflow),
      external: this.analyzeExternalDependencies(workflow),
      technical: this.analyzeTechnicalDependencies(workflow),
      team: this.analyzeTeamDependencies(workflow),
      infrastructure: this.analyzeInfrastructureDependencies(workflow),
      criticalPath: this.identifyCriticalPath(workflow),
      bottlenecks: this.identifyBottlenecks(workflow)
    };

    return dependencies;
  }

  /**
   * Analyze internal dependencies between tasks/phases
   * @param {Object} workflow - Workflow object
   * @returns {Array} Internal dependencies
   */
  analyzeInternalDependencies(workflow) {
    const dependencies = [];
    
    if (!workflow.phases) return dependencies;
    
    // Analyze phase dependencies
    workflow.phases.forEach((phase, phaseIndex) => {
      if (phaseIndex > 0) {
        dependencies.push({
          name: `${phase.name} depends on ${workflow.phases[phaseIndex - 1].name}`,
          type: 'phase',
          critical: true,
          description: `Phase ${phaseIndex + 1} cannot start until Phase ${phaseIndex} is complete`
        });
      }
      
      // Analyze task dependencies within phases
      if (phase.tasks) {
        phase.tasks.forEach((task, taskIndex) => {
          if (task.dependencies) {
            task.dependencies.forEach(dep => {
              dependencies.push({
                name: `${task.title} depends on ${dep}`,
                type: 'task',
                critical: task.priority === 'high',
                description: `Task requires completion of ${dep}`
              });
            });
          }
        });
      }
    });
    
    return dependencies;
  }

  /**
   * Analyze external service dependencies
   * @param {Object} workflow - Workflow object
   * @returns {Array} External dependencies
   */
  analyzeExternalDependencies(workflow) {
    const dependencies = [];
    const externalServices = new Set();
    
    // Extract external services from workflow tasks
    if (workflow.phases) {
      workflow.phases.forEach(phase => {
        if (phase.tasks) {
          phase.tasks.forEach(task => {
            // Look for integration tasks
            if (task.type === 'integration' || task.title.includes('integrate')) {
              const serviceName = this.extractServiceName(task.title, task.description);
              if (serviceName) {
                externalServices.add(serviceName);
              }
            }
            
            // Look for API dependencies
            if (task.tools) {
              task.tools.forEach(tool => {
                if (this.isExternalService(tool)) {
                  externalServices.add(tool);
                }
              });
            }
          });
        }
      });
    }
    
    // Convert to dependency objects
    externalServices.forEach(service => {
      dependencies.push({
        name: service,
        type: 'external-service',
        critical: this.isServiceCritical(service),
        description: `Integration with ${service} service`,
        riskLevel: this.assessServiceRisk(service)
      });
    });
    
    return dependencies;
  }

  /**
   * Analyze technical dependencies (frameworks, libraries, etc.)
   * @param {Object} workflow - Workflow object
   * @returns {Array} Technical dependencies
   */
  analyzeTechnicalDependencies(workflow) {
    const dependencies = [];
    const technologies = new Set();
    
    // Extract technologies from tools and descriptions
    if (workflow.phases) {
      workflow.phases.forEach(phase => {
        if (phase.tasks) {
          phase.tasks.forEach(task => {
            if (task.tools) {
              task.tools.forEach(tool => {
                if (this.isTechnicalDependency(tool)) {
                  technologies.add(tool);
                }
              });
            }
            
            // Extract from descriptions
            const techFromDescription = this.extractTechnologies(task.description || '');
            techFromDescription.forEach(tech => technologies.add(tech));
          });
        }
      });
    }
    
    // Convert to dependency objects
    technologies.forEach(tech => {
      dependencies.push({
        name: tech,
        type: 'technical',
        critical: this.isTechCritical(tech),
        description: `Framework/library dependency: ${tech}`,
        version: this.suggestVersion(tech)
      });
    });
    
    return dependencies;
  }

  /**
   * Analyze team dependencies
   * @param {Object} workflow - Workflow object
   * @returns {Array} Team dependencies
   */
  analyzeTeamDependencies(workflow) {
    const dependencies = [];
    
    // Identify tasks that require specific expertise
    if (workflow.phases) {
      workflow.phases.forEach(phase => {
        const requiredSkills = this.identifyRequiredSkills(phase);
        requiredSkills.forEach(skill => {
          dependencies.push({
            name: `${skill} expertise required`,
            type: 'team-skill',
            critical: this.isSkillCritical(skill),
            description: `Phase "${phase.name}" requires ${skill} expertise`
          });
        });
      });
    }
    
    return dependencies;
  }

  /**
   * Analyze infrastructure dependencies
   * @param {Object} workflow - Workflow object
   * @returns {Array} Infrastructure dependencies
   */
  analyzeInfrastructureDependencies(workflow) {
    const dependencies = [];
    const infrastructure = new Set();
    
    // Look for deployment and infrastructure tasks
    if (workflow.phases) {
      workflow.phases.forEach(phase => {
        if (phase.type === 'deployment' || phase.type === 'infrastructure') {
          if (phase.tasks) {
            phase.tasks.forEach(task => {
              if (task.tools) {
                task.tools.forEach(tool => {
                  if (this.isInfrastructureTool(tool)) {
                    infrastructure.add(tool);
                  }
                });
              }
            });
          }
        }
      });
    }
    
    // Convert to dependency objects
    infrastructure.forEach(infra => {
      dependencies.push({
        name: infra,
        type: 'infrastructure',
        critical: true,
        description: `Infrastructure requirement: ${infra}`
      });
    });
    
    return dependencies;
  }

  /**
   * Identify critical path in workflow
   * @param {Object} workflow - Workflow object
   * @returns {Array} Critical path
   */
  identifyCriticalPath(workflow) {
    const criticalPath = [];
    
    if (!workflow.phases) return criticalPath;
    
    workflow.phases.forEach(phase => {
      const criticalTasks = [];
      
      if (phase.tasks) {
        phase.tasks.forEach(task => {
          if (task.priority === 'high' || task.critical) {
            criticalTasks.push(task.title);
          }
        });
      }
      
      if (criticalTasks.length > 0) {
        criticalPath.push({
          phase: phase.name,
          tasks: criticalTasks,
          duration: phase.duration
        });
      }
    });
    
    return criticalPath;
  }

  /**
   * Identify potential bottlenecks
   * @param {Object} workflow - Workflow object
   * @returns {Array} Potential bottlenecks
   */
  identifyBottlenecks(workflow) {
    const bottlenecks = [];
    
    if (!workflow.phases) return bottlenecks;
    
    workflow.phases.forEach(phase => {
      // High complexity phases
      if (phase.tasks && phase.tasks.length > 5) {
        bottlenecks.push({
          type: 'complexity',
          location: phase.name,
          description: `Phase has ${phase.tasks.length} tasks - potential complexity bottleneck`,
          recommendation: 'Consider breaking into smaller phases'
        });
      }
      
      // Sequential dependencies
      const sequentialTasks = phase.tasks?.filter(task => 
        task.dependencies && task.dependencies.length > 0
      ) || [];
      
      if (sequentialTasks.length > 3) {
        bottlenecks.push({
          type: 'sequential',
          location: phase.name,
          description: 'Multiple sequential dependencies detected',
          recommendation: 'Look for parallelization opportunities'
        });
      }
    });
    
    return bottlenecks;
  }

  // Helper methods
  extractServiceName(title, description) {
    const text = `${title} ${description || ''}`.toLowerCase();
    const services = ['stripe', 'paypal', 'aws', 'google', 'facebook', 'twitter', 'github'];
    return services.find(service => text.includes(service));
  }

  isExternalService(tool) {
    const externalServices = ['stripe', 'paypal', 'twilio', 'sendgrid', 'aws', 'gcp', 'azure'];
    return externalServices.includes(tool.toLowerCase());
  }

  isServiceCritical(service) {
    const criticalServices = ['payment', 'auth', 'database', 'storage'];
    return criticalServices.some(critical => service.toLowerCase().includes(critical));
  }

  assessServiceRisk(service) {
    const highRiskServices = ['payment', 'financial', 'banking'];
    const mediumRiskServices = ['email', 'sms', 'notification'];
    
    if (highRiskServices.some(risk => service.toLowerCase().includes(risk))) {
      return 'high';
    }
    if (mediumRiskServices.some(risk => service.toLowerCase().includes(risk))) {
      return 'medium';
    }
    return 'low';
  }

  isTechnicalDependency(tool) {
    const techTools = ['react', 'vue', 'angular', 'node', 'express', 'django', 'rails', 'spring'];
    return techTools.includes(tool.toLowerCase());
  }

  extractTechnologies(text) {
    const technologies = [];
    const techKeywords = ['react', 'vue', 'angular', 'node', 'express', 'mongodb', 'postgresql', 'redis'];
    
    techKeywords.forEach(tech => {
      if (text.toLowerCase().includes(tech)) {
        technologies.push(tech);
      }
    });
    
    return technologies;
  }

  isTechCritical(tech) {
    const criticalTech = ['database', 'framework', 'authentication'];
    return criticalTech.some(critical => tech.toLowerCase().includes(critical));
  }

  suggestVersion(tech) {
    const versions = {
      'react': '^18.0.0',
      'vue': '^3.0.0',
      'angular': '^16.0.0',
      'node': '^18.0.0',
      'express': '^4.18.0'
    };
    return versions[tech.toLowerCase()] || 'latest';
  }

  identifyRequiredSkills(phase) {
    const skills = [];
    const skillMap = {
      'frontend': ['React', 'Vue', 'Angular', 'CSS', 'JavaScript'],
      'backend': ['Node.js', 'Python', 'Java', 'Database'],
      'infrastructure': ['DevOps', 'Docker', 'Kubernetes', 'AWS'],
      'security': ['Security', 'Cryptography', 'OAuth'],
      'design': ['UI/UX', 'Design', 'Figma']
    };
    
    if (phase.type && skillMap[phase.type]) {
      skills.push(...skillMap[phase.type]);
    }
    
    return skills;
  }

  isSkillCritical(skill) {
    const criticalSkills = ['Security', 'Database', 'DevOps'];
    return criticalSkills.includes(skill);
  }

  isInfrastructureTool(tool) {
    const infraTools = ['docker', 'kubernetes', 'terraform', 'ansible', 'aws', 'gcp', 'azure'];
    return infraTools.includes(tool.toLowerCase());
  }
}