const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const fs = require('fs');


const credentials = new AWS.Credentials({
  accessKeyId: 'ASIAWOILZTBHAOBFPP67',
  secretAccessKey: 'oZbNX3DRah9XZ6V4hdBW0siffB2LB4Lr4WL2yC4R',
  sessionToken: 'FwoGZXIvYXdzEJb//////////wEaDG3G/saROQYSzVyfWyKQAmV/2BqynLMWdQfFXZhCi2/s31kOuAEgUXr8ZkglC/GVCOWm04JfBztrkmO2PZ4ekV5vk5MtMhn2cu7fNjK9Mqk2PkXnOdDluHYf3+lR8esqGAXuHww2viCUR2Y0K3KZr1duwg+/atfbadhG+XgV6rvACD1M4yyvK5t7693f2rm0oUAE9mAW+84Nu6HhOgUGg6w6z3cBasOYK1AfhAo8CTeH5HLkVTAEeVKbsDYmzeCDezowMSzznRPPNJmx7PTtz/Y1pci3CEHkimLytMH6yO/Xlkyp7dHzQmFujtGSeDbE6GVjsJa8XTZDsTkjJEc5tEuAh9I6dioBpN+rgcO59Bqf8eWJ3KBVu5CihKL3g6BxKN3Xs6YGMivORmlEn9VHYWxDgG0LRWljNL1aaM/pHWdNDvVcnUmKqz/WHbWSj41/5Ezi',
  securityToken: 'FwoGZXIvYXdzEJb//////////wEaDG3G/saROQYSzVyfWyKQAmV/2BqynLMWdQfFXZhCi2/s31kOuAEgUXr8ZkglC/GVCOWm04JfBztrkmO2PZ4ekV5vk5MtMhn2cu7fNjK9Mqk2PkXnOdDluHYf3+lR8esqGAXuHww2viCUR2Y0K3KZr1duwg+/atfbadhG+XgV6rvACD1M4yyvK5t7693f2rm0oUAE9mAW+84Nu6HhOgUGg6w6z3cBasOYK1AfhAo8CTeH5HLkVTAEeVKbsDYmzeCDezowMSzznRPPNJmx7PTtz/Y1pci3CEHkimLytMH6yO/Xlkyp7dHzQmFujtGSeDbE6GVjsJa8XTZDsTkjJEc5tEuAh9I6dioBpN+rgcO59Bqf8eWJ3KBVu5CihKL3g6BxKN3Xs6YGMivORmlEn9VHYWxDgG0LRWljNL1aaM/pHWdNDvVcnUmKqz/WHbWSj41/5Ezi'

});
const cloudwatchlogs = new AWS.CloudWatchLogs({
  region: 'eu-west-1',
  credentials: credentials
});

app.get('/log-data', async (req, res) => {
  const limit = req.header('limit');
  const msisdn = req.header('msisdn');
  const params = {
    logGroupName: `/aws/lambda/dx-app-mvax-logging-lambda-prod1-common`,
    queryString: `fields requestTime, guid, msisdn, mvaxApiName, dalAPIName, errorCode, success, responseBody
    |filter msisdn = ${msisdn}
    |sort requestTime desc
    |filter success = 0
    |limit ${limit}`,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).getTime(),
    endTime: new Date().getTime(),
  };

  try {
    const queryResult = await cloudwatchlogs.startQuery(params).promise();
    const queryId = queryResult.queryId;

    let result = [];
    while (true) {
      const queryStatus = await cloudwatchlogs.getQueryResults({ queryId }).promise();
      if (queryStatus.status === 'Complete') {
        result = queryStatus.results;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before checking the query status again
    }

    let formattedResult = '';
    result.forEach(function (resultRow) {
      const responseBody = JSON.parse(resultRow.find(item => item.field === 'responseBody').value);
      formattedResult += '---\n'; // Adding a separator between each log entry
      resultRow.forEach(function (item) {
        if (item.field === 'responseBody') {
          // Skip the responseBody field since we've already parsed it
          return;
        }
        formattedResult += `${item.field}: ${item.value}\n`;
      });
      if (responseBody.errorMessage) {
        formattedResult += `Dal Error Message: ${responseBody.errorMessage}\n`;
        formattedResult += `Dal Error Code: ${responseBody.errorCode}\n`;
        formattedResult += `Dal Reference ID: ${responseBody.referenceId}\n`;
      } else {
        formattedResult += `Error Message: ${responseBody.status.analytics.status}\n`;
      }
    });


    // Send the formattedResult as the response to the client
    res.send(formattedResult);
  } catch (err) {
    console.error('Error querying log data:', err);
    res.status(500).send('Error querying log data');
  }
});

const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});