# Micheon workspace instructions

- After every code or feature change, validate the affected area, bump the patch version, commit the finished change, and push `main` so the GitHub release workflow publishes the Windows update for every Micheon installation.
- Do not make the user ask separately for the public updater release.
- Treat the task as complete only after the matching GitHub release is published with both the Windows installer and `latest.yml`; monitor the workflow until that is true.
- Preserve unrelated working-tree changes while preparing a release.
- A local-only install is not a substitute for the public updater release and is unnecessary unless the user explicitly asks for one.
- This repository is public. Nothing from the conversation goes into it — not the users' names, not their words, not the request that prompted a change. That includes COMMIT MESSAGES, which never pass through the file checks: never quote what a user said and never name who asked. Keep the reason, drop the source — describe the fault and the fix as facts about the app. `check:commit-privacy` enforces this for outgoing commits; a commit it refuses must be reworded (`git commit --amend`), not bypassed.
