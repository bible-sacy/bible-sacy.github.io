
```
gs -dNOPAUSE -dBATCH -sDEVICE=pnggray -r300 -sOutputFile='page-%00d.png' input.pdf
& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' 

mkdir pngs-o1\1711_desprez_esdras

& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pnggray -r250 -sOutputFile='pngs-o1\1711_desprez_esdras\1711_desprez_esdras-%00d.png' .\pdfs-2\1711_desprez_esdras_5lJPAAAAcAAJ.pdf

optipng.exe pngs-o1/1711_desprez_esdras/*.png
```