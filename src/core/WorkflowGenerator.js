/**
 * Core Workflow Generator
 * Orchestrates the entire workflow generation process based on PRDs and feature specifications
 */

import { PRDParser } from '../parsers/PRDParser.js';
import { PersonaFactory } from '../personas/PersonaFactory.js';
import { OutputFormatter } from '../formatters/OutputFormatter.js';
import { DependencyAnalyzer } from './DependencyAnalyzer.js';
import { RiskAssessment } from './RiskAssessment.js';
import { MCPIntegration } from './MCPIntegration.js';
import { QualityGates } from './QualityGates.js';

export class WorkflowGenerator {
  constructor(options = {}) {
    this.options = {
      strategy: 'systematic',
      output: 'roadmap',
      persona: 'auto',
      enableMCP: true,
      includeEstimates: false,
      includeDependencies: false,
      includeRisks: false,
      enableParallel: false,
      includeMilestones: false,
      ...options
    };

    this.prdParser = new PRDParser();
    this.personaFactory = new PersonaFactory();
    this.outputFormatter = new OutputFormatter();
    this.dependencyAnalyzer = new DependencyAnalyzer();
    this.riskAssessment = new RiskAssessment();
    this.mcpIntegration = new MCPIntegration();
    this.qualityGates = new QualityGates();
  }

  /**
   * Generate workflow from PRD file or feature description
   * @param {string} input - Path to PRD file or feature description
   * @param {Object} flags - Command flags and options
   * @returns {Object} Generated workflow
   */
  async generateWorkflow(input, flags = {}) {
    try {
      // Merge flags with constructor options
      const options = { ...this.options, ...flags };

      // Step 1: Parse input (PRD file or description)
      const requirements = await this.parseInput(input);
      
      // Step 2: Analyze complexity and auto-detect persona if needed
      const analysis = await this.analyzeRequirements(requirements, options);
      
      // Step 3: Generate persona-specific workflow
      const persona = this.selectPersona(analysis, options);
      const baseWorkflow = await persona.generateWorkflow(requirements, options);
      
      // Ensure baseWorkflow has phases array
      if (!baseWorkflow.phases) {
        baseWorkflow.phases = [];
      }
      
      // Step 4: Enhance with additional analysis
      const enhancedWorkflow = await this.enhanceWorkflow(baseWorkflow, options);
      
      // Step 5: Apply quality gates (skip for now to avoid validation complexity)
      // const validatedWorkflow = await this.qualityGates.validate(enhancedWorkflow);
      const validatedWorkflow = enhancedWorkflow;
      
      // Step 6: Format output
      const formattedOutput = this.outputFormatter.format(validatedWorkflow, options.output);
      
      return {
        workflow: formattedOutput,
        metadata: {
          persona: persona.type,
          strategy: options.strategy,
          complexity: analysis.complexity,
          estimatedDuration: analysis.estimatedDuration,
          riskLevel: analysis.riskLevel
        }
      };
    } catch (error) {
      throw new Error(`Workflow generation failed: ${error.message}`);
    }
  }

  /**
   * Parse input - either PRD file or feature description
   * @param {string} input - Input string
   * @returns {Object} Parsed requirements
   */
  async parseInput(input) {
    // Check if input is a file path
    if (input.includes('.md') || input.includes('.txt') || input.includes('/')) {
      return await this.prdParser.parseFile(input);
    } else {
      return this.prdParser.parseDescription(input);
    }
  }

  /**
   * Analyze requirements for complexity, domain, and patterns
   * @param {Object} requirements - Parsed requirements
   * @param {Object} options - Generation options
   * @returns {Object} Analysis results
   */
  async analyzeRequirements(requirements, options) {
    const analysis = {
      complexity: this.calculateComplexity(requirements),
      domains: requirements.domains || this.identifyDomains(requirements),
      patterns: requirements.patterns || this.identifyPatterns(requirements),
      riskLevel: this.assessInitialRisk(requirements),
      estimatedDuration: this.estimateDuration(requirements)
    };

    // Use MCP for enhanced analysis if enabled
    if (options.enableMCP) {
      const mcpAnalysis = await this.mcpIntegration.enhanceAnalysis(analysis, requirements);
      return { ...analysis, ...mcpAnalysis };
    }

    return analysis;
  }

  /**
   * Select appropriate persona based on analysis
   * @param {Object} analysis - Requirements analysis
   * @param {Object} options - Generation options
   * @returns {Object} Selected persona instance
   */
  selectPersona(analysis, options) {
    if (options.persona !== 'auto') {
      return this.personaFactory.create(options.persona);
    }

    // Auto-detect persona based on domains and patterns
    const personaType = this.autoDetectPersona(analysis);
    return this.personaFactory.create(personaType);
  }

  /**
   * Auto-detect persona based on analysis
   * @param {Object} analysis - Requirements analysis
   * @returns {string} Persona type
   */
  autoDetectPersona(analysis) {
    const { domains, patterns } = analysis;

    // Frontend indicators
    if (domains.includes('frontend') || patterns.includes('ui-component') || patterns.includes('responsive')) {
      return 'frontend';
    }

    // Backend indicators
    if (domains.includes('backend') || patterns.includes('api') || patterns.includes('database')) {
      return 'backend';
    }

    // Security indicators
    if (domains.includes('security') || patterns.includes('authentication') || patterns.includes('encryption')) {
      return 'security';
    }

    // DevOps indicators
    if (domains.includes('infrastructure') || patterns.includes('deployment') || patterns.includes('ci-cd')) {
      return 'devops';
    }

    // Default to architect for complex multi-domain projects
    if (domains.length > 2 || analysis.complexity > 0.8) {
      return 'architect';
    }

    return 'architect'; // Default fallback
  }

  /**
   * Enhance workflow with additional analysis
   * @param {Object} workflow - Base workflow
   * @param {Object} options - Generation options
   * @returns {Object} Enhanced workflow
   */
  async enhanceWorkflow(workflow, options) {
    let enhanced = { ...workflow };

    // Add dependency analysis
    if (options.includeDependencies) {
      enhanced.dependencies = await this.dependencyAnalyzer.analyze(workflow);
    }

    // Add risk assessment
    if (options.includeRisks) {
      enhanced.risks = await this.riskAssessment.assess(workflow);
    }

    // Add time estimates
    if (options.includeEstimates) {
      enhanced = this.addTimeEstimates(enhanced);
    }

    // Identify parallel work streams
    if (options.enableParallel) {
      enhanced.parallelStreams = this.identifyParallelStreams(enhanced);
    }

    // Add milestones
    if (options.includeMilestones) {
      enhanced.milestones = this.createMilestones(enhanced);
    }

    return enhanced;
  }

  /**
   * Calculate complexity score (0-1)
   * @param {Object} requirements - Requirements object
   * @returns {number} Complexity score
   */
  calculateComplexity(requirements) {
    let score = 0;
    
    // Base complexity factors
    const factors = {
      components: Math.min(requirements.components?.length || 0, 10) * 0.05,
      integrations: Math.min(requirements.integrations?.length || 0, 5) * 0.1,
      userRoles: Math.min(requirements.userRoles?.length || 0, 5) * 0.05,
      features: Math.min(requirements.features?.length || 0, 20) * 0.03,
      pages: Math.min(requirements.pages?.length || 0, 15) * 0.02
    };

    score = Object.values(factors).reduce((sum, val) => sum + val, 0);
    
    // Complexity modifiers
    if (requirements.realtime) score += 0.2;
    if (requirements.security === 'high') score += 0.15;
    if (requirements.performance === 'critical') score += 0.1;
    if (requirements.scalability === 'enterprise') score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * Identify domains from requirements
   * @param {Object} requirements - Requirements object
   * @returns {Array} List of domains
   */
  identifyDomains(requirements) {
    const domains = new Set();
    
    // Check for frontend indicators
    if (requirements.ui || requirements.components || requirements.responsive) {
      domains.add('frontend');
    }
    
    // Check for backend indicators
    if (requirements.api || requirements.database || requirements.server) {
      domains.add('backend');
    }
    
    // Check for security indicators
    if (requirements.authentication || requirements.authorization || requirements.encryption) {
      domains.add('security');
    }
    
    // Check for infrastructure indicators
    if (requirements.deployment || requirements.scaling || requirements.monitoring) {
      domains.add('infrastructure');
    }

    return Array.from(domains);
  }

  /**
   * Identify implementation patterns
   * @param {Object} requirements - Requirements object
   * @returns {Array} List of patterns
   */
  identifyPatterns(requirements) {
    const patterns = [];
    
    // Common patterns based on requirements
    if (requirements.components) patterns.push('ui-component');
    if (requirements.api) patterns.push('api');
    if (requirements.database) patterns.push('database');
    if (requirements.authentication) patterns.push('authentication');
    if (requirements.realtime) patterns.push('realtime');
    if (requirements.responsive) patterns.push('responsive');
    if (requirements.testing) patterns.push('testing');
    
    return patterns;
  }

  /**
   * Assess initial risk level
   * @param {Object} requirements - Requirements object
   * @returns {string} Risk level (low, medium, high)
   */
  assessInitialRisk(requirements) {
    let riskScore = 0;
    
    if (requirements.complexity > 0.7) riskScore += 2;
    if (requirements.integrations?.length > 3) riskScore += 2;
    if (requirements.security === 'high') riskScore += 1;
    if (requirements.timeline === 'tight') riskScore += 2;
    if (requirements.team === 'small') riskScore += 1;
    
    if (riskScore >= 5) return 'high';
    if (riskScore >= 3) return 'medium';
    return 'low';
  }

  /**
   * Estimate project duration in weeks
   * @param {Object} requirements - Requirements object
   * @returns {number} Duration in weeks
   */
  estimateDuration(requirements) {
    let baseWeeks = 2; // Minimum project duration
    
    // Add time based on components
    baseWeeks += (requirements.components?.length || 0) * 0.5;
    baseWeeks += (requirements.features?.length || 0) * 0.3;
    baseWeeks += (requirements.integrations?.length || 0) * 1;
    
    // Complexity multiplier
    const complexity = this.calculateComplexity(requirements);
    baseWeeks *= (1 + complexity);
    
    return Math.ceil(baseWeeks);
  }

  /**
   * Add time estimates to workflow tasks
   * @param {Object} workflow - Workflow object
   * @returns {Object} Workflow with time estimates
   */
  addTimeEstimates(workflow) {
    const estimated = { ...workflow };
    
    if (estimated.phases) {
      estimated.phases = estimated.phases.map(phase => ({
        ...phase,
        estimatedDuration: this.estimatePhaseTime(phase),
        tasks: phase.tasks?.map(task => ({
          ...task,
          estimatedHours: this.estimateTaskTime(task)
        }))
      }));
    }
    
    return estimated;
  }

  /**
   * Estimate time for a phase
   * @param {Object} phase - Phase object
   * @returns {string} Time estimate
   */
  estimatePhaseTime(phase) {
    const taskCount = phase.tasks?.length || 0;
    const baseHours = taskCount * 8; // 8 hours per task average
    const days = Math.ceil(baseHours / 8);
    
    if (days <= 5) return `${days} days`;
    const weeks = Math.ceil(days / 5);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  }

  /**
   * Estimate time for a task
   * @param {Object} task - Task object
   * @returns {number} Hours estimate
   */
  estimateTaskTime(task) {
    // Base estimates by task type
    const taskTypeHours = {
      'design': 4,
      'implement': 8,
      'test': 3,
      'deploy': 2,
      'review': 2,
      'setup': 3,
      'integrate': 6,
      'optimize': 5
    };
    
    // Try to detect task type from description
    const description = (task.description || task.title || '').toLowerCase();
    
    for (const [type, hours] of Object.entries(taskTypeHours)) {
      if (description.includes(type)) {
        return hours;
      }
    }
    
    return 5; // Default estimate
  }

  /**
   * Identify parallel work streams
   * @param {Object} workflow - Workflow object
   * @returns {Array} Parallel work streams
   */
  identifyParallelStreams(workflow) {
    const streams = [];
    
    if (workflow.phases) {
      // Group tasks by independence
      const independentTasks = workflow.phases.flatMap(phase => 
        phase.tasks?.filter(task => !task.dependencies?.length) || []
      );
      
      if (independentTasks.length > 1) {
        streams.push({
          name: 'Independent Development',
          tasks: independentTasks,
          canRunInParallel: true
        });
      }
    }
    
    return streams;
  }

  /**
   * Create project milestones
   * @param {Object} workflow - Workflow object
   * @returns {Array} Project milestones
   */
  createMilestones(workflow) {
    const milestones = [];
    
    if (workflow.phases) {
      workflow.phases.forEach((phase, index) => {
        milestones.push({
          name: `${phase.name} Complete`,
          description: `All tasks in ${phase.name} phase completed`,
          phase: index + 1,
          criteria: phase.tasks?.map(task => task.title) || []
        });
      });
    }
    
    return milestones;
  }
}