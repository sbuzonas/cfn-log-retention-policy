import * as CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { CloudFormationEvent, CloudFormationResponse, LambdaContext } from '@fancyguy/cfn-response';

const cloudwatchlogs = new CloudWatchLogs();

export interface ResourceProperties {
  LogGroup: string;
  RetentionInDays: number | string;
}

export function handler(event: CloudFormationEvent<ResourceProperties>, context: LambdaContext) {
  const response = new CloudFormationResponse(event, context);

  const logGroup: string = event.ResourceProperties.LogGroup;
  const retentionInDays: number = parseInt(event.ResourceProperties.RetentionInDays.toString(), 10);

  const responseHandler = (err: Error, data: {}) => {
    if (err) {
      response.failed(err);
    } else {
      response.success(data);
    }
  };

  try {
    if (logGroup) {
      response.PhysicalResourceId = logGroup;
      switch (event.RequestType) {
        case 'Create':
        case 'Update':
          if (retentionInDays) {
            cloudwatchlogs.putRetentionPolicy({
              logGroupName: logGroup,
              retentionInDays: retentionInDays
            }, responseHandler);
          } else {
            throw new Error('RetentionInDays not specified');
          }
          break;
        case 'Delete':
          cloudwatchlogs.deleteRetentionPolicy({
            logGroupName: logGroup,
          }, responseHandler);
          break;
        default:
          throw new Error('The request type "' + event.RequestType + '" is not supported.');
      }
    } else {
      throw new Error('LogGroup not specified');
    }
  } catch (err) {
    response.failed(err);
  }
}
