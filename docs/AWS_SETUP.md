# AWS Setup Checklist

## S3

1. Create bucket.
2. Choose region.
3. Enable versioning.
4. For learning, configure static website hosting if you intentionally want direct S3 website access.
5. For production, keep the bucket private and use CloudFront OAC.
6. Record the bucket name and region.

## IAM

Create a deployment identity with access limited to the bucket.

Required actions for this demo:

- s3:ListBucket
- s3:PutObject
- s3:DeleteObject
- s3:GetObject

## GitHub

Add repository secrets:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_BUCKET
- AWS_REGION

## Deployment

Push to `main`.

GitHub Actions will run:

```text
Checkout
  ↓
Node 20
  ↓
npm install
  ↓
npm run build
  ↓
AWS credentials
  ↓
aws s3 sync dist/ s3://bucket --delete
```

## Recommended production security

Do not use a permanent AWS access key if you can use GitHub OIDC.

Recommended:

```text
GitHub Actions
      |
      | OIDC token
      v
AWS IAM Role
      |
      v
S3
```

This avoids storing a long-lived AWS secret in GitHub.
