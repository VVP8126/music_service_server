import { Controller, Query, Get, Body, Post, Param, Delete, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateTrackDto } from "./dto/create-track.dto";
import { TrackService } from "./track.service";
import { ObjectId } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller("/track")
export class TrackController {

    constructor(private trackService: TrackService) {}

    @Post("/create")
    @UseInterceptors(
        FileFieldsInterceptor(
            [   {name:"picture", maxCount:1},
                {name:"audio",   maxCount:1}    ]
        )
    )
    create(
        @Body() dto: CreateTrackDto,
        @UploadedFiles() files 
    ) {
        const {picture, audio} = files;
        return this.trackService.create(dto, picture[0], audio[0]);
    }
    
    @Get("/all")
    getAll(
        @Query("count") count:number,
        @Query("offset") offset:number
    ) {
        return this.trackService.getAll(count, offset);
    }

    @Get("/search")
    search(@Query("query") query: string, @Query("param") param: string) {
        return this.trackService.search(query, param);
    }

    @Get("/count")
    getTrackCount() {
        return this.trackService.getTrackCount();
    }

    @Get("/:id")
    getOne(@Param("id") id:ObjectId) {
        return this.trackService.getById(id);
    }

    @Delete("/:id")
    delete(@Param("id") id:ObjectId) {
        return this.trackService.delete(id);        
    }

    @Post("/comment")
    addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addComment(dto);
    }

    @Post("/listen/:id")
    listen(@Param("id") id:ObjectId) {
        return this.trackService.listen(id);        
    }

}
