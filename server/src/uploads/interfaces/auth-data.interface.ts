interface Allowed {
  bucketId: string;
  bucketName: string;
  capabilities?: string[] | null;
  namePrefix?: null;
}
export interface AuthData {
  absoluteMinimumPartSize: number;
  accountId: string;
  allowed: Allowed;
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
  recommendedPartSize: number;
}
