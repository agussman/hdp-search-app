pdfDir=pdf
txtDir=txt

if [ -d $txtDir ]
then
	rm -rf $txtDir
fi

mkdir $txtDir

for f in $pdfDir/*.pdf 
do 
	# rename pdf to txt
	txt=`echo $f | sed s/^$pdfDir/$txtDir/ | sed s/pdf$/txt/`
	pdftotext -nopgbrk -enc ASCII7 $f $txt
done

