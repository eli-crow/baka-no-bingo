export function preloadImages(urls: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    let loadedCounter = 0;
    const toLoadTotal = urls.length;

    urls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        loadedCounter++;
        if (loadedCounter === toLoadTotal) {
          resolve();
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  });
}
