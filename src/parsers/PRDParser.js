/**
 * PRD Parser
 * Parses Product Requirements Documents and feature descriptions
 */

import { readFile } from 'fs/promises';
import { marked } from 'marked';

export class PRDParser {
  constructor() {
    this.sectionPatterns = {
      overview: /(?:overview|summary|description)/i,
      features: /(?:features|functionality|requirements)/i,
      userStories: /(?:user stories|stories|scenarios)/i,
      acceptance: /(?:acceptance criteria|acceptance|criteria)/i,
      technical: /(?:technical requirements|technical specs|architecture)/i,
      constraints: /(?:constraints|limitations|assumptions)/i,
      timeline: /(?:timeline|schedule|milestones)/i,
      resources: /(?:resources|team|budget)/i
    };
  }

  /**
   * Parse PRD from file
   * @param {string} filePath - Path to PRD file
   * @returns {Object} Parsed PRD structure
   */
  async parseFile(filePath) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const fileType = this.detectFileType(filePath);
      
      switch (fileType) {
        case 'markdown':
          return this.parseMarkdown(content);
        case 'text':
          return this.parseText(content);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      throw new Error(`Failed to parse PRD file: ${error.message}`);
    }
  }

  /**
   * Parse feature description
   * @param {string} description - Feature description text
   * @returns {Object} Parsed requirements structure
   */
  parseDescription(description) {
    return {
      title: this.extractTitle(description),
      overview: description,
      features: this.extractFeatures(description),
      components: this.extractComponents(description),
      integrations: this.extractIntegrations(description),
      userRoles: this.extractUserRoles(description),
      pages: this.extractPages(description),
      complexity: this.analyzeComplexity(description),
      domains: this.extractDomains(description),
      patterns: this.extractPatterns(description),
      requirements: this.extractRequirements(description),
      acceptanceCriteria: this.extractAcceptanceCriteria(description),
      timeline: this.extractTimeline(description),
      resources: this.extractResources(description)
    };
  }

  /**
   * Detect file type from extension
   * @param {string} filePath - File path
   * @returns {string} File type
   */
  detectFileType(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'md':
      case 'markdown':
        return 'markdown';
      case 'txt':
        return 'text';
      default:
        return 'unknown';
    }
  }

  /**
   * Parse markdown content
   * @param {string} content - Markdown content
   * @returns {Object} Parsed structure
   */
  parseMarkdown(content) {
    const tokens = marked.lexer(content);
    const sections = this.extractSections(tokens);
    
    return {
      title: this.findTitle(tokens),
      overview: sections.overview || '',
      features: this.parseFeaturesList(sections.features),
      userStories: this.parseUserStories(sections.userStories),
      acceptanceCriteria: this.parseAcceptanceCriteria(sections.acceptance),
      technicalRequirements: this.parseTechnicalRequirements(sections.technical),
      constraints: this.parseConstraints(sections.constraints),
      timeline: this.parseTimeline(sections.timeline),
      resources: this.parseResources(sections.resources),
      components: this.extractComponents(content),
      integrations: this.extractIntegrations(content),
      userRoles: this.extractUserRoles(content),
      pages: this.extractPages(content),
      complexity: this.analyzeComplexity(content),
      domains: this.extractDomains(content),
      patterns: this.extractPatterns(content),
      requirements: this.extractRequirements(content)
    };
  }

  /**
   * Parse plain text content
   * @param {string} content - Text content
   * @returns {Object} Parsed structure
   */
  parseText(content) {
    return this.parseDescription(content);
  }

  /**
   * Extract sections from markdown tokens
   * @param {Array} tokens - Markdown tokens
   * @returns {Object} Sections object
   */
  extractSections(tokens) {
    const sections = {};
    let currentSection = null;
    let currentContent = [];

    for (const token of tokens) {
      if (token.type === 'heading') {
        // Save previous section
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n');
        }
        
        // Start new section
        currentSection = this.identifySection(token.text);
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(token.raw);
      }
    }

    // Save last section
    if (currentSection) {
      sections[currentSection] = currentContent.join('\n');
    }

    return sections;
  }

  /**
   * Identify section type from heading text
   * @param {string} headingText - Heading text
   * @returns {string} Section type
   */
  identifySection(headingText) {
    const text = headingText.toLowerCase();
    
    for (const [section, pattern] of Object.entries(this.sectionPatterns)) {
      if (pattern.test(text)) {
        return section;
      }
    }
    
    return 'other';
  }

  /**
   * Find document title
   * @param {Array} tokens - Markdown tokens
   * @returns {string} Document title
   */
  findTitle(tokens) {
    const firstHeading = tokens.find(token => token.type === 'heading' && token.depth === 1);
    return firstHeading ? firstHeading.text : 'Untitled Project';
  }

  /**
   * Extract title from description
   * @param {string} description - Description text
   * @returns {string} Extracted title
   */
  extractTitle(description) {
    const lines = description.split('\n');
    const firstLine = lines[0].trim();
    
    // Look for title patterns
    if (firstLine.length < 100 && !firstLine.includes('.')) {
      return firstLine;
    }
    
    // Generate title from first sentence
    const firstSentence = description.split('.')[0].trim();
    if (firstSentence.length < 50) {
      return firstSentence;
    }
    
    return 'Feature Implementation';
  }

  /**
   * Parse features list
   * @param {string} content - Features section content
   * @returns {Array} List of features
   */
  parseFeaturesList(content) {
    if (!content) return [];
    
    const features = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
        const feature = trimmed.replace(/^[-*\d\.\s]+/, '').trim();
        if (feature) {
          features.push({
            name: feature,
            priority: this.extractPriority(feature),
            complexity: this.extractComplexity(feature)
          });
        }
      }
    }
    
    return features;
  }

  /**
   * Parse user stories
   * @param {string} content - User stories section content
   * @returns {Array} List of user stories
   */
  parseUserStories(content) {
    if (!content) return [];
    
    const stories = [];
    const storyPattern = /As a (.*?), I want (.*?) so that (.*?)[.\n]/gi;
    let match;
    
    while ((match = storyPattern.exec(content)) !== null) {
      stories.push({
        role: match[1].trim(),
        want: match[2].trim(),
        benefit: match[3].trim(),
        priority: 'medium'
      });
    }
    
    // Fallback: extract from bullet points
    if (stories.length === 0) {
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const story = trimmed.replace(/^[-*\s]+/, '').trim();
          if (story) {
            stories.push({
              description: story,
              priority: 'medium'
            });
          }
        }
      }
    }
    
    return stories;
  }

  /**
   * Parse acceptance criteria
   * @param {string} content - Acceptance criteria section content
   * @returns {Array} List of acceptance criteria
   */
  parseAcceptanceCriteria(content) {
    if (!content) return [];
    
    const criteria = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
        const criterion = trimmed.replace(/^[-*\d\.\s]+/, '').trim();
        if (criterion) {
          criteria.push({
            description: criterion,
            testable: this.isTestable(criterion),
            priority: this.extractPriority(criterion)
          });
        }
      }
    }
    
    return criteria;
  }

  /**
   * Extract features from text
   * @param {string} text - Input text
   * @returns {Array} List of features
   */
  extractFeatures(text) {
    const features = [];
    const featurePatterns = [
      /implement (.*?)(?:\.|,|\n|$)/gi,
      /create (.*?)(?:\.|,|\n|$)/gi,
      /build (.*?)(?:\.|,|\n|$)/gi,
      /develop (.*?)(?:\.|,|\n|$)/gi,
      /add (.*?)(?:\.|,|\n|$)/gi
    ];
    
    for (const pattern of featurePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const feature = match[1].trim();
        if (feature.length > 5 && feature.length < 100) {
          features.push({
            name: feature,
            priority: 'medium'
          });
        }
      }
    }
    
    return features.slice(0, 10); // Limit to 10 features
  }

  /**
   * Extract components from text
   * @param {string} text - Input text
   * @returns {Array} List of components
   */
  extractComponents(text) {
    const components = new Set();
    const componentPatterns = [
      /\b(\w+)\s*component/gi,
      /\b(\w+)\s*module/gi,
      /\b(\w+)\s*service/gi,
      /\b(\w+)\s*widget/gi,
      /\b(\w+)\s*page/gi,
      /\b(\w+)\s*form/gi,
      /\b(\w+)\s*dialog/gi,
      /\b(\w+)\s*modal/gi
    ];
    
    for (const pattern of componentPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const component = match[1].toLowerCase();
        if (component.length > 2) {
          components.add(component);
        }
      }
    }
    
    return Array.from(components).slice(0, 15);
  }

  /**
   * Extract integrations from text
   * @param {string} text - Input text
   * @returns {Array} List of integrations
   */
  extractIntegrations(text) {
    const integrations = new Set();
    const integrationPatterns = [
      /integrate with (.*?)(?:\.|,|\n|$)/gi,
      /connect to (.*?)(?:\.|,|\n|$)/gi,
      /\b(\w+)\s*api/gi,
      /\b(\w+)\s*service/gi,
      /third[- ]party (.*?)(?:\.|,|\n|$)/gi
    ];
    
    for (const pattern of integrationPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const integration = match[1].trim();
        if (integration.length > 2 && integration.length < 50) {
          integrations.add(integration);
        }
      }
    }
    
    return Array.from(integrations).slice(0, 10);
  }

  /**
   * Extract user roles from text
   * @param {string} text - Input text
   * @returns {Array} List of user roles
   */
  extractUserRoles(text) {
    const roles = new Set();
    const rolePatterns = [
      /\b(admin|administrator|user|customer|client|manager|operator|viewer|editor)\b/gi,
      /as a (.*?)(?:,|\s)/gi
    ];
    
    for (const pattern of rolePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const role = match[1] ? match[1].trim() : match[0].trim();
        if (role.length > 2 && role.length < 20) {
          roles.add(role.toLowerCase());
        }
      }
    }
    
    return Array.from(roles).slice(0, 8);
  }

  /**
   * Extract pages from text
   * @param {string} text - Input text
   * @returns {Array} List of pages
   */
  extractPages(text) {
    const pages = new Set();
    const pagePatterns = [
      /\b(\w+)\s*page/gi,
      /\b(\w+)\s*screen/gi,
      /\b(\w+)\s*view/gi,
      /navigate to (.*?)(?:\.|,|\n|$)/gi
    ];
    
    for (const pattern of pagePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const page = match[1].trim();
        if (page.length > 2 && page.length < 30) {
          pages.add(page.toLowerCase());
        }
      }
    }
    
    return Array.from(pages).slice(0, 12);
  }

  /**
   * Analyze complexity from text
   * @param {string} text - Input text
   * @returns {number} Complexity score (0-1)
   */
  analyzeComplexity(text) {
    let score = 0;
    
    // Length factor
    score += Math.min(text.length / 5000, 0.3);
    
    // Complexity keywords
    const complexityKeywords = [
      'realtime', 'real-time', 'complex', 'advanced', 'sophisticated',
      'enterprise', 'scalable', 'distributed', 'microservices',
      'integration', 'authentication', 'authorization', 'encryption',
      'performance', 'optimization', 'caching', 'database',
      'api', 'rest', 'graphql', 'websocket'
    ];
    
    const matches = complexityKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    score += Math.min(matches.length * 0.05, 0.4);
    
    // Technical indicators
    const technicalPatterns = [
      /\b[A-Z]{2,}\b/g, // Acronyms
      /\b\w+\.\w+/g,    // Dot notation
      /\b\w+API\b/gi,   // API references
      /\b\w+DB\b/gi     // Database references
    ];
    
    let technicalCount = 0;
    for (const pattern of technicalPatterns) {
      const matches = text.match(pattern) || [];
      technicalCount += matches.length;
    }
    
    score += Math.min(technicalCount * 0.02, 0.3);
    
    return Math.min(score, 1);
  }

  /**
   * Extract domains from text
   * @param {string} text - Input text
   * @returns {Array} List of domains
   */
  extractDomains(text) {
    const domains = new Set();
    const lowerText = text.toLowerCase();
    
    // Frontend indicators
    if (/\b(ui|ux|frontend|react|vue|angular|component|responsive|css|html|javascript)\b/.test(lowerText)) {
      domains.add('frontend');
    }
    
    // Backend indicators
    if (/\b(api|backend|server|database|node|python|java|sql|nosql|rest|graphql)\b/.test(lowerText)) {
      domains.add('backend');
    }
    
    // Security indicators
    if (/\b(security|auth|encryption|token|oauth|ssl|https|privacy|gdpr)\b/.test(lowerText)) {
      domains.add('security');
    }
    
    // Infrastructure indicators
    if (/\b(deploy|infrastructure|cloud|aws|docker|kubernetes|ci\/cd|devops)\b/.test(lowerText)) {
      domains.add('infrastructure');
    }
    
    // Mobile indicators
    if (/\b(mobile|ios|android|react native|flutter|responsive)\b/.test(lowerText)) {
      domains.add('mobile');
    }
    
    return Array.from(domains);
  }

  /**
   * Extract patterns from text
   * @param {string} text - Input text
   * @returns {Array} List of patterns
   */
  extractPatterns(text) {
    const patterns = [];
    const lowerText = text.toLowerCase();
    
    const patternMap = {
      'ui-component': /\b(component|widget|element|button|form|input|modal)\b/,
      'api': /\b(api|endpoint|rest|graphql|service)\b/,
      'database': /\b(database|db|sql|nosql|mongo|postgres|mysql)\b/,
      'authentication': /\b(auth|login|register|signin|signup|oauth|jwt)\b/,
      'realtime': /\b(realtime|real-time|websocket|socket|live|streaming)\b/,
      'responsive': /\b(responsive|mobile|tablet|desktop|adaptive)\b/,
      'testing': /\b(test|testing|unit|integration|e2e|spec)\b/,
      'deployment': /\b(deploy|deployment|ci\/cd|pipeline|build)\b/,
      'performance': /\b(performance|optimization|cache|caching|speed)\b/,
      'security': /\b(security|secure|encryption|ssl|https|privacy)\b/
    };
    
    for (const [pattern, regex] of Object.entries(patternMap)) {
      if (regex.test(lowerText)) {
        patterns.push(pattern);
      }
    }
    
    return patterns;
  }

  /**
   * Extract requirements from text
   * @param {string} text - Input text
   * @returns {Object} Requirements object
   */
  extractRequirements(text) {
    const lowerText = text.toLowerCase();
    
    return {
      realtime: /\b(realtime|real-time|live|streaming)\b/.test(lowerText),
      responsive: /\b(responsive|mobile|tablet)\b/.test(lowerText),
      authentication: /\b(auth|login|signin|register)\b/.test(lowerText),
      database: /\b(database|db|storage|data)\b/.test(lowerText),
      api: /\b(api|rest|graphql|endpoint)\b/.test(lowerText),
      testing: /\b(test|testing|spec|qa)\b/.test(lowerText),
      deployment: /\b(deploy|deployment|production)\b/.test(lowerText),
      monitoring: /\b(monitor|logging|analytics|tracking)\b/.test(lowerText),
      security: /\b(security|secure|encryption|ssl)\b/.test(lowerText),
      performance: /\b(performance|fast|speed|optimization)\b/.test(lowerText)
    };
  }

  /**
   * Extract acceptance criteria from text
   * @param {string} text - Input text
   * @returns {Array} List of acceptance criteria
   */
  extractAcceptanceCriteria(text) {
    const criteria = [];
    const criteriaPatterns = [
      /(?:must|should|shall|will) (.*?)(?:\.|,|\n|$)/gi,
      /(?:given|when|then) (.*?)(?:\.|,|\n|$)/gi,
      /user (?:can|should|must) (.*?)(?:\.|,|\n|$)/gi,
      /system (?:will|should|must) (.*?)(?:\.|,|\n|$)/gi
    ];
    
    for (const pattern of criteriaPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const criterion = match[1].trim();
        if (criterion.length > 10 && criterion.length < 200) {
          criteria.push({
            description: criterion,
            testable: this.isTestable(criterion)
          });
        }
      }
    }
    
    return criteria.slice(0, 20);
  }

  /**
   * Extract timeline information
   * @param {string} text - Input text
   * @returns {Object} Timeline object
   */
  extractTimeline(text) {
    const lowerText = text.toLowerCase();
    const timeline = {};
    
    // Extract duration
    const durationPattern = /(?:in|within|over|during) (\d+) (days?|weeks?|months?)/gi;
    const durationMatch = durationPattern.exec(lowerText);
    if (durationMatch) {
      timeline.duration = `${durationMatch[1]} ${durationMatch[2]}`;
    }
    
    // Extract urgency
    if (/\b(urgent|asap|critical|immediate|rush)\b/.test(lowerText)) {
      timeline.urgency = 'high';
    } else if (/\b(flexible|relaxed|when possible)\b/.test(lowerText)) {
      timeline.urgency = 'low';
    } else {
      timeline.urgency = 'medium';
    }
    
    return timeline;
  }

  /**
   * Extract resource information
   * @param {string} text - Input text
   * @returns {Object} Resources object
   */
  extractResources(text) {
    const lowerText = text.toLowerCase();
    const resources = {};
    
    // Team size indicators
    const teamPatterns = [
      /(\d+) developers?/gi,
      /team of (\d+)/gi,
      /(\d+) people/gi
    ];
    
    for (const pattern of teamPatterns) {
      const match = pattern.exec(lowerText);
      if (match) {
        resources.teamSize = parseInt(match[1]);
        break;
      }
    }
    
    // Skills required
    const skills = [];
    const skillPatterns = [
      /\b(react|vue|angular|node|python|java|javascript|typescript|css|html)\b/gi,
      /\b(frontend|backend|fullstack|devops|qa|designer)\b/gi
    ];
    
    for (const pattern of skillPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const skill = match[1].toLowerCase();
        if (!skills.includes(skill)) {
          skills.push(skill);
        }
      }
    }
    
    resources.skills = skills.slice(0, 10);
    return resources;
  }

  /**
   * Extract priority from text
   * @param {string} text - Input text
   * @returns {string} Priority level
   */
  extractPriority(text) {
    const lowerText = text.toLowerCase();
    
    if (/\b(critical|urgent|high|important|must)\b/.test(lowerText)) {
      return 'high';
    } else if (/\b(low|nice|optional|future)\b/.test(lowerText)) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Extract complexity from text
   * @param {string} text - Input text
   * @returns {string} Complexity level
   */
  extractComplexity(text) {
    const lowerText = text.toLowerCase();
    
    if (/\b(complex|advanced|sophisticated|difficult|challenging)\b/.test(lowerText)) {
      return 'high';
    } else if (/\b(simple|basic|easy|straightforward|trivial)\b/.test(lowerText)) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Check if criterion is testable
   * @param {string} criterion - Acceptance criterion
   * @returns {boolean} Whether criterion is testable
   */
  isTestable(criterion) {
    const lowerCriterion = criterion.toLowerCase();
    
    // Testable indicators
    const testablePatterns = [
      /\b(can|should|must|will|displays?|shows?|validates?|prevents?|allows?)\b/,
      /\b(clicks?|selects?|enters?|submits?|navigates?)\b/,
      /\b(appears?|disappears?|changes?|updates?|saves?)\b/
    ];
    
    return testablePatterns.some(pattern => pattern.test(lowerCriterion));
  }

  /**
   * Parse technical requirements
   * @param {string} content - Technical requirements content
   * @returns {Object} Technical requirements object
   */
  parseTechnicalRequirements(content) {
    if (!content) return {};
    
    const requirements = {};
    const lowerContent = content.toLowerCase();
    
    // Performance requirements
    if (/performance|speed|response time|load time/.test(lowerContent)) {
      requirements.performance = this.extractPerformanceRequirements(content);
    }
    
    // Security requirements
    if (/security|auth|encryption|ssl/.test(lowerContent)) {
      requirements.security = this.extractSecurityRequirements(content);
    }
    
    // Scalability requirements
    if (/scalability|scale|concurrent|users/.test(lowerContent)) {
      requirements.scalability = this.extractScalabilityRequirements(content);
    }
    
    return requirements;
  }

  /**
   * Extract performance requirements
   * @param {string} content - Content to analyze
   * @returns {Object} Performance requirements
   */
  extractPerformanceRequirements(content) {
    const performance = {};
    
    // Load time requirements
    const loadTimePattern = /load.*?(?:in|within|under|<)\s*(\d+)\s*(ms|milliseconds?|s|seconds?)/gi;
    const loadTimeMatch = loadTimePattern.exec(content);
    if (loadTimeMatch) {
      performance.loadTime = `${loadTimeMatch[1]}${loadTimeMatch[2]}`;
    }
    
    // Response time requirements
    const responseTimePattern = /response.*?(?:in|within|under|<)\s*(\d+)\s*(ms|milliseconds?|s|seconds?)/gi;
    const responseTimeMatch = responseTimePattern.exec(content);
    if (responseTimeMatch) {
      performance.responseTime = `${responseTimeMatch[1]}${responseTimeMatch[2]}`;
    }
    
    return performance;
  }

  /**
   * Extract security requirements
   * @param {string} content - Content to analyze
   * @returns {Object} Security requirements
   */
  extractSecurityRequirements(content) {
    const security = {};
    const lowerContent = content.toLowerCase();
    
    if (/\b(oauth|jwt|token|session)\b/.test(lowerContent)) {
      security.authentication = 'required';
    }
    
    if (/\b(https|ssl|tls|encryption)\b/.test(lowerContent)) {
      security.encryption = 'required';
    }
    
    if (/\b(gdpr|hipaa|compliance|privacy)\b/.test(lowerContent)) {
      security.compliance = 'required';
    }
    
    return security;
  }

  /**
   * Extract scalability requirements
   * @param {string} content - Content to analyze
   * @returns {Object} Scalability requirements
   */
  extractScalabilityRequirements(content) {
    const scalability = {};
    
    // Concurrent users
    const usersPattern = /(\d+(?:,\d+)*)\s*(?:concurrent\s*)?users?/gi;
    const usersMatch = usersPattern.exec(content);
    if (usersMatch) {
      scalability.concurrentUsers = usersMatch[1].replace(/,/g, '');
    }
    
    // Load capacity
    const loadPattern = /handle.*?(\d+(?:,\d+)*)\s*(?:requests?|transactions?|operations?)/gi;
    const loadMatch = loadPattern.exec(content);
    if (loadMatch) {
      scalability.capacity = loadMatch[1].replace(/,/g, '');
    }
    
    return scalability;
  }

  /**
   * Parse constraints
   * @param {string} content - Constraints content
   * @returns {Array} List of constraints
   */
  parseConstraints(content) {
    if (!content) return [];
    
    const constraints = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
        const constraint = trimmed.replace(/^[-*\d\.\s]+/, '').trim();
        if (constraint) {
          constraints.push({
            description: constraint,
            type: this.categorizeConstraint(constraint)
          });
        }
      }
    }
    
    return constraints;
  }

  /**
   * Categorize constraint type
   * @param {string} constraint - Constraint description
   * @returns {string} Constraint type
   */
  categorizeConstraint(constraint) {
    const lowerConstraint = constraint.toLowerCase();
    
    if (/budget|cost|money|price/.test(lowerConstraint)) {
      return 'budget';
    } else if (/time|deadline|schedule/.test(lowerConstraint)) {
      return 'timeline';
    } else if (/technology|tech|framework|platform/.test(lowerConstraint)) {
      return 'technical';
    } else if (/team|resource|skill|people/.test(lowerConstraint)) {
      return 'resource';
    } else if (/legal|compliance|regulation|policy/.test(lowerConstraint)) {
      return 'regulatory';
    }
    
    return 'other';
  }
}