const gulp = require('gulp'),
    pug = require('gulp-pug'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    htmlhint = require('gulp-htmlhint'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    imgmin = require('gulp-tinypng-nokey'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    browserSync = require('browser-sync'),
    smartGrid = require('smart-grid'),
    webp = require('gulp-webp');


/* FILES PATHS */

const paths = {
    prod: {
        build: './build'
    },
    html: {
        src: './src/pages/*.pug',
        dest: './build',
        watch: ['./src/blocks/**/*.pug', './src/mixins-pug/**/*.pug', './src/pages/**/*.pug', './src/sections/**/*.pug']
    },
    css: {
        src: './src/styles/main.scss',
        dest: './build/css',
        watch: ['./src/blocks/**/*.scss', './src/sections/**/*.scss', './src/styles/**/*.scss', './src/css-libraries/**/*', '!./src/css-plugins/**/*']
    },
    cssPlugins: {
        src: './src/css-plugins/**/*',
        dest: './build/css',
        watch: './src/css-plugins/**/*'
    },
    js: {
        src: ['./src/js/libraries/**/*.js', './src/js/custom/**/*.js', 'node_modules/svgxuse/svgxuse.min.js'],
        dest: './build/js',
        watch: ['./src/js/libraries/**/*.js', './src/js/custom/**/*.js', ]
    },
    jsPlugins: {
        src: './src/js/plugins/**/*.js',
        dest: './build/js',
        watch: './src/js/plugins/**/*.js'
    },
    images: {
        src: ['./src/img/**/*', '!./src/img/**/*.svg', '!./src/img/**/*.webp'],
        dest: './build/img',
        watch: ['./src/img/**/*', '!./src/img/**/*.svg', '!./src/img/**/*.webp']
    },
    webpImages: {
        src: './src/img/**/*.webp',
        dest: './build/img',
        watch: './src/img/**/*.webp'
    },
    svgSprite: {
        src: './src/img/icons/**/*.svg',
        dest: './build/img/icons',
        watch: './src/img/icons/**/*.svg'
    },
    svg: {
        src: ['./src/img/**/*.svg', '!./src/img/icons/**/*.svg'],
        dest: './build/img/icons',
        watch: ['./src/img/**/*.svg', '!./src/img/icons/**/*.svg']
    },
    fonts: {
        src: './src/fonts/**/*',
        dest: './build/fonts',
        watch: './src/fonts/**/*'
    },
    php: {
        src: './src/php/**/*.php',
        dest: './build/php',
        watch: './src/php/**/*.php'
    }
};

/* SMART GRID OPTIONS */

const optionsSmartGrid = {
    filename: 'smart-grid',
    outputStyle: 'scss',
    columns: 12,
    offset: '30px',
    mobileFirst: true,
    container: {
        maxWidth: '1440px',
        fields: '15px'
    },
    breakPoints: {
        xlg: {
            width: '1920px'
        },
        lg: {
            width: '1440px'
        },
        md: {
            width: '1024px',
            fields: '10px',
            offset: '5px'
        },
        sm: {
            width: '800px',
            fields: '10px',
            offset: '5px'
        },
        sd: {
            width: '600px',
            fields: '10px',
            offset: '5px'
        },
        xs: {
            width: '480px',
            fields: '10px',
            offset: '5px'
        },
        xxs: {
            width: '320px',
            fields: '6px',
            offset: '3px'
        }
    },
    mixinNames: {
        container: 'container',
        row: 'row-flex',
        rowFloat: 'row-float',
        rowInlineBlock: 'row-ib',
        rowOffsets: 'row-offsets',
        column: 'col',
        size: 'size',
        columnFloat: 'col-float',
        columnInlineBlock: 'col-ib',
        columnPadding: 'col-padding',
        columnOffsets: 'col-offsets',
        shift: 'shift',
        from: 'from',
        to: 'to',
        fromTo: 'from-to',
        reset: 'reset',
        clearfix: 'clearfix',
        debug: 'debug',
        uRowFlex: 'u-row-flex',
        uColumn: 'u-col',
        uSize: 'u-size'
    },
    tab: '    ',
    defaultMediaDevice: 'screen',
    detailedCalc: false
};

/* TASKS */

/* SMART GRID START */

smartGrid('./src/styles', optionsSmartGrid);

/* PPUG TO HTML MINIFICATION */

gulp.task('html', () => {
    return gulp.src(paths.html.src)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(htmlhint.failOnError())
        //.pipe(htmlmin({
        //    collapseWhitespace: true
        //}))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* SCSS TO CSS CONVERTATION & MINIFICATION */

gulp.task('styles', () => {
    return gulp.src(paths.css.src)
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            Browserslist: ['last 3 versions'],
            cascade: true
        }))
        .pipe(gcmq())
        .pipe(gulp.dest(paths.css.dest))
        .pipe(csso())
        //.pipe(sourcemaps.write())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* CSS PLUGINS MOVING TO BUILD */

gulp.task('cssPlugins', () => {
    return gulp.src(paths.cssPlugins.src)
        .pipe(plumber())
        .pipe(csso())
        .pipe(gulp.dest(paths.cssPlugins.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* JAVASCRIPT BABEL & MINIFICATION */

gulp.task('scripts', () => {
    return gulp.src(paths.js.src)
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(uglify({
            mangle: {
                toplevel: true
            }
        }))
        //.pipe(sourcemaps.write())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* JAVASCRIPT & QJUERY PLUGINS MOVING TO BUILD */

gulp.task('jsPlugins', () => {
    return gulp.src(paths.jsPlugins.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.jsPlugins.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* IMAGES MINIFICATION */

gulp.task('imgmin', () => {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        // .pipe(imgmin())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* IMAGES JPG/JPEG & PNG TO WEBP CONVERTATION */

gulp.task('webp', () => {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(webp())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* WEBP IMAGES MOVING TO BUILD */

gulp.task('webpImages', () => {
    return gulp.src(paths.webpImages.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* SVG SPRITES */

gulp.task('sprites', () => {
    return gulp.src(paths.svgSprite.src)
        .pipe(plumber())
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: ($) => {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest(paths.svgSprite.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* SVG MINIFICATION */

gulp.task('svg', () => {
    return gulp.src(paths.svg.src)
        .pipe(plumber())
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest(paths.svg.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* FONTS MOVING TO BUILD */

gulp.task('fonts', () => {
    return gulp.src(paths.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* PHP MOVING TO BUILD */

gulp.task('php', () => {
    return gulp.src(paths.php.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.php.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* BUILD FOLDER ERASE */

gulp.task('clean', () => {
    return del(paths.prod.build);
});

/* BROWSER SYNC */

gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: paths.prod.build
        },
        reloadOnRestart: true
    });
    gulp.watch(paths.html.watch, gulp.parallel('html'));
    gulp.watch(paths.css.watch, gulp.parallel('styles'));
    gulp.watch(paths.cssPlugins.watch, gulp.parallel('cssPlugins'));
    gulp.watch(paths.js.watch, gulp.parallel('scripts'));
    gulp.watch(paths.jsPlugins.watch, gulp.parallel('jsPlugins'));
    gulp.watch(paths.images.watch, gulp.parallel('imgmin'));
    gulp.watch(paths.images.watch, gulp.parallel('webp'));
    gulp.watch(paths.webpImages.watch, gulp.parallel('webpImages'));
    gulp.watch(paths.svgSprite.watch, gulp.parallel('sprites'));
    gulp.watch(paths.svg.watch, gulp.parallel('svg'));
    gulp.watch(paths.fonts.watch, gulp.parallel('fonts'));
    gulp.watch(paths.fonts.watch, gulp.parallel('php'));
});

/* PROJECT TASK BUILD QUEUE */

gulp.task('build', gulp.series(
    //'clean',
    'html',
    'styles',
    'cssPlugins',
    'scripts',
    'jsPlugins',
    'imgmin',
    'webp',
    'webpImages',
    'sprites',
    'svg',
    'fonts',
    'php'
));

/* START GULP */

gulp.task('default', gulp.series(
    'build', 'server'
));