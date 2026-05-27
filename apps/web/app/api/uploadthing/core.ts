import {
    createUploadthing,
    type FileRouter,
} from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
    formUploader: f({
        image: {
            maxFileSize: "8MB",
        },

        pdf: {
            maxFileSize: "16MB",
        },
    }).onUploadComplete(
        async ({ file }) => {
            return {
                url: file.url,
            }
        },
    ),
} satisfies FileRouter

export type OurFileRouter =
    typeof ourFileRouter