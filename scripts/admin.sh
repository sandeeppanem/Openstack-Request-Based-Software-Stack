#!/bin/bash
RED="\033[0;31m"
ENDCOLOR="\033[0m"
DISTRIBUTION=`cat /etc/*-release | grep "DISTRIB_CODENAME" | sed -e 's/DISTRIB_CODENAME=//g'`
#echo $DISTRIBUTION
mypass=$1
ARCHITECTURE=`uname -m`

function ubuntu(){
	FILESFOLDER="ubuntuFiles"
	adminActions "$FILESFOLDER"
}


function fedora(){
	FILESFOLDER="fedoraFiles"
	adminActions "$FILESFOLDER"
}


function adminActions(){
	option=$(zenity  --list  --width=600 --height=670 --text "Choose Operating System" --radiolist  --column "Select" --column "Option" TRUE "List All Softwares" FALSE "Add New Software" FALSE "Delete Software" --separator=":")

	if [ "$option" = "List All Softwares" ] ; then 
		listSoftwares "$1"
	elif [ "$option" = "Add New Software" ] ; then
		addSoftware "$1"
	elif [ "$option" = "Delete Software" ] ; then
		deleteSoftware	"$1"
	else
		echo "No selection"
		main
	fi

}

function listSoftwares(){
	echo "list Softwares"
	softwareList=""
	echo "listing Software in $1"
	for i in `ls $1/`
	do  
		sub="${i%%.txt}"
		softwareList="$softwareList $sub"
	done  
	ans=$(zenity  --list  --text "List of softwares"  --width 500 --height 570 --column "Software" $softwareList --separator=":")
	if [ "$?" = "0" ] ; then
		echo "Success in listing softwares"
		adminActions "$1"
	else
		echo "Error in list softwares"
		adminActions "$1"
	fi
}

function addSoftware(){
	echo "add Softwares"
	FILENAME=$(zenity --entry --title="Add new software" --text="Name of Software"  --entry-text "name")
	echo $FILENAME
	if [ "$FILENAME" != "" ] ; then
		for i in `ls $1/`
		do
			if [ "$FILENAME.txt" = "$i" ] ; then
				echo "File Already exist"
				zenity --error --text="Function with same name already exist!"
				adminActions "$1"
			fi
		done
		FILEPATH="$1/$FILENAME.txt"
		echo $FILEPATH
		FILEUPLOAD=`zenity --file-selection --title="Select a File"`
		echo $FILEUPLOAD
		if [ "$FILEUPLOAD" != "" ] ; then
			cat $FILEUPLOAD > $FILEPATH
			if [ "$?" = "0" ] ; then
				echo "Success in creating function file.. Now changing configOfUbuntu file"
				read line < configOfUbuntu
				line="$line FALSE $FILENAME"
				echo $line > configOfUbuntu
				if [ "$?" = "0" ] ; then
					zenity --info --text="Software added successfully!"
					adminActions "$1"
					echo "Success in changing configOfUbuntu file"
				else
					echo "Error in changing configOfUbuntu File"
				fi
		
			else
				echo "Error in creating file"
			fi
		else
			adminActions "$1"
		fi
	else
		adminActions "$1"
	fi
	
}

function deleteSoftware(){
	echo "delete Softwares"
	read line < configOfUbuntu
	ans=$(zenity  --list  --width=600 --height=670 --text "Choose your Software Installations" --checklist  --column "Select" --column "Options" $line --separator=":")
	if [ "$ans" != "" ] ; then
		arr=$(echo $ans | tr "\:" "\n")
		for x in $arr
		do
			echo $x
			line=`echo $line | sed -e s/FALSE\ $x//g`
			echo $line
			file="$1/$x.txt"
			if [ -f "$file" ] ; then
				rm $file
			else
				echo "File $x.txt does not exist"
			fi
		done
		echo $line > configOfUbuntu
		zenity --info --text="Software deleted successfully!"
		adminActions "$1"
	
	elif [ "$ans" = "" ] ; then
		zenity --error --text="No Software Selected!"
		adminActions "$1"
	fi
}


function main(){
	os_type=$(zenity  --list  --width=600 --height=670 --text "Choose Operating System" --radiolist  --column "Select" --column "Option" TRUE "Ubuntu" FALSE "Fedora" --separator=":")
	#echo $ans
	if [ "$os_type" = "Ubuntu" ] ; then 
		ubuntu
	elif [ "$os_type" = "Fedora" ] ; then 
		fedora
	elif [ "$os_type" = "" ] ; then 
		exit
	fi
}

main

