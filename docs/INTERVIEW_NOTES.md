# Interview Notes

## 30-second explanation

"I created a React/Vite static web application and automated its deployment to Amazon S3 using GitHub Actions. A push to main triggers an Ubuntu runner. The runner checks out the source, installs dependencies, builds the Vite application, configures AWS credentials from GitHub Secrets, and syncs the dist directory to S3. This gives me a repeatable CI/CD pipeline without needing a Jenkins server."

## Jenkins comparison

Jenkins:
- Jenkins controller/agent
- Webhook or SCM polling
- Pipeline stages
- Credentials store
- Deploy to target

GitHub Actions:
- GitHub workflow
- Push/manual trigger
- Jobs and steps
- GitHub Secrets
- Deploy to S3

The DevOps principle is the same: automate build, validation and deployment.

## What to improve next

1. Add automated tests.
2. Add a staging bucket.
3. Add production approval.
4. Replace access keys with OIDC.
5. Put CloudFront in front of private S3.
6. Add custom domain and HTTPS.
7. Add monitoring and rollback through S3 versioning.
