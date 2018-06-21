$(document).ready(function() {
  attachBookListeners();
});

function attachBookListeners() {
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
  <li><a href='/authors/${this.id}'>${this.name}</a></li>`
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
  let genreHtml = `<li><a href='/genres/${this.id}'>${this.name}</a></li>`
  return genreHtml;
}



