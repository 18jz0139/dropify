var gulp = require('gulp'),
    $    = require('gulp-load-plugins')(),
    meta = require('./package.json');

var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);

var jsDir     = 'src/js/',
    sassDir   = 'src/sass/',
    fontsDir  = 'src/fonts/',
    distDir   = 'dist',
    banner    = [
        '/*!',
        ' * =============================================================',
        ' * <%= name %> v<%= version %> | <%= description %>',
        ' * <%= homepage %>',
        ' *',
        ' * (c) 2015 <%= author.name %> <<%= author.email %>> | <%= author.url %>',
        ' * =============================================================',
        ' */\n\n'
    ].join('\n'),
    umdDeps = {
        dependencies: function() {
            return [
                {
                    name: '$',
                    amd: 'jquery',
                    cjs: 'jquery',
                    global: '$',
                    param: '$'
                }
            ];
        }
    };


var onError = function (err) {
    $.util.beep();
    console.log(err.toString());
    this.emit('end');
};


gulp.task('fonts', function() {
    return gulp.src(fontsDir + '**/*')
        .pipe(gulp.dest(distDir + "/fonts"));
});

gulp.task('sass', function() {
    return gulp.src(sassDir + '*.scss')
        .pipe($.plumber({ errorHandler: onError }))
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe($.if(!argv.dev, $.minifyCss()))
        .pipe(gulp.dest(distDir + "/css"));
});

gulp.task('scripts', function() {
    return gulp.src([jsDir + '*.js'])
        .pipe(gulp.dest(distDir + "/js"))
        .pipe($.umd(umdDeps))
        .pipe($.header(banner, meta))
        .pipe($.if(!argv.dev, $.uglify()))
        .pipe(gulp.dest(distDir + "/js"));
});


gulp.task('default', ['sass', 'scripts', 'fonts'], function() {
    gulp.watch(jsDir + '**/*.js', ['scripts']);
    gulp.watch(sassDir + '**/*.scss', ['sass']);
});

gulp.task('install', ['sass', 'scripts', 'fonts']);
