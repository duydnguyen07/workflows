var gulp = require("gulp"),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	cleanCss = require('gulp-clean-css'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-minify-html'),
	jsonMinify = require('gulp-jsonminify'),
	browserify = require('gulp-browserify');

var env,
	coffeeSrcs,
	jsSrcs,
	sassSrcs,
	htmlSrcs,
	jsonSrcs,
	sassStyle,
	outputDir;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

console.log(sassStyle, outputDir);

coffeeSrcs = ['components/coffee/tagline.coffee'];
jsSrcs = [
	'components/scripts/tagline.js',	
	'components/scripts/rclick.js',	
	'components/scripts/pixgrid.js',	
	'components/scripts/template.js'	
];
sassSrcs = ['components/sass/style.scss'];
htmlSrcs = ['builds/development/*.html'];
jsonSrcs = ['builds/development/js/*.json'];

gulp.task('coffee', function() {
	gulp.src(coffeeSrcs)
		.pipe(coffee({base: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function() {
	gulp.src(jsSrcs)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir+'js'))
		.pipe(connect.reload());
});

gulp.task('compass', function() {
	gulp.src(sassSrcs)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images'
		})
		.on('error', gutil.log))
		.pipe(cleanCss())
		.pipe(gulp.dest(outputDir+'css'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(coffeeSrcs, ['coffee']);
	gulp.watch(jsSrcs, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSrcs, ['html']);
	gulp.watch(jsonSrcs, ['json']);

});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src(htmlSrcs)
		.pipe(gulpif(env === 'production', minifyHtml()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir) ))
		.pipe(connect.reload());
});

gulp.task('json', function() {
	gulp.src(jsonSrcs)
		.pipe(gulpif(env === 'production', jsonMinify()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir+'js') ))
		.pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);