/**
 * Quality Gates
 * Validates workflows against quality standards and best practices
 */

export class QualityGates {
  constructor() {
    this.gates = [
      { name: 'Requirements Validation', weight: 0.2 },
      { name: 'Architecture Review', weight: 0.15 },
      { name: 'Security Assessment', weight: 0.15 },
      { name: 'Performance Validation', weight: 0.15 },
      { name: 'Testing Strategy', weight: 0.15 },
      { name: 'Documentation Review', weight: 0.1 },
      { name: 'Risk Assessment', weight: 0.1 }
    ];

    this.passingScore = 0.8; // 80% minimum to pass
  }

  /**
   * Validate workflow against quality gates
   * @param {Object} workflow - Workflow object
   * @returns {Object} Validation results
   */
  async validate(workflow) {
    const results = {
      overall: { passed: false, score: 0 },
      gates: {},
      recommendations: [],
      blockers: []
    };

    // Run each quality gate
    for (const gate of this.gates) {
      const gateResult = await this.runGate(gate.name, workflow);
      results.gates[gate.name] = {
        ...gateResult,
        weight: gate.weight
      };
    }

    // Calculate overall score
    results.overall.score = this.calculateOverallScore(results.gates);
    results.overall.passed = results.overall.score >= this.passingScore;

    // Generate recommendations
    results.recommendations = this.generateRecommendations(results.gates);
    results.blockers = this.identifyBlockers(results.gates);

    return results;
  }

  /**
   * Run individual quality gate
   * @param {string} gateName - Gate name
   * @param {Object} workflow - Workflow object
   * @returns {Object} Gate result
   */
  async runGate(gateName, workflow) {
    switch (gateName) {
      case 'Requirements Validation':
        return this.validateRequirements(workflow);
      case 'Architecture Review':
        return this.reviewArchitecture(workflow);
      case 'Security Assessment':
        return this.assessSecurity(workflow);
      case 'Performance Validation':
        return this.validatePerformance(workflow);
      case 'Testing Strategy':
        return this.validateTesting(workflow);
      case 'Documentation Review':
        return this.reviewDocumentation(workflow);
      case 'Risk Assessment':
        return this.assessRisks(workflow);
      default:
        return { passed: false, score: 0, issues: ['Unknown gate'] };
    }
  }

  /**
   * Validate requirements completeness
   * @param {Object} workflow - Workflow object
   * @returns {Object} Validation result
   */
  validateRequirements(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for title
    if (!workflow.title) {
      issues.push('Missing workflow title');
      score -= 0.1;
    }

    // Check for phases
    if (!workflow.phases || workflow.phases.length === 0) {
      issues.push('No implementation phases defined');
      score -= 0.3;
    }

    // Check for task details
    let tasksWithoutDescription = 0;
    let totalTasks = 0;

    workflow.phases?.forEach(phase => {
      phase.tasks?.forEach(task => {
        totalTasks++;
        if (!task.description) {
          tasksWithoutDescription++;
        }
      });
    });

    if (totalTasks > 0 && tasksWithoutDescription / totalTasks > 0.5) {
      issues.push('Many tasks lack detailed descriptions');
      score -= 0.2;
    }

    // Check for acceptance criteria
    if (!workflow.acceptanceCriteria || workflow.acceptanceCriteria.length === 0) {
      issues.push('Missing acceptance criteria');
      score -= 0.2;
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add missing requirements details'] : []
    };
  }

  /**
   * Review architecture decisions
   * @param {Object} workflow - Workflow object
   * @returns {Object} Review result
   */
  reviewArchitecture(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for architecture phase
    const hasArchPhase = workflow.phases?.some(phase => 
      phase.type === 'architecture' || 
      phase.name.toLowerCase().includes('architecture')
    );

    if (!hasArchPhase) {
      issues.push('No dedicated architecture planning phase');
      score -= 0.3;
    }

    // Check for technology decisions
    const hasTechDecisions = workflow.phases?.some(phase =>
      phase.tasks?.some(task => 
        task.title.toLowerCase().includes('technology') ||
        task.title.toLowerCase().includes('framework')
      )
    );

    if (!hasTechDecisions) {
      issues.push('No technology selection tasks identified');
      score -= 0.2;
    }

    // Check for scalability considerations
    const hasScalability = JSON.stringify(workflow).toLowerCase().includes('scalability');
    if (!hasScalability) {
      issues.push('No scalability considerations mentioned');
      score -= 0.2;
    }

    // Check for persona alignment
    if (workflow.persona === 'architect' && score < 0.9) {
      issues.push('Architecture workflow should have more detailed planning');
      score -= 0.1;
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add architecture planning tasks'] : []
    };
  }

  /**
   * Assess security considerations
   * @param {Object} workflow - Workflow object
   * @returns {Object} Assessment result
   */
  assessSecurity(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for security tasks
    const hasSecurityTasks = workflow.phases?.some(phase =>
      phase.tasks?.some(task => 
        task.title.toLowerCase().includes('security') ||
        task.title.toLowerCase().includes('auth') ||
        task.type === 'security'
      )
    );

    if (!hasSecurityTasks) {
      issues.push('No security implementation tasks identified');
      score -= 0.4;
    }

    // Check for authentication
    const hasAuth = JSON.stringify(workflow).toLowerCase().includes('auth');
    if (!hasAuth) {
      issues.push('No authentication considerations');
      score -= 0.2;
    }

    // Check for input validation
    const hasValidation = JSON.stringify(workflow).toLowerCase().includes('validation');
    if (!hasValidation) {
      issues.push('No input validation mentioned');
      score -= 0.2;
    }

    // Check for HTTPS/encryption
    const hasEncryption = JSON.stringify(workflow).toLowerCase().includes('encrypt');
    if (!hasEncryption) {
      issues.push('No encryption considerations');
      score -= 0.2;
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add security implementation tasks'] : []
    };
  }

  /**
   * Validate performance considerations
   * @param {Object} workflow - Workflow object
   * @returns {Object} Validation result
   */
  validatePerformance(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for performance tasks
    const hasPerformanceTasks = workflow.phases?.some(phase =>
      phase.tasks?.some(task => 
        task.title.toLowerCase().includes('performance') ||
        task.title.toLowerCase().includes('optimization') ||
        task.type === 'optimize'
      )
    );

    if (!hasPerformanceTasks) {
      issues.push('No performance optimization tasks');
      score -= 0.3;
    }

    // Check for monitoring
    const hasMonitoring = JSON.stringify(workflow).toLowerCase().includes('monitor');
    if (!hasMonitoring) {
      issues.push('No performance monitoring planned');
      score -= 0.3;
    }

    // Check for testing
    const hasLoadTesting = JSON.stringify(workflow).toLowerCase().includes('load test');
    if (!hasLoadTesting) {
      issues.push('No load testing planned');
      score -= 0.2;
    }

    // Check for caching
    const hasCaching = JSON.stringify(workflow).toLowerCase().includes('cach');
    if (!hasCaching) {
      issues.push('No caching strategy mentioned');
      score -= 0.2;
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add performance optimization tasks'] : []
    };
  }

  /**
   * Validate testing strategy
   * @param {Object} workflow - Workflow object
   * @returns {Object} Validation result
   */
  validateTesting(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for testing phase
    const hasTestingPhase = workflow.phases?.some(phase =>
      phase.type === 'testing' || 
      phase.name.toLowerCase().includes('test')
    );

    if (!hasTestingPhase) {
      issues.push('No dedicated testing phase');
      score -= 0.3;
    }

    // Check for different test types
    const workflowStr = JSON.stringify(workflow).toLowerCase();
    const testTypes = ['unit test', 'integration test', 'e2e test', 'acceptance test'];
    const missingTests = testTypes.filter(type => !workflowStr.includes(type));

    if (missingTests.length > 2) {
      issues.push(`Missing test types: ${missingTests.join(', ')}`);
      score -= 0.3;
    }

    // Check for test automation
    const hasAutomation = workflowStr.includes('automat');
    if (!hasAutomation) {
      issues.push('No test automation mentioned');
      score -= 0.2;
    }

    // Check for QA persona workflows
    if (workflow.persona === 'qa' && score < 0.9) {
      issues.push('QA workflow should have comprehensive testing strategy');
      score -= 0.1;
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add comprehensive testing strategy'] : []
    };
  }

  /**
   * Review documentation completeness
   * @param {Object} workflow - Workflow object
   * @returns {Object} Review result
   */
  reviewDocumentation(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for documentation tasks
    const hasDocTasks = workflow.phases?.some(phase =>
      phase.tasks?.some(task => 
        task.title.toLowerCase().includes('document') ||
        task.deliverables?.some(d => d.toLowerCase().includes('document'))
      )
    );

    if (!hasDocTasks) {
      issues.push('No documentation tasks identified');
      score -= 0.4;
    }

    // Check for deliverables documentation
    let tasksWithDeliverables = 0;
    let totalTasks = 0;

    workflow.phases?.forEach(phase => {
      phase.tasks?.forEach(task => {
        totalTasks++;
        if (task.deliverables && task.deliverables.length > 0) {
          tasksWithDeliverables++;
        }
      });
    });

    if (totalTasks > 0 && tasksWithDeliverables / totalTasks < 0.5) {
      issues.push('Many tasks lack deliverable specifications');
      score -= 0.3;
    }

    // Check for API documentation
    if (JSON.stringify(workflow).toLowerCase().includes('api')) {
      const hasAPIDoc = JSON.stringify(workflow).toLowerCase().includes('api doc');
      if (!hasAPIDoc) {
        issues.push('API development without documentation planning');
        score -= 0.3;
      }
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add documentation tasks and deliverables'] : []
    };
  }

  /**
   * Assess risk management
   * @param {Object} workflow - Workflow object
   * @returns {Object} Assessment result
   */
  assessRisks(workflow) {
    const issues = [];
    let score = 1.0;

    // Check for risk assessment
    if (!workflow.risks || Object.keys(workflow.risks).length === 0) {
      issues.push('No risk assessment provided');
      score -= 0.5;
    }

    // Check for mitigation strategies
    if (!workflow.risks?.mitigation) {
      issues.push('No risk mitigation strategies');
      score -= 0.3;
    }

    // Check for dependency analysis
    if (!workflow.dependencies) {
      issues.push('No dependency analysis');
      score -= 0.2;
    }

    return {
      passed: score >= 0.8,
      score: Math.max(0, score),
      issues,
      recommendations: issues.length > 0 ? ['Add risk assessment and mitigation'] : []
    };
  }

  /**
   * Calculate overall quality score
   * @param {Object} gates - Gate results
   * @returns {number} Overall score
   */
  calculateOverallScore(gates) {
    let totalScore = 0;
    let totalWeight = 0;

    Object.values(gates).forEach(gate => {
      totalScore += gate.score * gate.weight;
      totalWeight += gate.weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Generate recommendations based on gate results
   * @param {Object} gates - Gate results
   * @returns {Array} Recommendations
   */
  generateRecommendations(gates) {
    const recommendations = [];

    Object.entries(gates).forEach(([gateName, result]) => {
      if (!result.passed) {
        recommendations.push(`${gateName}: ${result.recommendations?.join(', ') || 'Needs improvement'}`);
      }
    });

    return recommendations;
  }

  /**
   * Identify blocking issues
   * @param {Object} gates - Gate results
   * @returns {Array} Blocking issues
   */
  identifyBlockers(gates) {
    const blockers = [];

    Object.entries(gates).forEach(([gateName, result]) => {
      if (result.score < 0.5) { // Critical failure threshold
        blockers.push({
          gate: gateName,
          issues: result.issues,
          severity: 'critical'
        });
      }
    });

    return blockers;
  }

  /**
   * Get quality gate definitions
   * @returns {Array} Gate definitions
   */
  getGateDefinitions() {
    return this.gates.map(gate => ({
      name: gate.name,
      weight: gate.weight,
      description: this.getGateDescription(gate.name)
    }));
  }

  /**
   * Get gate description
   * @param {string} gateName - Gate name
   * @returns {string} Gate description
   */
  getGateDescription(gateName) {
    const descriptions = {
      'Requirements Validation': 'Ensures all requirements are clearly defined and traceable',
      'Architecture Review': 'Validates architectural decisions and technology choices',
      'Security Assessment': 'Ensures security considerations are properly addressed',
      'Performance Validation': 'Validates performance requirements and optimization strategies',
      'Testing Strategy': 'Ensures comprehensive testing approach across all levels',
      'Documentation Review': 'Validates documentation completeness and quality',
      'Risk Assessment': 'Ensures risks are identified and mitigation strategies are in place'
    };

    return descriptions[gateName] || 'Quality gate validation';
  }
}