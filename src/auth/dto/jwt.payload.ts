export class JWTPayload {
  constructor(sub: string) {
    this.sub = sub;
  }

  sub: string;
}
