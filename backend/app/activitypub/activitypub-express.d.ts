declare module 'activitypub-express' {
  import { Express } from 'express';

  interface ApexOptions {
    name: string;
    domain: string;
    actorParam: string;
    objectParam: string;
  }

  function ActivitypubExpress(options: ApexOptions): Express;

  export = ActivitypubExpress;
}
