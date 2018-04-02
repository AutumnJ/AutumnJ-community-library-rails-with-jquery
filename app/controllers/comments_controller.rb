class CommentsController < ApplicationController

  before_action :find_book, :find_comment
  skip_before_action :find_comment, :only => [:new, :create, :index]
  skip_before_action :find_book, :only => [:index]

  def index
    @comments = Comment.user_comments(current_user)

    respond_to do |format|
      format.html { render :index }
      format.json { render json: @comments }
    end

  end

  def show
    @comments = Comment.user_comments(current_user)
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @comments }
    end
  end

  def new
    @comment = Comment.new
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id 
    if @comment.save
      render json: @comment, status: 201
    # else
      # render redirect_to borrowed_book_path(@book) 
      #How to render current page if validation fails?
    end
  end 

  def edit

  end

  def update
    if @comment.update(comment_params) 
      if @book.borrower == current_user.id
        redirect_to borrowed_book_path(@book)
      else
        redirect_to comments_path, {notice: 'Comment updated!'}
      end
    else
      render :edit
    end
  end 

  def destroy
    @comment.delete
    redirect_to borrowed_book_path(@book), {notice: 'The comment was removed.'}
  end

  private

  def find_book
    @book = Book.find_by(id: params[:book_id])
  end

  def find_comment
    @comment = Comment.find_by(id: params[:id], user_id: current_user.id, book_id: params[:book_id])
    if @comment.nil?
      redirect_to comments_path, {notice: 'Please select one of your comments to update or remove.'}
    end
  end

  def comment_params
    params.require(:comment).permit(
      :book_id, 
      :content
      )
  end

end
