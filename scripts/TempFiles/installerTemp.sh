#!/bin/bash
RED="\033[0;31m"
ENDCOLOR="\033[0m"
DISTRIBUTION=`cat /etc/*-release | grep "DISTRIB_CODENAME" | sed -e 's/DISTRIB_CODENAME=//g'`
echo $DISTRIBUTION
mypass=$1
ARCHITECTURE=`uname -m`
set -e -x
sudo apt-get update
export http_proxy=http://proxy.iiit.ac.in:8080/

function VirtualBox()
{
        if [ -f /etc/apt/sources.list.d/VirtualBox.list ]
        then
                echo -e $GREEN"*VirtualBox Repository Found*"$ENDCOLOR
               
        else
                echo "=================================================="
                echo -e $BLUE"Adding the VirtualBox Repository"$ENDCOLOR
                sudo bash -c "echo 'deb http://download.virtualbox.org/virtualbox/debian $DISTRIBUTION contrib' > ./VirtualBox.list"
                sudo mv ./VirtualBox.list /etc/apt/sources.list.d/VirtualBox.list
                wget -q http://download.virtualbox.org/virtualbox/debian/oracle_vbox.asc -O- | sudo apt-key add -
        fi
	echo "Updating repository---------------------"
	echo -e $RED"Installing VirtualBox"$ENDCOLOR
        if [ $ARCHITECTURE = "i686" ]
        then
                wget -nc http://dlc.sun.com.edgesuite.net/virtualbox/4.2.6/virtualbox-4.2_4.2.6-82870~Ubuntu~$DISTRIBUTION\_i386.deb
        fi
        if [ $ARCHITECTURE = "x86_64" ]
        then
                wget -nc http://dlc.sun.com.edgesuite.net/virtualbox/4.2.6/virtualbox-4.2_4.2.6-82870~Ubuntu~$DISTRIBUTION\_amd64.deb
        fi
        sudo apt-get --force-yes -y install libcurl3 libqt4-network libqt4-opengl libqtcore4 libqtgui4 libsdl-ttf2.0-0 libaudio2 libmng1 libqt4-dbus libqt4-xml
        echo -e $RED"Removing Previous VirtualBox Versions"$ENDCOLOR
        sudo apt-get --force-yes -y remove virtualbox
        sudo dpkg -i virtualbox*
        rm ./virtualbox*
        RESTART="YES"
        echo "=================================================="
        echo -e $RED"Downloading VirtualBox Extensions"$ENDCOLOR
        wget -nc http://dlc.sun.com.edgesuite.net/virtualbox/4.2.4/Oracle_VM_VirtualBox_Extension_Pack-4.2.4.vbox-extpack
        echo "=================================================="
        sudo /etc/init.d/vboxdrv setup
        virtualbox&
        echo -e $RED"Starting VirtualBox"$ENDCOLOR
        return 
}

VirtualBox
