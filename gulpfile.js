var gulp = require("gulp"),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	cleanCss = require('gulp-clean-css'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
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
htmlSrcs = ['builds/development/index.html'];
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
			image: 'builds/development/images',
			config_file: 'compass_config.rb'
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
		root: 'builds/development/',
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src(htmlSrcs)
		.pipe(connect.reload());
});

gulp.task('json', function() {
	gulp.src(jsonSrcs)
		.pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);