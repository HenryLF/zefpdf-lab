#!/usr/bin/env bash
# Install or update zefpdf-lab from the latest main:
#   curl -fsSL https://raw.githubusercontent.com/HenryLF/zefpdf-lab/main/install.sh | bash
#
# The repo is cloned into ZEFPDF_LAB_HOME, then `bun link` puts it in bun's
# global node_modules and the zefpdf-lab command in ~/.bun/bin.
set -euo pipefail

REPO="${ZEFPDF_LAB_REPO:-https://github.com/HenryLF/zefpdf-lab.git}"
DIR="${ZEFPDF_LAB_HOME:-${XDG_DATA_HOME:-$HOME/.local/share}/zefpdf-lab}"
BUN_HOME="${BUN_INSTALL:-$HOME/.bun}"

for cmd in git bun; do
  if ! command -v "$cmd" >/dev/null; then
    echo "$cmd is required" >&2
    exit 1
  fi
done

if [ -d "$DIR/.git" ]; then
  echo "Updating $DIR"
  # bun link marks the bin executable: never let a mode bit block the merge.
  git -C "$DIR" config core.fileMode false
  git -C "$DIR" fetch --quiet origin main
  git -C "$DIR" checkout --quiet main
  git -C "$DIR" merge --ff-only --quiet origin/main
else
  echo "Cloning into $DIR"
  mkdir -p "$(dirname "$DIR")"
  git clone --quiet --branch main "$REPO" "$DIR"
  git -C "$DIR" config core.fileMode false
fi

cd "$DIR"
bun install
# Registers "link:zefpdf-lab" for projects and links the bin.
bun link

echo
echo "zefpdf-lab $(git rev-parse --short HEAD) installed in $DIR"
case ":$PATH:" in
  *":$BUN_HOME/bin:"*) ;;
  *) echo "Add $BUN_HOME/bin to your PATH to use the zefpdf-lab command." ;;
esac
echo "Start a document with: zefpdf-lab create <dir>"
