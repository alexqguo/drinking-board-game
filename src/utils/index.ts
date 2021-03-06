import { PlayerColor } from '../interfaces';

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb #noshame
export function hexToRgb(hex: string): PlayerColor {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function sumNumbers(nums: number[]): number {
  return nums.reduce((acc: number, cur: number) => acc + cur);
}

export function times(n: number, cb: Function) {
  for (let i = 0; i < n; i++) {
    cb(i);
  }
}

export function createId(prefix?: string): string {
  return `${prefix ? prefix + '__' : ''}${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
}