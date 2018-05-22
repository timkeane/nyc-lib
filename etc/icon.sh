ink=${3:-'/Applications/Inkscape.app/Contents/Resources/bin/inkscape-bin'}
infile=$1
outdir=$2

sizes=(512 384 256 192 180 167 152 120 76 60)

for size in ${sizes[@]}
do
	$ink --file=$infile --export-png=$outdiricon-$size.png --export-area-page --export-width=$size --export-height=$size	
done

