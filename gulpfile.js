const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const livereload = require('gulp-livereload');
const clean_css = require('gulp-clean-css');
const render = require('gulp-nunjucks-render');
const i18n = require('gulp-html-i18n');
const autofixer = require('gulp-autoprefixer');
const stripDebug = require('gulp-strip-debug');
const del = require('del');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const base64 = require('gulp-base64');
const zip = require('gulp-zip');


let dev_scss = ['dev/scss/*.scss', '!dev/scss/*_m.scss'];
let dev_scss_merge = ['dev/scss/*_m.scss'];

let dev_js_merge = ['dev/js/*_m.js'];
let dev_js_single = ['dev/js/*_s.js'];
let dev_html = ['dev/page/html/*.html'];
let dev_template = ['dev/page/template/*.html'];
let dev_yaml_zh = ['dev/lang/zh/*.yaml'];
let dev_yaml_en = ['dev/lang/en/*.yaml'];
let dev_yaml_ko = ['dev/lang/ko/*.yaml'];


let run_css = 'run/css';
let run_js = 'run/js';
let run_html = 'run/';

let run_zip = 'run/*';


gulp.task('Watch', function () {
    livereload.listen();
    console.log('/////// Watching... ///////');

    //scss single
    gulp.watch(dev_scss, function () {
        console.log('single scss has changed');
        gulp.src(dev_scss)
            .pipe(plumber())
            .pipe(sass())
            .pipe(rename(function (path) {
                path.extname = ".min.css";
                // console.log(path);
            }))
            .pipe(gulp.dest(run_css))
            .pipe(livereload());
    });

    //scss merge
    gulp.watch(dev_scss_merge, function () {
        console.log('merge scss has changed');
        gulp.src(dev_scss_merge)
            .pipe(plumber())
            .pipe(concat('common.min.css'))
            .pipe(sass())
            // .pipe(rename(function (path) {
            //     path.extname = ".min.css";
            //     console.log(path);
            // }))
            .pipe(gulp.dest(run_css))
            .pipe(livereload());
    });

    //yaml template html
    gulp.watch(dev_yaml_en.concat(dev_yaml_zh).concat(dev_yaml_ko).concat(dev_template).concat(dev_html), function () {
        console.log('yaml or template or html has changed');
        gulp.src(dev_html)
            .pipe(render({
                path: ['dev/page/template']
            }))
            .pipe(i18n({
                langDir: './dev/lang/',
                renderEngine: 'mustache',
                trace: true,
                createLangDirs: true,
                delimiters: '{| |}',
            }))
            .pipe(gulp.dest(run_html))
            .pipe(livereload())
    });
});

function js_merge(q) {
    if (q === 1) {
        return gulp.src(dev_js_merge)
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(concat('common.min.js'))
            .pipe(stripDebug())
            .pipe(uglify({
                mangle: true,
                compress: true,
            }))
            .pipe(gulp.dest(run_js))
    } else {
        return gulp.src(dev_js_merge)
            .pipe(concat('common.min.js'))
            .pipe(gulp.dest(run_js))
    }

}

function js_single(q) {
    if (q === 1) {
        return gulp.src(dev_js_single)
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .pipe(stripDebug())
            .pipe(uglify({
                mangle: true,
                compress: true,
            }))
            .pipe(rename(function (path) {
                path.basename = path.basename.replace('_s', '.min');
            }))
            .pipe(gulp.dest(run_js))
    } else {
        return gulp.src(dev_js_single)
            .pipe(rename(function (path) {
                path.basename = path.basename.replace('_s', '.min');
            }))
            .pipe(gulp.dest(run_js))
    }
}

gulp.task('Js=>single', function () {
    js_single(0);
    gulp.watch(dev_js_single, function () {
        js_single(0);
    });
});

gulp.task('Js=>merge', function () {
    js_merge(0);
    gulp.watch(dev_js_merge, function () {
        js_merge(0);
    });
});

gulp.task('Js=>compile', done => {
    js_single(1);
    js_merge(1);

    done();
});

gulp.task('Scss=>compile', done => {
    del([run_css + '/*']);

    gulp.src(dev_scss)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autofixer({
            browsers: ['last 2 versions', 'ie >= 9'],
        }))
        .pipe(clean_css({
            compatibility: 'ie7'
        }))
        .pipe(rename(function (path) {
            path.extname = ".min.css";
            // console.log(path);
        }))
        .pipe(base64({
            baseDir: 'Uselink-website/run/',
            extensions: ['svg', 'png','jpg','jpge'],
            exclude:    [],
            debug: true
        }))
        .pipe(gulp.dest(run_css))
        .pipe(livereload());

    gulp.src(dev_scss_merge)
        .pipe(plumber())
        .pipe(concat('common.min.css'))
        .pipe(sass())
        .pipe(autofixer({
            browsers: ['last 2 versions', 'ie >= 9'],
        }))
        .pipe(clean_css({
            compatibility: 'ie7'
        }))
        .pipe(base64())
        .pipe(gulp.dest(run_css))
        .pipe(livereload());

    done();
});

gulp.task('Html=>compile', function () {
    gulp.src(dev_scss)
    //.pipe(concat('index.scss'))
        .pipe(plumber())
        .pipe(sass())
        // .pipe(autofixer({
        //     browsers: ['last 2 versions', 'ie >= 9'],
        // }))
        .pipe(clean_css())
        .pipe(rename(function (path) {
            path.extname = ".min.css";
            console.log(path);
        }))
        .pipe(gulp.dest(run_css))
        .pipe(livereload());


    gulp.src(dev_html)
        .pipe(render({
            path: ['dev/page/template']
        }))
        .pipe(i18n({
            langDir: './dev/lang/',
            renderEngine: 'mustache',
            trace: true,
            createLangDirs: true,
            delimiters: '{| |}',
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(run_html))
        .pipe(livereload());

});

gulp.task('Del=>js', done => {
    del([run_js + '/*']);

    done();
});

gulp.task('Del=>css', done => {
    del([run_css + '/*']);

    done();
});

gulp.task('Del=>html', done => {
    del([run_html + '/en/*']);
    del([run_html + '/zh/*']);
    del([run_html + '/zh-TW/*']);
    del([run_html + '/ko/*']);

    done();
});

gulp.task('Del All=>', ['Del=>js', 'Del=>css', 'Del=>html']);

gulp.task('ALL=>compile', ['Js=>compile', 'Scss=>compile', 'Html=>compile']);

gulp.task('ZIP',done=>{
    let today = new Date();//获得当前日期
    let year = today.getFullYear();//获得年份
    let month = today.getMonth() + 1<10?'0'+(today.getMonth() + 1).toString():today.getMonth() + 1;//此方法获得的月份是从0---11，所以要加1才是当前月份
    let day = today.getDate() + 1<10?'0'+(today.getDate()).toString():today.getDate();//获得当前日期
    let hour = today.getHours() + 1<10?'0'+(today.getHours()).toString():today.getHours();//获得当前日期
    let min = today.getMinutes() + 1<10?'0'+(today.getMinutes()).toString():today.getMinutes();//获得当前日期
    let time = year+''+month+''+day+''+hour+''+min;//获得当前日期

    gulp.src('run/**')
    .pipe(zip('run.zip'))
    .pipe(gulp.dest('dist'))
});