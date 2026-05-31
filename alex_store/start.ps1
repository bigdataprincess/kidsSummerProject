# start.ps1 — tiny static-file HTTP server for Alexander's Photo Store.
# Uses only built-in PowerShell + .NET. No installs needed.
# Run by double-clicking start.bat (which calls this script).

$port = 8765
$root = $PSScriptRoot

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'text/javascript; charset=utf-8'
    '.mjs'  = 'text/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/markdown; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$prefix   = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "Could not start server on port $port." -ForegroundColor Red
    Write-Host "Maybe another program is using it. Edit `$port at the top of start.ps1 and try again."
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "  Alexander's Photo Store is running!" -ForegroundColor Magenta
Write-Host "  Open this in your browser:" -ForegroundColor Magenta
Write-Host "  $prefix" -ForegroundColor Cyan
Write-Host "  (Closing this window will stop the app.)" -ForegroundColor DarkGray
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host ""

# Auto-open the default browser
Start-Process $prefix | Out-Null

try {
    while ($listener.IsListening) {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        try {
            $relPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = 'index.html' }

            # Prevent path traversal
            $fullPath = [System.IO.Path]::GetFullPath((Join-Path $root $relPath))
            if (-not $fullPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $response.Close()
                continue
            }

            if (Test-Path $fullPath -PathType Container) {
                $fullPath = Join-Path $fullPath 'index.html'
            }

            if (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $msg = "404 Not Found: $relPath"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
                $response.StatusCode = 404
                $response.ContentType = 'text/plain; charset=utf-8'
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } catch {
            try { $response.StatusCode = 500 } catch {}
            Write-Host "Error handling request: $_" -ForegroundColor Red
        } finally {
            try { $response.OutputStream.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
