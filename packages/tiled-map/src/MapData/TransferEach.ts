export function transferEach(
  srcX: number,
  srcY: number,
  width: number,
  height: number,
  destX: number,
  destY: number,
  srcWidth: number,
  srcHeight: number,
  destWidth: number,
  destHeight: number,
  callback: (pickupX: number, pickupY: number, putX: number, putY: number) => void) {
    for(let x = 0; x < width; x++) {
      const putX = destX + x
      const pickupX = srcX + x
      if (putX < 0 || putX >= destWidth) continue;
      if (pickupX < 0 || pickupX >= srcWidth) continue;

      for(let y = 0; y < height; y++) {
        const putY = destY + y
        const pickupY = srcY + y
        if (putY < 0 || putY >= destHeight) continue;
        if (pickupY < 0 || pickupY >= srcHeight) continue;

        callback(pickupX, pickupY, putX, putY)
      }
    }
  }
