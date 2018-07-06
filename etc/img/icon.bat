set ink=%3
set infile=%1
set outdir=%2

set sizes=512 384 256 192 180 167 152 120 76 60

(for %%s in (%sizes%) do (
	%ink% --file=%infile% --export-png=%outdir%icon-%%s.png --export-area-page --export-width=%%s --export-height=%%s
))
