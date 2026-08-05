$frontendDir = "C:\Users\Pawan\Desktop\orpind-website"
$backendDir = "C:\Users\Pawan\Desktop\orpind-website\backend"

$logDir = "$frontendDir\logs"
New-Item -ItemType Directory -Path $logDir -Force | Out-Null

$env:NEXT_USE_SWC_WASM = "1"

$feLog = "$logDir\frontend.log"
$beLog = "$logDir\backend.log"

$feJob = Start-Job -Name "frontend" -ScriptBlock {
  param($dir, $log)
  Set-Location $dir
  $env:NEXT_USE_SWC_WASM = "1"
  npm run dev *>&1 | Out-File -FilePath $log -Encoding utf8
} -ArgumentList $frontendDir, $feLog

Write-Output "Frontend starting (job id $($feJob.Id))..."

$beJob = Start-Job -Name "backend" -ScriptBlock {
  param($dir, $log)
  Set-Location $dir
  npm run dev *>&1 | Out-File -FilePath $log -Encoding utf8
} -ArgumentList $backendDir, $beLog

Write-Output "Backend starting (job id $($beJob.Id))..."

Write-Output "`nWaiting for servers to start..."
$count = 0
while ($count -lt 30) {
  Start-Sleep -Seconds 2
  $feRunning = $false; $beRunning = $false
  try { netstat -an | Select-String ":3000.*LISTENING" | Out-Null; $feRunning = $true } catch {}
  try { netstat -an | Select-String ":4000.*LISTENING" | Out-Null; $beRunning = $true } catch {}
  if ($feRunning -and $beRunning) { break }
  $count++
}

if ((netstat -an | Select-String ":3000.*LISTENING")) {
  Write-Output "✅ Frontend: http://localhost:3000"
} else {
  Write-Output "❌ Frontend not ready. Check logs\$feLog"
}

if ((netstat -an | Select-String ":4000.*LISTENING")) {
  Write-Output "✅ Backend: http://localhost:4000"
} else {
  Write-Output "❌ Backend not ready. Check logs\$beLog"
}

Write-Output "`nJobs running:"
Get-Job | Where-Object State -eq "Running" | Format-Table Id, Name, State
