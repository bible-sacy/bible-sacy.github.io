
```
& 'C:\Program Files\gs\gs9.50\bin\gswin64c.exe' -dNOPAUSE -dBATCH -sDEVICE=pnggray -r250 -dFirstPage=580 -dLastPage=774 -sOutputFile='concorde\concorde-%00d.png' concorde.pdf

-dFirstPage=589 -dLastPage=774

optipng.exe *.png

Get-ChildItem -Path . -Filter *.png -Recurse | Foreach { optipng.exe $_.fullname }

Get-ChildItem -Path . -Recurse -File -Filter *.png | Where-Object { $_.Length -gt 80kb } | Foreach { optipng.exe $_.fullname }
```