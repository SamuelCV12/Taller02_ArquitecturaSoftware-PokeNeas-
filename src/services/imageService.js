function getImageUrl(imageKey) {
  const baseUrl = (process.env.S3_PUBLIC_BASE_URL || '/images').replace(/\/$/, '');
  return `${baseUrl}/${imageKey}`;
}

module.exports = { getImageUrl };
