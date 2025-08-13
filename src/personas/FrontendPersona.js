/**
 * Frontend Persona
 * UX specialist, accessibility advocate, performance-conscious developer
 */

import { BasePersona } from './BasePersona.js';

export class FrontendPersona extends BasePersona {
  constructor() {
    super('frontend', {
      priorityHierarchy: ['User needs', 'Accessibility', 'Performance', 'Technical elegance'],
      mcpPreferences: {
        primary: 'Magic',
        secondary: 'Playwright',
        avoided: null
      },
      optimizedCommands: ['/build', '/improve --perf', '/test e2e', '/design'],
      qualityStandards: {
        usability: 'Interfaces must be intuitive and user-friendly',
        accessibility: 'WCAG 2.1 AA compliance minimum',
        performance: 'Sub-3-second load times on 3G networks'
      },
      performanceBudgets: {
        loadTime: '<3s on 3G, <1s on WiFi',
        bundleSize: '<500KB initial, <2MB total',
        accessibility: 'WCAG 2.1 AA minimum (90%+)',
        coreWebVitals: 'LCP <2.5s, FID <100ms, CLS <0.1'
      }
    });
  }

  /**
   * Generate frontend-specific systematic workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Array} Workflow phases
   */
  async generateSystematicWorkflow(requirements, options) {
    return [
      await this.createUXAnalysisPhase(requirements),
      await this.createDesignSystemPhase(requirements),
      await this.createComponentArchitecturePhase(requirements),
      await this.createImplementationPhases(requirements),
      await this.createAccessibilityTestingPhase(requirements),
      await this.createPerformanceOptimizationPhase(requirements),
      await this.createCrossBrowserTestingPhase(requirements)
    ].filter(phase => phase && phase.tasks && phase.tasks.length > 0);
  }

  /**
   * Create UX analysis phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createUXAnalysisPhase(requirements) {
    return {
      name: 'UX Analysis & Planning',
      type: 'ux-design',
      duration: '3-5 days',
      tasks: [
        {
          type: 'analysis',
          title: 'User journey mapping',
          description: 'Map all user flows and interaction patterns',
          deliverables: ['User journey maps', 'Flow diagrams'],
          tools: ['Figma', 'Miro'],
          estimatedHours: 8
        },
        {
          type: 'design',
          title: 'Wireframe creation',
          description: 'Create low-fidelity wireframes for all interfaces',
          deliverables: ['Wireframe library', 'Interaction specifications'],
          tools: ['Figma', 'Sketch'],
          estimatedHours: 12
        },
        {
          type: 'analysis',
          title: 'Accessibility requirements analysis',
          description: 'Define accessibility requirements and compliance targets',
          deliverables: ['Accessibility checklist', 'WCAG compliance plan'],
          estimatedHours: 4
        },
        {
          type: 'analysis',
          title: 'Performance requirements definition',
          description: 'Set performance budgets and optimization targets',
          deliverables: ['Performance budget document', 'Optimization strategy'],
          estimatedHours: 3
        }
      ]
    };
  }

  /**
   * Create design system phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createDesignSystemPhase(requirements) {
    return {
      name: 'Design System Development',
      type: 'design-system',
      duration: '5-8 days',
      tasks: [
        {
          type: 'design',
          title: 'Component library design',
          description: 'Design reusable UI components and patterns',
          deliverables: ['Component library', 'Design tokens'],
          tools: ['Figma', 'Storybook'],
          estimatedHours: 16
        },
        {
          type: 'design',
          title: 'Typography and color system',
          description: 'Define typography scales, color palettes, and spacing',
          deliverables: ['Design tokens', 'Style guide'],
          estimatedHours: 6
        },
        {
          type: 'design',
          title: 'Responsive breakpoint strategy',
          description: 'Define responsive behavior and breakpoint system',
          deliverables: ['Responsive guidelines', 'Grid system'],
          estimatedHours: 4
        },
        {
          type: 'implement',
          title: 'CSS architecture setup',
          description: 'Implement CSS architecture and build system',
          deliverables: ['CSS framework', 'Build configuration'],
          tools: ['Sass', 'PostCSS', 'Tailwind'],
          estimatedHours: 8
        }
      ]
    };
  }

  /**
   * Create component architecture phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createComponentArchitecturePhase(requirements) {
    const components = requirements.components || this.extractUIComponents(requirements);
    
    return {
      name: 'Component Architecture',
      type: 'architecture',
      duration: '3-5 days',
      tasks: [
        {
          type: 'design',
          title: 'Component hierarchy design',
          description: 'Define component structure and relationships',
          deliverables: ['Component tree', 'Props interface design'],
          estimatedHours: 6
        },
        {
          type: 'design',
          title: 'State management architecture',
          description: 'Design client-side state management strategy',
          deliverables: ['State architecture', 'Data flow diagrams'],
          tools: ['Redux', 'Context API', 'Zustand'],
          estimatedHours: 8
        },
        {
          type: 'setup',
          title: 'Development environment setup',
          description: 'Configure development tools and build pipeline',
          deliverables: ['Dev environment', 'Build configuration'],
          tools: ['Vite', 'Webpack', 'ESLint', 'Prettier'],
          estimatedHours: 4
        },
        ...components.slice(0, 5).map(component => ({
          type: 'implement',
          title: `Implement ${component} component`,
          description: `Create reusable ${component} component with full functionality`,
          deliverables: [`${component} component`, 'Unit tests', 'Storybook stories'],
          estimatedHours: this.estimateComponentHours(component)
        }))
      ]
    };
  }

  /**
   * Create accessibility testing phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createAccessibilityTestingPhase(requirements) {
    return {
      name: 'Accessibility Testing & Compliance',
      type: 'accessibility',
      duration: '2-3 days',
      tasks: [
        {
          type: 'test',
          title: 'Automated accessibility testing',
          description: 'Run automated accessibility audits and fix issues',
          deliverables: ['Accessibility audit report', 'Fixed violations'],
          tools: ['axe-core', 'Lighthouse', 'WAVE'],
          estimatedHours: 6
        },
        {
          type: 'test',
          title: 'Manual accessibility testing',
          description: 'Perform manual testing with screen readers and keyboard navigation',
          deliverables: ['Manual test results', 'Accessibility improvements'],
          tools: ['NVDA', 'JAWS', 'VoiceOver'],
          estimatedHours: 8
        },
        {
          type: 'test',
          title: 'Color contrast validation',
          description: 'Validate color contrast ratios meet WCAG guidelines',
          deliverables: ['Contrast audit report', 'Color adjustments'],
          tools: ['Colour Contrast Analyser'],
          estimatedHours: 3
        },
        {
          type: 'implement',
          title: 'ARIA implementation',
          description: 'Implement proper ARIA labels and semantic markup',
          deliverables: ['ARIA implementation', 'Semantic HTML'],
          estimatedHours: 5
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
      duration: '3-4 days',
      tasks: [
        {
          type: 'optimize',
          title: 'Bundle size optimization',
          description: 'Optimize JavaScript bundles and implement code splitting',
          deliverables: ['Optimized bundles', 'Code splitting strategy'],
          tools: ['Webpack Bundle Analyzer', 'source-map-explorer'],
          estimatedHours: 8
        },
        {
          type: 'optimize',
          title: 'Image optimization',
          description: 'Optimize images and implement lazy loading',
          deliverables: ['Optimized images', 'Lazy loading implementation'],
          tools: ['ImageOptim', 'Sharp', 'react-lazyload'],
          estimatedHours: 4
        },
        {
          type: 'optimize',
          title: 'CSS optimization',
          description: 'Optimize CSS delivery and remove unused styles',
          deliverables: ['Optimized CSS', 'Critical CSS extraction'],
          tools: ['PurgeCSS', 'Critical'],
          estimatedHours: 3
        },
        {
          type: 'implement',
          title: 'Performance monitoring setup',
          description: 'Implement performance monitoring and Core Web Vitals tracking',
          deliverables: ['Performance monitoring', 'Metrics dashboard'],
          tools: ['Google Analytics', 'Sentry', 'Web Vitals'],
          estimatedHours: 4
        },
        {
          type: 'test',
          title: 'Performance testing',
          description: 'Conduct performance tests and validate against budgets',
          deliverables: ['Performance test results', 'Optimization recommendations'],
          tools: ['Lighthouse', 'WebPageTest', 'GTmetrix'],
          estimatedHours: 3
        }
      ]
    };
  }

  /**
   * Create cross-browser testing phase
   * @param {Object} requirements - Requirements object
   * @returns {Object} Phase object
   */
  async createCrossBrowserTestingPhase(requirements) {
    return {
      name: 'Cross-Browser Testing',
      type: 'testing',
      duration: '2-3 days',
      tasks: [
        {
          type: 'test',
          title: 'Browser compatibility testing',
          description: 'Test functionality across major browsers and versions',
          deliverables: ['Compatibility test results', 'Browser-specific fixes'],
          tools: ['BrowserStack', 'Sauce Labs'],
          estimatedHours: 8
        },
        {
          type: 'test',
          title: 'Mobile device testing',
          description: 'Test responsive behavior on various mobile devices',
          deliverables: ['Mobile test results', 'Responsive fixes'],
          tools: ['Chrome DevTools', 'Real devices'],
          estimatedHours: 6
        },
        {
          type: 'test',
          title: 'Feature detection and polyfills',
          description: 'Implement feature detection and necessary polyfills',
          deliverables: ['Polyfill strategy', 'Feature detection code'],
          tools: ['Modernizr', 'core-js'],
          estimatedHours: 4
        }
      ]
    };
  }

  /**
   * Extract UI components from requirements
   * @param {Object} requirements - Requirements object
   * @returns {Array} List of UI components
   */
  extractUIComponents(requirements) {
    const components = new Set();
    const text = JSON.stringify(requirements).toLowerCase();
    
    // Common UI components
    const uiPatterns = [
      'button', 'form', 'input', 'modal', 'dialog', 'dropdown', 'menu',
      'navigation', 'header', 'footer', 'sidebar', 'card', 'table',
      'list', 'grid', 'chart', 'calendar', 'datepicker', 'search',
      'filter', 'pagination', 'tabs', 'accordion', 'tooltip', 'alert',
      'notification', 'progress', 'loader', 'avatar', 'badge', 'tag'
    ];
    
    for (const pattern of uiPatterns) {
      if (text.includes(pattern)) {
        components.add(pattern);
      }
    }
    
    // Add components from requirements
    if (requirements.components) {
      requirements.components.forEach(comp => components.add(comp));
    }
    
    return Array.from(components);
  }

  /**
   * Estimate hours for component implementation
   * @param {string} component - Component name
   * @returns {number} Estimated hours
   */
  estimateComponentHours(component) {
    const complexComponents = ['table', 'chart', 'calendar', 'form', 'navigation'];
    const simpleComponents = ['button', 'input', 'badge', 'tag', 'avatar'];
    
    if (complexComponents.includes(component.toLowerCase())) {
      return 12;
    } else if (simpleComponents.includes(component.toLowerCase())) {
      return 4;
    }
    
    return 8; // Default estimate
  }

  /**
   * Get frontend-specific best practices
   * @returns {Array} Best practices
   */
  getBestPractices() {
    return [
      'Implement mobile-first responsive design',
      'Ensure WCAG 2.1 AA accessibility compliance',
      'Optimize for Core Web Vitals performance metrics',
      'Use semantic HTML and proper ARIA labels',
      'Implement proper error boundaries and loading states',
      'Follow consistent naming conventions for CSS classes',
      'Optimize images and implement lazy loading',
      'Use progressive enhancement principles',
      'Test across multiple browsers and devices',
      'Implement proper focus management for keyboard users'
    ];
  }

  /**
   * Get frontend-specific quality gates
   * @returns {Array} Quality gates
   */
  getQualityGates() {
    return [
      'Design system consistency check',
      'Accessibility audit (WCAG 2.1 AA)',
      'Performance budget validation',
      'Cross-browser compatibility test',
      'Mobile responsiveness validation',
      'Code quality and ESLint compliance',
      'Bundle size optimization check',
      'User acceptance testing',
      'Visual regression testing'
    ];
  }

  /**
   * Enhance workflow with frontend-specific improvements
   * @param {Object} workflow - Base workflow
   * @param {Object} requirements - Requirements object
   * @param {Object} options - Generation options
   * @returns {Object} Enhanced workflow
   */
  enhanceWorkflow(workflow, requirements, options) {
    const enhanced = super.enhanceWorkflow(workflow, requirements, options);
    
    // Add frontend-specific enhancements
    enhanced.performanceBudgets = this.config.performanceBudgets;
    enhanced.accessibilityTargets = {
      wcagLevel: 'AA',
      minimumScore: 90,
      screenReaderCompatibility: true,
      keyboardNavigation: true
    };
    enhanced.browserSupport = {
      chrome: 'last 2 versions',
      firefox: 'last 2 versions',
      safari: 'last 2 versions',
      edge: 'last 2 versions',
      mobile: 'iOS 12+, Android 8+'
    };
    enhanced.designTokens = {
      colors: 'Define consistent color palette',
      typography: 'Establish typography scale',
      spacing: 'Define spacing system',
      breakpoints: 'Set responsive breakpoints'
    };
    
    return enhanced;
  }
}