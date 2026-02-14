# Remote Repository Instructions Template

**IMPORTANT - REMOTE REPOSITORY:**

This repository is located on a remote GPU cluster. All operations must be executed via SSH.

**SSH Host:** {ssh_host}
**Repository Path:** {repo_path}

## Command Pattern

ALL Bash commands must use this pattern:
```
ssh {ssh_host} 'cd {repo_path} && YOUR_COMMAND_HERE'
```

## Examples

**Check status:**
```bash
ssh {ssh_host} 'cd {repo_path} && git status'
```

**Run tests:**
```bash
ssh {ssh_host} 'cd {repo_path} && pytest tests/'
```

**Install dependencies:**
```bash
ssh {ssh_host} 'cd {repo_path} && pip install -r requirements.txt'
```

## File Operations

**Read file:**
```bash
ssh {ssh_host} 'cat {repo_path}/file.py'
```

**Write file:**
```bash
ssh {ssh_host} 'cat > {repo_path}/file.py' <<'EOF'
[content]
EOF
```

## Critical Notes

- **NEVER execute commands locally** for this repository. Always use SSH.
- You have full access to the cluster's GPU resources for training, testing, etc.
- Chain multiple commands with `&&` to reduce SSH overhead
- Use single quotes to prevent local shell expansion
