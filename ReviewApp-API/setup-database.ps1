# PowerShell script to create review database in MySQL
# Usage: .\setup-database.ps1 [mysql-pod-name]

Write-Host "Setting up Review database..." -ForegroundColor Cyan

# Get MySQL pod name if not provided
if ($args.Count -eq 0) {
    $mysqlPod = kubectl get pods -l app.kubernetes.io/name=mysql-chart -o jsonpath='{.items[0].metadata.name}' 2>$null
    if ([string]::IsNullOrEmpty($mysqlPod)) {
        Write-Host "Error: Could not find MySQL pod. Please provide pod name as argument." -ForegroundColor Red
        Write-Host "Usage: .\setup-database.ps1 <mysql-pod-name>" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "Found MySQL pod: $mysqlPod" -ForegroundColor Green
} else {
    $mysqlPod = $args[0]
}

# Create review database
Write-Host "Creating review database..." -ForegroundColor Yellow
kubectl exec -it $mysqlPod -- mysql -u admin -padmin -e "CREATE DATABASE IF NOT EXISTS review;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    exit 1
}

# Grant permissions
Write-Host "Granting permissions..." -ForegroundColor Yellow
kubectl exec -it $mysqlPod -- mysql -u admin -padmin -e "GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%'; FLUSH PRIVILEGES;"

# Verify
Write-Host "Verifying database creation..." -ForegroundColor Yellow
kubectl exec -it $mysqlPod -- mysql -u admin -padmin -e "SHOW DATABASES;"

Write-Host "`n✅ Review database setup complete!" -ForegroundColor Green
Write-Host "You can now deploy the Review Service." -ForegroundColor Cyan


