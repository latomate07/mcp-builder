#!/usr/bin/env bash
# Builds the deployable directory for one Lambda function: its handler
# code, the shared modules under src/ it may import, and any third-party
# dependencies — `archive_file`'s source_file only zips a single file, so
# everything the function needs at runtime has to be assembled here first.
#
# Usage:
#   build_lambda.sh <src_root> <build_dir> <architecture> <function_name> [dependency...]
#
#   src_root      path to apps/backend/src
#   build_dir     path to the directory that will be zipped
#   architecture  arm64 or x86_64 — must match the Lambda's declared Architectures
#   function_name name of the folder under src/functions/ to package
#   dependency... optional list of PyPI packages to bundle (e.g. pydantic).
#                 Skip if the function only uses the stdlib and boto3,
#                 which is already present in the Lambda Python runtime.
set -euo pipefail

SRC_ROOT="$1"
BUILD_DIR="$2"
ARCHITECTURE="$3"
FUNCTION_NAME="$4"
shift 4
DEPENDENCIES=("$@")

case "$ARCHITECTURE" in
  arm64)   PYTHON_PLATFORM="aarch64-manylinux2014" ;;
  x86_64)  PYTHON_PLATFORM="x86_64-manylinux2014" ;;
  *) echo "Unknown architecture: $ARCHITECTURE (expected arm64 or x86_64)" >&2; exit 1 ;;
esac

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

cp "$SRC_ROOT/functions/$FUNCTION_NAME/index.py" "$BUILD_DIR/index.py"

# Bundle every shared module directory (services/, validations/, ...)
# alongside the handler, so a new shared package "just works" for every
# Lambda without touching this script.
for dir in "$SRC_ROOT"/*/; do
  name=$(basename "$dir")
  [ "$name" = "functions" ] && continue
  cp -r "$dir" "$BUILD_DIR/$name"
done

if [ "${#DEPENDENCIES[@]}" -gt 0 ]; then
  # Target python3.12/manylinux explicitly since the local Python version
  # (see apps/backend/.python-version) may not match the Lambda runtime,
  # and the compiled wheels must match the Lambda's actual CPU architecture.
  uv pip install \
    --target "$BUILD_DIR" \
    --python-platform "$PYTHON_PLATFORM" \
    --python-version 3.12 \
    --only-binary=:all: \
    "${DEPENDENCIES[@]}"
fi
