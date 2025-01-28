import gulp from 'gulp';
import eslint from 'gulp-eslint'; // ESLint
import autoprefixer from 'gulp-autoprefixer'; // Autoprefixer
import imagemin from 'gulp-imagemin'; // Imagemin
import responsive from 'gulp-responsive'; // Responsive Images
import htmlmin from 'gulp-htmlmin'; // HTMLMin
import cleanCSS from 'gulp-clean-css'; // Минификация CSS
import uglify from 'gulp-uglify'; // Минификация JS
import browserSync from 'browser-sync'; // BrowserSync
import imageminMozjpeg from 'imagemin-mozjpeg'; // Imagemin plugin for JPEG
import imageminOptipng from 'imagemin-optipng'; // Imagemin plugin for PNG
import imageminSvgo from 'imagemin-svgo'; // Imagemin plugin for SVG
import imageminGifsicle from 'imagemin-gifsicle'; // Imagemin plugin for GIF

// Пути к файлам
const paths = {
  html: './*.html',
  styles: './assets/css/**/*.css',
  scripts: './assets/js/**/*.js',
  images: './assets/img/**/*.{png,jpg,jpeg,svg,gif}',
  output: './dist',
};

// Линтинг JavaScript с помощью ESLint
export const lintJS = () => {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

// Компиляция SCSS и добавление префиксов
export const styles = () => {
  return gulp.src(paths.styles)
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${paths.output}/css`));
};

// Минификация JavaScript
export const scripts = () => {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.output}/js`));
};

// Минификация HTML
export const minifyHTML = () => {
  return gulp.src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.output));
};

export const optimizeImages = () => {
  return gulp.src(paths.images)
    .pipe(imagemin([
      imageminMozjpeg({ quality: 75, progressive: true }), // Оптимизация jpg
      imageminOptipng({ optimizationLevel: 5 }),           // Оптимизация png
      imageminSvgo({                                       // Оптимизация svg
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeViewBox: false, removeUselessDefs: false } },
          },
        ],
      }),
      imageminGifsicle({ optimizationLevel: 3 }),           // Оптимизация gif
    ], {
      verbose: true, // Печать подробной информации
    }))
    .pipe(gulp.dest(`${paths.output}/img`));
};

// Запуск сервера разработки
export const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    notify: false,
  });

  gulp.watch(paths.html, minifyHTML).on('change', browserSync.reload);
  gulp.watch(paths.styles, styles).on('change', browserSync.reload);
  gulp.watch(paths.scripts, gulp.series(lintJS, scripts)).on('change', browserSync.reload);
  gulp.watch(paths.images, gulp.series(optimizeImages)).on('change', browserSync.reload);
};

// Сборка проекта
export const build = gulp.series(
  gulp.parallel(lintJS, styles, scripts, minifyHTML),  // Все задачи, кроме изображений
  gulp.parallel(optimizeImages) // Задачи для изображений
);

// Экспорт задач
export default build;
