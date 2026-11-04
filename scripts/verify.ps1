[CmdletBinding()]
param(
    [string]$ProfilePath = 'profiles/examples/code-context.json',
    [string[]]$Only = @(),
    [switch]$ToolsOnly,
    [string]$OutputPath,
    [string]$PrivateRootsPath
)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$node = (Get-Command node -ErrorAction Stop).Source
$arguments = @((Join-Path $PSScriptRoot 'lib\toolchain.mjs'), 'verify', '--root', $projectRoot, '--profile', $ProfilePath)
if ($Only.Count -gt 0) { $arguments += @('--only', ($Only -join ',')) }
if ($ToolsOnly) { $arguments += '--tools-only' }
if ($OutputPath) { $arguments += @('--output', $OutputPath) }
if ($PrivateRootsPath) { $arguments += @('--private-roots', $PrivateRootsPath) }
& $node @arguments
exit $LASTEXITCODE
