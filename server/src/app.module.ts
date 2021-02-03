import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CoreModule } from "./core/core.module";
import { FilesModule } from "./files/files.module";
import { File } from "./files/entities/file.entity";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_USER,
      entities: [File],
      // TODO set to false on prod
      synchronize: true,
    }),
    CoreModule,
    FilesModule,
    UploadsModule,
  ],
})
export class AppModule {}
