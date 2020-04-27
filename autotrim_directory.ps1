param ([string]$directoryArg)

$directory = $directoryArg -replace '^\.\\', ''
$directory = $directory -replace '\\$', ''
$dirParts = $directory.split('\')
$dirPartsCount = $dirParts.Count
$lastPart = $dirParts[$dirPartsCount - 1]
$dirParts[$dirPartsCount - 1] = "trimmed-$lastPart"
$outputDir = $dirParts -join '\'

Write-Output "new directory: $outputDir"

mkdir -p $outputDir

Write-Output "trimming files in $directory to $outputDir"

Get-ChildItem -Path $directory -Filter *.png | ForEach-Object {

    Write-Output "trimming  file $directory\$_"

    $outputFile = "$outputDir\trimmed-$_"

    magick.exe $directory\$_ -shave 5x30 `( `+clone -virtual-pixel white -blur 0x15 -fuzz 15% -trim -set option:fuzzy_trim '%[fx:w+100]x%[fx:h+100]+%[fx:page.x-50]+%[fx:page.y-50]' `+delete `) -crop `%[fuzzy_trim] $outputFile

    optipng.exe $outputFile
}
