import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { SitemapStream, streamToPromise } from "sitemap";
import { File } from "../../server/src/files/entities/file.entity";
import { writeFileSync } from "fs";

const { Readable } = require("stream");

createConnection()
  .then(async (connection) => {
    const fileRepository = getRepository(File);
    const files = await fileRepository.find({ select: ["id", "name"] });

    // An array with your links
    const links = files.map((file) => ({ url: `/${file.id}` }));

    // Create a stream to write to
    const stream = new SitemapStream({ hostname: "https://quicksend.cloud" });

    // Return a promise that resolves with your XML string
    return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
      writeFileSync("./src/sitemap.xml", data.toString());
    });
  })
  .catch((error) => console.log(error));
