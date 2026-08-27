# CloudPulse — S3 CI/CD Project

A portfolio-ready Cloud Operations dashboard demonstrating **React + Vite + GitHub Actions + Amazon S3**.

## Architecture

```text
Developer
   |
   | git push origin main
   v
GitHub Repository
   |
   v
GitHub Actions (Ubuntu runner)
   |
   +--> checkout
   +--> npm install
   +--> npm run build
   +--> configure AWS credentials
   +--> aws s3 sync dist/ s3://BUCKET --delete
   |
   v
Amazon S3
   |
   v
Live static website
```

## Project goals

- Build a modern responsive frontend.
- Use GitHub as the source-code repository.
- Automatically build the application with GitHub Actions.
- Store AWS credentials in GitHub Secrets rather than source code.
- Deploy only the production `dist/` output to S3.
- Keep S3 synchronized using `aws s3 sync --delete`.
- Provide a clear DevOps story for interviews.

## Prerequisites

- AWS account
- S3 bucket
- IAM user or role with the required S3 permissions
- GitHub repository
- Node.js 20+ for local development
- Git

## 1. Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

Production build test:

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

## 2. Create the S3 bucket

Create a globally unique bucket in your preferred AWS Region.

For a simple learning/static-site setup, configure the bucket for website hosting and decide deliberately whether public access is appropriate.

For production, the recommended pattern is:

```text
S3 private bucket
      |
      v
CloudFront
      |
      v
Origin Access Control (OAC)
      |
      v
HTTPS website
```

Avoid making an S3 bucket public just because it is convenient.

## 3. IAM permissions

For learning, a deployment identity can be limited to the specific bucket. A simple policy shape is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

Replace `YOUR_BUCKET_NAME`.

For a real production environment, prefer short-lived credentials / GitHub OIDC instead of long-lived access keys.

## 4. GitHub Secrets

Go to:

**Repository → Settings → Secrets and variables → Actions → New repository secret**

Create:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET
AWS_REGION
```

Example region:

```text
ap-south-1
```

Never commit an AWS secret into the repository.

## 5. GitHub Actions

The workflow is:

```text
.github/workflows/deploy.yml
```

It runs automatically when code is pushed to `main`.

It also supports manual execution through **Run workflow** because `workflow_dispatch` is enabled.

### Pipeline stages

1. Checkout source
2. Setup Node.js 20
3. Install dependencies
4. Build Vite app
5. Configure AWS credentials
6. Sync `dist/` to S3
7. Print deployment summary

## 6. Trigger a deployment

```bash
git add .
git commit -m "Deploy CloudPulse"
git push origin main
```

Then open:

**GitHub → Actions → CloudPulse S3 CI/CD**

A successful run should show green checks for each step.

## 7. Why `dist/`?

Vite converts the development source into optimized production assets.

```text
src/
index.html
        |
        | npm run build
        v
dist/
├── index.html
└── assets/
```

Only `dist/` is deployed.

## 8. Why `--delete`?

The command:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET --delete
```

copies new/changed files and removes objects that no longer exist in `dist/`.

This keeps the bucket aligned with the latest build.

## 9. Production upgrade

For a stronger real-world architecture:

```text
GitHub
  |
GitHub Actions
  |
S3 private origin
  |
CloudFront
  |
HTTPS + custom domain
```

Then add:

- GitHub OIDC instead of access keys
- CloudFront Origin Access Control
- S3 versioning
- CloudWatch monitoring
- Route 53 DNS
- ACM certificate
- Branch protection
- Deployment approvals for production

## 10. Interview explanation

> I built a React/Vite cloud operations dashboard and implemented CI/CD using GitHub Actions. Every push to the main branch starts an Ubuntu runner, checks out the code, installs Node dependencies, builds the Vite application, authenticates to AWS using GitHub Secrets, and synchronizes the production dist directory to an Amazon S3 bucket. I also added a manual workflow trigger and used a least-privilege S3 deployment policy. For production, I would replace long-lived AWS keys with GitHub OIDC and put CloudFront in front of a private S3 bucket.

## Troubleshooting

### Build fails

Run locally:

```bash
npm install
npm run build
```

Fix the application error before pushing again.

### AWS credentials error

Check these GitHub Secrets:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
```

### Access denied from S3

Verify the IAM identity has:

```text
s3:ListBucket
s3:PutObject
s3:DeleteObject
s3:GetObject
```

on the correct bucket.

### Website shows an old version

If using CloudFront, invalidate the distribution cache after deployment.

---

## Portfolio value

This project demonstrates:

**Git → GitHub → CI/CD → Linux runner → Node/Vite build → AWS authentication → S3 deployment → Static website hosting**

It is intentionally designed so the infrastructure can later be upgraded to **OIDC + S3 private bucket + CloudFront + Route 53 + ACM**.
