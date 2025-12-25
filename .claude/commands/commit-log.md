---
description: Review changes, create detailed log, then commit with approval
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git branch:*), Write, Edit, Read, AskUserQuestion
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

**IMPORTANT**: Follow these steps IN ORDER:

1. **Analyze all changes** - Review both staged and unstaged changes thoroughly

2. **Draft commit message**:
   - If user provided a message ($ARGUMENTS), use it but ensure it's descriptive
   - If no message provided, generate a clear, conventional commit message based on the changes
   - Make it comprehensive - explain the "what" and "why"

3. **Stage all relevant files**:
   - Stage all files that should be included in the commit
   - Ask user if uncertain about what to include

4. **Create detailed log file FIRST** (BEFORE committing):
   - Create filename format: `YYYY-MM-DD-commit-summary.md` (e.g., `2025-12-25-add-oauth-support.md`)
   - Save to `docs/commit-logs/` directory
   - Use "PENDING - Will be updated after commit" for the commit hash field
   - Include in the log:
     - **Date and Time**: Current timestamp (will be approximate)
     - **Commit Hash**: "PENDING - Will be updated after commit"
     - **Commit Message**: The drafted commit message
     - **Branch**: Current branch name
     - **Files Changed**: Complete list with change type (Added/Modified/Deleted)
     - **Detailed Changes**: For each file, describe what changed and why
     - **Summary**: High-level overview of what this commit accomplishes
     - **Impact**: What features/functionality this affects
     - **Statistics**: Lines added/removed/modified

5. **Show summary and ask for approval**:
   - Display the commit message you drafted
   - Show the log file path that was created
   - Use AskUserQuestion to ask: "Ready to commit with this message?"
   - Options: "Yes, commit now" or "No, cancel"

6. **If approved, create the commit**:
   - Create the commit with the drafted message
   - Add the standard footer:
     ```
     🤖 Generated with [Claude Code](https://claude.com/claude-code)

     Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
     ```

7. **Update the log file with actual commit hash**:
   - Get the actual commit hash
   - Get the actual commit timestamp
   - Update the log file to replace "PENDING" with the real commit hash and exact timestamp

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

**Critical Workflow Order**:
1. ✅ Analyze changes thoroughly
2. ✅ Draft commit message
3. ✅ Stage files
4. ✅ **CREATE LOG FILE FIRST** (with "PENDING" hash)
5. ✅ **ASK USER FOR APPROVAL** (always required)
6. ✅ Commit (only if approved)
7. ✅ Update log file with actual commit hash

**Best Practices**:
- Be thorough in analyzing the changes - understand what changed and why
- Generate meaningful commit messages that explain the "what" and "why"
- Ensure the log filename is descriptive and follows the date-name format
- If there are merge conflicts or issues, report them clearly
- If user declines approval, do NOT commit and ask what they'd like to change
- Never skip asking for approval - this is a required safety step
