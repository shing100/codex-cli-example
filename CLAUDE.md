# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **SuperClaude Workflow Generator** (`/sc:workflow`) - a comprehensive implementation workflow generator that analyzes Product Requirements Documents (PRDs) and feature specifications to create detailed, step-by-step implementation workflows with expert guidance.

## Architecture

The project implements a modular Node.js application with the following key components:

- **Core Engine** (`src/core/`) - Main workflow generation logic with persona-based intelligence
- **Expert Personas** (`src/personas/`) - 6 specialized AI personas (Architect, Frontend, Backend, Security, DevOps, QA)
- **PRD Parser** (`src/parsers/`) - Advanced parsing of Markdown PRDs and feature descriptions
- **Output Formatters** (`src/formatters/`) - Multiple output formats (Roadmap, Tasks, Detailed)
- **Quality Gates** (`src/core/QualityGates.js`) - 8-step validation framework
- **CLI Interface** (`src/index.js`) - Command-line interface with comprehensive options

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Run the workflow generator
npm start generate <input> [options]

# Interactive mode
npm start interactive

# Run demo
npm run demo

# Run tests
npm test

# Validate code (tests + linting)
npm run validate
```

### Example Usage
```bash
# Generate from feature description
npm start generate "Create user authentication with OAuth" --persona security

# Generate from PRD file
npm start generate examples/sample-prd.md --output detailed --estimate

# Full-featured generation
npm start generate examples/sample-prd.md --persona architect --all-mcp --risks --dependencies --save workflow.md
```

## Key Features

1. **Multi-Persona Intelligence**: Each persona has specialized knowledge, priorities, and MCP server preferences
2. **Strategy Options**: Systematic (detailed phases), Agile (sprints), MVP (rapid validation)
3. **Output Formats**: Roadmap (executive), Tasks (development), Detailed (implementation guide)
4. **Quality Validation**: 8-step quality gates ensuring workflow completeness
5. **Advanced Analysis**: Dependency mapping, risk assessment, time estimation
6. **MCP Integration**: Mock integration with Context7, Sequential, Magic, Playwright servers

## Expert Personas

- **architect**: Systems design, scalability, long-term maintainability
- **frontend**: UI/UX, accessibility, performance, responsive design
- **backend**: APIs, databases, reliability, security
- **security**: Threat modeling, compliance, vulnerability assessment
- **devops**: Infrastructure, CI/CD, monitoring, automation
- **qa**: Testing strategy, quality assurance, edge case detection

## File Structure

```
src/
├── core/
│   ├── WorkflowGenerator.js     # Main orchestration engine
│   ├── DependencyAnalyzer.js    # Dependency mapping and analysis
│   ├── RiskAssessment.js        # Risk identification and mitigation
│   ├── MCPIntegration.js        # Mock MCP server integration
│   └── QualityGates.js          # 8-step validation framework
├── personas/
│   ├── PersonaFactory.js        # Persona instantiation
│   ├── BasePersona.js           # Shared persona functionality
│   └── [Specific personas...]   # Individual persona implementations
├── parsers/
│   └── PRDParser.js             # PRD and description parsing
├── formatters/
│   └── OutputFormatter.js       # Output format generation
└── index.js                     # CLI interface and command handling

examples/
├── sample-prd.md               # Example PRD for testing
└── demo.js                     # Interactive demo script

test/
└── workflow-generator.test.js  # Test suite
```

## Testing Strategy

- **Unit Tests**: Core functionality and individual components
- **Integration Tests**: Persona workflows and output formatting
- **CLI Tests**: Command-line interface and flag handling
- **Example Validation**: Sample PRD processing and output generation

## Extension Points

### Adding New Personas
1. Create new persona class extending `BasePersona`
2. Implement persona-specific workflow generation methods
3. Add to `PersonaFactory` registration
4. Update CLI help and documentation

### Adding Output Formats
1. Add new formatter method to `OutputFormatter`
2. Register in formatters map
3. Update CLI options and validation
4. Add tests for new format

### Enhancing Analysis
1. Extend `DependencyAnalyzer` for new dependency types
2. Add risk categories to `RiskAssessment`
3. Implement new quality gates in `QualityGates`
4. Update MCP integration patterns

## Integration with SuperClaude Ecosystem

This implementation serves as a reference for the `/sc:workflow` command specification, demonstrating:

- Persona-based AI intelligence with specialized expertise
- Multi-strategy workflow generation approaches
- Comprehensive analysis capabilities (dependencies, risks, estimates)
- Quality validation frameworks
- MCP server integration patterns
- CLI design patterns for complex AI tools

## Best Practices

- **Persona Consistency**: Each persona maintains consistent priorities and decision-making patterns
- **Modular Design**: Clear separation between parsing, analysis, generation, and formatting
- **Quality First**: Multiple validation layers ensure workflow completeness
- **Extensibility**: Plugin-style architecture for easy enhancement
- **User Experience**: Comprehensive CLI with examples, help, and interactive mode