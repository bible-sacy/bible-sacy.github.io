#!/usr/bin/env bash
. subrepos.sh
for subrepo in $SUBREPOS
do
    pushd $subrepo >/dev/null
    echo "## ./$subrepo\$ $@"
    echo
    $@
    echo
    popd >/dev/null
done