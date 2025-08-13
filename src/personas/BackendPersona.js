/**
 * Backend Persona
 * Reliability engineer, API specialist, data integrity focus
 */

import { BasePersona } from './BasePersona.js';

export class BackendPersona extends BasePersona {
  constructor() {
    super('backend', {
      priorityHierarchy: ['Reliability', 'Security', 'Performance', 'Features', 'Convenience'],
      mcpPreferences: {
        primary: 'Context7',
        secondary: 'Sequential',
        avoided: 'Magic'
      },
      optimizedCommands: ['/build --api', '/git'],
      qualityStandards: {
        reliability: '99.9% uptime with graceful degradation',
        security: 'Defense in depth with zero trust architecture',
        dataIntegrity: 'ACID compliance and consistency guarantees'
      },
      reliabilityBudgets: {
        uptime: '99.9% (8.7h/year downtime)',
        errorRate: '<0.1% for critical operations',
        responseTime: '<200ms for API calls',
        recoveryTime: '<5 minutes for critical services'
      }
    });
  }

  /**
   * Generate backend-specific systematic workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Array} Workflow phases
   */
  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createAPIDesignPhase(requirements),
      await this.createDatabaseDesignPhase(requirements),
      await this.createSecurityImplementationPhase(requirements),
      await this.createServiceImplementationPhase(requirements),
      await this.createIntegrationPhase(requirements),
      await this.createPerformanceOptimizationPhase(requirements),
      await this.createMonitoringPhase(requirements),
      await this.createDeploymentPhase(requirements)
    ].filter(phase => phase && phase.tasks.length > 0);
  }

  /**
   * Create API design phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createAPIDesignPhase(requirements) {
    return {
      name: 'API Design & Specification',
      type: 'api-design',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'design',
          title: 'API specification design',
          description: 'Design RESTful API endpoints and data contracts',
          deliverables: ['OpenAPI specification', 'API documentation'],
          tools: ['OpenAPI', 'Swagger', 'Postman'],
          estimatedHours: 12
        },
        {
          type: 'design',
          title: 'Data model design',
          description: 'Design request/response schemas and validation rules',
          deliverables: ['Data schemas', 'Validation specifications'],
          estimatedHours: 8
        },
        {
          type: 'design',
          title: 'Authentication & authorization design',
          description: 'Design API security and access control mechanisms',
          deliverables: ['Auth specification', 'Security policies'],
          tools: ['JWT', 'OAuth 2.0', 'API Keys'],
          estimatedHours: 10
        },
        {
          type: 'design',
          title: 'Error handling design',
          description: 'Design consistent error responses and status codes',
          deliverables: ['Error handling specification', 'Status code mapping'],
          estimatedHours: 4
        },
        {
          type: 'design',
          title: 'Rate limiting & throttling design',
          description: 'Design API rate limiting and abuse protection',
          deliverables: ['Rate limiting specification', 'Throttling policies'],
          estimatedHours: 3
        }
      ]
    };
  }

  /**
   * Create database design phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createDatabaseDesignPhase(requirements) {
    return {
      name: 'Database Design & Architecture',
      type: 'database',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'design',
          title: 'Database schema design',
          description: 'Design normalized database schema and relationships',
          deliverables: ['Database schema', 'Entity relationship diagram'],
          tools: ['PostgreSQL', 'MySQL', 'MongoDB'],
          estimatedHours: 16
        },
        {
          type: 'design',
          title: 'Data migration strategy',
          description: 'Design data migration and versioning strategy',
          deliverables: ['Migration scripts', 'Version control strategy'],
          estimatedHours: 6
        },
        {
          type: 'design',
          title: 'Database performance optimization',
          description: 'Design indexing strategy and query optimization',
          deliverables: ['Index strategy', 'Query optimization plan'],
          estimatedHours: 8
        },
        {
          type: 'design',
          title: 'Backup & recovery strategy',
          description: 'Design backup, recovery, and disaster recovery procedures',
          deliverables: ['Backup strategy', 'Recovery procedures'],
          estimatedHours: 4
        },
        {
          type: 'implement',
          title: 'Database setup & configuration',
          description: 'Set up database infrastructure and configurations',
          deliverables: ['Database infrastructure', 'Configuration files'],
          estimatedHours: 5
        }
      ]
    };
  }

  /**
   * Create security implementation phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createSecurityImplementationPhase(requirements) {
    return {
      name: 'Security Implementation',
      type: 'security',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'implement',
          title: 'Authentication system implementation',
          description: 'Implement user authentication and session management',
          deliverables: ['Authentication service', 'Session management'],
          tools: ['Passport.js', 'bcrypt', 'JWT'],
          estimatedHours: 12
        },
        {
          type: 'implement',
          title: 'Authorization & access control',
          description: 'Implement role-based access control and permissions',
          deliverables: ['Authorization middleware', 'Permission system'],
          estimatedHours: 10
        },
        {
          type: 'implement',
          title: 'Input validation & sanitization',
          description: 'Implement comprehensive input validation and sanitization',
          deliverables: ['Validation middleware', 'Sanitization functions'],
          tools: ['Joi', 'express-validator', 'DOMPurify'],
          estimatedHours: 8
        },
        {
          type: 'implement',
          title: 'Security headers & middleware',
          description: 'Implement security headers and protective middleware',
          deliverables: ['Security middleware', 'Headers configuration'],
          tools: ['helmet', 'cors', 'express-rate-limit'],
          estimatedHours: 4
        },
        {
          type: 'implement',
          title: 'Encryption & data protection',
          description: 'Implement data encryption and secure storage',
          deliverables: ['Encryption utilities', 'Secure storage'],
          tools: ['crypto', 'bcrypt', 'node-forge'],
          estimatedHours: 6
        }
      ]
    };
  }

  /**
   * Create service implementation phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createServiceImplementationPhase(requirements) {
    const services = this.extractServices(requirements);
    
    return {
      name: 'Service Implementation',
      type: 'implementation',
      duration: '2-4 weeks',
      tasks: [
        {
          type: 'setup',
          title: 'Project structure & dependencies',
          description: 'Set up project structure and install dependencies',
          deliverables: ['Project structure', 'Package configuration'],
          estimatedHours: 4
        },
        {
          type: 'implement',
          title: 'Core service layer implementation',
          description: 'Implement business logic and service layer',
          deliverables: ['Service classes', 'Business logic'],
          estimatedHours: 20
        },
        {
          type: 'implement',
          title: 'Data access layer implementation',
          description: 'Implement database repositories and data access',
          deliverables: ['Repository pattern', 'Data access layer'],
          tools: ['Sequelize', 'TypeORM', 'Mongoose'],
          estimatedHours: 16
        },
        ...services.slice(0, 5).map(service => ({
          type: 'implement',
          title: `Implement ${service} service`,
          description: `Implement ${service} service with full CRUD operations`,
          deliverables: [`${service} service`, 'API endpoints', 'Unit tests'],
          estimatedHours: this.estimateServiceHours(service)
        })),
        {
          type: 'implement',
          title: 'Error handling & logging',
          description: 'Implement centralized error handling and logging',
          deliverables: ['Error middleware', 'Logging system'],
          tools: ['winston', 'morgan', 'sentry'],
          estimatedHours: 6
        }
      ]
    };
  }

  /**
   * Create integration phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createIntegrationPhase(requirements) {
    const integrations = requirements.integrations || [];
    
    if (integrations.length === 0) return null;
    
    return {
      name: 'External Integrations',
      type: 'integration',
      duration: '1-2 weeks',
      tasks: [
        {
          type: 'design',
          title: 'Integration architecture design',
          description: 'Design integration patterns and error handling',
          deliverables: ['Integration architecture', 'Error handling strategy'],
          estimatedHours: 6
        },
        ...integrations.slice(0, 3).map(integration => ({
          type: 'implement',
          title: `Implement ${integration} integration`,
          description: `Integrate with ${integration} service`,
          deliverables: [`${integration} client`, 'Integration tests'],
          estimatedHours: 8
        })),
        {
          type: 'implement',
          title: 'Circuit breaker implementation',
          description: 'Implement circuit breaker pattern for external services',
          deliverables: ['Circuit breaker middleware', 'Fallback mechanisms'],
          tools: ['node-circuit-breaker'],
          estimatedHours: 4
        }
      ]
    };
  }

  /**
   * Create performance optimization phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createPerformanceOptimizationPhase(requirements) {
    return {
      name: 'Performance Optimization',
      type: 'performance',
      duration: '1 week',
      tasks: [
        {
          type: 'implement',
          title: 'Caching implementation',
          description: 'Implement multi-level caching strategy',
          deliverables: ['Caching layer', 'Cache invalidation'],
          tools: ['Redis', 'node-cache', 'memcached'],
          estimatedHours: 8
        },
        {
          type: 'optimize',
          title: 'Database query optimization',
          description: 'Optimize database queries and add proper indexing',
          deliverables: ['Optimized queries', 'Database indexes'],
          estimatedHours: 6
        },
        {
          type: 'implement',
          title: 'Connection pooling',
          description: 'Implement database connection pooling',
          deliverables: ['Connection pool configuration'],
          estimatedHours: 2
        },
        {
          type: 'implement',
          title: 'Response compression',
          description: 'Implement response compression and optimization',
          deliverables: ['Compression middleware'],
          tools: ['compression', 'gzip'],
          estimatedHours: 2
        },
        {
          type: 'test',
          title: 'Performance testing',
          description: 'Conduct load testing and performance benchmarking',
          deliverables: ['Performance test results', 'Benchmarks'],
          tools: ['Artillery', 'k6', 'Apache Bench'],
          estimatedHours: 4
        }
      ]
    };
  }

  /**
   * Create monitoring phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createMonitoringPhase(requirements) {
    return {
      name: 'Monitoring & Observability',
      type: 'monitoring',
      duration: '3-5 days',
      tasks: [
        {
          type: 'implement',
          title: 'Application monitoring setup',
          description: 'Set up application performance monitoring',
          deliverables: ['APM configuration', 'Performance dashboards'],
          tools: ['New Relic', 'DataDog', 'AppDynamics'],
          estimatedHours: 4
        },
        {
          type: 'implement',
          title: 'Health check endpoints',
          description: 'Implement health check and status endpoints',
          deliverables: ['Health check endpoints', 'Status monitoring'],
          estimatedHours: 3
        },
        {
          type: 'implement',
          title: 'Structured logging implementation',
          description: 'Implement structured logging with correlation IDs',
          deliverables: ['Logging configuration', 'Log aggregation'],
          tools: ['winston', 'bunyan', 'ELK stack'],
          estimatedHours: 5
        },
        {
          type: 'implement',
          title: 'Alerting & notifications',
          description: 'Set up alerting for critical issues and performance thresholds',
          deliverables: ['Alert configuration', 'Notification setup'],
          tools: ['PagerDuty', 'Slack', 'Email'],
          estimatedHours: 3
        }
      ]
    };
  }

  /**
   * Create deployment phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createDeploymentPhase(requirements) {
    return {
      name: 'Deployment & Infrastructure',
      type: 'deployment',
      duration: '1 week',
      tasks: [
        {
          type: 'setup',
          title: 'Environment configuration',
          description: 'Configure development, staging, and production environments',
          deliverables: ['Environment configs', 'Infrastructure as code'],
          tools: ['Docker', 'Terraform', 'Ansible'],
          estimatedHours: 8
        },
        {
          type: 'implement',
          title: 'CI/CD pipeline setup',
          description: 'Set up continuous integration and deployment pipeline',
          deliverables: ['CI/CD pipeline', 'Automated deployment'],
          tools: ['GitHub Actions', 'Jenkins', 'GitLab CI'],
          estimatedHours: 6
        },
        {
          type: 'implement',
          title: 'Database deployment strategy',
          description: 'Implement database migration and deployment strategy',
          deliverables: ['Migration scripts', 'Deployment procedures'],
          estimatedHours: 4
        },
        {
          type: 'setup',
          title: 'Production deployment',
          description: 'Deploy application to production environment',
          deliverables: ['Production deployment', 'Rollback procedures'],
          estimatedHours: 3
        }
      ]
    };
  }

  /**
   * Extract services from requirements
   * @param {Object} requirements - Requirements object
   * @returns {Array} List of services
   */
  extractServices(requirements) {
    const services = new Set();
    const text = JSON.stringify(requirements).toLowerCase();
    
    // Common service patterns
    const servicePatterns = [
      'user', 'auth', 'payment', 'order', 'product', 'inventory',
      'notification', 'email', 'file', 'image', 'search', 'analytics',
      'report', 'admin', 'customer', 'billing', 'subscription'
    ];
    
    for (const pattern of servicePatterns) {
      if (text.includes(pattern)) {
        services.add(pattern);
      }
    }
    
    // Add services from features
    if (requirements.features) {
      requirements.features.forEach(feature => {
        const featureName = feature.name.toLowerCase();
        if (featureName.includes('service') || featureName.includes('api')) {
          services.add(featureName.replace(/service|api/g, '').trim());
        }
      });
    }
    
    return Array.from(services);
  }

  /**
   * Estimate hours for service implementation
   * @param {string} service - Service name
   * @returns {number} Estimated hours
   */
  estimateServiceHours(service) {
    const complexServices = ['payment', 'auth', 'search', 'analytics', 'notification'];
    const simpleServices = ['user', 'product', 'file', 'image'];
    
    if (complexServices.includes(service.toLowerCase())) {
      return 16;
    } else if (simpleServices.includes(service.toLowerCase())) {
      return 8;
    }
    
    return 12; // Default estimate
  }

  /**
   * Get backend-specific best practices
   * @returns {Array} Best practices
   */
  getBestPractices() {
    return [
      'Implement proper error handling and logging',
      'Use connection pooling for database connections',
      'Implement comprehensive input validation',
      'Follow RESTful API design principles',
      'Use proper HTTP status codes and responses',
      'Implement rate limiting and request throttling',
      'Use database transactions for data consistency',
      'Implement proper authentication and authorization',
      'Use environment variables for configuration',
      'Implement health checks and monitoring endpoints',
      'Follow the principle of least privilege',
      'Implement proper backup and recovery procedures'
    ];
  }

  /**
   * Get backend-specific quality gates
   * @returns {Array} Quality gates
   */
  getQualityGates() {
    return [
      'API specification compliance check',
      'Security vulnerability assessment',
      'Database integrity validation',
      'Performance benchmark validation',
      'Error handling completeness check',
      'Authentication and authorization test',
      'Data validation and sanitization test',
      'Load testing and stress testing',
      'Backup and recovery testing',
      'Monitoring and alerting validation'
    ];
  }

  /**
   * Enhance workflow with backend-specific improvements
   * @param {Object} workflow - Base workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Object} Enhanced workflow
   */
  enhanceWorkflow(workflow, requirements, options) {
    const enhanced = super.enhanceWorkflow(workflow, requirements, options);
    
    // Add backend-specific enhancements
    enhanced.reliabilityTargets = this.config.reliabilityBudgets;
    enhanced.securityRequirements = {
      authentication: 'JWT or OAuth 2.0 implementation',
      authorization: 'Role-based access control',
      dataProtection: 'Encryption at rest and in transit',
      inputValidation: 'Comprehensive input sanitization',
      securityHeaders: 'Proper security headers implementation'
    };
    enhanced.performanceTargets = {
      responseTime: '<200ms for API endpoints',
      throughput: '>1000 requests/second',
      errorRate: '<0.1% for critical operations',
      availability: '99.9% uptime'
    };
    enhanced.operationalRequirements = {
      monitoring: 'Comprehensive APM and logging',
      healthChecks: 'Health and readiness endpoints',
      backups: 'Automated backup and recovery',
      deployment: 'Zero-downtime deployment capability'
    };
    
    return enhanced;
  }
}