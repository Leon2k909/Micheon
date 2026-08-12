$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repoRoot "public\micheon-immersion-extension"
$destination = Join-Path $repoRoot "public\micheon-immersion-extension.zip"
$temporary = Join-Path ([System.IO.Path]::GetTempPath()) ("micheon-immersion-extension-" + [Guid]::NewGuid().ToString("N") + ".zip")

try {
  Compress-Archive -LiteralPath (Join-Path $source "data"), (Join-Path $source "icons"), (Join-Path $source "src"), (Join-Path $source "manifest.json"), (Join-Path $source "README.md") -DestinationPath $temporary -CompressionLevel Optimal
  Move-Item -LiteralPath $temporary -Destination $destination -Force
  Write-Output "Packed Micheon Immersion to $destination"
}
finally {
  if (Test-Path -LiteralPath $temporary) {
    Remove-Item -LiteralPath $temporary -Force
  }
}
