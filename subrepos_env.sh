#!/usr/bin/env bash

export SUBREPOS="pngs-at pngs-at-2 pngs-nt-1-trimmed pngs-nt-2 pngs-o1 pub ui"

function clone_subrepos {
    for subrepo in $SUBREPOS
    do
        git clone git@github.com:bible-sacy/$subrepo.git
    done
}

function foreach_subrepo {
    for subrepo in $SUBREPOS
    do
        pushd $subrepo >/dev/null
        echo "## ./$subrepo\$ $@"
        echo
        $@
        echo
        popd >/dev/null
    done
}