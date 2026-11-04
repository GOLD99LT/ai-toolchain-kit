[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$node = (Get-Command node -ErrorAction Stop).Source
& $node (Join-Path $PSScriptRoot 'lib\pilot.mjs')
exit $LASTEXITCODE
