resource "aws_s3_bucket" "typescript_bucket" {
  bucket = var.web_bucket
  tags = {
    Environment = var.tag
  }
}

resource "aws_s3_bucket" "django_bucket" {
  bucket = var.static_bucket
  tags = {
    Environment = var.tag
  }
}

resource "aws_s3_bucket_public_access_block" "typescript_bucket_block_public_access" {
  bucket = aws_s3_bucket.typescript_bucket.id

  block_public_acls         = true
  block_public_policy       = true
  restrict_public_buckets   = true
  ignore_public_acls        = true
}

resource "aws_s3_bucket_public_access_block" "django_bucket_block_public_access" {
  bucket = aws_s3_bucket.django_bucket.id

  block_public_acls         = true
  block_public_policy       = true
  restrict_public_buckets   = true
  ignore_public_acls        = true
}

data "aws_iam_policy_document" "typescript_s3_policy" {
  statement {
    sid = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"
    actions = [ "s3:GetObject"]
    resources = ["${aws_s3_bucket.typescript_bucket.arn}/*"]
    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [aws_cloudfront_distribution.typescript_cloudfront.arn]
    }
  }
  statement {
    sid = "2"
    effect = "Allow"
    actions = [ "s3:GetObject"]
    resources = ["${aws_s3_bucket.typescript_bucket.arn}/*"]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.typescript_origin_access_identity.iam_arn]
    }
  }
}

data "aws_iam_policy_document" "django_s3_policy" {
  statement {
    sid = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"
    actions = [ "s3:GetObject"]
    resources = ["${aws_s3_bucket.django_bucket.arn}/*"]
    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [aws_cloudfront_distribution.django_cloudfront.arn]
    }
  }
  statement {
    sid = "2"
    effect = "Allow"
    actions = [ "s3:GetObject"]
    resources = ["${aws_s3_bucket.django_bucket.arn}/*"]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.django_origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.typescript_bucket.id
  policy = data.aws_iam_policy_document.typescript_s3_policy.json
}

resource "aws_s3_bucket_policy" "static" {
  bucket = aws_s3_bucket.django_bucket.id
  policy = data.aws_iam_policy_document.django_s3_policy.json
}
