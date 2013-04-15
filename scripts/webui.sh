#!/bin/bash
RED="\033[0;31m"
ENDCOLOR="\033[0m"
DISTRIBUTION=`cat /etc/*-release | grep "DISTRIB_CODENAME" | sed -e 's/DISTRIB_CODENAME=//g'`
ARCHITECTURE=`uname -m`
function installSoftwaresForUbuntu()
{
	cat /home/sandeep/sandeep/openstack/scripts/scriptLines.txt > /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
	arr=$(echo $data | tr "\:" "\n")
        k=0
        for x in $arr
	do
           if [ $k != 0 ]
           then
                cat "/home/sandeep/sandeep/openstack/scripts/ubuntuFiles/"$x".txt" >> /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
		echo $x >> /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
           fi
        ((k++))
        done
	echo "sandsand" | sudo -S chmod +x /home/sandeep/sandeep/openstack/scripts/installerTemp.sh 
	


}

function installSoftwaresForFedora()
{
	cat /home/sandeep/sandeep/openstack/scripts/scriptLines1.txt > /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
        arr=$(echo $data | tr "\:" "\n")
        k=0
        for x in $arr
	do
            if [ $k -gt 0 ]
            then
                cat "/home/sandeep/sandeep/openstack/scripts/fedoraFiles/"$x".txt" >> /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
		echo $x >> /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
            fi
        ((k++))
	done
        echo "sandsand" | sudo -S chmod +x /home/sandeep/sandeep/openstack/scripts/installerTemp.sh
	
}
data=$1
arr=$(echo $1 | tr "\:" "\n")
z=0
for x in $arr
do
if [ $z == 0 ]
then
os_type=$x
fi
((z++))
done
if [ "$os_type" = "Ubuntu" ] ; then 
		installSoftwaresForUbuntu 
	else
		installSoftwaresForFedora 
	fi

