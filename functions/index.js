const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.fetchimage = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    try {
      const fileName = req.path.split("/").pop();
      const filePath = `images/${fileName}`;
      const storageBucket = admin.storage().bucket();

      const bucketFile = storageBucket.file(filePath);

      const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + 5 * 60 * 1000, // 5 min
        contentType: "image/*",
      };

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("X-Robots-Tag", "noindex");

      const [exists] = await bucketFile.exists();
      if (!exists) {
        res.setHeader("Cache-Control", "no-cache");
        res.sendStatus(404);
        return;
      }

      const [metadata] = await bucketFile.getMetadata();
      res.set("Cache-Control", "public, max-age=300, s-maxage=600");
      res.set("Content-Type", metadata.contentType);

      await new Promise((resolve) => {
        res.once("end", resolve);
        bucketFile.createReadStream().pipe(res);
      });
    } catch (error) {
      console.error(`Error fetching image: ${error}`);
      res.status(500).send(`Error fetching image: ${error}`);
    }
  });
