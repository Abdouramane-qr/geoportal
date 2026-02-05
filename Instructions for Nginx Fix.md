Okay, it looks like we have a few critical issues on your production server. Don't worry, we can fix them.

The most immediate problem is a syntax error in your Nginx configuration file (`/etc/nginx/sites-available/geoportal.conf`), which is preventing Nginx from starting. This is why Certbot is also failing, as it relies on a functional Nginx.

The error message:
`unknown directive "nginx" in /etc/nginx/sites-enabled/geoportal.conf:2`

This usually means that the file `geoportal.conf` contains an extra `nginx` keyword or some global Nginx configuration (like `user www-data;` or `worker_processes auto;`) that should *not* be inside a `server` block. Your `geoportal.conf` file should *start* with `server {` on the very first line.

**Action Required: Fix Nginx Configuration**

1.  **Open the Nginx configuration file for editing**:
    ```bash
    nano /etc/nginx/sites-available/geoportal.conf
    ```
2.  **Carefully review the content**. It should *only* contain the `server { ... }` block that I provided previously. **Remove any lines before `server {` and ensure that `server {` is on the very first line of the file (line 1), and there are no extra keywords like `nginx` or `http` outside of that block.**

    Here is the correct content for `geoportal.conf` again:

    ```nginx
    server {
        listen 80;
        listen [::]:80;
        server_name geoportal.smartschool.zapwize.com 149.102.140.189; # Ensure this matches your domain/IP

        root /var/www/html/geoportal/public;

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
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Keep this as 8.2 for now, we'll address PHP version next
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
    *Make sure to use your exact domain `geoportal.smartschool.zapwize.com` in `server_name`.*

3.  **Save and close the file** (`Ctrl+O`, `Enter`, `Ctrl+X`).

4.  **Test Nginx configuration again**:
    ```bash
    sudo nginx -t
    ```
    *   Expected output: `syntax is ok`, `test is successful`.

5.  **If the test is successful, restart Nginx**:
    ```bash
    sudo systemctl restart nginx
    sudo systemctl status nginx # Verify it's running
    ```
    *   Expected output for status: `active (running)`.

**Once Nginx is successfully running, please let me know. We will then address the PHP version conflict and re-run Certbot.**