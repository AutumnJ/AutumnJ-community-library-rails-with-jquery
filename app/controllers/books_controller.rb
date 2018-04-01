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

    #use this to display authors, genres with has_many (link to their show pages)
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @book }
    end

  end

  def show_borrowed
    if @book = Book.find_by(id: params[:id], borrower: current_user.id)
      book_id = @book.id
      @comments = Comment.user_comments_by_book(book_id, current_user)

      #power JSON view of other comments:
      @other_comments = Comment.other_users_comments((book_id), current_user)
      @other_comments_with_user = @other_comments.map{|c| {content: c.content, user: c.user}}

      respond_to do |format|
        format.html { render :show_borrowed }
        format.json { render json: { 
          comments: @other_comments_with_user,
          msg_no_comments: "No comments from other users",
          msg: "Other User's Comments:",
          authors: @book.authors,
          genres: @book.genres }
        }
      end
    else
      redirect_to authenticated_root_path
    end
  end

  def show_available_to_borrow
    @book = Book.find(params[:id])
    book_id = @book.id

    #power JSON view of all comments:
    @comments = Comment.all_comments(book_id)
    @comments_with_user = @comments.map{|c| {content: c.content, user: c.user}}

    respond_to do |format|
      format.html { render :show_available_to_borrow }
      format.json { render json: { 
        comments: @comments_with_user,
        msg_no_comments: "No comments",
        msg: "Comments about this book:",
        authors: @book.authors,
        genres: @book.genres }
      }
    end

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
