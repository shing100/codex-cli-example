# sc-workflow

SuperClaude Workflow Generator - Implementation workflow generator for PRDs and feature specifications

**Version:** 1.0.0
**Author:** Claude Code
**License:** MIT

## Table of Contents

- [Overview](#overview)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Examples](#examples)
- [Quick Reference](#quick-reference)

## Overview

### Architecture

**Pattern:** Modular Architecture

**Layers:**
- CLI Interface (src/index.js)
- Core Engine (src/core/)
- Expert Personas (src/personas/)
- Parsers & Formatters (src/parsers/, src/formatters/)

**Key Components:**
- WorkflowGenerator - Main orchestration engine
- PersonaFactory - Expert persona management
- PRDParser - Requirements parsing
- OutputFormatter - Multi-format output

## API Documentation

### commands/IndexCommand.js

#### Classes

**IndexCommand**

#### Functions

- `walkDir(dir)` (async)
- `walkDir(dir)` (async)

#### Exports

- `IndexCommand` (class)

### commands/index.js

### core/DependencyAnalyzer.js

#### Classes

**DependencyAnalyzer**

#### Exports

- `DependencyAnalyzer` (class)

### core/MCPIntegration.js

#### Classes

**MCPIntegration**

#### Exports

- `MCPIntegration` (class)

### core/QualityGates.js

#### Classes

**QualityGates**

#### Exports

- `QualityGates` (class)

### core/RiskAssessment.js

#### Classes

**RiskAssessment**

#### Exports

- `RiskAssessment` (class)

### core/WorkflowGenerator.js

#### Classes

**WorkflowGenerator**

#### Exports

- `WorkflowGenerator` (class)

### formatters/OutputFormatter.js

#### Classes

**OutputFormatter**

#### Exports

- `OutputFormatter` (class)

### index.js

#### Functions

- `validateInput(input)` (async)
- `saveWorkflow(workflow, filename)` (async)
- `formatComplexity(complexity)`
- `prompt(question)`
- `confirmPrompt(question)`

### parsers/PRDParser.js

#### Classes

**PRDParser**

#### Exports

- `PRDParser` (class)

### personas/ArchitectPersona.js

#### Classes

**ArchitectPersona** extends BasePersona

#### Exports

- `ArchitectPersona` (class)

### personas/BackendPersona.js

#### Classes

**BackendPersona** extends BasePersona

#### Exports

- `BackendPersona` (class)

### personas/BasePersona.js

#### Classes

**BasePersona**

#### Exports

- `BasePersona` (class)

### personas/DevOpsPersona.js

#### Classes

**DevOpsPersona** extends BasePersona

#### Exports

- `DevOpsPersona` (class)

### personas/FrontendPersona.js

#### Classes

**FrontendPersona** extends BasePersona

#### Exports

- `FrontendPersona` (class)

### personas/PersonaFactory.js

#### Classes

**PersonaFactory**

#### Exports

- `PersonaFactory` (class)

### personas/QAPersona.js

#### Classes

**QAPersona** extends BasePersona

#### Exports

- `QAPersona` (class)

### personas/SecurityPersona.js

#### Classes

**SecurityPersona** extends BasePersona

#### Exports

- `SecurityPersona` (class)

## Project Structure

### Directory Tree

```
📁 codex-example
  📄 CLAUDE.md
  📄 README.md
  📁 docs
  📁 examples
    📄 demo.js
    📄 sample-prd.md
  📄 package-lock.json
  📄 package.json
  📁 src
    📁 commands
      📄 IndexCommand.js
      📄 index.js
    📁 core
      📄 DependencyAnalyzer.js
      📄 MCPIntegration.js
      📄 QualityGates.js
      📄 RiskAssessment.js
      📄 WorkflowGenerator.js
    📁 formatters
      📄 OutputFormatter.js
    📄 index.js
    📁 parsers
      📄 PRDParser.js
    📁 personas
      📄 ArchitectPersona.js
      📄 BackendPersona.js
      📄 BasePersona.js
      📄 DevOpsPersona.js
      📄 FrontendPersona.js
      📄 PersonaFactory.js
      📄 QAPersona.js
      📄 SecurityPersona.js
    📁 utils
  📁 test
    📄 workflow-generator.test.js
```

### Summary

- **Total Files:** 18
- **Directories:** 6
- **Components:** 18

### File Types

- **.js:** 18 files

## Examples

### Basic Examples

#### Generate Basic Workflow

Generate a workflow from a simple feature description

```bash
npm start generate "Create user authentication system"
```

#### Generate from PRD File

Generate workflow from a Product Requirements Document

```bash
npm start generate examples/sample-prd.md
```

### Advanced Examples

#### Full-Featured Workflow

Generate comprehensive workflow with all features enabled

```bash
npm start generate examples/sample-prd.md --persona architect --strategy systematic --output detailed --estimate --dependencies --risks --parallel --milestones --all-mcp --save workflow.md
```

#### Frontend-Specific Workflow

Generate frontend-focused workflow with UI components

```bash
npm start generate "Build React dashboard with charts" --persona frontend --magic --output detailed --estimate
```

## Quick Reference

### Quick Start

```bash
# Install dependencies
npm install

# Basic usage
npm start generate "your feature description"

# Get help
npm start --help
```

### Available Commands

- **generate:** Generate workflow from PRD or description
- **personas:** List available expert personas
- **strategies:** List available workflow strategies
- **examples:** Show usage examples
- **interactive:** Interactive workflow generation

### Expert Personas

- **architect:** Systems architecture and design
- **frontend:** UI/UX and user experience
- **backend:** APIs and data architecture
- **security:** Security and compliance
- **devops:** Infrastructure and deployment
- **qa:** Quality assurance and testing

