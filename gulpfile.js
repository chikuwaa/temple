const gulp = require("gulp");
const plumber = require("gulp-plumber");//エラーでビルドを中止させない
//ローカルサーバ
const bs = require("browser-sync").create();
//EJS
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const fs = require("fs");
const htmlbeautify = require("gulp-html-beautify"); //htmlを整形する
//SASS+Autoprefixer
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const postcssGapProperties = require("postcss-gap-properties");
//JS(ES2015(ES6)=>ES5)
const babel = require('gulp-babel');
//画像圧縮
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const changed = require('gulp-changed');
//ディレクトリ設定
const srcDir ="_src/"
const distDir ="_dist/"

gulp.task("bs-init", function () {
    bs.init({
      server: {
        baseDir: distDir,
      },
      reloadDelay: 1000,//リロードの遅延
      //open: false, //起動時ブラウザを立ち上げない
    });
});
gulp.task("ejs", function (done) {
    const data = JSON.parse(fs.readFileSync(srcDir+'ejs/options.json'));
    return gulp
      .src([srcDir+"ejs/**/*.ejs", "!" + srcDir+"ejs/**/_*.ejs"])
      .pipe(plumber())
      .pipe(ejs(data))
      .pipe(
          htmlbeautify({
            indent_size: 2, //インデントサイズ
            indent_char: " ", // インデントに使う文字列はスペース1こ
            max_preserve_newlines: 0, // 許容する連続改行数
            preserve_newlines: false, //コンパイル前のコードの改行
            indent_inner_html: false, //head,bodyをインデント
            extra_liners: [], // 終了タグの前に改行を入れるタグ。配列で指定。head,body,htmlにはデフォで改行を入れたくない場合は[]。
          })
        )
      .pipe(rename({ extname: ".html" }))
      .pipe(gulp.dest(distDir))
      .pipe(bs.stream());
    done();
});
gulp.task("sass", function (done) {
    return gulp
      .src([srcDir+"sass/**/*.scss", "!" + srcDir+"sass/**/_*.scss"])
      .pipe(plumber())
      .pipe(sass({
        outputStyle: 'compressed'// そのままはexpanded Minifyするなら'compressed'
      }))
      .pipe(postcss([
        postcssGapProperties(),
        autoprefixer({
          grid: true
        })
      ]))
      .pipe(gulp.dest(distDir+"css"))
      .pipe(bs.stream());
      done();
});
gulp.task("js", function () {
	return gulp
        .src([srcDir+"js/**/*.js", "!" + srcDir+"js/**/*.min.js"])
        .pipe(plumber())
        .pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest(distDir+"js"))
        .pipe(bs.stream());
    done();
});
gulp.task("img", function () {
    return gulp
        .src(srcDir+'images/**/*')
        .pipe(plumber())
        .pipe(changed(distDir+'images'))
        .pipe(
            imagemin([
            pngquant({
                quality: [.60, .70], // 画質
                speed: 1 // スピード
            }),
            mozjpeg({ quality: 65 }), // 画質
            imagemin.svgo(),
            imagemin.optipng(),
            imagemin.gifsicle({ optimizationLevel: 3 }) // 圧縮率
            ])
        )
        .pipe(gulp.dest(distDir+"images"));
    done();
});

// ファイルの監視
gulp.task("watch", function () {
    gulp.watch([srcDir+"ejs/**/*.ejs"], gulp.task("ejs"));
    gulp.watch([srcDir+"sass/**/*.scss"], gulp.task("sass"));
    gulp.watch([srcDir+"js/**/*.js"], gulp.task("js"));
    gulp.watch([srcDir+"images/**/*"], gulp.task('img'));
});
gulp.task(
    "default",
    gulp.series( //順番に実行
        gulp.parallel("ejs","sass","js"), 
        gulp.parallel("watch", "bs-init") //並列に実行
    )
);