# sync-templates

[![Continuous Integration](https://github.com/fiberplane/sync-templates/actions/workflows/ci.yml/badge.svg)](https://github.com/fiberplane/sync-templates/actions/workflows/ci.yml)

The `fiberplane/sync-templates` action is a utility that syncs your Fiberplane Templates from a designated directory in your repository with your Fiberplane Workspace.

## Usage
This action can be run on `ubuntu-latest` and `macos-latest` GitHub Actions runners.

A minimum working example of the action:
```yaml
steps:
- uses: fiberplane/sync-templates@v1
  with:
    api-token: ${{ secrets.FP_TOKEN }} # it is best practice to keep your secrets in GitHub Secrets
    workspace-id: ${{ secrets.FP_WORKSPACE_ID }}
```

The `sync-templates` action accepts the following inputs:
- `api-token` (**required**) - the Fiberplane API token used to access the workspace
- `workspace-id` (**required**) - the ID of the workspace where the Templates should be sync'ed to
- `templates-directory` (optional) - directory where valid Templates `*.jsonnet` files are located, default: `.fiberplane/templates/*`
- `fp-version` (optional) - explicit version of the `fp` CLI that should be used in the action, default: `latest`
- `fp-base-url`(optional) - the base URL of the Fiberplane API (always `studio.fiberplane.com`)

When run the action will:
1. Download, setup, and cache the Deno runtime and the Fiberplane CLI (`fp`).
2. Validate that the intended Templates are syntactically correct.
3. Create and/or upload the intended Templates to a Fiberplane Workspace
