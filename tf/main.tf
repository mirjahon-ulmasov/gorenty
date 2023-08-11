terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "<= 3.42.0"
    }
  }
}

provider "aws" {
  region = var.region
  alias   = "us"
  profile = "aws_account_profile"
}
