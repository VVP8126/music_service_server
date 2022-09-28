import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import { Model, ObjectId } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { CreateTrackDto } from "./dto/create-track.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileService, FileType } from "src/file/file.service";

@Injectable()
export class TrackService {
    
    constructor(
        @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        private fileService: FileService
    ) {}

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
        const track = await this.trackModel.create(
            {...dto, listens:0, audio:audioPath, picture:picturePath}
        );
        return track;
    }

    async getAll(count=10, offset=0): Promise<Track[]> {
        const allTracks = await this.trackModel.find().skip(offset).limit(count);
        return allTracks;
    }

    async getById(id: ObjectId): Promise<Track> {
        // function populate("comments") adds data from table "comments" to the object Track
        const track = await this.trackModel.findById(id).populate("comments");
        return track;
    }

    async delete(id: ObjectId): Promise<ObjectId> {
        const track = await this.trackModel.findByIdAndDelete(id);
        return track._id;
    }
    
    async addComment(dto: CreateCommentDto) {
        const track = await this.trackModel.findById(dto.trackId);
        const comnt = await this.commentModel.create({...dto});
        track.comments.push(comnt._id);
        await track.save();
        return comnt;
    }

    async listen(id: ObjectId): Promise<ObjectId> {
        const track = await this.trackModel.findById(id);
        track.listens = track.listens + 1;
        await track.save();
        return track._id;
    }

    // search by name or by artist
    async search(query: string, param: string): Promise<Track[]> {
        let tracks = [];
        if(param === "name") {
            tracks = await this.trackModel.find({name:{$regex: new RegExp(query, "i")}});
        } else {
            tracks = await this.trackModel.find({artist:{$regex: new RegExp(query, "i")}});
        }
        return tracks;
    }

}
