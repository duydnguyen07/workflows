$ = require 'jquery'

do fill = (item = 'The most creative minds in Arts') ->
  $('.tagline').append "#{item}"
fill