# Check for Node.js installation
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Installing Node.js..."
    # Download Node.js installer
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi" -OutFile "nodejs.msi"
    # Install Node.js
    Start-Process msiexec.exe -Wait -ArgumentList '/i nodejs.msi /quiet'
    Remove-Item nodejs.msi
}

# Check for Supabase CLI
$supabase = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabase) {
    Write-Host "Installing Supabase CLI..."
    npm install supabase --global
}

# Initialize Supabase project
if (-not (Test-Path .supabase)) {
    Write-Host "Initializing Supabase project..."
    supabase init
}

# Link to your project
Write-Host "Linking to Supabase project..."
supabase link --project-ref "udbwynamyknfloazdjlm"

Write-Host "Setup completed successfully!" 