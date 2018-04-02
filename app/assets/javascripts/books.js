$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $('a.load-comments').on('click', function(e){
    $(this).hide();
    e.preventDefault();
    loadOtherUsersComments(this);
  });
  $('a.load-authors').on('click', function(e){
    $(this).hide();
    e.preventDefault();
    loadAuthors(this);
  });
  $('a.load-genres').on('click', function(e){
    $(this).hide();
    e.preventDefault();
    loadGenres(this);
  });
  $('a.load-all-comments').on('click', function(e){
    $(this).hide();
    e.preventDefault();
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

  let date = new Date(Date.UTC(parseDate[0], parseDate[1], parseDate[2])); 
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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
      console.log(data)
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

function loadAuthors(element) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: element.href
  })
    .success(function( data ) {
      let authors = data.authors
      if (authors.length === 0) {
        let $header = $("div.book-authors strong");
        $header.html("Author(s): N/A")
      } else {
        let $header = $("div.book-authors strong");
        $header.html("Author(s):")

        let $ul = $("div.book-authors ul")
        authors.forEach(author => {
          let newAuthor = new Author(author)
          let authorHtml = newAuthor.formatAuthor()

          $ul.append(authorHtml)
        });
      }
    });
}

function Author(author) {
  this.name = author.name
  this.id = author.id
}

Author.prototype.formatAuthor = function() {
  let authorHtml = `
  <li><a href='/authors/${this.id}'>${this.name}</a></li><br>`
  return authorHtml;
}


function loadGenres(element) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: element.href
  })
    .success(function( data ) {
      let genres = data.genres
      if (genres.length === 0) {
        let $header = $("div.book-genres strong");
        $header.html("Genre(s): N/A")
      } else {
        let $header = $("div.book-genres strong");
        $header.html("Genre(s):")

        let $ul = $("div.book-genres ul")
        genres.forEach(genre => {
          let newGenre = new Genre(genre)
          let genreHtml = newGenre.formatGenre()

          $ul.append(genreHtml)
        });
      }
    });
}

function Genre(genre) {
  this.name = genre.name
  this.id = genre.id
}

Genre.prototype.formatGenre = function() {
  let genreHtml = `
  <li><a href='/genres/${this.id}'>${this.name}</a></li><br>`
  return genreHtml;
}

function loadNextComment(element) {
  console.log(element.href)
    $.ajax({
    method: "GET",
    dataType: "json",
    url: element.href
  })
    .success(function( data ) {
      let currentId = parseInt($(".js-next").attr("data-id"));
      if (currentId === (data.length-1)) {
        var id = 0;
      } else {
        var id = parseInt($(".js-next").attr("data-id")) + 1;
      }
      let comment = data[id]
      let newComment = new allComment(comment)
      let commentHtml = newComment.formatListOfAllComments()
      $(".js-next").attr("data-id", id)
      $("div.book-info-links").replaceWith(commentHtml)
      $("div.count").html(`<i>Showing comment ${id+1} of ${data.length}</i>`)
    });
}

allComment.prototype.formatListOfAllComments = function() {
  $(".bookTitle").html(`<i>Book Title: </i>${this.title}`)
  $(".bookComment").html(`<i>Comment: </i>${this.content}`)
  $(".commentDate").html(`<i>Comment submitted: </i>${this.date}`)

  commentHtml = `
  | <a href='/books/${this.book_id}/comments/${this.id}/edit'>Edit</a><br>
  `
  return commentHtml;
}

