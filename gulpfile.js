var gulp = require("gulp"),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify');

var coffeeSrcs = ['components/coffee/tagline.coffee'];
var jsSrcs = [
	'components/scripts/rclick.js',	
	'components/scripts/pixgrid.js',	
	'components/scripts/tagline.js',	
	'components/scripts/template.js',	
];

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