import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecspatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as logs from 'aws-cdk-lib/aws-logs';

export class EcsAlbCloudfrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'NewVpcSvelte', {
      maxAzs: 3,
      natGateways: 1
    });
    const cluster = new ecs.Cluster(this, 'newClusterSvelte', { vpc });
     const fargateService = new ecspatterns.ApplicationLoadBalancedFargateService(
      this,
      'newFargateSvelte',
      {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 1, // Default is 1
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("gnm3000/svelteapp:v3"),
          containerPort: 3000,
          enableLogging: true,


        },
        listenerPort: 80,
      openListener: true,
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is true
    }
     );
   
    new cdk.CfnOutput(this, 'newLoadBalancerSvelte', {
      value: fargateService.loadBalancer.loadBalancerDnsName
    });
    

    // example resource
    // const queue = new sqs.Queue(this, 'EcsAlbCloudfrontQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
