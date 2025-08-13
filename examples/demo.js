#!/usr/bin/env node

/**
 * Demo Script for SuperClaude Workflow Generator
 * Demonstrates the workflow generation capabilities
 */

import { WorkflowGenerator } from '../src/core/WorkflowGenerator.js';
import { readFile } from 'fs/promises';

async function runDemo() {
  console.log('🎯 SuperClaude Workflow Generator Demo\n');

  // Demo 1: Simple feature description with frontend persona
  console.log('📱 Demo 1: Frontend Dashboard Workflow');
  console.log('=' .repeat(50));
  
  const generator1 = new WorkflowGenerator({
    persona: 'frontend',
    strategy: 'systematic',
    output: 'roadmap',
    includeEstimates: true
  });
  
  const input1 = 'Create a responsive admin dashboard with React components, real-time charts, user management, and mobile-friendly design';
  
  try {
    const result1 = await generator1.generateWorkflow(input1, {
      magic: true,
      estimate: true
    });
    
    console.log(`Persona: ${result1.metadata.persona}`);
    console.log(`Complexity: ${formatComplexity(result1.metadata.complexity)}`);
    console.log(`Duration: ${result1.metadata.estimatedDuration}`);
    console.log(`Risk Level: ${result1.metadata.riskLevel}\n`);
    
    // Show first few lines of workflow
    const lines = result1.workflow.split('\n').slice(0, 15);
    console.log(lines.join('\n'));
    console.log('...\n');
    
  } catch (error) {
    console.error('Error in Demo 1:', error.message);
  }

  // Demo 2: Backend API with full analysis
  console.log('🔧 Demo 2: Backend API with Risk Assessment');
  console.log('=' .repeat(50));
  
  const generator2 = new WorkflowGenerator({
    persona: 'backend',
    strategy: 'systematic',
    output: 'tasks',
    includeRisks: true,
    includeDependencies: true
  });
  
  const input2 = 'Build a RESTful API for an e-commerce platform with user authentication, payment processing, inventory management, and real-time notifications';
  
  try {
    const result2 = await generator2.generateWorkflow(input2, {
      context7: true,
      sequential: true,
      risks: true,
      dependencies: true
    });
    
    console.log(`Persona: ${result2.metadata.persona}`);
    console.log(`Complexity: ${formatComplexity(result2.metadata.complexity)}`);
    console.log(`Duration: ${result2.metadata.estimatedDuration}`);
    console.log(`Risk Level: ${result2.metadata.riskLevel}\n`);
    
    // Show first few lines of workflow
    const lines = result2.workflow.split('\n').slice(0, 15);
    console.log(lines.join('\n'));
    console.log('...\n');
    
  } catch (error) {
    console.error('Error in Demo 2:', error.message);
  }

  // Demo 3: PRD file parsing with architect persona
  console.log('🏗️ Demo 3: PRD File Analysis with Architect Persona');
  console.log('=' .repeat(50));
  
  const generator3 = new WorkflowGenerator({
    persona: 'architect',
    strategy: 'systematic',
    output: 'detailed',
    includeEstimates: true,
    includeDependencies: true,
    includeRisks: true,
    enableParallel: true
  });
  
  try {
    const prdContent = await readFile('./examples/sample-prd.md', 'utf-8');
    
    const result3 = await generator3.generateWorkflow('./examples/sample-prd.md', {
      allMcp: true,
      estimate: true,
      dependencies: true,
      risks: true,
      parallel: true
    });
    
    console.log(`Persona: ${result3.metadata.persona}`);
    console.log(`Complexity: ${formatComplexity(result3.metadata.complexity)}`);
    console.log(`Duration: ${result3.metadata.estimatedDuration}`);
    console.log(`Risk Level: ${result3.metadata.riskLevel}\n`);
    
    // Show first few lines of workflow
    const lines = result3.workflow.split('\n').slice(0, 20);
    console.log(lines.join('\n'));
    console.log('...\n');
    
  } catch (error) {
    console.error('Error in Demo 3:', error.message);
  }

  // Demo 4: MVP Strategy with Security Focus
  console.log('🔒 Demo 4: MVP Security Implementation');
  console.log('=' .repeat(50));
  
  const generator4 = new WorkflowGenerator({
    persona: 'security',
    strategy: 'mvp',
    output: 'roadmap',
    includeRisks: true
  });
  
  const input4 = 'Implement secure user authentication system with OAuth integration, JWT tokens, password reset, and audit logging';
  
  try {
    const result4 = await generator4.generateWorkflow(input4, {
      sequential: true,
      context7: true,
      risks: true
    });
    
    console.log(`Persona: ${result4.metadata.persona}`);
    console.log(`Complexity: ${formatComplexity(result4.metadata.complexity)}`);
    console.log(`Duration: ${result4.metadata.estimatedDuration}`);
    console.log(`Risk Level: ${result4.metadata.riskLevel}\n`);
    
    // Show first few lines of workflow
    const lines = result4.workflow.split('\n').slice(0, 15);
    console.log(lines.join('\n'));
    console.log('...\n');
    
  } catch (error) {
    console.error('Error in Demo 4:', error.message);
  }

  // Demo 5: Agile Strategy with QA Focus
  console.log('🧪 Demo 5: Agile Testing Strategy');
  console.log('=' .repeat(50));
  
  const generator5 = new WorkflowGenerator({
    persona: 'qa',
    strategy: 'agile',
    output: 'tasks'
  });
  
  const input5 = 'Develop comprehensive testing strategy for a social media application including unit tests, integration tests, E2E tests, and performance testing';
  
  try {
    const result5 = await generator5.generateWorkflow(input5, {
      playwright: true,
      sequential: true
    });
    
    console.log(`Persona: ${result5.metadata.persona}`);
    console.log(`Complexity: ${formatComplexity(result5.metadata.complexity)}`);
    console.log(`Duration: ${result5.metadata.estimatedDuration}`);
    console.log(`Risk Level: ${result5.metadata.riskLevel}\n`);
    
    // Show first few lines of workflow
    const lines = result5.workflow.split('\n').slice(0, 15);
    console.log(lines.join('\n'));
    console.log('...\n');
    
  } catch (error) {
    console.error('Error in Demo 5:', error.message);
  }

  console.log('✅ Demo completed! Try running the CLI commands for interactive workflow generation.');
  console.log('\nExample commands:');
  console.log('  npm start generate "your feature description" --persona frontend');
  console.log('  npm start generate examples/sample-prd.md --output detailed');
  console.log('  npm start interactive');
}

function formatComplexity(complexity) {
  if (complexity >= 0.8) return 'High';
  if (complexity >= 0.5) return 'Medium';
  if (complexity >= 0.2) return 'Low';
  return 'Very Low';
}

// Run demo
runDemo().catch(error => {
  console.error('❌ Demo failed:', error.message);
  process.exit(1);
});