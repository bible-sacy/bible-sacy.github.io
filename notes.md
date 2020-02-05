
```
gs -dNOPAUSE -dBATCH -sDEVICE=pnggray -r300 -sOutputFile='page-%00d.png' input.pdf
& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' 

& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pnggray -r300 -sOutputFile='pngs-o1\1711_desprez_paralipomenes\1711_desprez_paralipomenes-%00d.png' .\pdfs-2\1711_desprez_paralipomenes_P_Oe5XEruFAC.pdf

optipng.exe -o3 pngs-o1/1711_desprez_paralipomenes/*.png
```