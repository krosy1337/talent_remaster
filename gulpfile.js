let projectFolder = require("path").basename(__dirname)
let sourceFolder = "#src"
let fs = require('fs')

let path = {
	build: {
		html: projectFolder + "/",
		css: projectFolder + "/css/",
		js: projectFolder + "/js/",
		img: projectFolder + "/img/",
		fonts: projectFolder + "/fonts/",
	},
	src: {
		html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
		css: [sourceFolder + "/scss/*.scss", "!" + sourceFolder + "/scss/_*.scss"],
		js: [sourceFolder + "/js/*.js", "!" + sourceFolder + "/js_*.js"],
		img: sourceFolder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
		fonts: sourceFolder + "/fonts/*.ttf",
	},
	watch: {
		html: sourceFolder + "/**/*.html",
		css: sourceFolder + "/scss/**/*.scss",
		js: sourceFolder + "/js/**/*.js",
		img: sourceFolder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
	},
	clean: "./" + projectFolder + "/",
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	groupMedia = require("gulp-group-css-media-queries"),
	cleanCss = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webpcss = require("gulp-webpcss"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2")

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + projectFolder + "/"
		},
		port: 3000,
		notify: false,
	})
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(
			groupMedia()
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true,
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(cleanCss())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function fonts(params) {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

function fontsStyle(params) {
	let file_content = fs.readFileSync(sourceFolder + '/scss/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(sourceFolder + '/scss/_fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let cFontName;
				for (let i = 0; i < items.length; i++) {
					let fontName = items[i].split('.');
					fontName = fontName[0];
					if (cFontName !== fontName) {
						fs.appendFileSync(sourceFolder + '/scss/_fonts.scss', '@include font("' + fontName + '", "' + fontName + '", "400", "normal");\r\n', cb);
					}
					cFontName = fontName;
				}
			}
		})
	}
}

function cb() { }

function watchFiles(params) {
	gulp.watch([path.watch.html], html)
	gulp.watch([path.watch.css], css)
	gulp.watch([path.watch.js], js)
	gulp.watch([path.watch.img], images)
}

function clean(params) {
	return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle)
let watch = gulp.parallel(build, watchFiles, browserSync)


exports.fontsStyle = fontsStyle
exports.fonts = fonts
exports.images = images
exports.js = js
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch

