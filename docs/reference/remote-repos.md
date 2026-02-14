# Remote Repository Support

Clide supports both local and remote repositories. Remote repositories (e.g., on GPU clusters) are accessed via SSH.

## Detecting Remote Repositories

When reading `data/repos.json`, check if a repository has the `remote` field:

```json
{
  "name": "rosalind",
  "path": "/home/joetey/rosalind",
  "remote": {
    "enabled": true,
    "ssh_host": "chimera-gpu-agent",
    "type": "cluster"
  }
}
```

If `remote.enabled` is `true`, all operations for this repository must be executed via SSH.

## SSH Command Execution

For remote repositories, wrap all Bash commands with SSH:

**Pattern:** `ssh {ssh_host} 'cd {repo_path} && {command}'`

**Examples:**
- Local: `git status`
- Remote: `ssh chimera-gpu-agent 'cd /home/joetey/rosalind && git status'`

**Important:**
- Always `cd` to the repository path first in the SSH command
- Use single quotes to prevent local shell expansion
- Chain multiple commands with `&&` in a single SSH call when possible to reduce latency

## File Operations on Remote Repos

When working with remote repositories, file operations must be executed via SSH:

**Reading files:**
```bash
ssh chimera-gpu-agent 'cat /home/joetey/rosalind/README.md'
```

**Writing files:**
```bash
ssh chimera-gpu-agent 'cat > /home/joetey/rosalind/file.txt' <<'EOF'
file contents here
EOF
```

**Grep:**
```bash
ssh chimera-gpu-agent 'cd /home/joetey/rosalind && grep -r "pattern" .'
```

**Glob/Find:**
```bash
ssh chimera-gpu-agent 'cd /home/joetey/rosalind && find . -name "*.py"'
```

## Sub-Agent Prompts for Remote Repos

When spawning sub-agents for remote repositories, include special instructions in the prompt (see `prompts/remote-repo-instructions.template.md`):

```markdown
IMPORTANT - REMOTE REPOSITORY:
This repository is located on a remote GPU cluster. All operations must be executed via SSH.

SSH Host: {ssh_host}
Repository Path: {repo_path}

ALL Bash commands must use this pattern:
ssh {ssh_host} 'cd {repo_path} && YOUR_COMMAND_HERE'

Examples:
- Check status: ssh {ssh_host} 'cd {repo_path} && git status'
- Run tests: ssh {ssh_host} 'cd {repo_path} && pytest tests/'
- Install deps: ssh {ssh_host} 'cd {repo_path} && pip install -r requirements.txt'

For file operations:
- Read: ssh {ssh_host} 'cat {repo_path}/file.py'
- Write: ssh {ssh_host} 'cat > {repo_path}/file.py' <<'EOF'
  [content]
  EOF

CRITICAL: Never execute commands locally for this repository. Always use SSH.
You have full access to the cluster's GPU resources for training, testing, etc.
```

## Git Worktrees on Remote Repos

Git worktrees for remote repos are created on the remote machine:

**In `scripts/init-worktree.sh`:**
- Detect if repo is remote by checking `data/repos.json`
- If remote, execute git worktree commands via SSH:
  ```bash
  ssh {ssh_host} 'cd {repo_path} && git worktree add -b {branch} {worktree_path}'
  ```
- Return the worktree path (which will be a remote path)

**In `scripts/cleanup-worktree.sh`:**
- If remote, cleanup via SSH:
  ```bash
  ssh {ssh_host} 'cd {repo_path} && git worktree remove {worktree_path}'
  ```

## Remote Repo Benefits

- **GPU Access**: Sub-agents can leverage cluster GPUs for training, inference, etc.
- **Large Datasets**: Work with datasets that exist only on the cluster
- **Cluster Resources**: Use cluster-specific tools, environments, libraries
- **No Local Sync**: No need to download/sync large repos locally
