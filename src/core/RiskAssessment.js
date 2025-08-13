/**
 * Risk Assessment
 * Analyzes and assesses risks in workflow implementation
 */

export class RiskAssessment {
  constructor() {
    this.riskCategories = {
      technical: 'Technical implementation risks',
      timeline: 'Schedule and timing risks', 
      security: 'Security and compliance risks',
      business: 'Business and market risks',
      resource: 'Team and resource risks'
    };

    this.impactLevels = {
      low: { score: 1, description: 'Minor impact on project' },
      medium: { score: 2, description: 'Moderate impact, manageable' },
      high: { score: 3, description: 'Significant impact, requires attention' },
      critical: { score: 4, description: 'Project-threatening impact' }
    };

    this.probabilityLevels = {
      low: { score: 1, description: 'Unlikely to occur' },
      medium: { score: 2, description: 'Possible to occur' },
      high: { score: 3, description: 'Likely to occur' },
      certain: { score: 4, description: 'Will definitely occur' }
    };
  }

  /**
   * Assess risks in workflow
   * @param {Object} workflow - Workflow object
   * @returns {Object} Risk assessment
   */
  async assess(workflow) {
    const risks = {
      technical: this.assessTechnicalRisks(workflow),
      timeline: this.assessTimelineRisks(workflow),
      security: this.assessSecurityRisks(workflow),
      business: this.assessBusinessRisks(workflow),
      resource: this.assessResourceRisks(workflow),
      summary: this.generateRiskSummary([])
    };

    // Flatten all risks for summary
    const allRisks = [
      ...risks.technical,
      ...risks.timeline,
      ...risks.security,
      ...risks.business,
      ...risks.resource
    ];

    risks.summary = this.generateRiskSummary(allRisks);
    risks.mitigation = this.generateMitigationPlan(allRisks);

    return risks;
  }

  /**
   * Assess technical risks
   * @param {Object} workflow - Workflow object
   * @returns {Array} Technical risks
   */
  assessTechnicalRisks(workflow) {
    const risks = [];

    // Complexity risk
    if (workflow.metadata?.complexity > 0.7) {
      risks.push({
        name: 'High Technical Complexity',
        category: 'technical',
        probability: 'high',
        impact: 'high',
        description: 'High system complexity may lead to implementation challenges',
        indicators: ['Complex architecture', 'Multiple integrations', 'Advanced features'],
        mitigation: 'Break down into smaller components, conduct proof-of-concepts'
      });
    }

    // Technology risk
    const newTechnologies = this.identifyNewTechnologies(workflow);
    if (newTechnologies.length > 0) {
      risks.push({
        name: 'New Technology Adoption',
        category: 'technical',
        probability: 'medium',
        impact: 'medium',
        description: 'Adoption of new technologies may cause learning curve delays',
        indicators: newTechnologies,
        mitigation: 'Provide training, create prototypes, use stable versions'
      });
    }

    // Integration risk
    const integrations = this.countIntegrations(workflow);
    if (integrations > 3) {
      risks.push({
        name: 'Multiple External Integrations',
        category: 'technical',
        probability: 'medium',
        impact: 'high',
        description: 'Multiple external integrations increase failure points',
        indicators: [`${integrations} external integrations`],
        mitigation: 'Implement circuit breakers, fallback mechanisms, thorough testing'
      });
    }

    // Performance risk
    if (this.hasPerformanceRequirements(workflow)) {
      risks.push({
        name: 'Performance Requirements',
        category: 'technical',
        probability: 'medium',
        impact: 'high',
        description: 'Strict performance requirements may be challenging to meet',
        indicators: ['Performance-critical features', 'Scalability requirements'],
        mitigation: 'Early performance testing, optimization sprints, monitoring'
      });
    }

    return risks;
  }

  /**
   * Assess timeline risks
   * @param {Object} workflow - Workflow object
   * @returns {Array} Timeline risks
   */
  assessTimelineRisks(workflow) {
    const risks = [];

    // Aggressive timeline
    if (this.hasAggressiveTimeline(workflow)) {
      risks.push({
        name: 'Aggressive Timeline',
        category: 'timeline',
        probability: 'high',
        impact: 'high',
        description: 'Timeline may be too aggressive for scope of work',
        indicators: ['Short duration', 'High complexity', 'Multiple phases'],
        mitigation: 'Reduce scope, parallel development, additional resources'
      });
    }

    // Dependency delays
    const criticalDependencies = this.identifyCriticalDependencies(workflow);
    if (criticalDependencies.length > 0) {
      risks.push({
        name: 'Critical Path Dependencies',
        category: 'timeline',
        probability: 'medium',
        impact: 'high',
        description: 'Dependencies on critical path may cause delays',
        indicators: criticalDependencies,
        mitigation: 'Early engagement with dependencies, parallel work streams'
      });
    }

    // Resource availability
    if (this.hasResourceConstraints(workflow)) {
      risks.push({
        name: 'Resource Availability',
        category: 'timeline',
        probability: 'medium',
        impact: 'medium',
        description: 'Limited resource availability may impact timeline',
        indicators: ['Small team', 'Specialized skills required'],
        mitigation: 'Resource planning, skill development, external contractors'
      });
    }

    return risks;
  }

  /**
   * Assess security risks
   * @param {Object} workflow - Workflow object
   * @returns {Array} Security risks
   */
  assessSecurityRisks(workflow) {
    const risks = [];

    // Security requirements
    if (this.hasSecurityRequirements(workflow)) {
      risks.push({
        name: 'Security Implementation',
        category: 'security',
        probability: 'medium',
        impact: 'critical',
        description: 'Security implementation errors could expose system',
        indicators: ['Authentication required', 'Data protection', 'Compliance needs'],
        mitigation: 'Security review, penetration testing, security training'
      });
    }

    // Data handling
    if (this.handlessensitiveData(workflow)) {
      risks.push({
        name: 'Sensitive Data Handling',
        category: 'security',
        probability: 'medium',
        impact: 'critical',
        description: 'Improper handling of sensitive data could cause breaches',
        indicators: ['User data', 'Payment information', 'Personal data'],
        mitigation: 'Encryption, access controls, data minimization, compliance audit'
      });
    }

    // Third-party security
    const thirdPartyServices = this.identifyThirdPartyServices(workflow);
    if (thirdPartyServices.length > 0) {
      risks.push({
        name: 'Third-Party Security',
        category: 'security',
        probability: 'low',
        impact: 'high',
        description: 'Third-party services may introduce security vulnerabilities',
        indicators: thirdPartyServices,
        mitigation: 'Security assessment of vendors, secure integration practices'
      });
    }

    return risks;
  }

  /**
   * Assess business risks
   * @param {Object} workflow - Workflow object
   * @returns {Array} Business risks
   */
  assessBusinessRisks(workflow) {
    const risks = [];

    // Scope creep
    risks.push({
      name: 'Scope Creep',
      category: 'business',
      probability: 'high',
      impact: 'medium',
      description: 'Requirements may expand during development',
      indicators: ['Evolving requirements', 'Stakeholder changes'],
      mitigation: 'Clear scope definition, change control process, regular reviews'
    });

    // Market changes
    if (this.isMarketSensitive(workflow)) {
      risks.push({
        name: 'Market Changes',
        category: 'business',
        probability: 'medium',
        impact: 'medium',
        description: 'Market conditions may change during development',
        indicators: ['Competitive product', 'Market-driven features'],
        mitigation: 'Regular market analysis, flexible architecture, MVP approach'
      });
    }

    // Stakeholder alignment
    risks.push({
      name: 'Stakeholder Alignment',
      category: 'business',
      probability: 'medium',
      impact: 'medium',
      description: 'Stakeholders may have conflicting priorities',
      indicators: ['Multiple stakeholders', 'Complex requirements'],
      mitigation: 'Regular communication, clear decision-making process'
    });

    return risks;
  }

  /**
   * Assess resource risks
   * @param {Object} workflow - Workflow object
   * @returns {Array} Resource risks
   */
  assessResourceRisks(workflow) {
    const risks = [];

    // Skill gaps
    const requiredSkills = this.identifyRequiredSkills(workflow);
    if (requiredSkills.length > 0) {
      risks.push({
        name: 'Skill Gaps',
        category: 'resource',
        probability: 'medium',
        impact: 'medium',
        description: 'Team may lack required specialized skills',
        indicators: requiredSkills,
        mitigation: 'Training programs, external expertise, mentoring'
      });
    }

    // Team size
    if (this.isTeamTooSmall(workflow)) {
      risks.push({
        name: 'Insufficient Team Size',
        category: 'resource',
        probability: 'medium',
        impact: 'high',
        description: 'Team size may be insufficient for project scope',
        indicators: ['Small team', 'Large scope', 'Tight timeline'],
        mitigation: 'Additional hiring, contractors, scope reduction'
      });
    }

    // Key person dependency
    risks.push({
      name: 'Key Person Dependency',
      category: 'resource',
      probability: 'low',
      impact: 'high',
      description: 'Project may be dependent on key individuals',
      indicators: ['Specialized knowledge', 'Single points of failure'],
      mitigation: 'Knowledge sharing, documentation, cross-training'
    });

    return risks;
  }

  /**
   * Generate risk summary
   * @param {Array} allRisks - All identified risks
   * @returns {Object} Risk summary
   */
  generateRiskSummary(allRisks) {
    const summary = {
      total: allRisks.length,
      byCategory: {},
      byImpact: {},
      byProbability: {},
      riskScore: 0,
      topRisks: []
    };

    // Count by category
    Object.keys(this.riskCategories).forEach(category => {
      summary.byCategory[category] = allRisks.filter(risk => risk.category === category).length;
    });

    // Count by impact
    Object.keys(this.impactLevels).forEach(impact => {
      summary.byImpact[impact] = allRisks.filter(risk => risk.impact === impact).length;
    });

    // Count by probability
    Object.keys(this.probabilityLevels).forEach(probability => {
      summary.byProbability[probability] = allRisks.filter(risk => risk.probability === probability).length;
    });

    // Calculate overall risk score
    summary.riskScore = allRisks.reduce((total, risk) => {
      const impactScore = this.impactLevels[risk.impact]?.score || 1;
      const probabilityScore = this.probabilityLevels[risk.probability]?.score || 1;
      return total + (impactScore * probabilityScore);
    }, 0) / Math.max(allRisks.length, 1);

    // Identify top risks
    summary.topRisks = allRisks
      .map(risk => ({
        ...risk,
        riskScore: (this.impactLevels[risk.impact]?.score || 1) * (this.probabilityLevels[risk.probability]?.score || 1)
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    return summary;
  }

  /**
   * Generate mitigation plan
   * @param {Array} allRisks - All identified risks
   * @returns {Object} Mitigation plan
   */
  generateMitigationPlan(allRisks) {
    const plan = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      monitoring: []
    };

    allRisks.forEach(risk => {
      const riskScore = (this.impactLevels[risk.impact]?.score || 1) * (this.probabilityLevels[risk.probability]?.score || 1);
      
      if (riskScore >= 9) {
        plan.immediate.push({
          risk: risk.name,
          action: risk.mitigation,
          priority: 'critical'
        });
      } else if (riskScore >= 6) {
        plan.shortTerm.push({
          risk: risk.name,
          action: risk.mitigation,
          priority: 'high'
        });
      } else {
        plan.longTerm.push({
          risk: risk.name,
          action: risk.mitigation,
          priority: 'medium'
        });
      }

      // Add monitoring for all risks
      plan.monitoring.push({
        risk: risk.name,
        indicators: risk.indicators || [],
        frequency: riskScore >= 6 ? 'weekly' : 'monthly'
      });
    });

    return plan;
  }

  // Helper methods for risk identification
  identifyNewTechnologies(workflow) {
    const newTech = [];
    // This would analyze workflow for cutting-edge or unfamiliar technologies
    // For now, return empty array
    return newTech;
  }

  countIntegrations(workflow) {
    let count = 0;
    if (workflow.phases) {
      workflow.phases.forEach(phase => {
        if (phase.tasks) {
          count += phase.tasks.filter(task => 
            task.type === 'integration' || 
            task.title.toLowerCase().includes('integrate')
          ).length;
        }
      });
    }
    return count;
  }

  hasPerformanceRequirements(workflow) {
    const performanceKeywords = ['performance', 'speed', 'fast', 'optimization', 'scalability'];
    const workflowStr = JSON.stringify(workflow).toLowerCase();
    return performanceKeywords.some(keyword => workflowStr.includes(keyword));
  }

  hasAggressiveTimeline(workflow) {
    if (!workflow.metadata?.estimatedDuration) return false;
    const duration = workflow.metadata.estimatedDuration.toLowerCase();
    return duration.includes('week') && parseInt(duration) <= 4;
  }

  identifyCriticalDependencies(workflow) {
    const dependencies = [];
    // This would analyze workflow for critical path dependencies
    return dependencies;
  }

  hasResourceConstraints(workflow) {
    // Analyze workflow for resource constraint indicators
    return false;
  }

  hasSecurityRequirements(workflow) {
    const securityKeywords = ['auth', 'security', 'encrypt', 'privacy', 'compliance'];
    const workflowStr = JSON.stringify(workflow).toLowerCase();
    return securityKeywords.some(keyword => workflowStr.includes(keyword));
  }

  handlessensitiveData(workflow) {
    const dataKeywords = ['user data', 'payment', 'personal', 'pii', 'financial'];
    const workflowStr = JSON.stringify(workflow).toLowerCase();
    return dataKeywords.some(keyword => workflowStr.includes(keyword));
  }

  identifyThirdPartyServices(workflow) {
    const services = [];
    // This would analyze workflow for third-party service usage
    return services;
  }

  isMarketSensitive(workflow) {
    const marketKeywords = ['competitive', 'market', 'customer-facing', 'public'];
    const workflowStr = JSON.stringify(workflow).toLowerCase();
    return marketKeywords.some(keyword => workflowStr.includes(keyword));
  }

  identifyRequiredSkills(workflow) {
    const skills = [];
    // This would analyze workflow for specialized skill requirements
    return skills;
  }

  isTeamTooSmall(workflow) {
    // Analyze if team size is insufficient for scope
    return false;
  }
}