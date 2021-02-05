import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";
import * as schedule from "node-schedule";

import { File } from "../../server/src/files/entities/file.entity";

const { Readable } = require("stream");

async function genSitemap() {
  console.log("Generating new site map");
  const fileRepository = getRepository(File);
  const files = await fileRepository.find({ select: ["id"] });

  // An array with your links
  const links = files.map((file) => ({ url: `/${file.id}` }));

  // Create a stream to write to
  const stream = new SitemapStream({ hostname: "https://quicksend.cloud" });

  // Return a promise that resolves with your XML string
  return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
    writeFileSync("../client/public/sitemaps/sitemap.xml", data.toString());
  });
}

createConnection()
  .then(() => {
    console.log("cron job started");
    schedule.scheduleJob("*/1 * * * *", genSitemap);
  })
  .catch((error) => console.log(error));
