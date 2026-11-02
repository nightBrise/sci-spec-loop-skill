// R1: block history-rewriting and hook-bypassing git commands (red lines).
// PreToolUse hook; exit 2 = block, 0 = allow. Fail-open by harness design.
let input = '';
process.stdin.on('data', (c) => { input += c; });
process.stdin.on('end', () => {
  let cmd = '';
  try { cmd = JSON.parse(input).tool_input?.command ?? ''; } catch { process.exit(0); }
  const banned = [
    [/git\s+push\s+(-f\b|--force\b|--force-with-lease\b)/, 'force-push is banned (history rewrite)'],
    [/--no-verify/, '--no-verify is banned (never bypass hooks)'],
    [/git\s+rebase\b/, 'git rebase is banned (merge-only flow)'],
    [/git\s+reset\s+--hard\b/, 'git reset --hard is banned (may destroy uncommitted work)'],
  ];
  for (const [re, reason] of banned) {
    if (re.test(cmd)) { console.error(`Blocked: ${reason}`); process.exit(2); }
  }
  process.exit(0);
});
