pdfDir=pdf
imgDir=img

if [ -d $imgDir ]
then
	rm -rf $imgDir
fi

mkdir $imgDir

for f in $pdfDir/*.pdf 
do 
	img=`echo $f | sed s/^$pdfDir/$imgDir/ | sed s/pdf$/png/`
	convert $f[0] $img
done

