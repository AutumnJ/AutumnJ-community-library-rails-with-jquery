class AuthorsController < ApplicationController

  before_action :find_authors_books, :find_authors_borrowable_books

  def show    
  end

  private

  def find_authors_books
    @author = find_author
    @books = @author.find_authors_books(current_user)
    if !@author
      redirect_to authenticated_root_path
    end
  end

  def find_authors_borrowable_books
    @author = find_author
    @borrowable_books = @author.find_authors_borrowable_books(current_user)
    if !@author
      redirect_to authenticated_root_path
    end
  end

  def find_author
    Author.find_by(id: params[:id])
  end
  
end
