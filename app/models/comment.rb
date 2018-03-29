class Comment < ActiveRecord::Base

  belongs_to :user
  belongs_to :book

  validates :content, presence: true

  def self.user_comments(current_user)
    where({user_id: current_user.id})
  end

  def self.user_comments_by_book(book_id, current_user)
    where({user_id: current_user.id, book_id: book_id}).order(:created_at)
  end

  def self.all_comments(book_id)
    where({book_id: book_id}).order(:created_at)
  end

  def self.other_users_comments(book_id, current_user)
    where("user_id != ? AND book_id = ?", current_user.id, book_id).order(:created_at)
  end

end
