$(document).ready(function() {
  $('#menu').click(function(e) {
    $('nav').slideToggle(400);
    e.stopPropagation()
  })

  $(document).click(function(e) {
    if ($('nav').css('display') == 'block') {
      $('nav').slideToggle(400);
      
    }
  })
})
