variable "region" {
  default = "us-east-1"
  type = string
}

variable "web_bucket" {
  default = "go-renty-front-bucket"
  type = string
}

variable "static_bucket" {
  default = "go-renty-static-bucket"
  type = string
}

variable "root_domain_name" {
  default = "go-renty.com"
  type = string
}

variable "static_sub_domain_name" {
  default = "static.go-renty.com"
  type = string
}

variable "user" {
  default = "go-renty-front-gitlab-user"
  type = string
}

variable "tag" {
  default = "Prod"
  type = string
}
