import * as redisStore from "cache-manager-redis-store";
import { CacheModule, Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

import { File } from "./entities/file.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CacheModule.register({
      store: redisStore,
      host: "redis",
      port: 6379,
    }),
  ],
  controllers: [FilesController],
  exports: [FilesService],
  providers: [FilesService],
})
export class FilesModule {}
