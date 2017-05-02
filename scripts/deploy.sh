#!/usr/bin/env bash

declare -r DEFAULT_FUNC=LogRetentionPolicy
declare -r FUNCTION_SLUG=log-retention-policy

read -p "S3 bucket (and optional prefix) to store template assets (e.g. mybucket/code): " S3PATH
bucket=${S3PATH/\/*/}
prefix=${S3PATH/#$bucket}
if [ -n "$prefix" ]; then
    prefix=${prefix:1}
fi

read -p "Lambda function name [$DEFAULT_FUNC]: " FUNCTION
func_name=${FUNCTION:-$DEFAULT_FUNC}

declare -r DEFAULT_ROLE=${func_name}ExecutionRole
read -p "Lambda role name [$DEFAULT_ROLE]: " ROLE
role_name=${ROLE:-$DEFAULT_ROLE}

declare -r DEFAULT_STACK=CFN-${func_name}
read -p "CloudFormation stack name [$DEFAULT_STACK]: " STACK
stack_name=${STACK:-$DEFAULT_STACK}

zip -j -9 $FUNCTION_SLUG.zip dist/*.js

aws s3 cp cfn/$FUNCTION_SLUG.yml s3://${S3PATH}/
aws s3 cp $FUNCTION_SLUG.zip s3://${S3PATH}/

aws cloudformation create-stack --stack-name $stack_name --template-url https://s3.amazonaws.com/$S3PATH/$FUNCTION_SLUG.yml --parameters ParameterKey=S3Bucket,ParameterValue=$bucket ParameterKey=S3Prefix,ParameterValue=$prefix ParameterKey=FunctionName,ParameterValue=$func_name ParameterKey=RoleName,ParameterValue=$role_name --timeout-in-minutes 5 --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name $stack_name

rm -f $FUNCTION_SLUG.zip
