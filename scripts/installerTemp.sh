#!/bin/bash
RED="\033[0;31m"
ENDCOLOR="\033[0m"
DISTRIBUTION=`cat /etc/*-release | grep "DISTRIB_CODENAME" | sed -e 's/DISTRIB_CODENAME=//g'`
echo $DISTRIBUTION
ARCHITECTURE=`uname -m`
set -e -x
sudo apt-get update
export http_proxy=http://proxy.iiit.ac.in:8080/

function Dropbox()
{
        echo "=================================================="
        echo -e $RED"Installing Dropbox"$ENDCOLOR
        if [ $ARCHITECTURE = "i686" ]
        then
                wget -nc http://linux.dropbox.com/packages/ubuntu/dropbox_1.4.0_i386.deb
        fi
        if [ $ARCHITECTURE = "x86_64" ]
        then
                wget -nc http://linux.dropbox.com/packages/ubuntu/dropbox_1.4.0_amd64.deb
        fi
        sudo dpkg -i ./dropbox*.deb
        rm ./dropbox*.deb
        sudo apt-get install --force-yes -y python-gpgme
        /usr/bin/python /usr/bin/dropbox start -i
}
Dropbox
