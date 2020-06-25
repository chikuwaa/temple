const imagemin = require('imagemin-keep-folder');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

imagemin(['_src/images/**/*.{jpg,png,gif,svg}'], {
  plugins: [
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: [.7, .85] }),
    imageminGifsicle(),
    imageminSvgo()
  ],
  replaceOutputDir: output => {
    return output.replace(/images\//, '../_dist/images/')
  }
}).then(() => {
  console.log('Images optimized');
});