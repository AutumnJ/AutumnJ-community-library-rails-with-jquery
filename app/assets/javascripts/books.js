$(document).ready(function() {
  $('a.load-comments').on('click', function(e) {
    $(this).hide(); //LOOKS BETTER HIDDEN, BUT CAN LEAVE OUT?
    e.preventDefault();
    $.ajax({
      method: "GET",
      dataType: "json",
      url: this.href
    })
      .success(function( data ) {
        //SHOULD I USE LET HERE
        const otherComments = data.other_comments
        if (otherComments.length === 0) {
          const $header = $("div.all-comments strong");
          $header.html("");
          $header.html("No comments from other users")
        } else {
        // const userComments = data.user_comments
          const $header = $("div.all-comments strong");
          $header.html("");
          $header.html("Other User's Comments:")

          const $ul = $("div.all-comments ul")
          $ul.html("");
          otherComments.forEach(function(comment) {
            //need to append name here - can I obtain by setting up serializer?
            $ul.append("<li>" + comment.content + "</li>");
          });
        }
      });
  });

});

//make formatting above look as it does currently
//prototype this? 
//upon iteration, send to constructor to create name, date, etc
//then send to prototype to add styling
//then append to element at end of iteration 