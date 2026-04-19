#!/bin/bash
# ============================================================
# Frontend ko AWS S3 + CloudFront pe deploy karne ka script
# Pehle AWS CLI configure karo: aws configure
# ============================================================

set -e

# ---- CONFIG - Ye values apni replace karo ----
S3_BUCKET="bookstore-frontend-YOUR_NAME"       # Unique bucket name daalo
AWS_REGION="ap-south-1"                         # Mumbai region
BACKEND_URL="http://YOUR_EC2_PUBLIC_IP:8080/api"  # Backend ka URL

echo "=========================================="
echo "  Bookstore Frontend - S3 Deploy"
echo "=========================================="

# ---- 1. Check AWS CLI ----
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI install karo: https://aws.amazon.com/cli/"
    exit 1
fi

# ---- 2. Check Node ----
if ! command -v node &> /dev/null; then
    echo "❌ Node.js install karo: https://nodejs.org"
    exit 1
fi

# ---- 3. Build React App ----
echo "[1/4] React build kar raha hoon..."
cd bookstore/frontend
REACT_APP_API_URL=$BACKEND_URL npm run build

# ---- 4. Create S3 Bucket ----
echo "[2/4] S3 bucket bana raha hoon..."
aws s3api create-bucket \
    --bucket $S3_BUCKET \
    --region $AWS_REGION \
    --create-bucket-configuration LocationConstraint=$AWS_REGION 2>/dev/null || true

# Static website hosting enable karo
aws s3 website s3://$S3_BUCKET/ \
    --index-document index.html \
    --error-document index.html

# Public access allow karo
aws s3api delete-public-access-block \
    --bucket $S3_BUCKET

# Bucket policy set karo (public read)
aws s3api put-bucket-policy --bucket $S3_BUCKET --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Sid\": \"PublicReadGetObject\",
    \"Effect\": \"Allow\",
    \"Principal\": \"*\",
    \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$S3_BUCKET/*\"
  }]
}"

# ---- 5. Upload to S3 ----
echo "[3/4] Files S3 pe upload kar raha hoon..."
aws s3 sync build/ s3://$S3_BUCKET/ \
    --delete \
    --cache-control "max-age=31536000" \
    --exclude "index.html"

# index.html ko no-cache upload karo
aws s3 cp build/index.html s3://$S3_BUCKET/index.html \
    --cache-control "no-cache, no-store, must-revalidate"

echo "[4/4] Done!"

WEBSITE_URL="http://$S3_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
echo ""
echo "=========================================="
echo "  ✅ Frontend deploy ho gaya!"
echo "  Website URL: $WEBSITE_URL"
echo ""
echo "  💡 HTTPS ke liye CloudFront setup karo:"
echo "  1. AWS Console > CloudFront > Create Distribution"
echo "  2. Origin: $WEBSITE_URL"
echo "  3. Redirect HTTP to HTTPS"
echo "  4. Error pages: 404 -> /index.html (200)"
echo "=========================================="
