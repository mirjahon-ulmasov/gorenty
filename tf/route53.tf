data "aws_route53_zone" "hosted_zone" {
  name = var.root_domain_name
}

resource "aws_acm_certificate" "typescript_cert" {
  domain_name       = var.root_domain_name
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
  tags = {
    Environment = var.tag
  }
}

resource "aws_acm_certificate" "django_cert" {
  domain_name       = var.static_sub_domain_name
  validation_method = "DNS"
  lifecycle {
    create_before_destroy = true
  }
  tags = {
    Environment = var.tag
  }
}

resource "aws_route53_record" "typescript_cert_validation" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.typescript_cert.domain_validation_options)[0].resource_record_name
  records         = [ tolist(aws_acm_certificate.typescript_cert.domain_validation_options)[0].resource_record_value ]
  type            = tolist(aws_acm_certificate.typescript_cert.domain_validation_options)[0].resource_record_type
  zone_id  = data.aws_route53_zone.hosted_zone.id
  ttl      = 60
}

resource "aws_route53_record" "django_cert_validation" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.django_cert.domain_validation_options)[0].resource_record_name
  records         = [ tolist(aws_acm_certificate.django_cert.domain_validation_options)[0].resource_record_value ]
  type            = tolist(aws_acm_certificate.django_cert.domain_validation_options)[0].resource_record_type
  zone_id  = data.aws_route53_zone.hosted_zone.id
  ttl      = 60
}

resource "aws_acm_certificate_validation" "typescript_cert" {
  certificate_arn         = aws_acm_certificate.typescript_cert.arn
  validation_record_fqdns = [ aws_route53_record.typescript_cert_validation.fqdn ]
}

resource "aws_acm_certificate_validation" "django_cert" {
  certificate_arn         = aws_acm_certificate.django_cert.arn
  validation_record_fqdns = [ aws_route53_record.django_cert_validation.fqdn ]
}

resource "aws_route53_record" "web" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = data.aws_route53_zone.hosted_zone.name
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.typescript_cloudfront.domain_name
    zone_id                = aws_cloudfront_distribution.typescript_cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "static" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = var.static_sub_domain_name
  type = "A"

  alias {
    name                   = aws_cloudfront_distribution.django_cloudfront.domain_name
    zone_id                = aws_cloudfront_distribution.django_cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}
