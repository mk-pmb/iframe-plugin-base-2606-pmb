#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function build_cli_init () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local SELFPATH="$(readlink -m -- "$BASH_SOURCE"/..)"
  cd -- "$SELFPATH" || return $?
  ( cd .. && elp ) || return $?
  nodejs build.js || return $?
}


build_cli_init "$@"; exit $?
