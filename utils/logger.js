export const logInfo = (msg) => {
    console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);   // màu xanh dương nhạt
};

export const logWarn = (msg) => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`);  // màu vàng
};

export const logError = (msg) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`); // màu đỏ
};
