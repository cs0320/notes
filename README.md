# CSCI 0320 notes

Adapted with thanks from the CSCI 1710 mdbook, set up by David Fryd.

## Instructions to Build

Built with MkDocs (Material theme) + `mike` for year-based versioning.

1. `python3 -m venv .venv && source .venv/bin/activate` (needed only within sandboxes/Linux)
2. `pip install -r requirements.txt`
3. `mkdocs serve -o` to preview the current branch without versioning.
4. `mike serve` to preview with the version dropdown across all deployed years.

## Versioning

- `main`: current semester's content.
- `f25`, `s25`, ...: frozen per-semester branches.
- Deploy one semester: `git checkout <branch> && mike deploy --push --update-aliases <version> latest`
- Set the default landing version: `mike set-default --push latest`
- `.github/workflows/deploy.yml` runs `mike deploy` automatically on push to `main`.

## Directory Structure

- `docs/`: MkDocs source for the branch you're on.
- `mkdocs.yml`: site config, nav, and `mike` version-provider settings.
- `archive/book/`: old mdBook source (pre-migration), kept for reference only.
- `.github/workflows/deploy.yml`: CI deploy via `mike`.