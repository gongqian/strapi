"use strict";

/**
 *  translation controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const { parseMultipartData } = require("@strapi/utils");

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const unzipper = require("unzipper");
const rootDir = "./public/";
const exportDir = rootDir + "export/";
const importDir = rootDir + "upload/import/";
const archiveDir = rootDir + "archive/";

const { Parser } = require('json2csv');
const csv = require('csvtojson');

const ImportMode = {
  DUP_NO_OP: "> Multiple matches found!! -",
  UPDATE: "> Key Found: Updating to new value and setting to Draft -",
  CREATE: ">>> Adding translation key for: "
}

const API = {
  LANGUAGE: "api::language.language",
  TRANSLATION: "api::translation.translation"
}

module.exports = createCoreController(
  API.TRANSLATION,
  ({ strapi }) => ({
    export: async (ctx) => {
      const fmt = ctx.request.query.format;

      await removeDirRecursive(exportDir);

      let exportFileName = "translations.zip";
      let archiveFilePath = rootDir + exportFileName;

      if (fmt === 'json') {
        let languages = await getLanguages();
        await writeTranslationsToFiles(languages);
      }
      else if (fmt === 'csv')
        await writeCSVFils();


      await zipDirectory(exportDir, archiveFilePath);

      ctx.attachment(exportFileName);
      const outputData = fs.createReadStream(archiveFilePath);

      return outputData;
    },

    import: async (ctx) => {
      return await new Promise(async (resolve, reject) => {
        try {
          const parsedCtx = parseMultipartData(ctx);
          const fmt = parsedCtx.data.format;
          const publishMode = parsedCtx.data.publishMode;

          if (parsedCtx.data && parsedCtx.data.reset) {
            console.info("resetting on import");
            await resetTranslationsTable();
          }
          const file = parsedCtx.files.import;
          fs.createReadStream(file.path)
            .pipe(unzipper.Extract({ path: importDir }))
            .on("close", async () => {
              try {
                const languages = await getLanguages();
                if (fmt === "csv") {
                  await importFromCsv(languages, publishMode);
                } else {
                  await importFromJson(languages, publishMode);
                }
                await achiveImport();
                resolve("Successfully imported");
              }
              catch (e) {
                resolve(`There was an error importing: ${e}`);
              }
            });
        } catch (e) {
          resolve(
            `There was an error reading the uploaded file. Please ensure that you upload a zip file using multipart name files.import.`
          );
        }
      });
    },

    reset: async(ctx) => {
      console.log('made it into reset')
      await resetTranslationsTable();
      return 'Translation tables reset!';
    }
  })
);

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

const resetTranslationsTable = async () => {
  await strapi.db.connection.context.raw(`TRUNCATE TABLE translations;`);
  await strapi.db.connection.context.raw(
    "ALTER SEQUENCE translations_id_seq RESTART WITH 1;"
  );
};

const getLanguages = async () => {
  const results = await strapi.services[API.LANGUAGE].find();
  const langs = results.results.map((res) => res.languageCode);
  console.info("Languages retrieved: " + JSON.stringify(langs));
  return langs || [];
};

const logImportTransaction = (translation, importMode, hasChange, dupList) => {
  if ((importMode === ImportMode.CREATE || importMode === ImportMode.UPDATE) && !hasChange)
    return;
  console.info(
    importMode,
    translation.namespace,
    "|",
    translation.value,
    "|",
    translation.key,
    "|",
    translation.description
  );
  if (dupList)
    console.log(dupList)
};

const writeTranslationsToFiles = async (languages) => {
  let result = {};
  await asyncForEach(languages, async (langCode) => {
    result = await strapi.entityService.findMany(API.TRANSLATION, {
      fields: ['key', 'value', 'languageCode', 'namespace', 'description', 'publishedAt'],
      filters: {
        languageCode: langCode,
      },
      _limit: -1,
    });

    if (result.length > 0) {
      let namespaces = {};
      result.forEach((res) => {
        namespaces = {
          ...namespaces,
          [res.namespace]: {
            ...namespaces[res.namespace],
            [res.key]: res.value,
          },
        };
      });
      asyncForEach(Object.keys(namespaces), async (ns) => {
        let jsonData = JSON.stringify(namespaces[ns], null, 2);
        let extention = ".json";
        let fileName = langCode + "//" + ns + extention;
        console.info("=> Exporting", langCode, ns, fileName);
        await writeFileRecursive(exportDir + fileName, jsonData);
      });
    } else {
      //console.info('<> No data to export', langCode, ns, {});
    }
  });
};

const writeCSVFils = async () => {
  const result = await strapi.entityService.findMany(API.TRANSLATION, {
    sort: [{ key: 'asc' }, { namespace: 'asc' }],
  });
  let pivotResult = []
  let languageFields = [];
  let currentkey = null;
  let currentNameSpace = null;

  result.forEach((res) => {
    let lngCode = res.languageCode.replace("-", "_");
    if (languageFields.indexOf(lngCode) < 0)
      languageFields.push(lngCode);
    if (currentkey === res.key && currentNameSpace === res.namespace) {
      let obj = pivotResult[pivotResult.length - 1];
      obj[lngCode] = res.value;
    }
    else {
      let obj = {};
      obj = {
        ...obj,
        ["key"]: res.key,
        ["description"]: res.description,
        ["namespace"]: res.namespace,
        [lngCode]: res.value,
      }
      console.log(obj)
      pivotResult.push(obj);
    }
    currentkey = res.key;
    currentNameSpace = res.namespace;
  })

  if (pivotResult.length > 0) {

    const fields = ['key', 'description', 'namespace', ...languageFields];
    const opts = { fields };
    const parser = new Parser(opts);

    let content = parser.parse(pivotResult);

    console.info("=> Exporting translation to translation.csv");
    await writeFileRecursive(exportDir + 'translation.csv', content);
  } else {
    console.info('<> No data to export to CSV');
  }
};

const writeFileRecursive = async (filename, content) => {
  //normalize path separator to '/' instead of path.sep,
  //as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g, "/");

  //preparation to allow absolute paths as well
  let root = "";
  if (filepath[0] === "/") {
    root = "/";
    filepath = filepath.slice(1);
  } else if (filepath[1] === ":") {
    root = filepath.slice(0, 3);
    filepath = filepath.slice(3);
  }

  //create folders all the way down
  const folders = filepath.split("/").slice(0, -1);
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + "/";
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath;
    },
    root // first 'acc', important
  );

  //write file
  fs.writeFileSync(root + filepath, content);
};

const removeDirRecursive = async (dir) => {
  console.info("Deleting contents of dir: " + dir);
  if (fs.existsSync(dir)) {
    fs.rm(dir, { recursive: true }, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
    });
    console.info("X ", dir, "has been deleted.");
  }
};

const zipDirectory = async (source, dest) => {
  const output = fs.createWriteStream(dest);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("end", function () {
    console.info("Done archiving files.");
  });

  await new Promise((resolve, reject) => {
    output.on("close", () => {
      console.info(`zipped ${archive.pointer()} total bytes.`);
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });
    output.on("error", (e) => {
      reject(e);
    });

    //start the zipping
    archive.pipe(output);
    archive.glob("**/*.*", { cwd: `${source}` });

    archive.finalize();
  });
};

const dataCount = async (langCode) => {
  const results = await strapi.entityService.count(API.TRANSLATION,
    { filters: { languageCode: langCode, }, _limit: -1 });

  return results || 0;
};

const dataCountAll = async () => {
  const results = await strapi.entityService.count(API.TRANSLATION, {});
  return results || 0;
};

const importFromJson = async (supportedLanguages, publishMode) => {
  let transCnts = [];
  const languages = fs.readdirSync(importDir);
  await asyncForEach(
    languages.filter((lng) => supportedLanguages.includes(lng)),
    async (langCode) => {
      const initialCount = await dataCount(langCode);
      if (fs.existsSync(importDir + langCode)) {
        const files = fs.readdirSync(importDir + langCode);
        await asyncForEach(
          files.filter((f) => f.includes(".json")),
          async (file) => {
            const ns = file.replace(".json", "");
            let filePath = path.resolve(importDir + langCode + "/" + file);

            if (fs.existsSync(filePath)) {
              console.info("impByNS - File found:", filePath);
              let jsonFile = fs.readFileSync(filePath, "utf8");
              let data = JSON.parse(jsonFile);
              console.info(
                "Keys found in: ",
                filePath,
                "|",
                Object.keys(data).length
              );

              await asyncForEach(Object.entries(data), async (ele, index) => {
                try {
                  let langKey = ele[0];
                  let langValue = ele[1];
                  let result = await strapi.entityService.findMany(API.TRANSLATION, {
                    filters: {
                      key: langKey,
                      languageCode: langCode,
                      namespace: ns,
                      // published_at: null,
                    }
                  });

                  if (result.length > 1) {
                    console.info(
                      "> Multiple matches found!! -",
                      ns,
                      "|",
                      langCode,
                      "|",
                      langKey,
                      "|",
                      result
                    );
                  } else if (result.length === 1) {

                    const translation = { ...result[0], ...{ value: langValue } };

                    if (result[0].value !== translation.value ||
                      (publishMode && result[0].publishedAt === null) ||
                      (!publishMode && result[0].publishedAt !== null)) {
                      console.info(
                        "> Key Found: Updating to new value and setting to Draft -",
                        ns,
                        "|",
                        langCode,
                        "|",
                        langKey
                      );
                      await updateTranslation(translation, publishMode, id, true);
                    }
                  } else {
                    console.info(
                      ">>> Adding translation key for: ",
                      ns,
                      "|",
                      langCode,
                      "|",
                      langKey
                    );
                    const translation = { "key": langKey, "value": langValue, "languageCode": langCode, "namespace": ns };
                    await updateTranslation(translation, publishMode, null, false);
                  }
                } catch (ex) {
                  console.error(
                    "impByNS - Translation import exception: " + ex
                  );
                }
              });
            } else {
              console.info("impByNS - Missing file:", filePath);
            }
          }
        );

        const transCnt = await dataCount(langCode);
        transCnts.push({
          langCode,
          initial: initialCount,
          new: transCnt,
        });
      }
    }
  );
  transCnts.forEach((data) => {
    console.info("Initial count: ", data.langCode, data.initial);
    console.info("=> Data count: ", data.langCode, data.new);
  });
};

const importFromCsv = async (supportedLanguages, publishMode) => {
  const initialCount = await dataCountAll();

  if (fs.existsSync(importDir)) {
    const files = fs.readdirSync(importDir);
    await asyncForEach(
      files.filter((f) => f.includes(".csv")),
      async (file) => {
        let filePath = path.resolve(importDir + "/" + file);

        if (fs.existsSync(filePath)) {
          console.info("impByNS - File found:", filePath);

          csv({ flatKeys: true })
            .fromStream(fs.createReadStream(filePath, "utf8"))
            .subscribe((json) => {
              return new Promise((resolve, reject) => {
                supportedLanguages.forEach(async (language) => {
                  const langCode = language.replace("-", "_")
                  try {
                    console.log(`finding ${json.key} ${language} ${json.namespace}`)

                    const result = await strapi.entityService.findMany(API.TRANSLATION, {
                      fields: ['key', 'value', 'languageCode', 'namespace', 'description', 'publishedAt'],
                      filters: {
                        'key': json.key,
                        'languageCode': language,
                        'namespace': json.namespace
                      },
                      sort: { languageCode: 'DESC' },
                    });

                    if (result.length > 1) {
                      logImportTransaction({ ...json, ...{ value: json[langCode] } }, ImportMode.DUP_NO_OP, false, result);
                    } else {

                      const translation = { ...json, ...{ value: json[langCode], languageCode: language } };

                      let importMode = result.length === 1 ? ImportMode.UPDATE : ImportMode.CREATE;
                      let id = result.length === 1 ? result[0].id : null;
                      let hasChange = result.length === 1 ?
                        (result[0].value !== translation.value ||
                          result[0].description !== translation.description ||
                          (publishMode && result[0].publishedAt === null) ||
                          (!publishMode && result[0].publishedAt !== null))
                        : false;

                      logImportTransaction({ ...json, ...{ value: json[langCode] } }, importMode, hasChange);

                      await updateTranslation(translation, publishMode, id, hasChange);
                    }
                  } catch (error) {
                    console.log(error);
                    reject()
                  }
                })
                resolve(json)
              })
            })
            .on("error", function (error) {
              console.log(error.err);
              reject();
            })
            .on("end", function () {
              console.info(
                "Keys found in: ",
                filePath,
                "|",
                Object.keys(json).length
              );
              console.log("done")
            });
        } else {
          console.info("impByNS - Missing file:", filePath);
        }
      }
    );
  }

  const finalCount = await dataCountAll();
  console.info(
    "Initial data count: ",
    initialCount,
    "|",
    "Final data count: ",
    "|",
    finalCount
  );
};

const updateTranslation = async (translation, publishMode, id, hasChange) => {
  let publishedAt = { publishedAt: null };
  if (publishMode)
    publishedAt = { publishedAt: new Date() };
  if (id) {
    if (hasChange) {
      await strapi.entityService.update(API.TRANSLATION, id, {
        data: { ...translation, ...publishedAt }
      })
    }
  }
  else {
    await strapi.entityService.create(API.TRANSLATION, {
      data: { ...translation, ...publishedAt }
    });
  }
};

const achiveImport = async () => {
  const dateObj = new Date();
  const date = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
  const time = `${dateObj.getHours()}-${dateObj.getMinutes()}-${dateObj.getSeconds()}`;
  const filename = `${date}.${time}.zip`;
  const archiveFilePath = archiveDir + filename;
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir);
  }
  await zipDirectory(importDir, archiveFilePath);
  await removeDirRecursive(importDir);
}
