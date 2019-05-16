DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"C:\Program Files (x86)\Windows Media Player\wmplayer" "$DIR/nowpushit.wav" || afplay nowpushit.wav || echo 'Push it real good!'
exit 0