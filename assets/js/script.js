$(document).ready(function() {
  $('#menu').click(function(e) {
    $('nav').slideToggle('fast')
    e.stopPropagation()
  })

  $(document).click(function(e) {
    if ($('nav').css('display') == 'block') {
      $('nav').slideToggle('fast')
    }
  })
})
