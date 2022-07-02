// node-slate

// Imports
import browserSync  from 'browser-sync';
import chalk        from 'chalk';
import cleanCss     from 'gulp-clean-css';
import concat       from 'gulp-concat';
import ejs          from 'gulp-ejs';
import gulp         from 'gulp';
import highlight    from 'highlight.js';
import jsHint       from 'gulp-jshint';
import log          from 'fancy-log';
import mergeStream  from 'merge-stream';
import path         from 'path';
import prettify     from 'gulp-prettify';
import rename       from 'gulp-rename';
import RevAll       from 'gulp-rev-all';
import sassCompiler from 'sass';
import sassPlugin   from 'gulp-sass';
import size         from 'gulp-size';
import uglify       from 'gulp-uglify';
import yaml         from 'js-yaml';
import { marked } from 'marked';
import { readFileSync, writeFileSync } from 'fs';

// Setup
const port = 4567;
const sass = sassPlugin(sassCompiler);
const jsHintConfig = {
   jquery:  true,
   browser: true,
   undef:   true,
   unused:  true,
   };
const jsFiles = {
   libs: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery-ui-dist/jquery-ui.js', //not ideal: https://stackoverflow.com/q/34219046
      'source/js/lib/_jquery.tocify.js',
      'node_modules/tocbot/dist/tocbot.js',  //see: https://github.com/center-key/node-slate/issues/8
      'node_modules/imagesloaded/imagesloaded.pkgd.js',
      ],
   scripts: [
      'source/js/app/_lang.js',
      'source/js/app/_toc.js',
      ],
   search: [
      'node_modules/fuse.js/dist/fuse.js',
      'node_modules/jquery-highlight/jquery.highlight.js',
      'source/js/app/_search.js',
      ],
   };

// Helper functions
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
   const highlighted = language ? highlight.highlight(code, { language: language }).value :
      highlight.highlightAuto(code).value;
   return `<pre class="highlight ${language}"><code>${highlighted}</code></pre>`;
   };
const readIndexYml = () => yaml.load(readFileSync('source/index.yml', 'utf8'));
const getPageData = () => {
   const config = readIndexYml();
   const includes = config.includes
      .map(include => `source/includes/${include}.md`)
      .map(include => readFileSync(include, 'utf8'))
      .map(include => marked(include, { renderer: renderer }));
   const code = (filename) => filename.split('.')[0];
   const getPageData = {
      current_page: { data: config },
      page_classes: '',
      includes: includes,
      image_tag: (filename) =>
         `<img alt=${code(filename)} class=image-${code(filename)} src=images/${filename}>`,
      javascript_include_tag: (name) =>
         `<script src=js/${name}.js></script>\n`,
      stylesheet_link_tag: (name, media) =>
         `<link href=css/${name}.css rel=stylesheet media=${media}>`,
      langs: (config.language_tabs || []).map(
         lang => typeof lang === 'string' ? lang : lang.keys.first),
      };
   return getPageData;
   };

// Tasks
const task = {
   runStaticAnalysis() {
      return gulp.src(jsFiles.scripts)
         .pipe(jsHint(jsHintConfig))
         .pipe(jsHint.reporter());
      },
   buildFonts() {
      return gulp.src('source/fonts/**/*.+(ttf|woff|woff2)')
         .pipe(gulp.dest('build/1-dev/fonts'))
         .pipe(gulp.dest('build/2-min/fonts'));
      },
   buildImages() {
      return gulp.src('source/images/**/*')
         .pipe(gulp.dest('build/1-dev/images'))
         .pipe(gulp.dest('build/2-min/images'));
      },
   buildJs() {
      const config = readIndexYml();
      return gulp.src(jsFiles.libs.concat(config.search ? jsFiles.search : [], jsFiles.scripts))
         .pipe(concat('all.js'))
         .pipe(gulp.dest('build/1-dev/js'))
         .pipe(uglify())
         .pipe(gulp.dest('build/2-min/js'));
      },
   buildCss() {
      return gulp.src('source/css/*.css.scss')
         .pipe(sass().on('error', sass.logError))
         .pipe(rename({ extname: '' }))
         .pipe(gulp.dest('build/1-dev/css'))
         .pipe(cleanCss())
         .pipe(gulp.dest('build/2-min/css'));
      },
   addHighlightStyle() {
      const config = readIndexYml();
      const cssPath = 'node_modules/highlight.js/styles/' + config.highlight_theme + '.css';
      return gulp.src(cssPath)
         .pipe(rename({ prefix: 'highlight-' }))
         .pipe(gulp.dest('build/1-dev/css'))
         .pipe(cleanCss())
         .pipe(gulp.dest('build/2-min/css'));
      },
   buildHtml() {
      const data = getPageData();
      return gulp.src('source/*.html')
         .pipe(ejs(data).on('error', log.error))
         .pipe(gulp.dest('build/1-dev'))
         .pipe(prettify({ indent_size: 3 }))
         .pipe(gulp.dest('build/2-min'));
      },
   build() {
      return mergeStream(
         task.buildFonts(),
         task.buildImages(),
         task.buildJs(),
         task.buildCss(),
         task.addHighlightStyle(),
         task.buildHtml(),
         );
      },
   hashWebApp() {
      return gulp.src('build/2-min/**/*')
         .pipe(RevAll.revision({ dontRenameFile: ['.html'] }))
         .pipe(gulp.dest('build/3-rev'))
         .pipe(size({ showFiles: true }));
      },
   runServer() {
      gulp.watch('source/*.html',        gulp.parallel('build-html'));
      gulp.watch('source/includes/**/*', gulp.parallel('build-html'));
      gulp.watch('source/js/**/*',       gulp.parallel('build-js'));
      gulp.watch('source/css/**/*',      gulp.parallel('build-css'));
      gulp.watch('source/index.yml',     gulp.parallel('build-highlightjs', 'build-js', 'build-html'));
      const server = browserSync.create();
      server.init({
         open:      true,
         ui:        false,
         listen:    'localhost',
         port:      port,
         server:    { baseDir: '.' },
         startPath: 'build/1-dev',
         });
      gulp.watch('build/1-dev/**/*').on('change', server.reload);
      },
   showPaths() {
      console.log('Source input (markdown):  ', chalk.green(path.resolve('source')));
      console.log('Regular output (HTML):    ', chalk.white(path.resolve('build/1-dev')));
      console.log('Minified output (HTML):   ', chalk.white(path.resolve('build/2-min')));
      console.log('Production output (HTML): ', chalk.white(path.resolve('build/3-rev')));
      return gulp.src('source/*.html');
      },
   publishToDocs() {
      // mkdirSync('docs');
      writeFileSync('docs/CNAME', 'node-slate.js.org\n');
      return gulp.src('build/2-min/**/*')
         .pipe(gulp.dest('docs'));
      },
   };

// Gulp
gulp.task('lint',              task.runStaticAnalysis);
gulp.task('build-js',          task.buildJs);
gulp.task('build-css',         task.buildCss);
gulp.task('build-html',        task.buildHtml);
gulp.task('build-highlightjs', task.addHighlightStyle);
gulp.task('build',             task.build);
gulp.task('revision',          task.hashWebApp);
gulp.task('serve',             task.runServer);
gulp.task('show-paths',        task.showPaths);
gulp.task('publish',           task.publishToDocs);
