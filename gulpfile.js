"use strict"

const gulp = require("gulp")
const sass = require('gulp-sass')(require('sass'))
const pug = require('gulp-pug')
const gcmq = require("gulp-group-css-media-queries")
const postcss = require("gulp-postcss")
const sourcemaps = require("gulp-sourcemaps")
const autoprefixer = require("autoprefixer")
const browserSync = require("browser-sync").create()
// const rename = require("gulp-rename")
const del = require("del")

const paths = {
    styles: {
        src: "src/scss/**/*.scss",
        dest: "dest/css/"
    },
    templates: {
        src: "src/template/*.pug",
        dest: "dest/",
        watch: "src/template/**/*.pug"
    },
    scripts: {
        src: "src/js/*.js",
        dest: "dest/js/"
    },
    images: {
        src: "src/img/*.{gif,png,jpg,svg}",
        dest: "dest/img/"
    },
    res: {
        src: "src/res/*.*",
        dest: "dest/res/"
    },
    raw: {
        src: "src/raw/**/*.*",
        dest: "dest/"
    }
}
const options = {
    sass: {
        errLogToConsole: true,
        sourceMap: "sass", // req 4 map
        sourceComments: "map",
        outputStyle: "expanded" // nested, expanded, compact, compressed
    },
    pug: {
        pretty: true,
        data: {},
    }
}
// const fonts = './src/fonts/*.{ttf,woff,woff2,eot,svg}'

function clean() {
    return del(["dest/*"])
}

function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass(options.sass).on("error", sass.logError))
        .pipe(gcmq())
        .pipe(postcss([ autoprefixer() ])) // [unprefix(), autoprefixer()]
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.styles.dest))

        .pipe(browserSync.stream())
}

function templates() {
    return gulp
        .src(paths.templates.src)
        .pipe(pug(options.pug))
        .pipe(gulp.dest(paths.templates.dest))

        .pipe(browserSync.stream())
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.scripts.dest))

        .pipe(browserSync.stream())
}

function images() {
    return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest))
}

function res() {
    return gulp.src(paths.res.src).pipe(gulp.dest(paths.res.dest))
}

function raw() {
    return gulp.src(paths.raw.src).pipe(gulp.dest(paths.raw.dest))
}

function watcher() {
    browserSync.init({
        server: paths.raw.dest
    });
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.templates.watch, templates)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, images)
    gulp.watch(paths.res.src, res)
    gulp.watch(paths.raw.src, raw)
}

function sync() {
    browserSync.init({
        server: {
            baseDir: "./dest/"
        }
    })
}

const build = gulp.series(
    clean,
    gulp.parallel(templates, styles, scripts, images, res, raw)
)

const dev = gulp.series(build, watcher)

gulp.task("build", build)

gulp.task("dev", dev)


exports.clean = clean
exports.styles = styles
exports.templates = templates
exports.scripts = scripts
exports.images = images
exports.watch = watcher
exports.sync = sync
