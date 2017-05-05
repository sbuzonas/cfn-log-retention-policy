import * as CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { AWSError } from 'aws-sdk/lib/error';

export class LogGroupNotFound extends Error {
  constructor(m: string) {
    super(m);

    (<any>Object).setPrototypeOf(this, LogGroupNotFound.prototype);
  }
}


export class CloudWatchLogsClient {
  client: CloudWatchLogs;

  constructor() {
    this.client = new CloudWatchLogs();

    this.getLogGroup = this.getLogGroup.bind(this);
  }

  getLogGroup(name: string): Promise<CloudWatchLogs.Types.LogGroup> {
    return new Promise((resolve, reject) => {
      // TODO: Figure out what to do if paged and no match
      this.client.describeLogGroups({
        logGroupNamePrefix: name
      }, (err: AWSError, data: CloudWatchLogs.Types.DescribeLogGroupsResponse) => {
        if (err) {
          reject(err);
        } else {
          let found = false;
          for (let logGroup of data.logGroups) {
            if (logGroup.logGroupName === name) {
              found = true;
              resolve(logGroup);
              break;
            }
          }
          if (!found) {
            reject(new LogGroupNotFound('LogGroup named "' + name + '" was not found'));
          }
        }
      });
    });
  }

  createLogGroup(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getLogGroup(name)
        .then(() => {
          resolve(false);
        })
        .catch((err) => {
          if (err instanceof LogGroupNotFound) {
            this.client.createLogGroup({
              logGroupName: name
            }, (err: AWSError, data: {}) => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          } else {
            reject(err);
          }
        });
    });
  }

  putRetentionPolicy(logGroup: string, retentionInDays: number): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.client.putRetentionPolicy({
        logGroupName: logGroup,
        retentionInDays: retentionInDays
      }, (err: AWSError, data: {}) => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }

  deleteRetentionPolicy(logGroup: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.client.deleteRetentionPolicy({
        logGroupName: logGroup
      }, (err: AWSError, data: {}) => {
        if (err) {
          reject(err);
        } else {
          resolve({});
        }
      });
    });
  }
}
