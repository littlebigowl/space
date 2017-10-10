const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const minify = require('gulp-minify');


// COPY HTML task
gulp.task("copyHTML", function () {
    gulp.src("src/index.html")
        .pipe(gulp.dest("public"));
});

// COPY CSS
gulp.task("copyCSS", function(){
    gulp.src("src/css/*.css")
        .pipe(gulp.dest("public/css"));
});

// COPY SOUND
gulp.task("copySOUND", function(){
    gulp.src("src/sound/*")
        .pipe(gulp.dest("public/sound"));
});

// Optimize images
gulp.task('imageMin', () =>
    gulp.src('src/images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'))
);

// Minify JS
gulp.task("minify", function(){
    gulp.src("src/js/main.js")
        .pipe(minify())
        .pipe(gulp.dest("public/js"));
});

