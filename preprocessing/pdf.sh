# declare and assign variables
dir=pdf
output=list.txt
numPerPage=100
declare -a fields=("cs" "physics" "math" "stat" "q-bio" "q-fin")

if [ -f $output ]
then
	rm $output
fi

if [ -d $dir ]
then
	rm -rf $dir
fi

mkdir $dir

# get pdf links
for field in ${fields[@]}
do
	for i in {0..10}
	do
  		url="http://arxiv.org/list/$field/pastweek?skip=$(($i*$numPerPage))&show=$numPerPage"
		curl -0 $url | grep -E -o pdf/[0-9]+\\.[0-9]+ | awk '{ print $0".pdf" }' | uniq >> $output
	done
done

# download pdfs
cat $output | xargs -I @ curl -o @ "http://arxiv.org/"@

