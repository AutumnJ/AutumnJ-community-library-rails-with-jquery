$(document).ready(function() {
  attachCommentListeners();
});

function attachCommentListeners() {
  $('a.load-comments').on('click', function(e){
    $(this).hide();
    e.preventDefault();
    loadOtherUsersComments(this);
  });
  $('div.new-comment form').submit(function(e){
    e.preventDefault();
    $("div.no-comments i").hide();
    addNewComment(this);
  });
  $('a.load-all-comments').on('click', function(e){
    e.preventDefault();
    $(this).hide();
    loadAllComments(this);
  });
  $(".js-next").on("click", function(e){
    e.preventDefault();
    loadNextComment(this);
  });
}


function loadOtherUsersComments(element) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: element.href
  })
    .success(function( data ) {
      let comments = data.comments
      if (comments.length === 0) {
        let $header = $("div.all-comments strong");
        $header.html(data.msg_no_comments)
      } else {
        let $header = $("div.all-comments strong");
        $header.html(data.msg)

        let $ul = $("div.all-comments ul")
        comments.forEach(comment => {
          let newComment = new Comment(comment)
          let commentHtml = newComment.formatList()

          $ul.append(commentHtml)
        });
      }
    });
}


function Comment(comment) {
  this.content = comment.content
  this.user = comment.user.name
  this.date = dateConversion(comment.user.updated_at)
}

function dateConversion(time) {
  let splitDate = time.split("T")
  let parseDate = splitDate[0].split("-")
  let month = parseInt(parseDate[1]) - 1;
  let day = parseInt(parseDate[2]) + 1

  let date = new Date(Date.UTC(parseDate[0], month, day)); 
  console.log(date)
  var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  return date.toLocaleDateString("en-US", options);
}

Comment.prototype.formatList = function() {
  let commentHtml = `
  <li><i>Comment: </i>${this.content}<br>
  <i>User: </i>${this.user}<br>
  <i>Comment submitted: </i>${this.date}</li><br>`
  return commentHtml;
}

function loadAllComments(element) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: element.href
  })
    .success(function( data ) {
      if (!data[0]) {
        let $header = $("div.all-user-comments h2");
        $header.html("No comments yet!")
      } else {
        $("div.all-user-comments h2").html("Your comments:");

        let $ul = $("div.all-user-comments ul")
        data.forEach(comment => {
          let newComment = new allComment(comment)
          let commentHtml = newComment.formatListOfAll()

          $ul.append(commentHtml)
        });
      }
    });
}

function allComment(comment) {
  this.content = comment.content
  this.title = comment.book.title
  this.date = dateConversion(comment.updated_at)
  this.id = comment.id
  this.book_id = comment.book_id
  this.book = comment.book
}

allComment.prototype.formatListOfAll = function() {
  let commentHtml = `
  <i>Book Title: </i><a href='/books/${this.book_id}/comments/${this.id}'>${this.title}</a><br>
  <li><i>Comment: </i>${this.content}<br>
  <i>Comment submitted: </i>${this.date}<br>
  <a href='/books/${this.book_id}/comments/${this.id}/edit'>Edit</a></li><br>`
  return commentHtml;
}

function loadNextComment(element) {
    console.log(element.href)
    $.ajax({
    method: "GET",
    dataType: "json",
    url: element.href
  })
    .success(function( data ) {
      //where are we at in collection?
      let currentId = findCommentKey(data, element);
      //how should we set our counter and id?
      if (currentId === (data.length-1)) {
        var id = 0;
      } else {
        var id = currentId += 1;
      }
      //let's get those comment details
      let comment = data[id]
      let newComment = new allComment(comment)
      //let's tell users where they're at, and update our hidden counter 
      $(".js-next").attr("data-id", id)
      $("div.count").html(`<i>Showing comment ${id+1} of ${data.length}</i>`)

      //append formatted object info to DOM
      $("div.book-info-links").replaceWith(newComment.formatEditLink());
      $(".bookTitle").html(newComment.formatTitle());
      $(".bookComment").html(newComment.formatComment());
      $(".commentDate").html(newComment.formatCommentDate());
    });
}

function findCommentKey(data, element) {
  if ($(".js-next").attr("data-id") === "a") {
    let url = element.href.split("/")
    let commentId = parseInt(url[url.length-1].replace('#',''))
    foundBook = bookFinder(data, commentId)
    let key = foundBook;
    return parseInt(key);
  } else {
    return parseInt($(".js-next").attr("data-id"));
  }
}

function bookFinder(data, commentId) {
  for (var key in data) {
    if (data[key].id === parseInt(commentId)) {
      return key
    }
  }
}

allComment.prototype.formatTitle = function() {
  return `<i>Book Title: </i>${this.title}`
}

allComment.prototype.formatComment = function() {
  return `<i>Comment: </i>${this.content}`
}

allComment.prototype.formatCommentDate = function() {
  return `<i>Comment submitted: </i>${this.date}`
}

allComment.prototype.formatEditLink = function() {
  return `
  | <a href='/books/${this.book_id}/comments/${this.id}/edit'>Edit</a><br>
  `
}

function addNewComment(element) {
  let values = $(element).serialize();
  let comment = $.post(`${element.action}`, values);

  comment.done(function(data) {
    let newComment = new allComment(data)
    let commentHtml = newComment.formatNewComment();

    $("#comment_content").val("");
    $("div.new-comment ul").append(commentHtml)   
  });
}

allComment.prototype.formatNewComment = function() {
  let commentHtml = `
  <li><i>Comment: </i>${this.content}<br>
  <i>Comment submitted: </i>${this.date}<br>
  <a href='/books/${this.book_id}/comments/${this.id}/edit'>Edit</a></li><br>`
  return commentHtml;
}