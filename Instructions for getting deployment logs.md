Thank you for sharing the GitHub Actions summary!

I see that the deployment workflow (`.github/workflows/deploy.yml`) is consistently failing. This is why your site is not being updated automatically. The good news is that your `tests` and `linter` workflows seem to be passing, which means the code itself is okay.

To diagnose why the deployment is failing, I need to see the detailed logs of the failed `deploy` job.

**Please do the following:**

1.  **Go to the "Actions" tab** in your GitHub repository: `https://github.com/Abdouramane-qr/geoportal/actions`
2.  **Click on the most recent workflow run** that shows a "Failure" (it should be the one associated with the commit `d1eeafa` for "Confirmation of successful push and task completion").
3.  On the left sidebar, **click on the job named `.github/workflows/deploy.yml`** (or simply `deploy`). This job will be marked with a red 'X'.
4.  **Copy the entire output/logs from that failing job** and paste it here.

The logs will contain the specific error message that is causing the deployment to fail, which will allow me to help you fix it.