[CmdletBinding()]
param([string]$OutputPath)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$commands = @('node','npm.cmd','git','gh','codex','dsh','pnpm','uv','WindowsSandbox.exe')
$commandChecks = foreach ($name in $commands) {
    $entry = Get-Command $name -ErrorAction SilentlyContinue | Select-Object -First 1
    [PSCustomObject]@{ name=$name; found=[bool]$entry; path=if($entry){$entry.Source}else{$null} }
}
$nodeEntry = Get-Command node -ErrorAction SilentlyContinue | Select-Object -First 1
$nodeVersion = $null
$catalogCheck = $null
if ($nodeEntry) {
    $nodeVersion = (& $nodeEntry.Source --version | Out-String).Trim()
    $raw = & $nodeEntry.Source (Join-Path $PSScriptRoot 'lib\toolchain.mjs') validate --root $projectRoot
    if ($LASTEXITCODE -ne 0) { throw 'Catalog validation failed' }
    $catalogCheck = ($raw -join "`n") | ConvertFrom-Json
}
$uninstallPaths = @(
    'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
$apps = @()
foreach ($uninstallPath in $uninstallPaths) {
    $apps += @(Get-ItemProperty -Path $uninstallPath -ErrorAction SilentlyContinue |
        Where-Object { $_.DisplayName -match '^CC Switch$|^DeepSeek Harness' } |
        Select-Object DisplayName,DisplayVersion)
}
$sharedSkills = Join-Path $env:USERPROFILE '.agents\skills'
$legacySkills = Join-Path $env:USERPROFILE '.codex\skills'
$dshSkills = Join-Path $env:USERPROFILE '.dsh\skills'
$skillNames = foreach ($location in @($sharedSkills,$legacySkills,$dshSkills)) {
    if (Test-Path -LiteralPath $location) {
        foreach ($directory in @(Get-ChildItem -LiteralPath $location -Directory -ErrorAction SilentlyContinue)) {
            if (Test-Path -LiteralPath (Join-Path $directory.FullName 'SKILL.md')) {
                [PSCustomObject]@{ directory_name=$directory.Name; root=$location }
            }
        }
    }
}
$report = [ordered]@{
    schema_version=1; generated_at=[DateTime]::UtcNow.ToString('o'); mode='read-only';
    node_version=$nodeVersion; catalog=$catalogCheck; commands=@($commandChecks);
    installed_apps=@($apps); skill_directories=@($skillNames);
    isolation_verified=$false; credentials_read=$false;
    note='Directory names are inventory, not proof of skill discovery or task success. Complete Windows-user isolation has not been tested.'
}
$json = $report | ConvertTo-Json -Depth 8
if ($OutputPath) {
    if (-not $nodeEntry) { throw 'Node is required to validate a private report output path' }
    # The explicit command validates the path; UTF-8 JSON arrives via stdin.
    $json | & $nodeEntry.Source (Join-Path $PSScriptRoot 'lib\toolchain.mjs') write-report --root $projectRoot --output $OutputPath
    if ($LASTEXITCODE -ne 0) { throw 'Cannot write private doctor report' }
}
$json | Write-Output
if (-not $nodeEntry) { exit 2 }
