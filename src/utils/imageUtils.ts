
/**
 * Utility functions for image handling and processing
 */

/**
 * Compresses an image file to a specified maximum size in MB
 * 
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum size in MB for the compressed image
 * @returns Promise with compressed image as data URL
 */
export const compressImage = (file: File, maxSizeMB: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate current size in MB
        const imgDataUrl = event.target?.result as string;
        const base64String = imgDataUrl.split(',')[1];
        const sizeInBytes = (base64String.length * 0.75); // Approximation
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        console.log(`Original image size: ${sizeInMB.toFixed(2)} MB`);
        
        // If image is already smaller than max size, return it directly
        if (sizeInMB <= maxSizeMB) {
          resolve(imgDataUrl);
          return;
        }
        
        // Calculate scale factor to reduce size
        const scaleFactor = Math.sqrt(maxSizeMB / sizeInMB);
        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Adjust quality for JPEG
        const quality = 0.7;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading image file'));
    };
  });
};

/**
 * Processes and validates an image file
 * 
 * @param file - The image file to process
 * @param maxSizeMB - Maximum size in MB
 * @returns Promise with processed image data URL
 */
export const processImageFile = async (file: File, maxSizeMB: number = 20): Promise<string> => {
  // Verify file type
  if (!file.type.startsWith('image/')) {
    throw new Error('The selected file is not an image');
  }
  
  // Check file size (limit increased to 50MB before compression)
  const fileSizeMB = file.size / (1024 * 1024);
  console.log(`Selected file: ${file.name}, Size: ${fileSizeMB.toFixed(2)} MB`);
  
  if (fileSizeMB > 50) {
    throw new Error(`Image is too large (${fileSizeMB.toFixed(2)} MB). Maximum allowed size is 50 MB.`);
  }
  
  // Compress the image
  return await compressImage(file, maxSizeMB);
};
