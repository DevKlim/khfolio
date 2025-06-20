const fs = require("fs");
const path = require("path");
// This line has been updated to be more robust. It handles cases where the required
// module might be structured differently.
const sizeOf = require("image-size").default || require("image-size");

const picturesDir = path.join(__dirname, "..", "data", "pictures");
const manifestOutputPath = path.join(
  __dirname,
  "..",
  "data",
  "picture-manifest.json"
);

try {
  if (!fs.existsSync(picturesDir)) {
    console.warn(
      `Warning: The directory '${picturesDir}' does not exist. Creating an empty manifest.`
    );
    if (!fs.existsSync(path.dirname(manifestOutputPath))) {
      fs.mkdirSync(path.dirname(manifestOutputPath), { recursive: true });
    }
    fs.writeFileSync(manifestOutputPath, JSON.stringify([], null, 2));
    return;
  }

  const files = fs
    .readdirSync(picturesDir)
    .filter((file) => /\.(jpe?g|png)$/i.test(file));

  const filesWithStats = files.map((file) => {
    const filePath = path.join(picturesDir, file);
    const stats = fs.statSync(filePath);

    // ** THE FIX IS HERE **
    // We will now read the file into a buffer first
    const buffer = fs.readFileSync(filePath);

    // And pass the buffer to sizeOf, which is more reliable
    const dimensions = sizeOf(buffer);

    return {
      filename: file,
      createdAt: stats.birthtime || stats.mtime,
      width: dimensions.width,
      height: dimensions.height,
    };
  });

  filesWithStats.sort((a, b) => a.createdAt - b.createdAt);

  const manifestData = filesWithStats.map((file, index) => ({
    id: index + 1,
    filename: file.filename,
    width: file.width,
    height: file.height,
  }));

  fs.writeFileSync(manifestOutputPath, JSON.stringify(manifestData, null, 2));
  console.log(
    `Successfully created picture manifest at ${manifestOutputPath} with ${manifestData.length} entries.`
  );
  console.log(
    "The manifest now includes image dimensions for perfect aspect ratios."
  );
} catch (error) {
  console.error("Error generating picture manifest:", error);
  if (error.code === "MODULE_NOT_FOUND") {
    console.error(
      "\nHint: It looks like 'image-size' is not installed. Please run 'npm install image-size' in your project directory."
    );
  }
}
