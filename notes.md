
```
gs -dNOPAUSE -dBATCH -sDEVICE=pnggray -r300 -sOutputFile='page-%00d.png' input.pdf
& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' 

mkdir pngs-o1\1781_desprez_genese

& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pnggray -r250 -sOutputFile='pngs-o1\1781_desprez_genese\1781_desprez_genese-%00d.png' .\pdfs-2\1781_desprez_genese_2DqNCaDbrBAC.pdf

optipng.exe -o3 pngs-o1/1781_desprez_genese/1781_desprez_genese-{1,2}*.png&
optipng.exe -o3 pngs-o1/1781_desprez_genese/1781_desprez_genese-{3,4}*.png&
optipng.exe -o3 pngs-o1/1781_desprez_genese/1781_desprez_genese-{5,6}*.png&
optipng.exe -o3 pngs-o1/1781_desprez_genese/1781_desprez_genese-{7,8}*.png&
optipng.exe -o3 pngs-o1/1781_desprez_genese/1781_desprez_genese-9*.png&

optipng.exe pngs-o1/1781_desprez_genese/*-704.png

& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pnggray -r250 -sOutputFile='pngs-o1/1781_beaume_at_t1_p_manquante\1781_beaume_at_t1_p_manquante-25.png' .\pdfs\Préface_Générale_La_Genèse_2DqNCaDbrBAC_page_manquante_dans_genèse_p25.pdf

optipng.exe 

& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pnggray -r250 -sOutputFile='pngs-nt-1/matthieu_1/matthieu_1-174.png' .\pdfs\bible_sacy_matthieu_1_p174.pdf

1404 x 2414
bible_sacy_matthieu_1_p174.pdf

```