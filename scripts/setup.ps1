[CmdletBinding()]
param(
    [string]$ProfilePath = 'profiles/examples/code-context.json',
    [string[]]$Only = @(),
    [switch]$Apply,
    [string]$OutputPath,
    [string]$PrivateRootsPath
)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$core = Join-Path $PSScriptRoot 'lib\toolchain.mjs'
$node = (Get-Command node -ErrorAction Stop).Source
$arguments = @($core, 'plan', '--root', $projectRoot, '--profile', $ProfilePath)
if ($Only.Count -gt 0) { $arguments += @('--only', ($Only -join ',')) }
if ($PrivateRootsPath) { $arguments += @('--private-roots', $PrivateRootsPath) }
if ($OutputPath) { $arguments += @('--output', $OutputPath) }
$rawPlan = & $node @arguments
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$plan = ($rawPlan -join "`n") | ConvertFrom-Json
if (-not $Apply) {
    $rawPlan | Write-Output
    exit 0
}

$unsafeItems = @($plan.items | Where-Object { $_.status -eq 'blocked' -or $_.status -eq 'conflict' })
if ($unsafeItems.Count -gt 0) {
    $unsafeItems | Select-Object implementation_id,status,reason | Format-Table -AutoSize | Out-String | Write-Host
    Write-Error 'Apply stopped before any installation: resolve blocked/conflicting selections or choose an explicit -Only subset.'
    exit 1
}

$ready = @($plan.items | Where-Object { $_.status -eq 'ready' })
$npm = $null
if ($ready.Count -gt 0) { $npm = (Get-Command npm.cmd -ErrorAction Stop).Source }
# Check every selected lock before invoking the first external installer.
foreach ($item in $ready) {
    & $node $core check-runtime --root $projectRoot --source $item.source_id | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Runtime preflight failed: $($item.implementation_id)" }
}
foreach ($item in $ready) {
    $runtime = Join-Path $projectRoot $item.runtime_dir
    Write-Host ("Installing reviewed local tool: {0}@{1}" -f $item.package,$item.version)
    & $npm ci --prefix $runtime --ignore-scripts --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed: $($item.implementation_id)" }
}
foreach ($item in @($plan.items | Where-Object { $_.status -eq 'satisfied' })) {
    Write-Host ("Skipped matching installed tool: {0}" -f $item.implementation_id)
}
foreach ($item in @($plan.items | Where-Object { $_.status -eq 'manual' })) {
    Write-Host ("Manual/native workflow: {0}; see {1}" -f $item.implementation_id,$item.recipe)
}
Write-Host 'Installation steps finished. Run verify.ps1; this does not certify agent task compatibility.'
