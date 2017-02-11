$ = require 'jquery'

do fill = (item = 'The most creative minds') ->
  $('.tagline').append "#{item}"
fill