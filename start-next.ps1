$log = "C:\Users\Pawan\Desktop\orpind-website\nextjs.log"
$old = Get-Item $log -ErrorAction SilentlyContinue
if ($old) { $old | Remove-Item -Force }

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "C:\Program Files\nodejs\node.exe"
$psi.Arguments = "node_modules\next\dist\bin\next dev"
$psi.WorkingDirectory = "C:\Users\Pawan\Desktop\orpind-website"
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$p = [System.Diagnostics.Process]::Start($psi)
$p.Id | Out-File "C:\Users\Pawan\Desktop\orpind-website\nextjs.pid"
