module.exports.promisify = foo => new Promise((resolve, reject) => {
    foo((error, result) => {
        if (error) {
            reject(error);
        } else {
            resolve(result);
        }
    });
});