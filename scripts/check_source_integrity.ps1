param(
  [string]$Root = "."
)

$ErrorActionPreference = "Stop"

$extensions = @("*.html", "*.css", "*.js", "*.json", "*.md", "*.txt", "*.ps1")
$files = Get-ChildItem -Path $Root -Recurse -File -Include $extensions

$issues = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  $lines = Get-Content -Encoding UTF8 $file.FullName
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $lineNumber = $i + 1

    if ($line.Contains([char]0xFFFD)) {
      $issues.Add("$($file.FullName):$lineNumber contains replacement character U+FFFD")
    }

    $quoteCount = ([regex]::Matches($line, '"')).Count
    if (($quoteCount % 2) -ne 0) {
      $issues.Add("$($file.FullName):$lineNumber has an odd number of double quotes")
    }

    $backtickCount = ([regex]::Matches($line, '`')).Count
    if (($backtickCount % 2) -ne 0) {
      $issues.Add("$($file.FullName):$lineNumber has an odd number of backticks")
    }
  }
}

if ($issues.Count -eq 0) {
  Write-Output "OK: no obvious encoding or quote-balance issues found."
  exit 0
}

Write-Output "Detected possible source integrity issues:"
$issues | ForEach-Object { Write-Output $_ }
exit 1

