# CFN-LogRetentionPolicy

This package creates a CloudFormation custom resource for CloudWatch Logs log retention policies.

[![Launch Stack][launch-image]][launch-stack]

##### Topics

* [Syntax](#syntax)
* [Permissions](#permissions)
* [Properties](#properties)
* [Return Values](#return-values)
* [Examples](#examples)
* [More Info](#more-info)

### Syntax

To declare this entity in your AWS CloudFormation template, use the following syntax:

##### JSON

<big><pre>
{
&nbsp;&nbsp;&nbsp;&nbsp;"Type" : "Custom::LogRetentionPolicy",
&nbsp;&nbsp;&nbsp;&nbsp;"Properties" : {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Version": "1.0",
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"[ServiceToken](#servicetoken)": String,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"[LogGroup](#loggroup)": String,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"[RetentionInDays](#retentionindays)": Integer
&nbsp;&nbsp;&nbsp;&nbsp;}
}
</big></pre>

##### YAML

<big><pre>
Type: Custom::LogRetentionPolicy
Properties:
&nbsp;&nbsp;&nbsp;&nbsp;Version: '1.0'
&nbsp;&nbsp;&nbsp;&nbsp;[ServiceToken](#servicetoken): String
&nbsp;&nbsp;&nbsp;&nbsp;[LogGroup](#loggroup): String
&nbsp;&nbsp;&nbsp;&nbsp;[RetentionInDays](#retentionindays): Integer</pre></big>

### Permissions

### Properties

###### ServiceToken

The service token is the ARN to the Lambda function for the custom resource. It is exported for convenience as the function name with an optional prefix configured in the template.

*Required*: Yes

*Type*: String

*Update requires*: Updates are not supported.

###### LogGroup

The name of the log group. Creates a new log group if one does not already exist.

> ##### Note
> Changing the name requires replacement and will not delete the old log group.
> Use the `AWS::Logs::LogGroup` instead if you are in need of managing log groups.

*Required*: Yes

*Type*: String

*Update requires*: [Replacement][lifecycle:replacement]

###### RetentionInDays

The number of days log events are kept in CloudWatch Logs. When a log event expires, CloudWatch Logs automatically deletes it. For valid values, see [PutRetentionPolicy](http://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutRetentionPolicy.html) in the *Amazon CloudWatch Logs API Reference*.

*Required*: Yes

*Type*: Integer

*Update requires*: [No Interruption][lifecycle:no-interruption]

### Return Values

### Examples

### More Info


[launch-stack]: https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=CFN-LogRetentionPolicy&templateURL=https://s3.amazonaws.com/fancyguy-devops/cloudformation/templates/log-retention-policy.yml
[launch-image]: https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png

[lifecycle:replacement]: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement
[lifecycle:no-interruption]: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt
