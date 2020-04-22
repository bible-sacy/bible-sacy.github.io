
```
& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pngmono -r220 -sOutputFile='pngs\FOLDER\FOLDER-%00d.png'

-dFirstPage=303 -dLastPage=303

optipng.exe *.png

Get-ChildItem -Path . -Filter *.png -Recurse | Foreach { optipng.exe $_.fullname }

Get-ChildItem -Path . -Recurse -File -Filter *.png | Where-Object { $_.Length -gt 80kb } | Foreach { optipng.exe $_.fullname }
```