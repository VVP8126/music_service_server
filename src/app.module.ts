import { Module } from "@nestjs/common";
import { TrackModule } from "./track/track.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FileModule } from "./file/file.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule } from "@nestjs/config";   // Module lets use settings of .env-file
import * as path from "path";

@Module({
    imports:[
        TrackModule,
        FileModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot("mongodb://0.0.0.0:27017/mtracks"),
        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, "static")})
    ]
})
export class AppModule { }
