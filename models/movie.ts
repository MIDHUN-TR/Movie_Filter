import mongoose, { Schema, Document, Model } from "mongoose";
import { WatchingState, ContentType } from "@/types/content";
import type { IContentBase } from "@/types/content";

// TypeScript interface for the Content document (extends mongoose Document)
export interface IContent extends IContentBase, Document { }

const contentSchema = new Schema<IContent>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        posterImage: {
            type: String,
            required: [true, "Poster image URL is required"],
        },
        genres: {
            type: [String],
            required: [true, "At least one genre is required"],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "At least one genre is required",
            },
        },
        cast: {
            type: [String],
            default: [],
        },
        originalLanguage: {
            type: String,
            required: [true, "Original language is required"],
            trim: true,
        },
        countryOfOrigin: {
            type: String,
            required: [true, "Country of origin is required"],
            trim: true,
        },
        watchingState: {
            type: String,
            enum: Object.values(WatchingState),
            default: WatchingState.PENDING,
        },
        type: {
            type: String,
            enum: Object.values(ContentType),
            required: [true, "Content type is required"],
        },

        // Movie-specific fields
        releaseDate: {
            type: Date,
            required: function (this: IContent) {
                return this.type === ContentType.MOVIE;
            },
        },
        runtime: {
            type: Number,
            min: [1, "Runtime must be at least 1 minute"],
            required: function (this: IContent) {
                return this.type === ContentType.MOVIE;
            },
        },

        // Series/Anime/TV Show specific fields
        numberOfSeasons: {
            type: Number,
            min: [1, "Number of seasons must be at least 1"],
            required: function (this: IContent) {
                return this.type !== ContentType.MOVIE;
            },
        },
        numberOfEpisodes: {
            type: Number,
            min: [1, "Number of episodes must be at least 1"],
            required: function (this: IContent) {
                return this.type !== ContentType.MOVIE;
            },
        },
        watchedEpisodes: {
            type: Number,
            min: [0, "Watched episodes cannot be negative"],
            default: 0,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for common queries
contentSchema.index({ title: "text" });
contentSchema.index({ type: 1 });
contentSchema.index({ watchingState: 1 });
contentSchema.index({ genres: 1 });

const Content: Model<IContent> =
    mongoose.models.Content || mongoose.model<IContent>("Content", contentSchema);

export default Content;