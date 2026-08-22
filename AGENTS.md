# Micheon workspace instructions

- After every code or feature change, validate the affected area, bump the patch version, commit the finished change, and push `main` so the GitHub release workflow publishes the Windows update for every Micheon installation.
- Do not make the user ask separately for the public updater release.
- Treat the task as complete only after the matching GitHub release is published with both the Windows installer and `latest.yml`; monitor the workflow until that is true.
- Preserve unrelated working-tree changes while preparing a release.
- A local-only install is not a substitute for the public updater release and is unnecessary unless the user explicitly asks for one.
