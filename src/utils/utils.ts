export const formateFileSize = (fileSize: number) => {
    if(fileSize === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Byets', 'KB', 'MB', 'GB', 'TB'];
    const unit = Math.floor(Math.log(fileSize)/Math.log(k));

    return parseFloat((fileSize/Math.pow(k, unit)).toFixed(2))+' '+sizes[unit];
}