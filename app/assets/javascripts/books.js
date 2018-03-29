$(document).ready(function() {
  $('a.load-comments').on('click', function(e) {
    $(this).hide();
    e.preventDefault();
    $.ajax({
      method: "GET",
      dataType: "json",
      url: this.href
    })
      .done(function( data ) {
        const otherComments = data.other_comments
        console.log(otherComments)
        if (otherComments === "[]" || otherComments.length === 0) {
          const comment = document.createElement("P");
          comment.innerHTML = "No comments from other users";
          $(".all-comments").append(comment);
        } else {
        // const userComments = data.user_comments
          const header = document.createElement("P")
          header.innerHTML = "Other User's Comments:"
          $(".all-comments").append(header);
          for (let i = 0; i < otherComments.length; i ++) {
            const comment = document.createElement("P");
            comment.innerHTML = otherComments[i]["content"];
            $(".all-comments").append(comment);
          }
        }
      });
  });

});

//make formatting above look as it does currently
//prototype this? 