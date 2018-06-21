class GenresController < ApplicationController

  before_action :find_genres_books, :find_genres_borrowable_books

  def show
  end

  private

  def find_genres_books
    @genre = find_genre
    @books = @genre.find_genres_books(current_user)
    if !@genre
      redirect_to authenticated_root_path
    end
  end

  def find_genres_borrowable_books
    @genre = find_genre
    @borrowable_books = @genre.find_genres_borrowable_books(current_user)
    if !@genre
      redirect_to authenticated_root_path
    end
  end

  def find_genre
    Genre.find_by(id: params[:id])
  end

end
