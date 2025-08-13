/**
 * Index Command - Project Documentation Generator
 * Creates and maintains comprehensive project documentation, indexes, and knowledge bases
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class IndexCommand {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.sourceDir = path.join(this.projectRoot, 'src');
    this.docsDir = path.join(this.projectRoot, 'docs');
  }

  /**
   * Generate comprehensive project documentation
   * @param {Object} options - Generation options
   * @returns {Object} Generated documentation
   */
  async generate(options = {}) {
    const {
      format = 'markdown',
      includeApi = true,
      includeStructure = true,
      includeExamples = true,
      outputPath = null
    } = options;

    try {
      // Ensure docs directory exists
      await this.ensureDocsDirectory();

      // Generate documentation components
      const documentation = {
        overview: await this.generateOverview(),
        api: includeApi ? await this.generateApiDocs() : null,
        structure: includeStructure ? await this.generateStructureDocs() : null,
        examples: includeExamples ? await this.generateExamples() : null,
        index: await this.generateIndex()
      };

      // Format output
      const formattedDocs = this.formatDocumentation(documentation, format);

      // Save to file if requested
      if (outputPath) {
        await this.saveDocumentation(formattedDocs, outputPath, format);
      }

      return {
        documentation: formattedDocs,
        metadata: {
          generatedAt: new Date().toISOString(),
          format,
          components: Object.keys(documentation).filter(k => documentation[k]),
          totalFiles: await this.countSourceFiles(),
          linesOfCode: await this.countLinesOfCode()
        }
      };
    } catch (error) {
      throw new Error(`Documentation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate project overview documentation
   * @returns {Object} Overview documentation
   */
  async generateOverview() {
    const packageJson = await this.readPackageJson();
    const readmeContent = await this.readReadme();

    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      license: packageJson.license,
      keywords: packageJson.keywords,
      dependencies: packageJson.dependencies,
      devDependencies: packageJson.devDependencies,
      scripts: packageJson.scripts,
      readme: readmeContent,
      architecture: await this.analyzeArchitecture()
    };
  }

  /**
   * Generate API documentation from source files
   * @returns {Object} API documentation
   */
  async generateApiDocs() {
    const sourceFiles = await this.getAllSourceFiles();
    const apiDocs = {};

    for (const file of sourceFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const relativePath = path.relative(this.sourceDir, file);
      
      apiDocs[relativePath] = {
        path: relativePath,
        exports: this.extractExports(content),
        classes: this.extractClasses(content),
        functions: this.extractFunctions(content),
        constants: this.extractConstants(content),
        imports: this.extractImports(content),
        comments: this.extractDocComments(content)
      };
    }

    return apiDocs;
  }

  /**
   * Generate project structure documentation
   * @returns {Object} Structure documentation
   */
  async generateStructureDocs() {
    const structure = await this.buildDirectoryTree(this.projectRoot);
    
    return {
      tree: structure,
      summary: {
        totalFiles: await this.countSourceFiles(),
        directories: await this.countDirectories(),
        fileTypes: await this.analyzeFileTypes(),
        componentCounts: await this.countComponents()
      }
    };
  }

  /**
   * Generate usage examples
   * @returns {Object} Examples documentation
   */
  async generateExamples() {
    const examples = {
      basic: [
        {
          title: "Generate Basic Workflow",
          command: 'npm start generate "Create user authentication system"',
          description: "Generate a workflow from a simple feature description"
        },
        {
          title: "Generate from PRD File",
          command: 'npm start generate examples/sample-prd.md',
          description: "Generate workflow from a Product Requirements Document"
        }
      ],
      advanced: [
        {
          title: "Full-Featured Workflow",
          command: 'npm start generate examples/sample-prd.md --persona architect --strategy systematic --output detailed --estimate --dependencies --risks --parallel --milestones --all-mcp --save workflow.md',
          description: "Generate comprehensive workflow with all features enabled"
        },
        {
          title: "Frontend-Specific Workflow",
          command: 'npm start generate "Build React dashboard with charts" --persona frontend --magic --output detailed --estimate',
          description: "Generate frontend-focused workflow with UI components"
        }
      ],
      personas: await this.generatePersonaExamples(),
      strategies: await this.generateStrategyExamples()
    };

    return examples;
  }

  /**
   * Generate comprehensive index
   * @returns {Object} Index documentation
   */
  async generateIndex() {
    return {
      quickStart: {
        installation: ["npm install"],
        basicUsage: ['npm start generate "your feature description"'],
        helpCommand: ["npm start --help"]
      },
      commands: {
        generate: "Generate workflow from PRD or description",
        personas: "List available expert personas",
        strategies: "List available workflow strategies",
        examples: "Show usage examples",
        interactive: "Interactive workflow generation"
      },
      personas: {
        architect: "Systems architecture and design",
        frontend: "UI/UX and user experience",
        backend: "APIs and data architecture", 
        security: "Security and compliance",
        devops: "Infrastructure and deployment",
        qa: "Quality assurance and testing"
      },
      strategies: {
        systematic: "Comprehensive phase-based approach",
        agile: "Sprint-based iterative development",
        mvp: "Minimum viable product focus"
      },
      outputs: {
        roadmap: "High-level timeline and milestones",
        tasks: "Detailed task breakdown",
        detailed: "Complete implementation guide"
      }
    };
  }

  /**
   * Extract exported items from source code
   * @param {string} content - File content
   * @returns {Array} Exported items
   */
  extractExports(content) {
    const exports = [];
    const exportRegex = /export\s+(?:class|function|const|let|var|default)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      exports.push({
        name: match[1],
        type: this.determineExportType(content, match[0])
      });
    }

    return exports;
  }

  /**
   * Extract class definitions from source code
   * @param {string} content - File content
   * @returns {Array} Class definitions
   */
  extractClasses(content) {
    const classes = [];
    const classRegex = /(?:export\s+)?class\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*(?:extends\s+([A-Za-z_$][A-Za-z0-9_$]*))?\s*\{/g;
    let match;

    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1];
      const extendsClass = match[2];
      
      classes.push({
        name: className,
        extends: extendsClass || null,
        methods: this.extractClassMethods(content, className),
        constructor: this.extractConstructor(content, className)
      });
    }

    return classes;
  }

  /**
   * Extract function definitions from source code
   * @param {string} content - File content
   * @returns {Array} Function definitions
   */
  extractFunctions(content) {
    const functions = [];
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\([^)]*\)/g;
    let match;

    while ((match = functionRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        async: match[0].includes('async'),
        params: this.extractFunctionParams(match[0])
      });
    }

    return functions;
  }

  /**
   * Extract constants from source code
   * @param {string} content - File content
   * @returns {Array} Constants
   */
  extractConstants(content) {
    const constants = [];
    const constRegex = /(?:export\s+)?const\s+([A-Z_][A-Z0-9_]*)\s*=/g;
    let match;

    while ((match = constRegex.exec(content)) !== null) {
      constants.push({
        name: match[1],
        value: this.extractConstantValue(content, match.index)
      });
    }

    return constants;
  }

  /**
   * Extract import statements from source code
   * @param {string} content - File content
   * @returns {Array} Import statements
   */
  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        source: match[1],
        statement: match[0]
      });
    }

    return imports;
  }

  /**
   * Extract documentation comments from source code
   * @param {string} content - File content
   * @returns {Array} Documentation comments
   */
  extractDocComments(content) {
    const comments = [];
    const commentRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
    let match;

    while ((match = commentRegex.exec(content)) !== null) {
      comments.push({
        content: match[1].replace(/^\s*\*\s?/gm, '').trim(),
        location: match.index
      });
    }

    return comments;
  }

  /**
   * Build directory tree structure
   * @param {string} dir - Directory path
   * @param {number} depth - Current depth
   * @returns {Object} Directory tree
   */
  async buildDirectoryTree(dir, depth = 0) {
    if (depth > 3) return null; // Limit depth

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const tree = {
        name: path.basename(dir),
        type: 'directory',
        children: []
      };

      for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.github') continue;
        if (entry.name === 'node_modules') continue;

        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subtree = await this.buildDirectoryTree(fullPath, depth + 1);
          if (subtree) tree.children.push(subtree);
        } else {
          tree.children.push({
            name: entry.name,
            type: 'file',
            extension: path.extname(entry.name)
          });
        }
      }

      return tree;
    } catch (error) {
      return null;
    }
  }

  /**
   * Format documentation for output
   * @param {Object} documentation - Documentation object
   * @param {string} format - Output format
   * @returns {string} Formatted documentation
   */
  formatDocumentation(documentation, format) {
    switch (format) {
      case 'markdown':
        return this.formatAsMarkdown(documentation);
      case 'json':
        return JSON.stringify(documentation, null, 2);
      case 'yaml':
        return this.formatAsYaml(documentation);
      default:
        return this.formatAsMarkdown(documentation);
    }
  }

  /**
   * Format documentation as Markdown
   * @param {Object} docs - Documentation object
   * @returns {string} Markdown formatted documentation
   */
  formatAsMarkdown(docs) {
    let markdown = '';

    // Title and overview
    if (docs.overview) {
      markdown += `# ${docs.overview.name}\n\n`;
      markdown += `${docs.overview.description}\n\n`;
      markdown += `**Version:** ${docs.overview.version}\n`;
      markdown += `**Author:** ${docs.overview.author}\n`;
      markdown += `**License:** ${docs.overview.license}\n\n`;
    }

    // Table of contents
    markdown += '## Table of Contents\n\n';
    markdown += '- [Overview](#overview)\n';
    if (docs.api) markdown += '- [API Documentation](#api-documentation)\n';
    if (docs.structure) markdown += '- [Project Structure](#project-structure)\n';
    if (docs.examples) markdown += '- [Examples](#examples)\n';
    if (docs.index) markdown += '- [Quick Reference](#quick-reference)\n';
    markdown += '\n';

    // Overview section
    if (docs.overview) {
      markdown += '## Overview\n\n';
      if (docs.overview.architecture) {
        markdown += '### Architecture\n\n';
        markdown += `**Pattern:** ${docs.overview.architecture.pattern}\n\n`;
        markdown += '**Layers:**\n';
        docs.overview.architecture.layers.forEach(layer => {
          markdown += `- ${layer}\n`;
        });
        markdown += '\n**Key Components:**\n';
        docs.overview.architecture.keyComponents.forEach(component => {
          markdown += `- ${component}\n`;
        });
        markdown += '\n';
      }
    }

    // API Documentation
    if (docs.api) {
      markdown += '## API Documentation\n\n';
      markdown += this.formatApiDocs(docs.api);
    }

    // Project Structure
    if (docs.structure) {
      markdown += '## Project Structure\n\n';
      markdown += this.formatStructure(docs.structure);
    }

    // Examples
    if (docs.examples) {
      markdown += '## Examples\n\n';
      markdown += this.formatExamples(docs.examples);
    }

    // Quick Reference
    if (docs.index) {
      markdown += '## Quick Reference\n\n';
      markdown += this.formatIndex(docs.index);
    }

    return markdown;
  }

  /**
   * Format API documentation as Markdown
   * @param {Object} api - API documentation
   * @returns {string} Formatted API docs
   */
  formatApiDocs(api) {
    let markdown = '';

    Object.entries(api).forEach(([filePath, fileDoc]) => {
      markdown += `### ${filePath}\n\n`;
      
      if (fileDoc.classes.length > 0) {
        markdown += '#### Classes\n\n';
        fileDoc.classes.forEach(cls => {
          markdown += `**${cls.name}**`;
          if (cls.extends) markdown += ` extends ${cls.extends}`;
          markdown += '\n\n';
          
          if (cls.methods.length > 0) {
            markdown += 'Methods:\n';
            cls.methods.forEach(method => {
              markdown += `- \`${method.name}(${method.params.join(', ')})\``;
              if (method.async) markdown += ' (async)';
              markdown += '\n';
            });
            markdown += '\n';
          }
        });
      }

      if (fileDoc.functions.length > 0) {
        markdown += '#### Functions\n\n';
        fileDoc.functions.forEach(func => {
          markdown += `- \`${func.name}(${func.params.join(', ')})\``;
          if (func.async) markdown += ' (async)';
          markdown += '\n';
        });
        markdown += '\n';
      }

      if (fileDoc.exports.length > 0) {
        markdown += '#### Exports\n\n';
        fileDoc.exports.forEach(exp => {
          markdown += `- \`${exp.name}\` (${exp.type})\n`;
        });
        markdown += '\n';
      }
    });

    return markdown;
  }

  /**
   * Format project structure as Markdown
   * @param {Object} structure - Structure documentation
   * @returns {string} Formatted structure
   */
  formatStructure(structure) {
    let markdown = '';

    markdown += '### Directory Tree\n\n';
    markdown += '```\n';
    markdown += this.renderTree(structure.tree, 0);
    markdown += '```\n\n';

    markdown += '### Summary\n\n';
    markdown += `- **Total Files:** ${structure.summary.totalFiles}\n`;
    markdown += `- **Directories:** ${structure.summary.directories}\n`;
    markdown += `- **Components:** ${structure.summary.componentCounts.total}\n\n`;

    markdown += '### File Types\n\n';
    Object.entries(structure.summary.fileTypes).forEach(([ext, count]) => {
      markdown += `- **${ext}:** ${count} files\n`;
    });
    markdown += '\n';

    return markdown;
  }

  /**
   * Format examples as Markdown
   * @param {Object} examples - Examples documentation
   * @returns {string} Formatted examples
   */
  formatExamples(examples) {
    let markdown = '';

    markdown += '### Basic Examples\n\n';
    examples.basic.forEach(example => {
      markdown += `#### ${example.title}\n\n`;
      markdown += `${example.description}\n\n`;
      markdown += '```bash\n';
      markdown += example.command;
      markdown += '\n```\n\n';
    });

    markdown += '### Advanced Examples\n\n';
    examples.advanced.forEach(example => {
      markdown += `#### ${example.title}\n\n`;
      markdown += `${example.description}\n\n`;
      markdown += '```bash\n';
      markdown += example.command;
      markdown += '\n```\n\n';
    });

    return markdown;
  }

  /**
   * Format index as Markdown
   * @param {Object} index - Index documentation
   * @returns {string} Formatted index
   */
  formatIndex(index) {
    let markdown = '';

    markdown += '### Quick Start\n\n';
    markdown += '```bash\n';
    markdown += '# Install dependencies\n';
    markdown += index.quickStart.installation[0] + '\n\n';
    markdown += '# Basic usage\n';
    markdown += index.quickStart.basicUsage[0] + '\n\n';
    markdown += '# Get help\n';
    markdown += index.quickStart.helpCommand[0] + '\n';
    markdown += '```\n\n';

    markdown += '### Available Commands\n\n';
    Object.entries(index.commands).forEach(([cmd, desc]) => {
      markdown += `- **${cmd}:** ${desc}\n`;
    });
    markdown += '\n';

    markdown += '### Expert Personas\n\n';
    Object.entries(index.personas).forEach(([persona, desc]) => {
      markdown += `- **${persona}:** ${desc}\n`;
    });
    markdown += '\n';

    return markdown;
  }

  // Helper methods
  async ensureDocsDirectory() {
    try {
      await fs.access(this.docsDir);
    } catch {
      await fs.mkdir(this.docsDir, { recursive: true });
    }
  }

  async readPackageJson() {
    const content = await fs.readFile(path.join(this.projectRoot, 'package.json'), 'utf-8');
    return JSON.parse(content);
  }

  async readReadme() {
    try {
      return await fs.readFile(path.join(this.projectRoot, 'README.md'), 'utf-8');
    } catch {
      return 'No README.md found';
    }
  }

  async getAllSourceFiles() {
    const files = [];
    
    async function walkDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    }

    await walkDir(this.sourceDir);
    return files;
  }

  async countSourceFiles() {
    const files = await this.getAllSourceFiles();
    return files.length;
  }

  async countDirectories() {
    let count = 0;
    
    async function walkDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          count++;
          await walkDir(path.join(dir, entry.name));
        }
      }
    }

    await walkDir(this.sourceDir);
    return count;
  }

  async analyzeFileTypes() {
    const types = {};
    const files = await this.getAllSourceFiles();
    
    files.forEach(file => {
      const ext = path.extname(file);
      types[ext] = (types[ext] || 0) + 1;
    });

    return types;
  }

  async countComponents() {
    const files = await this.getAllSourceFiles();
    let personas = 0, core = 0, parsers = 0, formatters = 0;

    files.forEach(file => {
      if (file.includes('/personas/')) personas++;
      else if (file.includes('/core/')) core++;
      else if (file.includes('/parsers/')) parsers++;
      else if (file.includes('/formatters/')) formatters++;
    });

    return { personas, core, parsers, formatters, total: files.length };
  }

  async analyzeArchitecture() {
    return {
      pattern: 'Modular Architecture',
      layers: [
        'CLI Interface (src/index.js)',
        'Core Engine (src/core/)',
        'Expert Personas (src/personas/)',
        'Parsers & Formatters (src/parsers/, src/formatters/)'
      ],
      keyComponents: [
        'WorkflowGenerator - Main orchestration engine',
        'PersonaFactory - Expert persona management', 
        'PRDParser - Requirements parsing',
        'OutputFormatter - Multi-format output'
      ]
    };
  }

  renderTree(node, depth) {
    let result = '';
    const indent = '  '.repeat(depth);
    const prefix = node.type === 'directory' ? '📁 ' : '📄 ';
    
    result += `${indent}${prefix}${node.name}\n`;
    
    if (node.children) {
      node.children.forEach(child => {
        result += this.renderTree(child, depth + 1);
      });
    }
    
    return result;
  }

  // Additional helper methods for extraction
  determineExportType(content, exportStatement) {
    if (exportStatement.includes('class')) return 'class';
    if (exportStatement.includes('function')) return 'function';
    if (exportStatement.includes('const')) return 'constant';
    return 'unknown';
  }

  extractClassMethods(content, className) {
    const methods = [];
    const classRegex = new RegExp(`class\\s+${className}[\\s\\S]*?\\{([\\s\\S]*?)\\n\\s*\\}`, 'g');
    const match = classRegex.exec(content);
    
    if (match) {
      const methodRegex = /(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/g;
      let methodMatch;
      
      while ((methodMatch = methodRegex.exec(match[1])) !== null) {
        if (methodMatch[1] !== 'constructor') {
          methods.push({
            name: methodMatch[1],
            async: methodMatch[0].includes('async'),
            params: this.extractFunctionParams(methodMatch[0])
          });
        }
      }
    }
    
    return methods;
  }

  extractConstructor(content, className) {
    const constructorRegex = new RegExp(`constructor\\s*\\(([^)]*)\\)`);
    const match = constructorRegex.exec(content);
    return match ? { params: this.extractFunctionParams(match[0]) } : null;
  }

  extractFunctionParams(functionSignature) {
    const paramMatch = functionSignature.match(/\(([^)]*)\)/);
    if (!paramMatch) return [];
    
    return paramMatch[1]
      .split(',')
      .map(param => param.trim())
      .filter(param => param.length > 0);
  }

  extractConstantValue(content, index) {
    const line = content.substring(index).split('\n')[0];
    const valueMatch = line.match(/=\s*(.+)$/);
    return valueMatch ? valueMatch[1].replace(/;$/, '').trim() : 'unknown';
  }

  async generatePersonaExamples() {
    return {
      architect: 'npm start generate "Enterprise system design" --persona architect --strategy systematic',
      frontend: 'npm start generate "React dashboard" --persona frontend --magic --output detailed',
      backend: 'npm start generate "REST API" --persona backend --c7 --dependencies',
      security: 'npm start generate "Authentication system" --persona security --validate --risks',
      devops: 'npm start generate "CI/CD pipeline" --persona devops --sequential',
      qa: 'npm start generate "Testing strategy" --persona qa --play'
    };
  }

  async generateStrategyExamples() {
    return {
      systematic: 'npm start generate input.md --strategy systematic --output detailed',
      agile: 'npm start generate input.md --strategy agile --milestones',
      mvp: 'npm start generate input.md --strategy mvp --estimate'
    };
  }

  async saveDocumentation(content, outputPath, format) {
    const fullPath = path.resolve(outputPath);
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  formatAsYaml(documentation) {
    // Simple YAML formatting - in production, would use yaml library
    return `# Project Documentation\n${JSON.stringify(documentation, null, 2)}`;
  }

  async countLinesOfCode() {
    const files = await this.getAllSourceFiles();
    let totalLines = 0;
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      totalLines += content.split('\n').length;
    }
    
    return totalLines;
  }
}