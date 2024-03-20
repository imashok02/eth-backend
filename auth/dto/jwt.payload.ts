export class JWTPayload {
  constructor(sub: number) {
    this.sub = sub;
  }

  sub: number;
}
