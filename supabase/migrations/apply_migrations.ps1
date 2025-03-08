# Check if Supabase CLI is installed
$supabase = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabase) {
    Write-Error "Supabase CLI is not installed. Please install it first."
    exit 1
}

# Apply migrations
Write-Host "Applying migrations..."
try {
    # Initialize Supabase if needed
    if (-not (Test-Path .supabase)) {
        supabase init
    }

    # Link to your project
    supabase link --project-ref "udbwynamyknfloazdjlm"

    # Apply migrations
    supabase db push

    # Verify migrations
    Write-Host "Verifying migrations..."
    supabase db reset --dry-run

    Write-Host "Migrations applied successfully!"
} catch {
    Write-Error "Error applying migrations: $_"
    Write-Host "Rolling back changes..."
    supabase db reset
    exit 1
} 