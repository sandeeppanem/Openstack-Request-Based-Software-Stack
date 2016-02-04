#!/bin/bash
RED="\033[0;31m"
ENDCOLOR="\033[0m"
DISTRIBUTION=`cat /etc/*-release | grep "DISTRIB_CODENAME" | sed -e 's/DISTRIB_CODENAME=//g'`
#echo $DISTRIBUTION
mypass=$1
ARCHITECTURE=`uname -m`

function installSoftwaresForUbuntu()
{
	echo "Ubuntu"
	read line < configOfUbuntu
#	echo $line
	ans=$(zenity  --list  --width=600 --height=670 --text "Choose your Software Installations" --checklist  --column "Select" --column "Options" $line --separator=":")
        if [ $? == 1 ]
        then
                echo "Program Terminated"
                exit 0
        fi

	cat scriptLines.txt > installerTemp.sh
	arr=$(echo $ans | tr "\:" "\n")
	for x in $arr
	do
#		echo $x".txt"
		cat $x".txt" >> installerTemp.sh
		echo $x >> installerTemp.sh
	done
	chmod 777 installerTemp.sh
	nova boot --key_name sandeep --user_data ./installerTemp.sh --image d8f83529-6ecb-47de-a361-d48ec24f0cc7 --flavor 1 instance1 
}

function installSoftwaresForFedora()
{
	echo "To be updated----"

}

os_type=$(zenity  --list  --width=600 --height=670 --text "Choose Operating System" --radiolist  --column "Select" --column "Option" TRUE "Ubuntu" FALSE "Fedora" --separator=":")
#echo $ans
if [ "$os_type" = "Ubuntu" ] ; then 
	installSoftwaresForUbuntu
fi
if [ "$os_type" = "Fedora" ] ; then 
	installSoftwaresForFedora
fi


