/**
 * Workflow Generator Tests
 * Basic test suite for the workflow generation functionality
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { WorkflowGenerator } from '../src/core/WorkflowGenerator.js';
import { PersonaFactory } from '../src/personas/PersonaFactory.js';
import { OutputFormatter } from '../src/formatters/OutputFormatter.js';

describe('WorkflowGenerator', () => {
  test('should create workflow generator with default options', () => {
    const generator = new WorkflowGenerator();
    assert.ok(generator);
    assert.strictEqual(generator.options.strategy, 'systematic');
    assert.strictEqual(generator.options.output, 'roadmap');
    assert.strictEqual(generator.options.persona, 'auto');
  });

  test('should create workflow generator with custom options', () => {
    const options = {
      strategy: 'agile',
      output: 'tasks',
      persona: 'frontend',
      includeEstimates: true
    };
    
    const generator = new WorkflowGenerator(options);
    assert.strictEqual(generator.options.strategy, 'agile');
    assert.strictEqual(generator.options.output, 'tasks');
    assert.strictEqual(generator.options.persona, 'frontend');
    assert.strictEqual(generator.options.includeEstimates, true);
  });

  test('should generate workflow from simple description', async () => {
    const generator = new WorkflowGenerator();
    const input = 'Create a user authentication system with login and registration';
    
    const result = await generator.generateWorkflow(input);
    
    assert.ok(result);
    assert.ok(result.workflow);
    assert.ok(result.metadata);
    assert.ok(result.metadata.persona);
    assert.ok(result.metadata.strategy);
    assert.ok(result.metadata.complexity >= 0);
    assert.ok(result.metadata.estimatedDuration);
  });

  test('should auto-detect frontend persona for UI components', async () => {
    const generator = new WorkflowGenerator();
    const input = 'Build a responsive dashboard with React components and charts';
    
    const result = await generator.generateWorkflow(input);
    
    assert.strictEqual(result.metadata.persona, 'frontend');
  });

  test('should auto-detect backend persona for API development', async () => {
    const generator = new WorkflowGenerator();
    const input = 'Implement REST API with authentication and database integration';
    
    const result = await generator.generateWorkflow(input);
    
    assert.strictEqual(result.metadata.persona, 'backend');
  });

  test('should calculate complexity score correctly', () => {
    const generator = new WorkflowGenerator();
    
    const simpleRequirements = {
      components: ['button'],
      features: [{ name: 'basic form' }],
      integrations: []
    };
    
    const complexRequirements = {
      components: ['form', 'table', 'chart', 'modal'],
      features: [
        { name: 'authentication' },
        { name: 'real-time updates' },
        { name: 'data analytics' }
      ],
      integrations: ['stripe', 'sendgrid', 'aws'],
      realtime: true,
      security: 'high'
    };
    
    const simpleComplexity = generator.calculateComplexity(simpleRequirements);
    const complexComplexity = generator.calculateComplexity(complexRequirements);
    
    assert.ok(simpleComplexity < complexComplexity);
    assert.ok(complexComplexity > 0.5);
  });

  test('should identify domains correctly', () => {
    const generator = new WorkflowGenerator();
    
    const requirements = {
      ui: true,
      api: true,
      authentication: true,
      deployment: true
    };
    
    const domains = generator.identifyDomains(requirements);
    
    assert.ok(domains.includes('frontend'));
    assert.ok(domains.includes('backend'));
    assert.ok(domains.includes('security'));
    assert.ok(domains.includes('infrastructure'));
  });
});

describe('PersonaFactory', () => {
  test('should create all available personas', () => {
    const factory = new PersonaFactory();
    const types = factory.getAvailableTypes();
    
    assert.ok(types.includes('architect'));
    assert.ok(types.includes('frontend'));
    assert.ok(types.includes('backend'));
    assert.ok(types.includes('security'));
    assert.ok(types.includes('devops'));
    assert.ok(types.includes('qa'));
    
    types.forEach(type => {
      const persona = factory.create(type);
      assert.ok(persona);
      assert.strictEqual(persona.type, type);
    });
  });

  test('should throw error for unknown persona type', () => {
    const factory = new PersonaFactory();
    
    assert.throws(() => {
      factory.create('unknown');
    }, /Unknown persona type/);
  });

  test('should check persona type existence', () => {
    const factory = new PersonaFactory();
    
    assert.ok(factory.hasType('frontend'));
    assert.ok(factory.hasType('backend'));
    assert.ok(!factory.hasType('unknown'));
  });
});

describe('OutputFormatter', () => {
  const sampleWorkflow = {
    title: 'Test Workflow',
    strategy: 'systematic',
    persona: 'frontend',
    phases: [
      {
        name: 'Phase 1',
        duration: '1 week',
        tasks: [
          {
            title: 'Task 1',
            description: 'First task',
            type: 'implement'
          },
          {
            title: 'Task 2',
            description: 'Second task',
            type: 'test'
          }
        ]
      }
    ],
    metadata: {
      estimatedDuration: '2 weeks',
      complexity: 0.6,
      riskLevel: 'medium'
    }
  };

  test('should format workflow as roadmap', () => {
    const formatter = new OutputFormatter();
    const result = formatter.format(sampleWorkflow, 'roadmap');
    
    assert.ok(result.includes('# Test Workflow'));
    assert.ok(result.includes('## Phase 1: Phase 1'));
    assert.ok(result.includes('- [ ] Task 1'));
    assert.ok(result.includes('- [ ] Task 2'));
    assert.ok(result.includes('**Strategy:** Systematic'));
    assert.ok(result.includes('**Persona:** Frontend'));
  });

  test('should format workflow as tasks', () => {
    const formatter = new OutputFormatter();
    const result = formatter.format(sampleWorkflow, 'tasks');
    
    assert.ok(result.includes('# Test Workflow'));
    assert.ok(result.includes('## Epic: Phase 1'));
    assert.ok(result.includes('### Story:'));
    assert.ok(result.includes('- [ ] Task 1'));
  });

  test('should format workflow as detailed', () => {
    const formatter = new OutputFormatter();
    const result = formatter.format(sampleWorkflow, 'detailed');
    
    assert.ok(result.includes('# Test Workflow'));
    assert.ok(result.includes('## Phase 1: Phase 1'));
    assert.ok(result.includes('### Task 1.1: Task 1'));
    assert.ok(result.includes('**Persona:** Frontend'));
    assert.ok(result.includes('First task'));
  });

  test('should validate output formats', () => {
    const formatter = new OutputFormatter();
    
    assert.ok(formatter.isValidFormat('roadmap'));
    assert.ok(formatter.isValidFormat('tasks'));
    assert.ok(formatter.isValidFormat('detailed'));
    assert.ok(!formatter.isValidFormat('unknown'));
  });

  test('should get available formats', () => {
    const formatter = new OutputFormatter();
    const formats = formatter.getAvailableFormats();
    
    assert.ok(formats.includes('roadmap'));
    assert.ok(formats.includes('tasks'));
    assert.ok(formats.includes('detailed'));
  });

  test('should throw error for unknown format', () => {
    const formatter = new OutputFormatter();
    
    assert.throws(() => {
      formatter.format(sampleWorkflow, 'unknown');
    }, /Unknown output format/);
  });

  test('should format complexity correctly', () => {
    const formatter = new OutputFormatter();
    
    assert.strictEqual(formatter.formatComplexity(0.9), 'High');
    assert.strictEqual(formatter.formatComplexity(0.6), 'Medium');
    assert.strictEqual(formatter.formatComplexity(0.3), 'Low');
    assert.strictEqual(formatter.formatComplexity(0.1), 'Very Low');
  });

  test('should capitalize strings correctly', () => {
    const formatter = new OutputFormatter();
    
    assert.strictEqual(formatter.capitalizeFirst('hello'), 'Hello');
    assert.strictEqual(formatter.capitalizeFirst('WORLD'), 'WORLD');
    assert.strictEqual(formatter.capitalizeFirst(''), '');
    assert.strictEqual(formatter.capitalizeFirst(null), '');
  });
});