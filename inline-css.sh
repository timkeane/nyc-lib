
echo '=================='
echo '   Inlining CSS   '
echo '=================='
echo ''

rm ./dist/css/nyc-lib.css

dist_dir='./dist/css/'
src_dir='./src/css/'
src_files=( 'nyc-lib.css' 'nyc-ol-lib.css' )
theme_file=${1:-$src_dir"base.theme.css"}

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
      if [ "$css_import" != "base.theme.css" ]
      then
        echo "inlining import from $src_dir$css_import"
        cat $src_dir$css_import >> $css
      fi
    fi
  done
  
  perl -pi -e 's/\: /\:/g' $css
  perl -pi -e 's/  //g' $css
  perl -pi -e 's/\ {/\{/g' $css
  perl -pi -e 's/\: /\:/g' $css
  perl -pi -e 's/\, /\,/g' $css
  perl -pi -e 's/^[ \t]+//g' $css
  perl -pi -e 's/[ \t]+$//g' $css
  perl -pi -e 's/^[ \t]*$//g' $css
  perl -pi -e 's/[ \t]*$//' $css
	perl -pi -e 's/^[ \t]*//' $css
	perl -pi -e 's/\n\r//g' $css
	perl -pi -e 's/\n//g' $css

  cat $theme_file | while read line
  do
    if [ "$line" != "" ]
    then
      name=`echo $line | perl -nle 'm/(--.*?):/; print $1'`
      if [ "$name" != "" ]
      then
        name="var($name)"
        name=`echo $name | sed -e 's/[\/&]/\\&/g'`
        value=`echo $line | perl -nle 'm/:(.*);/s; print $1'`
        value=`echo $value | sed -e 's/[\/&]/\\&/g'`
        cmd="s/$name/$value/g"
        echo $cmd
        sed -i $cmd $css
      fi
    fi
  done

  # cat $css
done




#cat dist/css/nyc-lib.css