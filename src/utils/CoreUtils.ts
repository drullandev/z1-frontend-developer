import { faCoffee, faCheck, faCheckCircle, faTimes, faLightbulb, faClock } from '@fortawesome/free-solid-svg-icons'

// All the states colors
export const colors = {
	blank: '#00000000',
	true: '#69CC8B',
	false: '#C00000',
  warning: '#f69400',
	bulb: '#F4F116',
	grey: '#F3F2F489',
  moregrey: '#313131', //Based on my testing background!!
  none: '#00000000',
  black: '#000000',
}

// All the modules colors required
export const statusIcons = {
	true: faCheck,
  trueCircle: faCheckCircle,
	false: faTimes,
	bulb: faLightbulb,
  expired: faClock,
  default: faCoffee,
}


/**
 * This function recover the RGB and LigtBright by the image related with an ID
 * - For this cae I want to help to avoid the unnecesary POSTS to the API service,
 *   where the image is being reevaluated with computational costs
 * //TODO: Try to move to the utilery!!
 * @param imgId string
 * @param precision number between 0-10 where 0 is the minimal precisiton
 * @param debug boolean coomnly used to test a feature ;) thank you!
 * @returns rgbl
 */
export const getRGBLLevels = (data: any, precision: number = 2, debug: boolean = false) => {

  if (debug) return { l: getRandomArbitrary(2, 6) }

  var defPrection = 50
  var i = -4
  var rgbl = { r: 0, g: 0, b: 0, l: 0 }
  var count = 0

  var length = data.length
  var avg = 0
  var colorSum = 0
  var blockSize = defPrection / precision
  
  while ((i += blockSize * 4) < length) {
    ++count;
    rgbl.r += data[i];
    rgbl.g += data[i + 1];
    rgbl.b += data[i + 2];
    avg = Math.floor((rgbl.r + rgbl.r + rgbl.r) / 3)
    colorSum += avg
  }

  rgbl.r = ~~(rgbl.r / count)
  rgbl.g = ~~(rgbl.g / count)
  rgbl.b = ~~(rgbl.b / count)
  rgbl.l = Math.floor(colorSum / count / 10000)

  return rgbl

}

export const getBrightness = (imageData: any) => {
  const { data, width, height } = imageData
  let brightness = 0
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4
      brightness += data[idx]
    }
  }
  return (brightness / (width * height) / 255)
}

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}
