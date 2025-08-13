/**
 * Output Formatter
 * Formats workflow data into different output formats (roadmap, tasks, detailed)
 */

export class OutputFormatter {
  constructor() {
    this.formatters = {
      roadmap: this.formatRoadmap.bind(this),
      tasks: this.formatTasks.bind(this),
      detailed: this.formatDetailed.bind(this)
    };
  }

  /**
   * Format workflow into specified output format
   * @param {Object} workflow - Workflow object
   * @param {string} format - Output format (roadmap, tasks, detailed)
   * @returns {string} Formatted output
   */
  format(workflow, format = 'roadmap') {
    const formatter = this.formatters[format];
    
    if (!formatter) {
      throw new Error(`Unknown output format: ${format}`);
    }
    
    return formatter(workflow);
  }

  /**
   * Format workflow as roadmap
   * @param {Object} workflow - Workflow object
   * @returns {string} Roadmap format
   */
  formatRoadmap(workflow) {
    let output = this.generateHeader(workflow, 'Roadmap');
    
    workflow.phases.forEach((phase, index) => {
      output += `## Phase ${index + 1}: ${phase.name}`;
      
      if (phase.duration) {
        output += ` (${phase.duration})`;
      }
      
      output += '\n\n';
      
      if (phase.tasks && phase.tasks.length > 0) {
        phase.tasks.forEach(task => {
          output += `- [ ] ${task.title}\n`;
          if (task.description) {
            output += `  - ${task.description}\n`;
          }
        });
        output += '\n';
      }
    });
    
    // Add metadata
    if (workflow.metadata) {
      output += this.formatMetadata(workflow.metadata);
    }
    
    // Add recommendations
    if (workflow.mcpRecommendations) {
      output += this.formatMCPRecommendations(workflow.mcpRecommendations);
    }
    
    return output;
  }

  /**
   * Format workflow as tasks
   * @param {Object} workflow - Workflow object
   * @returns {string} Tasks format
   */
  formatTasks(workflow) {
    let output = this.generateHeader(workflow, 'Tasks');
    
    workflow.phases.forEach(phase => {
      output += `## Epic: ${phase.name}\n\n`;
      
      // Group tasks by type if possible
      const taskGroups = this.groupTasksByType(phase.tasks || []);
      
      Object.entries(taskGroups).forEach(([type, tasks]) => {
        if (tasks.length > 0) {
          output += `### Story: ${this.capitalizeFirst(type)}\n`;
          
          tasks.forEach(task => {
            output += `- [ ] ${task.title}\n`;
            if (task.description) {
              output += `  - ${task.description}\n`;
            }
            if (task.priority) {
              output += `  - Priority: ${task.priority}\n`;
            }
            if (task.estimatedHours) {
              output += `  - Estimated: ${task.estimatedHours}h\n`;
            }
          });
          output += '\n';
        }
      });
    });
    
    // Add acceptance criteria if available
    if (workflow.acceptanceCriteria) {
      output += this.formatAcceptanceCriteria(workflow.acceptanceCriteria);
    }
    
    return output;
  }

  /**
   * Format workflow as detailed implementation guide
   * @param {Object} workflow - Workflow object
   * @returns {string} Detailed format
   */
  formatDetailed(workflow) {
    let output = this.generateHeader(workflow, 'Detailed Implementation Workflow');
    
    workflow.phases.forEach((phase, phaseIndex) => {
      output += `## Phase ${phaseIndex + 1}: ${phase.name}\n\n`;
      
      if (phase.description) {
        output += `${phase.description}\n\n`;
      }
      
      if (phase.duration) {
        output += `**Duration:** ${phase.duration}\n`;
      }
      
      if (phase.type) {
        output += `**Type:** ${phase.type}\n`;
      }
      
      output += '\n';
      
      if (phase.tasks && phase.tasks.length > 0) {
        phase.tasks.forEach((task, taskIndex) => {
          output += `### Task ${phaseIndex + 1}.${taskIndex + 1}: ${task.title}\n\n`;
          
          // Task metadata
          if (workflow.persona) {
            output += `**Persona:** ${this.capitalizeFirst(workflow.persona)}\n`;
          }
          
          if (task.estimatedHours) {
            output += `**Estimated Time:** ${task.estimatedHours} hours\n`;
          }
          
          if (task.dependencies && task.dependencies.length > 0) {
            output += `**Dependencies:** ${task.dependencies.join(', ')}\n`;
          }
          
          if (task.tools && task.tools.length > 0) {
            output += `**Tools:** ${task.tools.join(', ')}\n`;
          }
          
          output += '\n';
          
          // Task description
          if (task.description) {
            output += `${task.description}\n\n`;
          }
          
          // Implementation steps
          if (task.steps) {
            output += '#### Implementation Steps:\n';
            task.steps.forEach((step, stepIndex) => {
              output += `${stepIndex + 1}. **${step.title}** (${step.duration || 'TBD'})\n`;
              if (step.description) {
                output += `   - ${step.description}\n`;
              }
            });
            output += '\n';
          }
          
          // Deliverables
          if (task.deliverables && task.deliverables.length > 0) {
            output += '#### Deliverables:\n';
            task.deliverables.forEach(deliverable => {
              output += `- ${deliverable}\n`;
            });
            output += '\n';
          }
          
          // Acceptance criteria
          if (task.acceptanceCriteria && task.acceptanceCriteria.length > 0) {
            output += '#### Acceptance Criteria:\n';
            task.acceptanceCriteria.forEach(criterion => {
              output += `- [ ] ${criterion}\n`;
            });
            output += '\n';
          }
          
          output += '---\n\n';
        });
      }
    });
    
    // Add quality gates
    if (workflow.qualityGates) {
      output += this.formatQualityGates(workflow.qualityGates);
    }
    
    // Add best practices
    if (workflow.bestPractices) {
      output += this.formatBestPractices(workflow.bestPractices);
    }
    
    // Add dependencies if available
    if (workflow.dependencies) {
      output += this.formatDependencies(workflow.dependencies);
    }
    
    // Add risks if available
    if (workflow.risks) {
      output += this.formatRisks(workflow.risks);
    }
    
    return output;
  }

  /**
   * Generate common header for all formats
   * @param {Object} workflow - Workflow object
   * @param {string} subtitle - Format-specific subtitle
   * @returns {string} Header content
   */
  generateHeader(workflow, subtitle) {
    let header = `# ${workflow.title || 'Implementation Workflow'}\n\n`;
    
    if (subtitle) {
      header += `## ${subtitle}\n\n`;
    }
    
    // Add workflow metadata
    if (workflow.strategy) {
      header += `**Strategy:** ${this.capitalizeFirst(workflow.strategy)}\n`;
    }
    
    if (workflow.persona) {
      header += `**Persona:** ${this.capitalizeFirst(workflow.persona)}\n`;
    }
    
    if (workflow.metadata) {
      if (workflow.metadata.estimatedDuration) {
        header += `**Estimated Duration:** ${workflow.metadata.estimatedDuration}\n`;
      }
      
      if (workflow.metadata.complexity) {
        header += `**Complexity:** ${this.formatComplexity(workflow.metadata.complexity)}\n`;
      }
      
      if (workflow.metadata.riskLevel) {
        header += `**Risk Level:** ${this.capitalizeFirst(workflow.metadata.riskLevel)}\n`;
      }
    }
    
    header += '\n';
    
    // Add overview if available
    if (workflow.overview) {
      header += `## Overview\n\n${workflow.overview}\n\n`;
    }
    
    return header;
  }

  /**
   * Group tasks by type
   * @param {Array} tasks - Array of tasks
   * @returns {Object} Tasks grouped by type
   */
  groupTasksByType(tasks) {
    const groups = {};
    
    tasks.forEach(task => {
      const type = task.type || 'general';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(task);
    });
    
    return groups;
  }

  /**
   * Format metadata section
   * @param {Object} metadata - Metadata object
   * @returns {string} Formatted metadata
   */
  formatMetadata(metadata) {
    let output = '## Project Metadata\n\n';
    
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        output += `**${this.capitalizeFirst(key)}:** ${value}\n`;
      }
    });
    
    return output + '\n';
  }

  /**
   * Format MCP recommendations
   * @param {Object} recommendations - MCP recommendations
   * @returns {string} Formatted recommendations
   */
  formatMCPRecommendations(recommendations) {
    let output = '## MCP Server Recommendations\n\n';
    
    if (recommendations.primary) {
      output += `**Primary:** ${recommendations.primary}\n`;
    }
    
    if (recommendations.secondary) {
      output += `**Secondary:** ${recommendations.secondary}\n`;
    }
    
    if (recommendations.avoided) {
      output += `**Avoided:** ${recommendations.avoided}\n`;
    }
    
    if (recommendations.rationale) {
      output += `**Rationale:** ${recommendations.rationale}\n`;
    }
    
    return output + '\n';
  }

  /**
   * Format quality gates
   * @param {Array} qualityGates - Quality gates array
   * @returns {string} Formatted quality gates
   */
  formatQualityGates(qualityGates) {
    let output = '## Quality Gates\n\n';
    
    qualityGates.forEach(gate => {
      output += `- [ ] ${gate}\n`;
    });
    
    return output + '\n';
  }

  /**
   * Format best practices
   * @param {Array} bestPractices - Best practices array
   * @returns {string} Formatted best practices
   */
  formatBestPractices(bestPractices) {
    let output = '## Best Practices\n\n';
    
    bestPractices.forEach(practice => {
      output += `- ${practice}\n`;
    });
    
    return output + '\n';
  }

  /**
   * Format dependencies
   * @param {Array} dependencies - Dependencies array
   * @returns {string} Formatted dependencies
   */
  formatDependencies(dependencies) {
    let output = '## Dependencies\n\n';
    
    dependencies.forEach(dependency => {
      output += `### ${dependency.name}\n`;
      output += `- **Type:** ${dependency.type}\n`;
      if (dependency.critical) {
        output += `- **Critical:** Yes\n`;
      }
      if (dependency.description) {
        output += `- **Description:** ${dependency.description}\n`;
      }
      output += '\n';
    });
    
    return output;
  }

  /**
   * Format risks
   * @param {Array} risks - Risks array
   * @returns {string} Formatted risks
   */
  formatRisks(risks) {
    let output = '## Risk Assessment\n\n';
    
    risks.forEach(risk => {
      output += `### ${risk.name}\n`;
      output += `- **Probability:** ${risk.probability}\n`;
      output += `- **Impact:** ${risk.impact}\n`;
      if (risk.mitigation) {
        output += `- **Mitigation:** ${risk.mitigation}\n`;
      }
      output += '\n';
    });
    
    return output;
  }

  /**
   * Format acceptance criteria
   * @param {Array} criteria - Acceptance criteria array
   * @returns {string} Formatted acceptance criteria
   */
  formatAcceptanceCriteria(criteria) {
    let output = '## Acceptance Criteria\n\n';
    
    criteria.forEach(criterion => {
      output += `- [ ] ${criterion.description || criterion}\n`;
    });
    
    return output + '\n';
  }

  /**
   * Format complexity score
   * @param {number} complexity - Complexity score (0-1)
   * @returns {string} Formatted complexity
   */
  formatComplexity(complexity) {
    if (complexity >= 0.8) return 'High';
    if (complexity >= 0.5) return 'Medium';
    if (complexity >= 0.2) return 'Low';
    return 'Very Low';
  }

  /**
   * Capitalize first letter of string
   * @param {string} str - Input string
   * @returns {string} Capitalized string
   */
  capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get available output formats
   * @returns {Array} Available formats
   */
  getAvailableFormats() {
    return Object.keys(this.formatters);
  }

  /**
   * Validate output format
   * @param {string} format - Format to validate
   * @returns {boolean} Whether format is valid
   */
  isValidFormat(format) {
    return this.formatters.hasOwnProperty(format);
  }
}