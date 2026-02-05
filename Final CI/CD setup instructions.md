Okay, I have updated the `deploy.yml` file with the `SSH_TARGET_DIR` as `/var/www/html/geoportal`.

Here are the complete and final steps you need to take to enable your CI/CD pipeline:

### Step 1: Ensure `deploy.yml` is committed and pushed

Make sure the latest version of `deploy.yml` (with `TARGET: /var/www/html/geoportal` and `cd /var/www/html/geoportal` in the script) is committed and pushed to your `main` branch on GitHub.
If you have local changes that are not pushed, please do the following:
```bash
git add .github/workflows/deploy.yml
git commit -m "Update deploy.yml with SSH_TARGET_DIR"
git push origin main
```

### Step 2: Generate an SSH Key Pair (if you haven't already)

You need an SSH key pair to securely connect your GitHub Actions runner to your production server.

1.  **Open your terminal** (on your local machine, not the server).
2.  **Generate the key**: Run the following command:
    ```bash
    ssh-keygen -t ed25519 -f ~/.ssh/github-actions-geoportal -C "github-actions-geoportal-deploy-key"
    ```
    *   When prompted for a passphrase, **press Enter twice to leave it empty**. A passphrase will prevent automated deployments.
    *   This will create two files: `~/.ssh/github-actions-geoportal` (your **private key**) and `~/.ssh/github-actions-geoportal.pub` (your **public key**).

### Step 3: Add the Public Key to Your Production Server

You need to authorize the public key on your production server so GitHub Actions can log in.

1.  **Display your public key** on your local machine:
    ```bash
    cat ~/.ssh/github-actions-geoportal.pub
    ```
    Copy the *entire* output (it starts with `ssh-ed25519 ...`).

2.  **Log in to your production server** via SSH (using `ssh root@149.102.140.189`).
3.  **Append the public key** to your `authorized_keys` file:
    ```bash
    mkdir -p ~/.ssh
    echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```
    (Replace `PASTE_YOUR_PUBLIC_KEY_HERE` with the content you copied in step 2.1).

### Step 4: Configure GitHub Secrets in Your Repository

This is a critical step for security. You need to add the sensitive information as secrets in your GitHub repository.

1.  **Go to your GitHub repository**: `https://github.com/Abdouramane-qr/geoportal`
2.  **Navigate to Settings**: Click on the "Settings" tab.
3.  **Access Secrets**: In the left sidebar, go to `Secrets and variables` > `Actions`.
4.  **Add the following secrets** (if you haven't already):

    *   **`SSH_HOST`**:
        *   **Name**: `SSH_HOST`
        *   **Value**: `149.102.140.189`
        *   Click "Add secret".

    *   **`SSH_USER`**:
        *   **Name**: `SSH_USER`
        *   **Value**: `root`
        *   Click "Add secret".

    *   **`SSH_PRIVATE_KEY`**:
        *   **Name**: `SSH_PRIVATE_KEY`
        *   **Value**: **Copy the *entire content* of your private key file** (`~/.ssh/github-actions-geoportal`). This includes the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines.
        *   Click "Add secret".

    *   **`SSH_TARGET_DIR`**:
        *   **Name**: `SSH_TARGET_DIR`
        *   **Value**: `/var/www/html/geoportal`
        *   Click "Add secret".

### Step 5: Final Review of `deploy.yml` and Trigger Deployment

1.  **Review `deploy.yml`**: Double-check the `deploy.yml` file in your repository.
    *   **PHP Version**: Verify that `php-version: '8.2'` matches the PHP version on your production server.
    *   **Node.js Version**: Verify that `node-version: '20'` matches the Node.js version on your production server.
    *   Adjust these versions in your `deploy.yml` file if necessary and commit/push those changes.

2.  **Trigger the Deployment**: Once all GitHub Secrets are configured, and the `deploy.yml` is committed to your `main` branch, any new push to `main` will automatically trigger the deployment workflow.

3.  **Monitor the Workflow**: Go to the "Actions" tab in your GitHub repository to monitor the progress and output of your deployment workflow run. This is where you'll see if the deployment was successful or if any errors occurred.

This completes the setup for your CI/CD pipeline! Let me know if you have any questions during this process.