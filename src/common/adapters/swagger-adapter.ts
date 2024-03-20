import { DocumentBuilder } from '@nestjs/swagger';

export default class SwaggerAdapter {
  swaggerConfig;

  public init(): void {
    this.swaggerConfig = new DocumentBuilder()
      .setTitle('Eth Backend')
      .setDescription('API documentation.')
      .setVersion('1.0')
      .build();
  }
}
