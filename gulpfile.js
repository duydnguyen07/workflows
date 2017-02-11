var gulp = require("gulp"),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	compass = require('gulp-compass'),
	browserify = require('gulp-browserify');

var coffeeSrcs = ['components/coffee/tagline.coffee'];
var jsSrcs = [
	'components/scripts/rclick.js',	
	'components/scripts/pixgrid.js',	
	'components/scripts/tagline.js',	
	'components/scripts/template.js',	
];
var sassSrcs = ['components/sass/style.scss'];

gulp.task('coffee', function() {
	gulp.src(coffeeSrcs)
		.pipe(coffee({base: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function() {
	gulp.src(jsSrcs)
		.pipe(concat('scripts.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'));
});

gulp.task('compass', function() {
	gulp.src(sassSrcs)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		})
		.on('error', gutil.log))
		.pipe(gulp.dest('builds/development/css'));
});

gulp.task('default', ['coffee', 'js', 'compass']);