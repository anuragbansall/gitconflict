#!/bin/bash
set -e

CHALLENGES_DIR="$(cd "$(dirname "$0")/challenges" && pwd)"
GIT_EMAIL="dev@example.com"
GIT_NAME="Developer"

setup_git() {
  git config user.email "$GIT_EMAIL"
  git config user.name "$GIT_NAME"
  git config init.defaultBranch main
}

# ─────────────────────────────────────────────
# abort-the-merge
# Initial state: merge in progress with conflict
# ─────────────────────────────────────────────
setup_abort_the_merge() {
  local dir="$CHALLENGES_DIR/abort-the-merge/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function login(user) {
  if (user.valid) {
    console.log("Login");
  }
}

module.exports = { login };
EOF
  git add . && git commit -m "Initial commit"

  # Feature branch: changes the log line
  git checkout -b feature/login-update
  cat > app.js << 'EOF'
function login(user) {
  if (user.valid) {
    console.log("Login successful");
  }
}

module.exports = { login };
EOF
  git add . && git commit -m "Update login message"

  # Main: changes the same line differently
  git checkout main
  cat > app.js << 'EOF'
function login(user) {
  if (user.valid) {
    console.log("User authenticated");
  }
}

module.exports = { login };
EOF
  git add . && git commit -m "Improve auth message"

  # Start merge — leaves conflict + MERGE_HEAD
  git merge feature/login-update || true
  echo "✅ abort-the-merge"
}

# ─────────────────────────────────────────────
# delete-merged-branch
# Initial state: feature/user-profile merged into main, branch still exists
# ─────────────────────────────────────────────
setup_delete_merged_branch() {
  local dir="$CHALLENGES_DIR/delete-merged-branch/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

module.exports = { greet };
EOF
  git add . && git commit -m "Initial commit"

  git checkout -b feature/user-profile
  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

function getUserProfile(userId) {
  return { id: userId, name: "User " + userId };
}

module.exports = { greet, getUserProfile };
EOF
  git add . && git commit -m "Add user profile"

  git checkout main
  git merge feature/user-profile
  # Branch intentionally left — user must delete it
  echo "✅ delete-merged-branch"
}

# ─────────────────────────────────────────────
# embarrassing-commit-message
# Initial state: one commit with message "asdf"
# ─────────────────────────────────────────────
setup_embarrassing_commit_message() {
  local dir="$CHALLENGES_DIR/embarrassing-commit-message/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function authenticate(user) {
  if (user.token) {
    console.log("User authenticated");
    return true;
  }
  return false;
}

module.exports = { authenticate };
EOF
  git add . && git commit -m "asdf"
  echo "✅ embarrassing-commit-message"
}

# ─────────────────────────────────────────────
# implement-the-feature
# Initial state: on feature/user-profile, app.js modified but not committed
# ─────────────────────────────────────────────
setup_implement_the_feature() {
  local dir="$CHALLENGES_DIR/implement-the-feature/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

module.exports = { greet };
EOF
  git add . && git commit -m "Initial commit"

  git checkout -b feature/user-profile

  # Modify but do NOT commit — user must commit this
  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

// User Profile Feature
function getUserProfile(userId) {
  return { id: userId, name: "User " + userId };
}

module.exports = { greet, getUserProfile };
EOF
  echo "✅ implement-the-feature"
}

# ─────────────────────────────────────────────
# leaked-secrets
# Initial state: .env committed to git
# ─────────────────────────────────────────────
setup_leaked_secrets() {
  local dir="$CHALLENGES_DIR/leaked-secrets/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function start() {
  console.log("App started");
}

module.exports = { start };
EOF

  cat > .env << 'EOF'
DB_HOST=prod-db.internal
DB_USER=admin
DB_PASS=supersecret123
API_KEY=sk-live-abcdef123456
EOF

  git add . && git commit -m "Initial commit"
  echo "✅ leaked-secrets"
}

# ─────────────────────────────────────────────
# merge-the-feature
# Initial state: on main, feature/user-profile is ahead and ready to merge
# ─────────────────────────────────────────────
setup_merge_the_feature() {
  local dir="$CHALLENGES_DIR/merge-the-feature/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

module.exports = { greet };
EOF
  git add . && git commit -m "Initial commit"

  git checkout -b feature/user-profile
  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

// User Profile Feature
function getUserProfile(userId) {
  return { id: userId, name: "User " + userId };
}

module.exports = { greet, getUserProfile };
EOF
  git add . && git commit -m "Add User Profile Feature"

  git checkout main
  # Not merged yet — user must do it
  echo "✅ merge-the-feature"
}

# ─────────────────────────────────────────────
# resolve-merge-conflict
# Initial state: merge in progress, both useful changes must be kept
# ─────────────────────────────────────────────
setup_resolve_merge_conflict() {
  local dir="$CHALLENGES_DIR/resolve-merge-conflict/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function login(user) {
  if (user.valid) {
    console.log("Login");
  }
}

module.exports = { login };
EOF
  git add . && git commit -m "Initial commit"

  # Feature: add "Login successful"
  git checkout -b feature/login-update
  cat > app.js << 'EOF'
function login(user) {
  if (user.valid) {
    console.log("Login successful");
  }
}

module.exports = { login };
EOF
  git add . && git commit -m "Add login success log"

  # Main: change to "User authenticated"
  git checkout main
  cat > app.js << 'EOF'
function login(user) {
  if (user.valid) {
    console.log("User authenticated");
  }
}

module.exports = { login };
EOF
  git add . && git commit -m "Improve auth message"

  # Start merge — leaves conflict + MERGE_HEAD
  git merge feature/login-update || true
  echo "✅ resolve-merge-conflict"
}

# ─────────────────────────────────────────────
# start-a-new-feature
# Initial state: clean main, no feature branch
# ─────────────────────────────────────────────
setup_start_a_new_feature() {
  local dir="$CHALLENGES_DIR/start-a-new-feature/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function greet() {
  console.log("Hello, world!");
}

module.exports = { greet };
EOF
  git add . && git commit -m "Initial commit"
  echo "✅ start-a-new-feature"
}

# ─────────────────────────────────────────────
# undo-debugging
# Initial state: clean commit, working tree has debug code (not committed)
# ─────────────────────────────────────────────
setup_undo_debugging() {
  local dir="$CHALLENGES_DIR/undo-debugging/repo"
  rm -rf "$dir" && mkdir -p "$dir" && cd "$dir"
  git init && setup_git

  cat > app.js << 'EOF'
function authenticate(user) {
  if (user.token) {
    console.log("User authenticated");
    return true;
  }
  return false;
}

module.exports = { authenticate };
EOF
  git add . && git commit -m "Add authentication"

  # Add debug code to working tree — do NOT commit
  cat > app.js << 'EOF'
function authenticate(user) {
  console.log("DEBUG MODE ENABLED");
  console.log("TOKEN: " + user.token);
  if (user.token) {
    console.log("User authenticated");
    return true;
  }
  return false;
}

module.exports = { authenticate };
EOF
  echo "✅ undo-debugging"
}

setup_abort_the_merge
setup_delete_merged_branch
setup_embarrassing_commit_message
setup_implement_the_feature
setup_leaked_secrets
setup_merge_the_feature
setup_resolve_merge_conflict
setup_start_a_new_feature
setup_undo_debugging

echo ""
echo "🎉 All challenge repos ready!"
