# Portfolio GitHub Actions deployment

This package preserves the existing portfolio and adds automatic deployment version diagnostics.

## Before changing GitHub Pages settings
1. Download and unzip this package.
2. Upload/commit the contents of the `Portfolio-main` folder to the root of `ahost18/Portfolio` on branch `main`, preserving the existing files. The `.github/workflows/pages.yml` file is important. On GitHub's upload page, enable viewing hidden files if needed, or upload the `.github/workflows/pages.yml` file through the repository file editor.
3. Check that the workflow file is present at `.github/workflows/pages.yml` and that the `CNAME` file remains at the repository root.
4. Open the repository's **Actions** tab. The workflow should run on the push. It may not deploy yet while Pages is still configured to deploy from a branch; that is expected.
5. Open **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**, and save if prompted.
6. Wait for **Deploy portfolio to GitHub Pages** to finish successfully. Then test the custom domain and open the site-health footer.

## Important notes
- Do not delete or rename the `CNAME` file; keep the custom domain configured in Settings → Pages.
- This workflow deploys the repository root. It does not use the unrelated Cloudflare Worker.
- `build-info.json` is generated in the deployment artifact and is not meant to be manually edited or committed.
- The browser checks the public GitHub API without a token and caches the API result for 10 minutes per tab session. Network failures or GitHub rate limits produce a warning, not a claim that deployment failed.
- Keep your existing repository files. This is a replacement ZIP of the portfolio source, not an instruction to delete the repository and recreate it.
- If the Actions deployment fails, inspect the failed run's logs before making additional changes. You can temporarily switch Pages back to **Deploy from a branch** to restore the previous publishing method while troubleshooting.
