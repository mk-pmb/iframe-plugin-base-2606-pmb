#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function experi2ghp_cli_init () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local REPOPATH="$(readlink -m -- "$BASH_SOURCE"/../..)"
  cd -- "$REPOPATH" || return $?

  [ "$(git branch | grep -Fe '*')" == '* experimental' ] ||
    return 4$(echo E: 'Wrong branch!' >&2)
  elp || return $?

  local LIST=()
  local C_SUBJ="$(git log -n 1 --pretty=format:%s)"
  local UNCLEAN="$(git status --short -uno)"
  case "$C_SUBJ" in
    '[draft]'* | \
    '[towards]'* )
      guess-js-deps usy || return $?
      [ -z "$UNCLEAN" ] || git-amend-forcepush -- $(echo '
        package.json
        src/deps.mjs
        ') || return $?
      ;;
  esac
  git status --short -uno | grep . && return 4$(echo E: unclean >&2) || true
  ./build/build.sh || return $?
  ghpages-autodist-bundles || return $?
}










experi2ghp_cli_init "$@"; exit $?
