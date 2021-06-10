interface QueryParam {
  param: string;
  desc: string;
}

interface Result {
  code: number;
  content: any;
}

interface BodyArgument {
  type: 'string' | 'number' | 'data_url' | 'date';
  required: boolean;
  values?: string[];
}

export interface Route {
  method: 'GET' | 'POST' | 'DELETE';
  url: string;
  func: Array<(req: any, res: any, next?: any) => void>;
  name: string;
  permission: -1 | 0 | 100 | 1000;
  description: string;
  query?: Array<QueryParam>;
  result: Array<Result>;
  test?: true | false;
  body?: {
    [key: string]: string | BodyArgument;
  };
}
