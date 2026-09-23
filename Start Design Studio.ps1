$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory $projectRoot -WindowStyle Hidden
Start-Sleep -Seconds 1
Start-Process 'http://127.0.0.1:4177'
