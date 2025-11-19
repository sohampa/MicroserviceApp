#!/bin/bash

# Script to create review database in MySQL
# Usage: ./setup-database.sh [mysql-pod-name]

echo "Setting up Review database..."

# Get MySQL pod name if not provided
if [ -z "$1" ]; then
    MYSQL_POD=$(kubectl get pods -l app.kubernetes.io/name=mysql-chart -o jsonpath='{.items[0].metadata.name}')
    if [ -z "$MYSQL_POD" ]; then
        echo "Error: Could not find MySQL pod. Please provide pod name as argument."
        exit 1
    fi
    echo "Found MySQL pod: $MYSQL_POD"
else
    MYSQL_POD=$1
fi

# Create review database
echo "Creating review database..."
kubectl exec -it $MYSQL_POD -- mysql -u admin -padmin -e "CREATE DATABASE IF NOT EXISTS review;"

# Grant permissions
echo "Granting permissions..."
kubectl exec -it $MYSQL_POD -- mysql -u admin -padmin -e "GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%'; FLUSH PRIVILEGES;"

# Verify
echo "Verifying database creation..."
kubectl exec -it $MYSQL_POD -- mysql -u admin -padmin -e "SHOW DATABASES;"

echo "✅ Review database setup complete!"
echo "You can now deploy the Review Service."


