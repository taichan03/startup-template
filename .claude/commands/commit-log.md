---
description: Review changes, commit, and create detailed log
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git branch:*), Write, Read
argument-hint: "[optional commit message]"
---

# Commit with Detailed Logging

## Step 1: Review Current Changes

**Current Branch**: !`git branch --show-current`

**Git Status**:
```
!`git status`
```

**Unstaged Changes**:
```
!`git diff`
```

**Staged Changes**:
```
!`git diff --staged`
```

**Recent Commits**:
```
!`git log --oneline -5`
```

## Step 2: Your Tasks

1. **Analyze all changes** - Review both staged and unstaged changes thoroughly
2. **Create a commit**:
   - If user provided a message ($ARGUMENTS), use it but ensure it's descriptive
   - If no message provided, generate a clear, conventional commit message based on the changes
   - Stage all relevant files (ask user if uncertain about what to include)
   - Create the commit with the message

3. **Generate detailed log file**:
   - Create filename format: `YYYY-MM-DD-commit-summary.md` (e.g., `2025-12-25-add-oauth-support.md`)
   - Save to `docs/commit-logs/` directory
   - Include in the log:
     - **Date and Time**: Full timestamp
     - **Commit Hash**: The commit SHA
     - **Commit Message**: The full commit message used
     - **Branch**: What branch this was committed to
     - **Files Changed**: Complete list with change type (Added/Modified/Deleted)
     - **Detailed Changes**: For each file, describe what changed and why
     - **Summary**: High-level overview of what this commit accomplishes
     - **Impact**: What features/functionality this affects
     - **Statistics**: Lines added/removed/modified

## Format for Log File

Use this template structure:

```markdown
# Commit Log: [Commit Message]

**Date**: [YYYY-MM-DD HH:MM:SS]
**Commit Hash**: [full SHA]
**Branch**: [branch name]
**Author**: [from git config]

## Summary

[High-level description of what this commit does]

## Files Changed

### Added
- `path/to/file1.ext` - [brief description]

### Modified
- `path/to/file2.ext` - [brief description]

### Deleted
- `path/to/file3.ext` - [brief description]

## Detailed Changes

### File: path/to/file1.ext
**Change Type**: Added/Modified/Deleted
**Purpose**: [Why this change was made]
**Description**: [Detailed description of what changed]

[Repeat for each file]

## Impact

**Features Affected**:
- [Feature 1]
- [Feature 2]

**Breaking Changes**: Yes/No
[If yes, describe what breaks and migration path]

## Statistics

- **Files Changed**: X
- **Lines Added**: +XXX
- **Lines Deleted**: -XXX
- **Net Change**: ±XXX

## Related

**Related Commits**: [If part of a larger feature]
**Issues/Tickets**: [If applicable]
**Documentation Updated**: Yes/No

## Notes

[Any additional context, decisions made, or follow-up items]
```

## Important Guidelines

- Be thorough in analyzing the changes - understand what changed and why
- Generate meaningful commit messages that explain the "what" and "why"
- Create the log file immediately after committing
- Ensure the log filename is descriptive and follows the date-name format
- If there are merge conflicts or issues, report them clearly
- Verify the commit was successful before creating the log
