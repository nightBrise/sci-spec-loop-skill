// R2: remind the agent to gather evidence before pushing (advisory; never blocks).
// PreToolUse hook; stdout is appended to context by the harness.
let input = '';
process.stdin.on('data', (c) => { input += c; });
process.stdin.on('end', () => {
  let cmd = '';
  try { cmd = JSON.parse(input).tool_input?.command ?? ''; } catch { process.exit(0); }
  if (/(^|[;&|]\s*)git\s+push\b/.test(cmd)) {
    console.log('Reminder: run pre-push-checks for this diff and push with evidence (see pre-push-checks).');
  }
  process.exit(0);
});
