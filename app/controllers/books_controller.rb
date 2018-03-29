class BooksController < ApplicationController

  before_action :find_book
  skip_before_action :find_book, :only => [:index, :new, :create, :show_borrowed, :return_book, :show_available_to_borrow, :borrow_book]

  def index
    @user_books = current_user.all_books
    @books_to_borrow = Book.borrowable(current_user)
    @books_to_return = Book.returnable(current_user)
  end

  def new
    @book = Book.new
  end

  def create
    @book = Book.new(book_params)
    @book.user = current_user
    if @book.save
      redirect_to book_path(@book)
    else 
      render :new
    end
  end

  def show
    if @book.borrowed_by?
      @text = "Borrowed by #{@book.borrowed_by?.name}"
    elsif @book.status == "available"
      @text = "Available for the community to borrow"
    else
      @text = "Private - not available for the community to borrow"
    end


    respond_to do |format|
      format.html { render :show }
      format.json { render json: @book }
    end
  end

  def show_borrowed
    if @book = Book.find_by(id: params[:id], borrower: current_user.id)
      book_id = @book.id
      @comments = Comment.user_comments_by_book(book_id, current_user)
    else
      redirect_to authenticated_root_path
    end
  end

  def show_available_to_borrow
    @book = Book.find(params[:id])
    book_id = @book.id
    @comments = Comment.all_comments(book_id)
    if !@book.available?(current_user)
      redirect_to authenticated_root_path
    end
  end

  def edit
    if @book.borrowed_by? 
      @text = "Borrowed by #{@book.borrowed_by?.name}"
    end
  end

  def update
    if @book.update(book_params)
      redirect_to book_path(@book)
    else
      render :edit
    end
  end

  def borrow_book
    @book = Book.find(params[:id])
    if !@book.available?(current_user)
      redirect_to authenticated_root_path
    else
      @book.borrow_book(current_user)
      redirect_to authenticated_root_path
    end
  end

  def return_book
    @book = Book.find_by(id: params[:id], borrower: current_user.id)
    if @book.nil?
      redirect_to authenticated_root_path
    else
      @book.return_book
      redirect_to authenticated_root_path
    end
  end

  def destroy
    @book.comments.destroy_all
    @book.book_authors.destroy_all
    @book.book_genres.destroy_all
    @book.delete
    redirect_to authenticated_root_path, {notice: 'The book was removed from your collection.'}
  end

  private

    def find_book
      @book = Book.find_by(id: params[:id], user_id: current_user.id)
      if @book.nil?
        redirect_to authenticated_root_path, {notice: 'Please select one of your books below'}
      end
    end

    def book_params
      params.require(:book).permit(
        :title, 
        :year_published, 
        :language, 
        :status, 
        :description, 
        :author_ids => [], 
        authors_attributes: [:name],
        :genre_ids => [], 
        genres_attributes: [:name],
        )
    end

end
