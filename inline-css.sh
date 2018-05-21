
echo '=================='
echo '   Inlining CSS   '
echo '=================='
echo ''

rm ./dist/css/nyc-lib.css
#theme_file = $1

dist_dir='./dist/css/'
src_dir='./src/css/'
src_files=( 'nyc-lib.css' 'nyc-ol-lib.css' )
#src_files=( 'nyc-lib.css' )

mkdir -p $dist_dir

for src in "${src_files[@]}"
do
  css=$dist_dir$src
  touch $css
  cat $src_dir$src | while read import
  do
    css_import="${import/\@import/}"
    css_import="${css_import// /}"
    css_import="${css_import//\"}"
    css_import="${css_import//\;}"
    if [ "$css_import" != "" ]
    then
      echo "inlining import from $src_dir$css_import"
      cat $src_dir$css_import >> $css
    fi
  done
  sed -i 's/\: /\:/g' $css
  sed -i 's/  //g' $css
  sed -i 's/[ \t]*$//' $css
	sed -i 's/^[ \t]*//' $css
	sed -i ':a;N;$!ba;s/\n\r//g' $css
	sed -i ':a;N;$!ba;s/\n//g' $css
done