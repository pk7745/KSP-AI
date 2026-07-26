import catalyst from 'zcatalyst-sdk-node';

/**
 * Initializes the Catalyst App using the Express request context.
 * In Catalyst AppSail or Advanced I/O, this automatically picks up
 * the project environment and credentials.
 */
export function getCatalystApp(req) {
  try {
    return catalyst.initialize(req);
  } catch (error) {
    console.warn("Failed to initialize Catalyst (Ensure you are running in AppSail/Advanced IO):", error.message);
    throw error;
  }
}

/**
 * Executes a ZCQL query against the Catalyst Data Store.
 * Returns an array of objects mapping the results cleanly.
 */
export async function executeZCQL(app, query) {
  const zcql = app.zcql();
  const response = await zcql.executeZCQLQuery(query);
  
  // ZCQL returns data in a nested format: [{ TableName: { column: value } }]
  // We flatten this for easier consumption.
  return response.map(row => {
    let flattened = {};
    for (const tableName in row) {
      flattened = { ...flattened, ...row[tableName] };
    }
    return flattened;
  });
}

/**
 * Uploads a file buffer to Catalyst Stratus (File Store).
 * Requires the Folder/Bucket ID to be configured in environment or passed dynamically.
 */
export async function uploadToStratus(app, folderId, fileBuffer, fileName) {
  try {
    const filestore = app.filestore();
    const folder = filestore.folder(folderId);
    
    // Config object for uploadFile
    const uploadConfig = {
      code: fileBuffer,
      name: fileName
    };
    
    const fileObject = await folder.uploadFile(uploadConfig);
    return fileObject; // Contains id, file_name, etc.
  } catch (err) {
    console.error("[Stratus Upload Error]:", err);
    throw new Error(`Failed to upload to Stratus: ${err.message}`);
  }
}

/**
 * Generates a secure download/view URL or streams the file from Catalyst Stratus.
 * The SDK allows downloading the file stream or returning a secure URL.
 */
export async function getStratusFile(app, folderId, fileId) {
  try {
    const filestore = app.filestore();
    const folder = filestore.folder(folderId);
    
    // We can fetch the file as a buffer or stream. 
    // Here we'll return the file buffer to be sent in the Express response.
    const fileStream = await folder.downloadFile(fileId);
    return fileStream;
  } catch (err) {
    console.error("[Stratus Download Error]:", err);
    throw new Error(`Failed to download from Stratus: ${err.message}`);
  }
}
