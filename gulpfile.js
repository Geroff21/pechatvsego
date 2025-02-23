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

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3030;

// Настройка Express-сервера
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/components', express.static(path.join(__dirname, 'components')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/config', express.static(path.join(__dirname, 'config')));
app.use('/pages/css', express.static(path.join(__dirname, 'dist/css')));
app.use('/pages/fon', express.static(path.join(__dirname, 'dist/css')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


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

// Функция для запуска Express
export const startServer = (done) => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    done();
  });
};

// Запуск сервера разработки
export const serve = gulp.series(startServer, (done) => {
  browserSync.init({
    proxy: `http://localhost:${PORT}`, // Проксируем Express
    notify: false,
  });

  gulp.watch(paths.html, minifyHTML).on('change', browserSync.reload);
  gulp.watch(paths.styles, styles).on('change', browserSync.reload);
  gulp.watch(paths.scripts, gulp.series(lintJS, scripts)).on('change', browserSync.reload);
  gulp.watch(paths.images, gulp.series(optimizeImages)).on('change', browserSync.reload);
});

// Сборка проекта
export const build = gulp.series(
  gulp.parallel(lintJS, styles, scripts, minifyHTML),  // Все задачи, кроме изображений
  gulp.parallel(optimizeImages) // Задачи для изображений
);

// Экспорт задач
export default build;
