$sourceImagePath = "C:\Users\Mark Case\Documents\Final_Capstone_Project\merrimack-museum\images\a1.png"

for ($i = 1; $i -le 206; $i++) {
    $folderName = "a" + $i
    $imagePath = Join-Path $folderName "a1.png"
    Copy-Item $sourceImagePath $imagePath
}
