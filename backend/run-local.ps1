param(
  [string[]]$MavenArgs = @()
)

$ErrorActionPreference = "Stop"

function Test-JavaHome([string]$PathValue) {
  if ([string]::IsNullOrWhiteSpace($PathValue)) {
    return $false
  }

  $javaExe = Join-Path $PathValue "bin\java.exe"
  return (Test-Path -LiteralPath $javaExe)
}

function Resolve-JavaHome {
  if (Test-JavaHome $env:JAVA_HOME) {
    return $env:JAVA_HOME
  }

  $candidates = @(
    "C:\Users\nguye\AppData\Local\Temp\opencode\gplx-tools\jdk",
    "$env:USERPROFILE\.jdks\jdk-21",
    "$env:USERPROFILE\.jdks\openjdk-21",
    "$env:USERPROFILE\.jdks\temurin-21"
  )

  foreach ($candidate in $candidates) {
    if (Test-JavaHome $candidate) {
      return $candidate
    }
  }

  $searchedRoots = @(
    "$env:USERPROFILE\.jdks",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Java",
    "C:\Program Files\Microsoft",
    "C:\Program Files\Amazon Corretto",
    "C:\Program Files\Zulu"
  )

  foreach ($root in $searchedRoots) {
    if (-not (Test-Path -LiteralPath $root)) {
      continue
    }

    $match = Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue |
      Where-Object { Test-JavaHome $_.FullName } |
      Sort-Object FullName |
      Select-Object -First 1

    if ($match) {
      return $match.FullName
    }
  }

  throw "Khong tim thay JDK hop le. Hay cai JDK 21 hoac dat JAVA_HOME truoc khi chay script nay."
}

function Test-Postgres5433 {
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $async = $client.BeginConnect("127.0.0.1", 5433, $null, $null)
    $connected = $async.AsyncWaitHandle.WaitOne(1000)

    if (-not $connected) {
      $client.Close()
      return $false
    }

    $client.EndConnect($async)
    $client.Close()
    return $true
  } catch {
    return $false
  }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$mvnw = Join-Path $PSScriptRoot "mvnw.cmd"

if (-not (Test-Path -LiteralPath $mvnw)) {
  throw "Khong tim thay Maven Wrapper tai $mvnw"
}

$javaHome = Resolve-JavaHome
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

if (-not (Test-Postgres5433)) {
  throw "Khong ket noi duoc PostgreSQL Docker tren 127.0.0.1:5433. Hay chay: docker compose -f docker-compose.db.yml up -d"
}

$defaultArgs = @("spring-boot:run")
$allArgs = $defaultArgs + $MavenArgs

Write-Host "JAVA_HOME=$env:JAVA_HOME"
Write-Host "Running backend local against 127.0.0.1:5433 ..."

Push-Location $PSScriptRoot
try {
  & $mvnw @allArgs
} finally {
  Pop-Location
}
