#!/bin/bash
RED="\033[0;31m"
ENDCOLOR="\033[0m"
DISTRIBUTION=`cat /etc/*-release | grep "DISTRIB_CODENAME" | sed -e 's/DISTRIB_CODENAME=//g'`
#echo $DISTRIBUTION
mypass=$1
ARCHITECTURE=`uname -m`

function installSoftwaresForUbuntu()
{
	cat scriptLines.txt > installerTemp.sh
	arr=$(echo $1 | tr "\:" "\n")
	for x in $arr
	do
		cat "ubuntuFiles/"$x".txt" >> installerTemp.sh
		echo $x >> installerTemp.sh
	done
	chmod +x installerTemp.sh
	nova boot --key_name sandeep --user_data ./installerTemp.sh --image d8f83529-6ecb-47de-a361-d48ec24f0cc7 --flavor 1 instance1


}

function installSoftwaresForFedora()
{
	echo "To be updated----"

}


while  true
do
	flag=0
	os_type=$(zenity  --list  --width=600 --height=670 --text "Choose Operating System" --radiolist  --column "Select" --column "Option" TRUE "Ubuntu" FALSE "Fedora" --separator=":");
	if [ $? == 1 ]
	then 
		exit 0
	fi
	layers=$(zenity --width=600 --height=670 --entry --text "Number of Layers" --entry-text "1");
	if [ $? == 1 ]
	then 
		zenity --error --text "Installation cancelled"
	#	exit 0
	else 	
		flag=1
		if [ $layers -eq 0 ]
		then
			zenity --error --text "Installation terminated"
			exit 0
		fi
	fi
	if [ $flag -eq 1 ]
	then 
		break
	fi
done
i=0
c=0
read line < configOfUbuntu
while ((c<layers)); do
	
	ans=$(zenity  --list  --width=600 --height=670 --text "Choose your Software Installations for Layer $(($c+1))" --checklist  --column "Select" --column "Options" $line --separator=":")
	if [ "$ans" = "" ]
	then 
		((c++))
	else
		ansArr[$i]=$ans	
		((i++))
		((c++))
	fi
done

c=0
while ((c<i)) ; do
	
	if [ "$os_type" = "Ubuntu" ] ; then 
		installSoftwaresForUbuntu ${ansArr[$c]}
	else
		installSoftwaresForFedora ${ansArr[$c]}
	fi
	((c++))
done


