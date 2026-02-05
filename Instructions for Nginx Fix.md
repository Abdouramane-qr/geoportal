Okay, it seems the Nginx configuration file (`/etc/nginx/sites-available/geoportal.conf`) still has an issue that is preventing Nginx from starting. The error "unknown directive 'nginx'" on line 2 means that there's an incorrect line at the very beginning of the file.

Also, I noticed that your server has PHP 8.3.30 installed. We need to update the Nginx configuration and our CI/CD pipeline to reflect this.

Let's fix the Nginx configuration first:

### Action Required: Fix Nginx Configuration (Again) and Update PHP Version

1.  **Open the Nginx configuration file for editing**:
    ```bash
    nano /etc/nginx/sites-available/geoportal.conf
    ```
2.  **Completely DELETE the current content of the file and replace it with the following**.
    *   **Do not include any other lines.**
    *   **Ensure `server {` is on the very first line.**
    *   I've updated the `fastcgi_pass` to use `php8.3-fpm.sock` to match your server's PHP version.
    *   I've also used `geoportal.smartschool.zapwize.com` as the primary domain.

    ```nginx
    server {
        listen 80;
        listen [::]:80;
        server_name geoportal.smartschool.zapwize.com www.geoportal.smartschool.zapwize.com 149.102.140.189;

        root /var/www/geoportal/public; # IMPORTANT: Using /var/www/geoportal as per your previous command

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
            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock; # UPDATED to php8.3
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
    *   **Very carefully check that there are no extra characters or lines before `server {`**.
    *   **Save and close the file** (`Ctrl+O`, `Enter`, `Ctrl+X`).

3.  **Test Nginx configuration again**:
    ```bash
    sudo nginx -t
    ```
    *   Expected output: `syntax is ok`, `test is successful`.

4.  **If the test is successful, restart Nginx**:
    ```bash
    sudo systemctl restart nginx
    sudo systemctl status nginx # Verify it's running
    ```
    *   Expected output for status: `active (running)`.

**Important Notes:**

*   **Application Directory**: I've adjusted the `root` directive in Nginx to `/var/www/geoportal/public` based on your `chown` command. This means your application should reside in `/var/www/geoportal`. If you intend to use `/var/www/html/geoportal`, please let me know, and we'll adjust everything accordingly.
*   **PHP 8.3**: We are now targeting PHP 8.3 for your server configuration. This means your `deploy.yml` will also need to be updated to use `php-version: '8.3'`. We will do this after Nginx is working.

**Once Nginx is successfully running, please confirm by telling me the output of `sudo systemctl status nginx`. We will then proceed to update your `deploy.yml` and re-run Certbot.**