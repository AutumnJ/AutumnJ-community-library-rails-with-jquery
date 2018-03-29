class CommentsController < ApplicationController

  before_action :find_book, :find_comment
  skip_before_action :find_comment, :only => [:new, :create, :index]
  skip_before_action :find_book, :only => [:index]

  def index
    @user_comments = Comment.user_comments(current_user)

    if params[:book_id]
      @other_comments = Comment.other_users_comments((find_book.id), current_user)
    end

    respond_to do |format|
      format.html { render :index }
      format.json { render json: { 
        user_comments: @user_comments, #not using this currently, but could 
        # other_comments: (Comment.other_users_comments((find_book.id), current_user)) }
        other_comments: @other_comments }
        #how do I access user.name property in js -> pass it in here?, set custom serializer?
      }

    end
  end

  def new
    @comment = Comment.new
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id 
    if @comment.save
      redirect_to borrowed_book_path(@book) 
    else
      render :new
    end
  end 

  def edit

  end

  def update
    if @comment.update(comment_params) 
      if @book.borrower == current_user.id
        redirect_to borrowed_book_path(@book)
      else
        redirect_to comments_path
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
