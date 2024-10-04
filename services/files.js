const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
    keyFilename: "service-account.json",
});

exports.uploadPhotoFromBuffer = async ({ bucketName, name, file }) => {
    return new Promise(function(resolve) {
        const bucket = storage.bucket(bucketName);

        const blob = bucket.file(name);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            console.error('Помилка при завантаженні:', err);

            throw 'Помилка при завантаженні файлу';
        });

        blobStream.on('finish', async () => {
            await blob.makePublic();

            resolve(`https://storage.googleapis.com/${bucketName}/${blob.name}`);
        });

        blobStream.end(file.buffer);
    });
};

exports.deleteFile = async ({ bucketName, name }) => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(name);

    await file.delete();
}