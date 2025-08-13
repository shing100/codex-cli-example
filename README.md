# SuperClaude Workflow Generator (`/sc:workflow`)

A comprehensive implementation workflow generator for analyzing Product Requirements Documents (PRDs) and feature specifications. Generates step-by-step implementation workflows with expert guidance, dependency mapping, and automated task orchestration. Also includes project documentation generation capabilities via `/sc:index`.

## Features

- **Multi-Persona Support**: 6 specialized expert personas (Architect, Frontend, Backend, Security, DevOps, QA)
- **Multiple Strategies**: Systematic, Agile, and MVP workflow approaches
- **Output Formats**: Roadmap, Tasks, and Detailed implementation guides
- **PRD Parsing**: Advanced parsing of Markdown PRDs and plain text feature descriptions
- **Dependency Analysis**: Automatic mapping of internal, external, and technical dependencies
- **Risk Assessment**: Comprehensive risk analysis with mitigation strategies
- **Quality Gates**: 8-step validation framework ensuring workflow completeness
- **MCP Integration**: Mock integration with Context7, Sequential, Magic, and Playwright servers
- **Time Estimation**: Intelligent time and complexity estimates
- **Parallel Work Identification**: Automatic detection of parallelizable work streams
- **Project Documentation**: Comprehensive API documentation and project structure analysis via `/sc:index`
- **Multiple Output Formats**: Markdown, JSON, and YAML documentation outputs

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```bash
# Generate workflow from description
npm start generate "Create a user authentication system with login and registration"

# Generate workflow from PRD file
npm start generate examples/sample-prd.md

# Use specific persona
npm start generate "Build React dashboard" --persona frontend

# Different output formats
npm start generate "API development" --output detailed --persona backend
```

### Advanced Options

```bash
# Full-featured workflow generation
npm start generate examples/sample-prd.md \
  --persona architect \
  --strategy systematic \
  --output detailed \
  --estimate \
  --dependencies \
  --risks \
  --parallel \
  --milestones \
  --all-mcp \
  --save workflow.md
```

### Project Documentation

```bash
# Generate comprehensive project documentation
npm start index --save docs/PROJECT_DOCS.md

# Generate API documentation in JSON format
npm start index --format json --save docs/api.json

# Generate documentation without examples
npm start index --no-examples --save docs/structure.md
```

### Interactive Mode

```bash
npm start interactive
```

## Command Reference

### Main Commands

- `generate <input>` - Generate workflow from PRD file or description
- `index` - Generate comprehensive project documentation and API reference
- `personas` - List available expert personas
- `strategies` - List available workflow strategies
- `examples` - Show usage examples
- `interactive` - Interactive workflow generation

### Options

- `--persona <type>` - Force specific expert persona (architect, frontend, backend, security, devops, qa, auto)
- `--strategy <type>` - Workflow strategy (systematic, agile, mvp)
- `--output <format>` - Output format (roadmap, tasks, detailed)
- `--estimate` - Include time and complexity estimates
- `--dependencies` - Map external dependencies and integrations
- `--risks` - Include risk assessment and mitigation strategies
- `--parallel` - Identify parallelizable work streams
- `--milestones` - Create milestone-based project phases
- `--c7, --context7` - Enable Context7 for framework patterns
- `--sequential` - Enable Sequential thinking for complex analysis
- `--magic` - Enable Magic for UI component workflow planning
- `--all-mcp` - Enable all MCP servers for comprehensive workflow
- `--validate` - Run quality gates validation
- `--save <file>` - Save workflow to file

## Expert Personas

### Architect
- **Focus**: Systems architecture, long-term maintainability, scalability
- **Specialties**: High-level design, technology selection, scalability planning
- **MCP Preference**: Sequential (primary), Context7 (secondary)

### Frontend
- **Focus**: User experience, accessibility, performance
- **Specialties**: UI components, responsive design, accessibility compliance
- **MCP Preference**: Magic (primary), Playwright (secondary)

### Backend
- **Focus**: Reliability, security, data integrity
- **Specialties**: API design, database architecture, performance optimization
- **MCP Preference**: Context7 (primary), Sequential (secondary)

### Security
- **Focus**: Threat modeling, compliance, vulnerability assessment
- **Specialties**: Security architecture, risk assessment, compliance validation
- **MCP Preference**: Sequential (primary), Context7 (secondary)

### DevOps
- **Focus**: Infrastructure, automation, reliability
- **Specialties**: CI/CD, infrastructure as code, monitoring
- **MCP Preference**: Sequential (primary), Context7 (secondary)

### QA
- **Focus**: Quality assurance, testing, edge case detection
- **Specialties**: Test strategy, automation, quality validation
- **MCP Preference**: Playwright (primary), Sequential (secondary)

## Workflow Strategies

### Systematic (Default)
- Comprehensive, phase-based approach
- Detailed requirements analysis and architecture planning
- Sequential phases with clear deliverables
- Best for: Complex projects, enterprise systems

### Agile
- Sprint-based iterative development
- User story breakdown and epic organization
- Continuous delivery and feedback cycles
- Best for: Dynamic requirements, team collaboration

### MVP
- Minimum viable product focus
- Core feature identification and rapid validation
- Quick market validation and feedback
- Best for: Startups, proof-of-concepts

## Output Formats

### Roadmap
- High-level phase overview
- Timeline and milestone focus
- Executive-friendly format
- Checkbox task lists

### Tasks
- Epic and user story breakdown
- Detailed task organization
- Priority and estimation information
- Development team focus

### Detailed
- Comprehensive implementation guide
- Step-by-step instructions
- Tools and deliverable specifications
- Architecture and technical focus

## Quality Gates

The system implements an 8-step quality validation framework:

1. **Requirements Validation** - Completeness and traceability
2. **Architecture Review** - Design decisions and technology choices
3. **Security Assessment** - Security considerations and threat mitigation
4. **Performance Validation** - Performance requirements and optimization
5. **Testing Strategy** - Comprehensive testing approach
6. **Documentation Review** - Documentation completeness and quality
7. **Risk Assessment** - Risk identification and mitigation strategies
8. **Integration Validation** - Dependency and integration planning

## Examples

### Frontend Dashboard
```bash
npm start generate "Create a responsive admin dashboard with React, charts, and real-time data" \
  --persona frontend \
  --magic \
  --output detailed \
  --estimate
```

### Backend API
```bash
npm start generate "Build REST API for e-commerce with authentication, payments, and inventory" \
  --persona backend \
  --c7 \
  --dependencies \
  --risks
```

### Full-Stack Application
```bash
npm start generate examples/sample-prd.md \
  --persona architect \
  --all-mcp \
  --strategy systematic \
  --output detailed \
  --estimate \
  --dependencies \
  --risks \
  --parallel \
  --milestones
```

## Testing

```bash
# Run test suite
npm test

# Run with coverage
npm run test:coverage
```

## Development

```bash
# Start in development mode
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture

The workflow generator is built with a modular architecture:

- **Core Engine** (`src/core/`) - Main workflow generation logic
- **Personas** (`src/personas/`) - Expert persona implementations
- **Parsers** (`src/parsers/`) - PRD and description parsing
- **Formatters** (`src/formatters/`) - Output format generation
- **Integration** (`src/core/MCPIntegration.js`) - MCP server coordination
- **Quality** (`src/core/QualityGates.js`) - Validation framework

## File Structure

```
src/
├── core/
│   ├── WorkflowGenerator.js     # Main workflow engine
│   ├── DependencyAnalyzer.js    # Dependency mapping
│   ├── RiskAssessment.js        # Risk analysis
│   ├── MCPIntegration.js        # MCP server integration
│   └── QualityGates.js          # Quality validation
├── personas/
│   ├── PersonaFactory.js        # Persona creation
│   ├── BasePersona.js           # Base persona class
│   ├── ArchitectPersona.js      # Systems architect
│   ├── FrontendPersona.js       # UI/UX specialist
│   ├── BackendPersona.js        # API/data specialist
│   ├── SecurityPersona.js       # Security expert
│   ├── DevOpsPersona.js         # Infrastructure expert
│   └── QAPersona.js             # Quality specialist
├── parsers/
│   └── PRDParser.js             # PRD parsing logic
├── formatters/
│   └── OutputFormatter.js       # Output formatting
└── index.js                     # CLI interface
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.