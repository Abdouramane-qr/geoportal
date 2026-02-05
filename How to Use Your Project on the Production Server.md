### How to Use Your Project on the Production Server (Initial Setup)

This guide covers the manual steps required on your production server *before* your first GitHub Actions deployment. Subsequent deployments will automate most of these steps.

**Assumptions:**

*   You have SSH access to your server as `root` (as provided: `root@149.102.140.189`).
*   Your `SSH_TARGET_DIR` is `/var/www/html/geoportal`.
*   You are using Nginx as your web server and PostgreSQL as your database.
*   Your production environment has PHP (version 8.2 or compatible) and Node.js (version 20 or compatible) installed.
*   You have a registered domain name (e.g., `geoportal.smartschool.zapwize.com`) that you want to use for your application.

---

### Step 0: Update DNS Records (Crucial for SSL)

Before you can install an SSL certificate, your domain name must point to your server's IP address.

1.  **Go to your domain registrar** (where you purchased `geoportal.smartschool.zapwize.com`).
2.  **Find your DNS settings**.
3.  **Create an A record**:
    *   **Type**: `A`
    *   **Name/Host**: `@` (for the root domain) or `www` (for the www subdomain)
    *   **Value/Points to**: `149.102.140.189` (your server's IP address)
    *   If you're using a subdomain (like `geoportal.smartschool.zapwize.com`), you'll likely create an A record for `geoportal` pointing to your IP.
4.  **Wait for DNS propagation**: This can take anywhere from a few minutes to several hours. You can check propagation using online tools like `dnschecker.org`.

### Step 1: Log in to Your Production Server

Open your terminal and SSH into your server:

```bash
ssh root@149.102.140.189
```

### Step 2: Install Necessary Software (if not already installed)

Ensure Nginx, PHP-FPM, and PostgreSQL are installed. The exact commands might vary based on your Linux distribution (e.g., Ubuntu/Debian vs. CentOS/RHEL).

**Example for Ubuntu/Debian:**

```bash
# Update package list
apt update
apt upgrade -y

# Install Nginx
apt install nginx -y

# Install PHP-FPM (replace 8.2 with your PHP version if different)
apt install php8.2-fpm php8.2-pgsql php8.2-mbstring php8.2-xml php8.2-ctype php8.2-json php8.2-tokenizer -y

# Install PostgreSQL client and server
apt install postgresql postgresql-contrib -y

# Install Node.js and NPM (if not present, ensure version 20 or compatible)
# You might use a Node Version Manager like nvm, or direct package installation:
# curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# apt-get install -y nodejs
```

### Step 3: Prepare Firewall (Open HTTP and HTTPS Ports)

Ensure your server's firewall allows HTTP (port 80) and HTTPS (port 443) traffic.

**For UFW (Ubuntu/Debian):**

```bash
ufw allow 'Nginx HTTP'
ufw allow 'Nginx HTTPS'
ufw enable # If firewall is not enabled
ufw status
```

**For FirewallD (CentOS/RHEL):**

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Step 4: Configure Nginx for Your Laravel Application (Initial HTTP Setup)

This initial Nginx configuration will serve your site over HTTP. Certbot will later automatically modify this file to enable HTTPS.

1.  **Create an Nginx server block configuration file**:
    ```bash
    nano /etc/nginx/sites-available/geoportal.conf
    ```
2.  **Paste the following configuration** into the file. Replace `your_domain.com` with your actual domain (e.g., `geoportal.smartschool.zapwize.com`).

    ```nginx
    server {
        listen 80;
        listen [::]:80;
        server_name geoportal.smartschool.zapwize.com www.geoportal.smartschool.zapwize.com; # Replace with your actual domain(s)

        root /var/www/html/geoportal/geoportal/public;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";

        index index.php index.html index.htm;
        charset utf-8;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location = /favicon.ico { access_log off; log_not_found off; }
        location = /robots.txt { access_log off; log_not_found off; }

        error_page 404 /index.php;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Adjust PHP-FPM socket path/version if needed
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
            fastcgi_buffers 16 16k;
            fastcgi_buffer_size 32k;
            fastcgi_read_timeout 600;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
    ```
    Save and close the file (`Ctrl+O`, `Enter`, `Ctrl+X`).

3.  **Enable the Nginx site and remove default**:
    ```bash
    ln -s /etc/nginx/sites-available/geoportal.conf /etc/nginx/sites-enabled/
    rm /etc/nginx/sites-enabled/default # Remove default Nginx config
    ```

4.  **Test Nginx configuration and restart**:
    ```bash
    nginx -t
    systemctl restart nginx
    systemctl enable nginx # Ensure Nginx starts on boot
    ```

### Step 5: Install SSL Certificates with Let's Encrypt and Certbot

This step will obtain a free SSL certificate from Let's Encrypt and configure Nginx to use it, automatically redirecting HTTP traffic to HTTPS.

1.  **Install Certbot and its Nginx plugin**:
    ```bash
    snap install core; snap refresh core
    snap install --classic certbot
    ln -s /snap/bin/certbot /usr/bin/certbot
    ```

2.  **Obtain the SSL Certificate**:
    Run Certbot. It will detect your Nginx configuration.
    ```bash
    sudo certbot --nginx -d your_domain.com -m your_email@example.com --agree-tos --no-eff-email
    ```
    *   Replace `your_domain.com` with your actual domain (e.g., `geoportal.smartschool.zapwize.com`).
    *   Replace `your_email@example.com` with your email address for urgent renewal notices.
    *   `--agree-tos` agrees to the Let's Encrypt Terms of Service.
    *   `--no-eff-email` opts out of sharing your email with EFF.

    Certbot will ask if you want to redirect HTTP traffic to HTTPS. **It is highly recommended to choose the option to redirect.**

3.  **Test Certbot's Auto-Renewal**:
    Let's Encrypt certificates are valid for 90 days. Certbot automatically sets up a cron job to renew them. You can test this process:
    ```bash
    sudo certbot renew --dry-run
    ```
    If no errors are reported, your certificates should renew automatically.

### Step 6: Configure PostgreSQL Database

1.  **Switch to the PostgreSQL user**:
    ```bash
    sudo -i -u postgres
    ```
2.  **Access the PostgreSQL prompt**:
    ```bash
    psql
    ```
3.  **Create a new database and user for your Laravel application**:
    ```sql
    CREATE DATABASE geoportal_db;
    CREATE USER geoportal_user WITH PASSWORD 'your_secure_password';
    GRANT ALL PRIVILEGES ON DATABASE geoportal_db TO geoportal_user;
    \q
    ```
    (Replace `geoportal_db`, `geoportal_user`, and `your_secure_password` with your desired credentials).
4.  **Exit PostgreSQL user**:
    ```bash
    exit
    ```

### Step 7: Prepare Your Application Directory

Create the application directory, which will be the target for GitHub Actions deployment:

```bash
mkdir -p /var/www/html/geoportal
chown -R www-data:www-data /var/www/html/geoportal # Change ownership to web server user (commonly www-data)
```
*Note: `www-data` is common for Ubuntu/Debian. For CentOS/RHEL, it might be `nginx` or `apache`.*

### Step 8: Configure Laravel Environment Variables (`.env`)

1.  **Create an empty `.env` file**:
    ```bash
    nano /var/www/html/geoportal/.env
    ```
2.  **Paste essential Laravel environment variables** and fill in your database credentials. **Crucially, set `APP_URL` to use `https`**:

    ```ini
    APP_NAME="GeoPortal"
    APP_ENV=production
    APP_KEY=
    APP_DEBUG=false
    APP_URL=https://your_domain.com # IMPORTANT: Use HTTPS here! Replace with your actual domain

    LOG_CHANNEL=stack
    LOG_LEVEL=debug

    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=geoportal_db # Your database name
    DB_USERNAME=geoportal_user # Your database user
    DB_PASSWORD=your_secure_password # Your database user password

    BROADCAST_DRIVER=log
    CACHE_DRIVER=file
    FILESYSTEM_DISK=local
    QUEUE_CONNECTION=sync
    SESSION_DRIVER=file
    SESSION_LIFETIME=120

    # For GitHub Actions (if needed)
    # GITHUB_ACTION_SECRET=your_github_action_secret
    ```
    Save and close the file.

3.  **Set correct permissions for the `.env` file**:
    ```bash
    chown www-data:www-data /var/www/html/geoportal/.env
    chmod 664 /var/www/html/geoportal/.env
    ```

### Step 9: Generate Laravel Application Key

The `APP_KEY` in your `.env` file needs to be generated. This command requires PHP and Composer, and for the project files to be present. Since your CI/CD will handle `composer install` and `php artisan migrate` automatically, you can either wait for the first deployment to run this or run this manually *after* the initial `git clone` or `rsync` from your CI/CD has populated the directory.

**Option A (Recommended: Let CI/CD handle it):** The CI/CD script is configured to run `php artisan migrate` and `php artisan optimize` commands. You might need to add `php artisan key:generate` to the post-deployment script in `deploy.yml` if it's not handled automatically by another step.

**Option B (Manual initial run after first CI/CD deployment):**
After your first successful CI/CD deployment copies files to `/var/www/html/geoportal`:
```bash
cd /var/www/html/geoportal
php artisan key:generate
chown -R www-data:www-data storage bootstrap/cache
```

### Step 10: Access Your Deployed Application

Once all the above steps are completed and your GitHub Actions workflow successfully deploys your code:

1.  **Open your web browser.**
2.  **Navigate to your server's domain name**: `https://your_domain.com` (e.g., `https://geoportal.smartschool.zapwize.com`).

You should see your GeoPortal application running over a secure HTTPS connection!

---

### Troubleshooting Tips

*   **GitHub Actions Logs**: If the deployment fails, check the "Actions" tab in your GitHub repository for detailed logs of each step.
*   **Certbot Logs**: Check `/var/log/letsencrypt/` on your server for Certbot errors during SSL certificate issuance or renewal.
*   **Nginx Logs**: Check `/var/log/nginx/error.log` and `/var/log/nginx/access.log` on your server for web server related issues.
*   **Laravel Logs**: Check `/var/www/html/geoportal/storage/logs/laravel.log` on your server for application errors.
*   **PHP-FPM Logs**: Check PHP-FPM logs (e.g., `/var/log/php8.2-fpm.log` or similar) for PHP processing issues.
*   **Firewall**: Double-check that ports 80 and 443 are open as per Step 3.

This comprehensive guide should help you get your application up and running on your production server with HTTPS. Let me know if you have any questions!