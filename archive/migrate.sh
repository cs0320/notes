#!/bin/bash
# Migrate the F25 book from mdbook to mkdocs format.
# Converts admonish/details syntax and copies tracked assets.
#
# Unlike forge-fm's version of this script, asset copying is driven by
# `git ls-files` (not a raw filesystem `find`), so untracked work-in-progress
# files sitting in book/src/ are never pulled into the new docs/ tree.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$REPO_ROOT/book/src"
DST="$REPO_ROOT/docs"
CONVERT="$SCRIPT_DIR/convert.py"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting migration from mdbook to mkdocs...${NC}"
echo "Source: $SRC"
echo "Destination: $DST"
echo ""

if [ -d "$DST" ]; then
    echo "Cleaning existing docs directory..."
    rm -rf "$DST"
fi
mkdir -p "$DST"

# Chapter directories that are linked into SUMMARY.md today (i.e. actually
# part of the F25 book). mbt_pbt/ and s25/ are deliberately excluded: mbt_pbt
# is untracked WIP never linked into the book, and s25 is being archived
# separately, unconverted.
CHAPTER_DIRS=(
    "success-in-0320"
    "02_lambdas_validation"
    "03_bias_narrowing_refinements"
    "04_refinements_mutability"
    "05_threads_promises"
    "06_html_react"
    "algorithms"
    "security"
)

convert_md() {
    local src_file="$1"
    local dst_file="$2"
    mkdir -p "$(dirname "$dst_file")"
    python3 "$CONVERT" "$src_file" > "$dst_file"
    echo -e "${GREEN}Converted:${NC} ${src_file#$REPO_ROOT/}"
}

copy_asset() {
    local src_file="$1"
    local dst_file="$2"
    mkdir -p "$(dirname "$dst_file")"
    cp "$src_file" "$dst_file"
    echo -e "${GREEN}Copied:${NC} ${src_file#$REPO_ROOT/}"
}

mkdir -p "$DST/javascripts" "$DST/stylesheets"

cat > "$DST/javascripts/mathjax.js" << 'EOF'
window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {
  MathJax.startup.output.clearCache()
  MathJax.typesetClear()
  MathJax.texReset()
  MathJax.typesetPromise()
})
EOF

cat > "$DST/stylesheets/extra.css" << 'EOF'
/* Custom styles for CSCI 0320 Notes */

/* Ensure code blocks don't overflow */
.md-typeset pre > code {
  overflow-x: auto;
}
EOF

echo ""
echo -e "${BLUE}Converting/copying files (git-tracked only)...${NC}"

# Home page -> index.md
convert_md "$SRC/home.md" "$DST/index.md"

# Everything else: walk git's tracked file list for each chapter dir,
# converting .md and copying everything else as-is.
cd "$REPO_ROOT"
for dir in "${CHAPTER_DIRS[@]}"; do
    echo ""
    echo "Processing $dir..."
    git ls-files "book/src/$dir" | while read -r rel_path; do
        src_file="$REPO_ROOT/$rel_path"
        dst_rel="${rel_path#book/src/}"
        dst_file="$DST/$dst_rel"
        if [[ "$rel_path" == *.md ]]; then
            convert_md "$src_file" "$dst_file"
        else
            copy_asset "$src_file" "$dst_file"
        fi
    done
done

echo ""
echo -e "${GREEN}Migration complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit mkdocs.yml's nav: to match SUMMARY.md's structure"
echo "  2. Preview locally: mkdocs serve"
echo "  3. Build: mkdocs build --strict"
