import { CloudWatchLogsClient } from './client';
import { CloudFormationEvent, CloudFormationResponse, LambdaContext } from '@fancyguy/cfn-response';

const cloudwatchlogs = new CloudWatchLogsClient();

export interface ResourceProperties {
  LogGroup: string;
  RetentionInDays: number | string;
}

export function handler(event: CloudFormationEvent<ResourceProperties>, context: LambdaContext) {
  console.log('Received event:\n', JSON.stringify(event, null, 2));
  const response = new CloudFormationResponse(event, context);

  response.timeout = 60000;

  const logGroup: string = event.ResourceProperties.LogGroup;
  const retentionInDays: number = parseInt(event.ResourceProperties.RetentionInDays.toString(), 10);

  try {
    if (logGroup) {
      let request: Promise<any>;
      response.PhysicalResourceId = logGroup;

      switch (event.RequestType) {
        case 'Create':
        case 'Update':
          if (retentionInDays) {
            request = cloudwatchlogs.createLogGroup(logGroup)
              .then(() => {
                return cloudwatchlogs.putRetentionPolicy(logGroup, retentionInDays)
              });
          } else {
            throw new Error('RetentionInDays not specified');
          }
          break;
        case 'Delete':
          request = cloudwatchlogs.deleteRetentionPolicy(logGroup);
          break;
        default:
          throw new Error('The request type "' + event.RequestType + '" is not supported.');
      }

      request.then(() => {
        response.success({});
      }).catch((err) => {
        response.failed(err);
      });
    } else {
      throw new Error('LogGroup not specified');
    }
  } catch (err) {
    response.failed(err);
  }
}
