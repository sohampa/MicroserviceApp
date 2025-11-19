# Database Configuration for Review Service

## Current Setup

### MySQL Instance
- **Service Name**: `mysql-chart` (Kubernetes service)
- **Port**: `3306`
- **Root Password**: `admin`
- **User**: `admin`
- **Password**: `admin`
- **Current Database**: `product` (for Product Service)

### Review Service Database Requirements
- **Database Name**: `review`
- **Connection**: Same MySQL instance (`mysql-chart:3306`)
- **User**: `admin` (same user, has access to all databases)

---

## Database Configuration Options

### Option 1: Manual Database Creation (Recommended for Quick Setup)

After MySQL is deployed, connect and create the review database:

```bash
# Connect to MySQL pod
kubectl exec -it <mysql-pod-name> -- mysql -u admin -padmin

# Or use port-forward
kubectl port-forward svc/mysql-chart 3306:3306
# Then connect with: mysql -h 127.0.0.1 -u admin -padmin
```

**SQL Commands:**
```sql
-- Create review database
CREATE DATABASE IF NOT EXISTS review;

-- Verify database was created
SHOW DATABASES;

-- Grant permissions (if needed)
GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%';
FLUSH PRIVILEGES;
```

---

### Option 2: Update MySQL Chart to Create Both Databases

Modify the MySQL chart to support multiple databases:

**Update `ProductApp-API/charts/mysql/mysql-chart/values.yaml`:**
```yaml
env:
  mysqlrootpass: admin
  mysqldb: product  # Primary database (created automatically)
  mysqluser: admin
  mysqlpass: admin
  # Add additional databases
  additionalDatabases:
    - review
```

**Create an init script** `ProductApp-API/charts/mysql/mysql-chart/templates/init-db-configmap.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "mysql-chart.fullname" . }}-init
  labels:
    {{- include "mysql-chart.labels" . | nindent 4 }}
data:
  init-db.sql: |
    CREATE DATABASE IF NOT EXISTS review;
    GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%';
    FLUSH PRIVILEGES;
```

**Update deployment.yaml** to mount the init script:
```yaml
volumeMounts:
  - name: init-script
    mountPath: /docker-entrypoint-initdb.d
volumes:
  - name: init-script
    configMap:
      name: {{ include "mysql-chart.fullname" . }}-init
```

---

### Option 3: Use SQL Init Script (Simplest)

Create a SQL file and mount it as a volume:

1. **Create init script** `ProductApp-API/charts/mysql/mysql-chart/init-scripts/01-create-review-db.sql`:
```sql
CREATE DATABASE IF NOT EXISTS review;
GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%';
FLUSH PRIVILEGES;
```

2. **Mount in deployment** (MySQL automatically runs `.sql` files in `/docker-entrypoint-initdb.d`)

---

## Review Service Connection Configuration

### Current Configuration (ReviewApp-API/charts/review-api-chart/values.yaml):
```yaml
env:
  springDatasourceUrl: jdbc:mysql://mysql-chart:3306/review?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
  springDatasourceUsername: admin
  springDatasourcePassword: admin
```

### Application Properties (ReviewApp-API/src/main/resources/application.properties):
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create-drop  # Auto-creates tables on startup
```

**Note**: `ddl-auto=create-drop` will automatically create the `review` table structure when the Review Service starts, but the database itself must exist first.

---

## Deployment Steps

### Step 1: Deploy MySQL (if not already deployed)
```bash
cd ProductApp-API/charts/mysql/mysql-chart
helm install mysql . -f values.yaml
```

### Step 2: Create Review Database

**Option A: Using kubectl exec**
```bash
# Get MySQL pod name
kubectl get pods | grep mysql

# Connect and create database
kubectl exec -it <mysql-pod-name> -- mysql -u admin -padmin -e "CREATE DATABASE IF NOT EXISTS review;"
```

**Option B: Using port-forward**
```bash
# In terminal 1: Port forward
kubectl port-forward svc/mysql-chart 3306:3306

# In terminal 2: Connect with MySQL client
mysql -h 127.0.0.1 -u admin -padmin
# Then run: CREATE DATABASE IF NOT EXISTS review;
```

### Step 3: Verify Database
```sql
SHOW DATABASES;
-- Should show: product, review, information_schema, mysql, performance_schema, sys
```

### Step 4: Deploy Review Service
```bash
cd ReviewApp-API/charts/review-api-chart
helm install review-api . -f values.yaml
```

The Review Service will:
1. Connect to `mysql-chart:3306/review`
2. Auto-create the `review` table (JPA/Hibernate)
3. Be ready to accept requests

---

## Database Schema

The Review Service will automatically create this table:

```sql
CREATE TABLE review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    reviewer_name VARCHAR(255),
    rating INT,
    comment VARCHAR(255),
    review_date DATETIME
);
```

---

## Troubleshooting

### Issue: Review Service can't connect to database

**Check:**
1. MySQL pod is running: `kubectl get pods | grep mysql`
2. MySQL service exists: `kubectl get svc | grep mysql`
3. Review database exists: `kubectl exec -it <mysql-pod> -- mysql -u admin -padmin -e "SHOW DATABASES;"`
4. Network connectivity: Review Service can reach `mysql-chart:3306`

### Issue: Table not created

**Solution**: Check Review Service logs:
```bash
kubectl logs <review-service-pod>
```

The service should show JPA creating tables on startup.

### Issue: Permission denied

**Solution**: Grant permissions:
```sql
GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%';
FLUSH PRIVILEGES;
```

---

## Summary

**Minimal Setup Required:**
1. ✅ MySQL instance already deployed (for Product Service)
2. ✅ Create `review` database in same MySQL instance
3. ✅ Review Service connects to `mysql-chart:3306/review`
4. ✅ Tables auto-created by JPA on first startup

**No additional MySQL instance needed!** Both services share the same MySQL server but use different databases.


