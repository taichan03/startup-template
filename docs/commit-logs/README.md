# Commit Logs

This directory contains detailed logs of all commits made using the `/commit-log` slash command.

## Purpose

These logs provide comprehensive documentation of code changes, including:
- What files were changed
- Why changes were made
- Impact on features and functionality
- Detailed descriptions of modifications

## File Naming Convention

Logs are named using the format: `YYYY-MM-DD-commit-summary.md`

Examples:
- `2025-12-25-add-oauth-support.md`
- `2025-12-25-fix-authentication-bug.md`
- `2025-12-26-refactor-dashboard-components.md`

## Usage

Use the `/commit-log` command in Claude Code:

```bash
# Review changes, commit, and log (auto-generates message)
/commit-log

# With a specific commit message
/commit-log "feat: add user profile settings"
```

## Log Structure

Each log file contains:
- Commit metadata (hash, date, branch, author)
- Summary of changes
- List of files changed (added/modified/deleted)
- Detailed analysis of each file's changes
- Impact assessment
- Statistics (lines added/removed)
- Related information and notes

## Benefits

1. **Historical Context**: Understand why changes were made months later
2. **Team Communication**: Share detailed change information with team members
3. **Code Reviews**: Reference during code review processes
4. **Audit Trail**: Maintain compliance and track project evolution
5. **Onboarding**: Help new team members understand project history
