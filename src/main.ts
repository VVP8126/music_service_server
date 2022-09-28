import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const start = async () => {
    try {
        const PORT = process.env.PORT || 5555; // Install package "@nestjs/config" to use config from .env-files
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.listen(
            PORT, 
            () => console.log(`Server started in <PORT=${PORT}>`)
        );
    } catch (error) {
        console.log(error);        
    }
}

start();
